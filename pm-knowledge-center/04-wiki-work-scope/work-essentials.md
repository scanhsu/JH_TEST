# PLM 工作要領（日常實務主題）

> 最後更新：2026-07-08｜維護人：（待指定）｜來源：ODM1 PJM Training 主題大綱（以 PLM 視角重整）
>
> 前半是 **PLM 自己要扛的事**，後半是**協作常識**（PJM / 工廠主導，但 PLM 要懂才不會被流程卡住）。標「📝 待補充」者歡迎資深成員認領。

---

## Part 1：PLM 自己要扛的事

### 產品 Roadmap 維護

- PLM 負責產品線 roadmap；資料來源：chipset roadmap（見 [02 資料庫](../02-cpu-soc-roadmap/README.md)）、客戶需求、競品動態、上級策略。
- 要領：vendor NDA roadmap 更新後，同步更新 02 資料庫的「Roadmap 追蹤」索引；平台評估過就留紀錄，沒採用也寫一行原因。

### 成本與報價紀律

- 遵循[成本評估格式](../05-processes/cost-evaluation.md)：ODM 案用 Function BOM、標準品客製用加減件（KA 仍用 Function BOM）。
- **提供成本評估前，先與業務確認數量基礎**；PCB / Power / Heatsink / 機構件依數量重新詢價或考慮開模價。
- Summary 用公式引用，不手動調整；BOM cost review 先與 Golden BOM 比對異常項。

### 規格承諾與變更

- 對客戶的規格承諾，先確認 RD 技術可行性與測試條件（例如 MTBF 計算標準、throughput 的量測條件）。
- Spec 變更一律走 **PCR**：PLM 判斷商業影響（成本 / 時程 / 其他客戶影響）後發動，PJM 執行變更管理。不做口頭承諾。

### 產品生命週期（EOL）

- **Regular BOM scan**：定期掃描 BOM 零件生命週期狀態，提早發現停產風險 —— 不要等 vendor 發 EOL 通知才動。
- **ACR approval impact**：ACR 核准對 EOL 的影響評估。
- 選型時就要確認長供貨承諾（Intel IOTG / AMD Embedded 7~10 年，見 [02 資料庫](../02-cpu-soc-roadmap/README.md)）。
- 產品 EOL 決策是 PLM 的責任：last buy 通知、替代方案（後繼機種）要一起規畫。

### 認證與法規（PLM 責任文件）

| 主題 | 重點 |
|------|------|
| 環境法規 | 環境考量面**評估表**（C0 發行，PLM/PJM 提供內容）→ **驗證表**（C4，PM 負責）；RoHS / REACH / WEEE |
| 安規（UL 等） | C5 需 FCC / CE / UL 證書與 report；有 UL Mark 需申請反銀龍料號 |
| MTBF | C4 產出 MTBF Report（10F DQA）；客戶常要求，**規格承諾前先確認計算標準**（如 Telcordia） |

### 產品上市（C4~C5）

- Marketing material：Photo / Quick Guide / Data Sheet / Manual / Product Launch Note。
- 要領：Data sheet 規格數字與 Engineering Spec、測試報告一致，出貨前最後一次核對。
- **Datasheet 撰寫一律依 [06 Datasheet 編輯規則](../06-doc-standards/datasheet-rules.md)**；寫 eNews 參考 Datasheet 不參考 PSD；不可寫 BOM 沒建的功能。

### 外觀標示控管（銘版 / 網印）

- 標準品外觀的 I/O 網印標示、NEXBOOT logo 擺放由 **PLM 與 ME 共同控管**，依 [06 銘版與網印設計原則](../06-doc-standards/silkprint-membrane-rules.md)。
- 錯了要重開模/重印，成本高 —— 設計審查階段就對照規範的正確/錯誤範例檢查。

---

## Part 2：協作常識（懂就好，執行找對窗口）

### 與 PJM 的日常協作

- Schedule / open issue 以 PJM 為準，PLM 不重複追 RD；但 open issue 涉及 **product spec 取捨**時，PLM 要出面判斷（C3/C4 Open Issue Judgement 中 Sales/Product Spec 類 issue）。
- C3/C4 open issue 主管分派參考（依訓練教材，人員異動請更新）：Sales/Product Spec — Allan；EE — Jovanni；SW & FAE — Cobalt；DQA — Nick / Kent。

### 工廠協作

- **工廠主要窗口**：NPI（新產品導入）、ECO（工程變更執行）。📝 待補充窗口名單
- **特材單**：特殊材料需求申請，常見退件原因見訓練教材。📝 待補充
- **重工流程（E 料號）**：重工作業使用 E 料號管理。📝 待補充
- 對 PLM 的意義：客戶急單 / 客製變更會不會卡在工廠端，先懂這些流程才估得準交期承諾。

### BOM / 文件常識

- 標準品 vs ODM BOM 差異、A 料號規則：見 [BOM / ECO / 系統操作說明](../05-processes/bom-eco-systems.md)。
- Label making 使用 Bartender。📝 待補充：模板位置與申請流程
