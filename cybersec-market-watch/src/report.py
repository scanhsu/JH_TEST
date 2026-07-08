"""報告產生器:將分析結果輸出為繁體中文 Markdown 報告。

輸出 reports/latest.md 以及 reports/archive/YYYY-MM-DD.md 存檔。
"""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ANALYSIS_PATH = ROOT / "data" / "analysis.json"
SPECS_PATH = ROOT / "data" / "specs.json"
REPORTS_DIR = ROOT / "reports"


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def heat_bar(n: int, scale: int) -> str:
    if scale <= 0:
        return ""
    filled = round(n / scale * 10)
    return "█" * filled + "░" * (10 - filled)


def render(analysis: dict, specs: dict) -> str:
    today = analysis["generated"]
    lines: list[str] = []
    add = lines.append

    add(f"# 網路安全產品市場分析報告")
    add("")
    add(f"> 產生日期:{today}|"
        f"分析視窗:近 {analysis['window_days']} 天|"
        f"累積文章:{analysis['article_total']} 篇(近期 {analysis['article_recent']} 篇)")
    add("")

    # ── 趨勢總覽 ──
    add("## 一、市場趨勢熱度")
    add("")
    add("依各廠商官方新聞中出現的主題關鍵字統計,近期提及次數越多代表該趨勢越熱。")
    add("")
    add("| 趨勢主題 | 近期熱度 | 近期提及 | 累積提及 | 主要推動廠商 |")
    add("|---|---|---:|---:|---|")
    max_recent = max((t["recent_mentions"] for t in analysis["trends"]), default=0)
    vendor_names = {vid: v["name"] for vid, v in analysis["vendors"].items()}
    vendor_names["industry"] = "產業媒體/分析師"
    for t in analysis["trends"]:
        vendors = "、".join(
            vendor_names.get(v, v) for v in list(t["recent_by_vendor"])[:3]
        ) or "—"
        add(f"| {t['label_zh']} | `{heat_bar(t['recent_mentions'], max_recent)}` "
            f"| {t['recent_mentions']} | {t['total_mentions']} | {vendors} |")
    add("")

    # ── 各廠商動態 ──
    add("## 二、各廠商近期動態")
    add("")
    for vid, v in analysis["vendors"].items():
        add(f"### {v['name']}")
        add("")
        if v["top_products"]:
            prods = "、".join(f"`{name}`" for name, _ in v["top_products"][:8])
            add(f"**新聞中被提及的產品/版本:** {prods}")
            add("")
        if v["recent_articles"]:
            for a in v["recent_articles"]:
                d = a.get("date") or a.get("collected") or ""
                add(f"- {d} [{a['title']}]({a['url']})")
        else:
            add("- (近期無新資料,或資料來源暫時無法連線)")
        add("")

    # ── 規格對照 ──
    add("## 三、旗艦產品規格對照")
    add("")
    add(f"> 規格基準資料人工整理自各廠商官方文件,最後校對:{specs.get('last_reviewed', 'N/A')}。")
    add("")
    for category in specs["categories"]:
        add(f"### {category['title_zh']}")
        add("")
        cols = category["columns"]
        add("| " + " | ".join(["產品"] + [c["label_zh"] for c in cols]) + " |")
        add("|" + "---|" * (len(cols) + 1))
        for p in category["products"]:
            row = [f"**{p['vendor']}** {p['model']}"]
            row += [str(p["specs"].get(c["key"], "—")) for c in cols]
            add("| " + " | ".join(row) + " |")
        add("")
        for p in category["products"]:
            if p.get("note_zh"):
                add(f"- **{p['vendor']} {p['model']}**:{p['note_zh']}")
        add("")

    # ── 重點觀察 ──
    if specs.get("insights_zh"):
        add("## 四、重點觀察與趨勢解讀")
        add("")
        for insight in specs["insights_zh"]:
            add(f"- {insight}")
        add("")

    add("## 附錄:方法說明")
    add("")
    add("- **資料收集**:每日自動抓取各廠商官方部落格/新聞 RSS,累積於 `data/articles.json`。")
    add("- **趨勢統計**:以 `config/trends.json` 定義的關鍵字組比對文章標題與摘要。")
    add("- **產品擷取**:以 `config/vendors.json` 定義的型號正規表示式擷取產品提及。")
    add("- **規格對照**:`data/specs.json` 為人工校對的官方規格基準,隨新品發表更新。")
    add("")
    return "\n".join(lines)


def generate() -> Path:
    analysis = load(ANALYSIS_PATH)
    specs = load(SPECS_PATH)
    md = render(analysis, specs)

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    latest = REPORTS_DIR / "latest.md"
    latest.write_text(md, encoding="utf-8")
    archive = REPORTS_DIR / "archive" / f"{date.today().isoformat()}.md"
    archive.parent.mkdir(parents=True, exist_ok=True)
    archive.write_text(md, encoding="utf-8")
    print(f"[report] 已輸出 {latest} 與 {archive}")
    return latest


if __name__ == "__main__":
    generate()
