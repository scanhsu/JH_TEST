# PLM 產品經理知識及方案中心（PLM Knowledge & Solution Center）

> **PLM（Product Line Manager）產品經理團隊**的共同知識庫 —— 新手 PLM 的入職參考庫、資深 PLM 的知識沉澱與分享庫。
>
> 本庫以 **PLM 為主體**：內容聚焦產品規畫、平台選型、成本與 roadmap 等 PLM 核心工作；**PJM（專案經理）與 RD（研發）是我們的合作對象**，相關流程說明皆以「PLM 如何與其協作」的角度整理。

## 這裡有什麼

| 區域 | 內容 | 適合對象 |
|------|------|----------|
| [01 產品知識分享](./01-product-knowledge/README.md) | 產品線介紹、技術知識、市場與競品資料分享 | 全體 PLM |
| [02 CPU / SoC 方案及 Roadmap 資料庫](./02-cpu-soc-roadmap/README.md) | 各家 CPU / SoC 平台方案、規格與 roadmap 追蹤（**PLM 核心資產**） | 全體 PLM |
| [03 產品架構規畫參考方案](./03-architecture-reference/README.md) | 過去範例產品庫：架構規畫、選型理由、經驗教訓 | 規畫新產品時 |
| [04 工作範圍及要領 Wiki](./04-wiki-work-scope/README.md) | PLM 工作範圍、合作對象職掌（PJM / PMC / RD）、入職指南、工作要領 | 新手必讀 |
| [05 流程及工作說明](./05-processes/README.md) | 研發 C 流程（C0~C5）PLM 視角、成本評估格式、BOM / ECO 協作常識 | 全體 PLM |
| [06 文件規範與設計準則](./06-doc-standards/README.md) | Datasheet 編輯規則、銘版/網印設計原則、Block Diagram 圖示規範 | 撰寫 datasheet／定義外觀時 |

## 新手 PLM 入職建議路徑

1. **第 1 週**：讀 [04 PLM 工作範圍與合作對象](./04-wiki-work-scope/pm-roles.md) 與 [04 入職指南](./04-wiki-work-scope/onboarding-guide.md)，申請系統帳號權限。
2. **第 2 週**：讀 [05 研發 C 流程](./05-processes/rd-c-process.md)，掌握 C0~C5 中 **PLM 的責任節點**（SOW/PSD、價格分析、marketing material）與 PJM / RD 的分工。
3. **第 3~4 週**：讀 [05 成本評估格式](./05-processes/cost-evaluation.md)（PLM 對外報價評估的基本功）與 [04 工作要領](./04-wiki-work-scope/work-essentials.md)，並跟著資深 PLM 實際走一次進行中的案子。
4. **第 2 個月起**：熟悉 [02 CPU / SoC 資料庫](./02-cpu-soc-roadmap/README.md) 與 [03 參考產品庫](./03-architecture-reference/README.md)，開始參與新產品規畫與客戶提案。

## 資深 PLM 怎麼貢獻

- **知識分享**：把簡報 / 筆記 / 踩雷經驗放進 [01 產品知識分享](./01-product-knowledge/README.md)，照範本補一頁摘要。
- **Roadmap 更新**：拿到新的 vendor roadmap 或 NDA 簡報後，更新 [02 資料庫](./02-cpu-soc-roadmap/README.md) 對應頁面（注意保密等級，NDA 內容只放連結與索引，不放內容）。
- **結案歸檔**：專案 Close Meeting 後，用 [03 範本](./03-architecture-reference/_template-reference-design.md) 建一頁產品案例，把選型理由與 Lesson & Learn 留下來。
- **流程修訂**：流程或表單改版時，同步更新 [05 流程說明](./05-processes/README.md) 並在頁面標註版本與日期。

## 目前狀態與待補

本庫為**骨架完整、部分內容待團隊補實**的狀態。所有待補項目彙整在 👉 [待補清單-TODO.md](./待補清單-TODO.md)（依「需真實資料 / 需 PLM 專業內容 / 需持續更新」分三級，方便分派認領）。

## 怎麼在 GitHub 上使用

- **閱讀**：在 GitHub 網頁上點進各 `.md` 檔即可閱讀，頁面間的連結可直接點著走；`.pptx` 附件點「Download」或「View raw」下載後用 PowerPoint 開。
- **加入資料（產品、方案、知識、流程）**：完整步驟見 👉 **[如何加入資料-手冊](./如何加入資料-手冊.md)**（三種方式：丟給 Claude 整理／GitHub 網頁編輯／clone 到本機，含命名規則與檢查清單）。

## 維護原則

- 每頁頂端標註 **最後更新日期** 與 **維護人**。
- 機密 / NDA 資料不直接放入本庫，只放索引與存放位置連結。
- 內容有疑義時，以正式管制文件為準（例如 Q410-000 設計／開發管制程序），本庫為工作參考。
