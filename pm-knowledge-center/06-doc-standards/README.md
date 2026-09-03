# 06 文件規範與設計準則（Documentation Standards & Design Guidelines）

> 最後更新：2026-07-22｜維護人：（待指定）

NCS 標準品在**產品文件與外觀標示**上的統一規範。PLM 定義產品、撰寫 datasheet、控管外觀標示時，都要依這裡的規則，確保各產品線對外一致。

## 為什麼 PLM 要管這一區

- **Datasheet 是 PLM 的 C4 marketing material 責任**（見 [研發 C 流程](../05-processes/rd-c-process.md)），寫法有統一規則才不會各家亂寫。
- **銘版 / 網印**的 I/O 標示、NEXBOOT logo 擺放由 **PLM 與 ME 共同控管**，規則錯了要重開模、重印，成本高。
- **Block diagram 圖示**統一，PSD / 提案簡報 / datasheet 的架構圖才有一致視覺語言。

## 頁面索引

| 頁面 | 內容 | 版本 | 原始檔 |
|------|------|------|--------|
| [Datasheet 編輯規則](./datasheet-rules.md) | NCS Datasheet 撰寫規範：Product Positioning、規格 wording、照片、LAN module、Ordering info | Rev 3.0（2024/11） | NCS_Datasheet編輯說明_v3.0.docx |
| [銘版與網印印刷設計原則](./silkprint-membrane-rules.md) | 標準品外觀：PANTONE 色、藍色色塊、NEXCOM/NEXBOOT logo、I/O 孔位網印標示命名 | Rev 1.4（2026/04） | NCS標準品銘版與網印印刷設計原則_v1.4.docx |
| [Block Diagram 圖示與繪製規範](./block-diagram-icons.md) | 標準零件圖示庫、port 編號畫法、訊號線顏色/線型規範 | Rev 1.1（2026/03） | Block_Diagram_Icons_v1.1.pptx |

## 附件（原始規範文件 — 以這些為準）

| 檔案 | 說明 |
|------|------|
| [NCS_Datasheet編輯說明_v3.0.docx](./attachments/NCS_Datasheet編輯說明_v3.0.docx) | 含完整範例（NSA 1170）、Product Positioning Check List、LAN module datasheet rule |
| [NCS標準品銘版與網印印刷設計原則_v1.4.docx](./attachments/NCS標準品銘版與網印印刷設計原則_v1.4.docx) | 含正確/錯誤範例圖、各 I/O 標示範例圖 |
| [Block_Diagram_Icons_v1.1.pptx](./attachments/Block_Diagram_Icons_v1.1.pptx) | 可直接取用的圖示素材，畫 block diagram 時複製貼上 |

> ⚠️ 以下 Markdown 頁面為**重點摘要**，方便查閱與新人理解；**實際製作時一律以 attachments 的原始檔為準**（含圖例、尺寸標註、範例照片，Markdown 無法完整呈現）。規範改版時請同步更新本區頁面的版本標註。

## 這一區和其他區的關係

- 產品定義階段 → 搭配 [05 成本評估格式](../05-processes/cost-evaluation.md)、[04 PLM 工作要領](../04-wiki-work-scope/work-essentials.md)
- 結案歸檔的產品案例 → [03 參考產品庫](../03-architecture-reference/README.md) 可引用本區規範產出的 datasheet
