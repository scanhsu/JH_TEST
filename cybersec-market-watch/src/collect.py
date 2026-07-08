"""收集器:抓取各廠商官方 RSS/Atom 新聞來源,合併進 data/articles.json。

僅使用 Python 標準函式庫,無外部相依。單一來源失敗不會中斷整體流程。
"""
from __future__ import annotations

import gzip
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_PATH = ROOT / "data" / "articles.json"
SEED_PATH = ROOT / "data" / "seed_articles.json"
VENDORS_PATH = ROOT / "config" / "vendors.json"

USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36 MarketWatchBot/1.0"
)
TIMEOUT = 30
MAX_ITEMS_PER_FEED = 40

ATOM_NS = "{http://www.w3.org/2005/Atom}"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={
        "User-Agent": USER_AGENT,
        "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
        "Accept-Encoding": "gzip",
    })
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        raw = resp.read()
        if resp.headers.get("Content-Encoding") == "gzip" or raw[:2] == b"\x1f\x8b":
            raw = gzip.decompress(raw)
        return raw


def strip_html(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text or "")
    return re.sub(r"\s+", " ", unescape(text)).strip()


def parse_date(value: str) -> str:
    """回傳 ISO 格式 (YYYY-MM-DD);解析失敗回傳空字串。"""
    if not value:
        return ""
    value = value.strip()
    try:  # RFC 822 (RSS)
        return parsedate_to_datetime(value).astimezone(timezone.utc).date().isoformat()
    except (TypeError, ValueError):
        pass
    try:  # ISO 8601 (Atom)
        return datetime.fromisoformat(value.replace("Z", "+00:00")).date().isoformat()
    except ValueError:
        return ""


def parse_feed(xml_bytes: bytes) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    items = []
    # RSS 2.0
    for item in root.iter("item"):
        items.append({
            "title": strip_html(item.findtext("title", "")),
            "url": (item.findtext("link") or "").strip(),
            "date": parse_date(item.findtext("pubDate", "")),
            "summary": strip_html(item.findtext("description", ""))[:600],
        })
    # Atom
    for entry in root.iter(f"{ATOM_NS}entry"):
        link = ""
        for l in entry.findall(f"{ATOM_NS}link"):
            if l.get("rel") in (None, "alternate"):
                link = l.get("href", "")
                break
        items.append({
            "title": strip_html(entry.findtext(f"{ATOM_NS}title", "")),
            "url": link.strip(),
            "date": parse_date(entry.findtext(f"{ATOM_NS}published", "")
                               or entry.findtext(f"{ATOM_NS}updated", "")),
            "summary": strip_html(entry.findtext(f"{ATOM_NS}summary", "")
                                  or entry.findtext(f"{ATOM_NS}content", ""))[:600],
        })
    return [i for i in items if i["url"] and i["title"]][:MAX_ITEMS_PER_FEED]


def load_json(path: Path, default):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def collect(offline: bool = False) -> dict:
    vendors = load_json(VENDORS_PATH, {"vendors": []})["vendors"]
    db = load_json(ARTICLES_PATH, {"articles": {}})
    seed = load_json(SEED_PATH, {"articles": []})

    # 種子資料(人工研究整理)只在首次匯入
    for art in seed["articles"]:
        db["articles"].setdefault(art["url"], art)

    today = datetime.now(timezone.utc).date().isoformat()
    stats = {"fetched": 0, "new": 0, "failed_feeds": []}

    for vendor in vendors if not offline else []:
        got_feed = False
        for feed_url in vendor["feeds"]:
            try:
                items = parse_feed(fetch(feed_url))
            except Exception as exc:  # noqa: BLE001 — 單一來源失敗需容忍
                print(f"[warn] {vendor['id']}: {feed_url} 失敗: {exc}", file=sys.stderr)
                continue
            got_feed = True
            stats["fetched"] += len(items)
            for item in items:
                if item["url"] not in db["articles"]:
                    stats["new"] += 1
                item = {**item, "vendor": vendor["id"], "collected": today, "source": "rss"}
                existing = db["articles"].get(item["url"], {})
                # 保留最早的 collected 日期
                if existing.get("collected"):
                    item["collected"] = existing["collected"]
                db["articles"][item["url"]] = item
            break  # 一個廠商成功抓到一個 feed 即可
        if not got_feed and vendor["feeds"]:
            stats["failed_feeds"].append(vendor["id"])

    db["last_run"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    db["last_run_stats"] = stats
    ARTICLES_PATH.parent.mkdir(parents=True, exist_ok=True)
    ARTICLES_PATH.write_text(
        json.dumps(db, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(f"[collect] 抓取 {stats['fetched']} 篇,新增 {stats['new']} 篇;"
          f"失敗廠商: {stats['failed_feeds'] or '無'}")
    return db


if __name__ == "__main__":
    collect()
