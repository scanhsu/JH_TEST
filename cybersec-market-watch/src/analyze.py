"""分析器:對累積的文章做趨勢關鍵字統計與產品型號擷取。"""
from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_PATH = ROOT / "data" / "articles.json"
VENDORS_PATH = ROOT / "config" / "vendors.json"
TRENDS_PATH = ROOT / "config" / "trends.json"
ANALYSIS_PATH = ROOT / "data" / "analysis.json"

RECENT_DAYS = 90


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def article_text(article: dict) -> str:
    return f"{article.get('title', '')} {article.get('summary', '')}".lower()


def is_recent(article: dict, cutoff: str) -> bool:
    d = article.get("date") or article.get("collected") or ""
    return d >= cutoff


def analyze() -> dict:
    articles = list(load(ARTICLES_PATH)["articles"].values())
    vendors = load(VENDORS_PATH)["vendors"]
    trends = load(TRENDS_PATH)["trends"]

    cutoff = (date.today() - timedelta(days=RECENT_DAYS)).isoformat()
    recent = [a for a in articles if is_recent(a, cutoff)]

    # 趨勢關鍵字統計(全部 vs 近期,可看出趨勢升溫/降溫)
    trend_stats = []
    for trend in trends:
        kws = [k.lower() for k in trend["keywords"]]

        def hits(items):
            arts = [a for a in items if any(k in article_text(a) for k in kws)]
            return len(arts), Counter(a["vendor"] for a in arts)

        total, _ = hits(articles)
        recent_n, by_vendor = hits(recent)
        trend_stats.append({
            "id": trend["id"],
            "label_zh": trend["label_zh"],
            "total_mentions": total,
            "recent_mentions": recent_n,
            "recent_by_vendor": dict(by_vendor.most_common()),
        })
    trend_stats.sort(key=lambda t: (-t["recent_mentions"], -t["total_mentions"]))

    # 各廠商:近期文章 + 被提及的產品型號
    vendor_stats = {}
    for vendor in vendors:
        v_articles = sorted(
            (a for a in recent if a["vendor"] == vendor["id"]),
            key=lambda a: a.get("date") or a.get("collected") or "",
            reverse=True,
        )
        products: Counter = Counter()
        patterns = [re.compile(p, re.IGNORECASE) for p in vendor["product_patterns"]]
        for a in (x for x in articles if x["vendor"] == vendor["id"]):
            text = f"{a.get('title', '')} {a.get('summary', '')}"
            for pat in patterns:
                for m in pat.findall(text):
                    products[re.sub(r"\s+", " ", m).strip()] += 1
        vendor_stats[vendor["id"]] = {
            "name": vendor["name"],
            "recent_count": len(v_articles),
            "recent_articles": v_articles[:8],
            "top_products": products.most_common(12),
        }

    analysis = {
        "generated": date.today().isoformat(),
        "window_days": RECENT_DAYS,
        "article_total": len(articles),
        "article_recent": len(recent),
        "trends": trend_stats,
        "vendors": vendor_stats,
    }
    ANALYSIS_PATH.write_text(
        json.dumps(analysis, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"[analyze] 分析 {len(articles)} 篇文章(近 {RECENT_DAYS} 天 {len(recent)} 篇)")
    return analysis


if __name__ == "__main__":
    analyze()
