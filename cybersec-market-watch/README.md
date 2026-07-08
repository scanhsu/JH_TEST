# Cybersec Market Watch|網路安全產品市場分析

持續追蹤 Sophos、Check Point、Fortinet、Palo Alto Networks、Cisco 等網路安全廠商的
最新產品動態,自動產出**趨勢熱度 + 產品規格對照**的繁體中文分析報告。

📄 **最新報告:[`reports/latest.md`](reports/latest.md)**(歷史報告存於 `reports/archive/`)

## 運作方式

```
┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│ collect.py   │ →  │ analyze.py   │ →  │ report.py        │
│ 抓官方 RSS    │    │ 趨勢關鍵字統計 │    │ 繁中 Markdown 報告 │
│ 累積文章資料庫 │    │ 產品型號擷取   │    │ latest + 日期存檔  │
└──────────────┘    └──────────────┘    └──────────────────┘
```

- **`config/vendors.json`** — 追蹤的廠商、RSS 來源、產品型號正規表示式
- **`config/trends.json`** — 趨勢主題與關鍵字(AI 安全、SASE、零信任、Hybrid Mesh…)
- **`data/articles.json`** — 自動累積的文章資料庫(以 URL 去重)
- **`data/specs.json`** — 人工校對的旗艦產品規格基準與重點觀察
- **`data/seed_articles.json`** — 初始種子資料(2026-07 人工研究)

純 Python 標準函式庫,**無任何外部相依**。

## 使用

```bash
python run.py            # 完整流程:收集 → 分析 → 報告
python run.py --offline  # 不連網,用既有資料重新分析與產報告
```

## 持續自動更新

`.github/workflows/market-watch.yml` 每天 21:00 UTC(台北 05:00)自動執行並 commit
更新後的資料與報告,也可在 GitHub Actions 頁面手動觸發(workflow_dispatch)。

> ⚠️ GitHub 的排程(schedule)只會在**預設分支**上生效;此功能分支合併進預設分支後
> 排程才會開始每天執行。合併前可用手動觸發測試。

## 維護

- **新增廠商**:在 `config/vendors.json` 加一個物件(id、name、feeds、product_patterns)。
- **新增趨勢主題**:在 `config/trends.json` 加關鍵字組。
- **更新規格**:廠商發表新品時,更新 `data/specs.json` 並改 `last_reviewed` 日期;
  「二、各廠商近期動態」的產品提及可提示哪些新型號該補進規格表。
- 單一 RSS 來源失敗不會中斷流程,失敗廠商會列在 log 與 `data/articles.json`
  的 `last_run_stats.failed_feeds`,方便更換來源網址。
