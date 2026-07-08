# 研發 C 流程（C0~C5）

> 最後更新：2026-07-08｜維護人：（待指定）｜來源：研發C流程簡介_2025_0612.pptx（Jason Huang）
> 正式依據：**Q410-000 設計／開發管制程序（A3 版）**，本頁為工作摘要。

## PLM 視角速覽

C 流程的日常執行由 **PJM 推進、RD 實作**；PLM 的責任集中在**頭（定義產品）**與**尾（把產品推上市）**，中段以成本追蹤與規格判斷為主：

| 階段 | PLM 責任節點 | 主要靠誰執行 |
|------|--------------|--------------|
| Pre-Kick-off / C0 | 可行性分析（價格分析）、**SOW / PSD**、Kick-off Presentation | PLM 主導，RD 提供技術可行性 |
| C1~C2 | Cost BOM review、規格異動判斷（走 PCR） | PJM / RD / PMC |
| C3 | Open issue 中 product spec 類的取捨判斷 | PJM 彙整、DQA/RD 驗證 |
| C4 | **Marketing material**、環境考量面驗證表、定價確認 | PLM 主導 |
| C5 / Close | 產品上市；結案後歸檔到 [03 參考產品庫](../03-architecture-reference/README.md) | PJM 主導 Close Meeting |

以下為完整流程說明（含 PJM / RD / 各單位分工），PLM 需要看得懂全貌才能對客戶承諾時程與規格。

## 全貌：專案管理 5 大流程 vs 研發流程

```
輸入（Initiating）            Planning Stage              Executing（C0~C5）        Closing
─────────────────            ──────────────              ─────────────────        ─────────
客戶需求                      將商業需求轉為內部規格        C0 產品規格要求(Kick Off)  Close Meeting
Chipset Roadmap        →     （SOW / PSD）          →     C1 設計規劃          →    回顧/總結/導入
技術創新                      將 Milestone 轉為細部        C2 產品設計
上級主管策略                  Schedule                    C3 設計驗證
（NPP）                       召集 Project Team           C4 工程量試
                             （Pre-Kick Off）             C5 產品量試
                    ────────── Monitoring & Controlling（全程）──────────
```

- **C**：Check point。每個 C 階段結束有 check point meeting。
- **P**：Phase（P0~P5），對應硬體開發實體進度。

## 階段與時程

| Phase | P0 | P1 | P2 | P3 | P4 | P5 |
|-------|----|----|----|----|----|----|
| 實體進度 | Spec. | Placement | Tape out | Engineer Sample | PE Pilot Run | MP |
| Check point | C0 | C1 | C2 | C3 | C4 | C5 |
| 參考週數 | 5 週 | 8 週 | 3 週 | 15 週（合計至 C3） | — | 2 週 |

**NCS Project Template 標準時程：**

- **New Design**：18 週到 C3 Meeting
- **Derivation（衍生案）**：13 週到 C3 Meeting
- ⚠️ 過 C3 Meeting 時，**跳線不可超過 5 條**

## P0 / C0 產品規格要求階段（Kick-Off）

**流程**：客戶需求/技術發展 → 可行性分析 → Pre Kick-Off → Kick-Off（C0 Meeting）

可行性分析涵蓋：技術可行性、Thermal Simulation、品質要求、生產可行性、特殊測試規範、價格分析、認證/環境要求。

| 節點 | 產出 |
|------|------|
| Pre Kick-Off | SOW 0.x 版、PSD 0.x 版、Schedule 0.x 版、Project Team 成員召集 |
| Kick-Off（C0 Meeting） | Kick-Off Presentation、SOW 1.x 版、PSD 1.x 版、Schedule 1.x 版、Project Team 成員參加 |

**正式 Kick-Off 後動作（責任人）：**

1. PLM 系統 PPM 專案啟動（**記得儲存比較基準**）— PMC
2. Kick-off 文件發行：SOW / PSD / 環境考量面評估表 — PLM/PJM 提供，PMC 發行
3. C0 Meeting 匯簽（PLM 系統）— PMC
4. 成品/半成品 Model Name 料號申請（通知 HW & SE）— PJM
5. Project Code 申請 — PJM

## P1 / C1 設計規劃階段

**主要活動**：畫電路圖及 Layout Placement（RD）、Placement 設計審查、新電子料料號申請 / Pre-BOM（HW）

| 文件 | 負責 |
|------|------|
| 研發管制表 | HW |
| Cost BOM | PMC |
| C1 Design Check List | PM |

**板端備料計劃**（研發所需 + 客戶 sample）：

- L/T 備料：新產品樣品需求單（**6 週以上**長交期料）
- C1 備料：新產品備料通知單（**約 4 週**）

## P2 / C2 產品設計階段

**主要活動**：拉線 / Tune 線 / Tape-out、ECO / 新產品試產放行單

| 文件 | 負責 |
|------|------|
| C2 Design Check List | PM |
| 成品 Pre-BOM（Excel 清單） | SE |
| EVT Test Plan | DQA |
| System Reliability Test Plan | SE |
| Engineering Spec | HW |
| QVL List 初版（給 HW/SQA/DQA/QT/PE 參考） | PJM |

**系統料備料計劃**：機構 / Cable 製作發包；Power Supply / FAN / Heatsink 用新產品樣品需求單。

## P3 / C3 設計驗證階段

**主要活動**：PCBA 上線、Function Debug（HW）、EVT Test（DQA）、訊號量測（SQA 高速 / EA 低速）、System C3 Test（SE）

| 文件 | 負責 |
|------|------|
| EVT Test Report | DQA |
| Thermal Report | SE |
| DVT Test Plan | DQA |
| IRT Test Plan | IRT |

**備料**：Pilot Run 燒機設備備料。

### C3/C4 Open Issue Judgement

1. DQA 列出 Redmine open issue
2. PJM 請相關單位對 issue 做出說明及採取措施
3. PJM 彙整後發給各主管（Sales/Product Spec、EE、SW & FAE、DQA 主管，名單見 [工作要領](../04-wiki-work-scope/work-essentials.md)）

> **PLM 注意**：其中 Sales / Product Spec 類的 issue 需要 PLM 出面做規格取捨判斷（降規、換料或堅持原規格的商業影響）。

## P4 / C4 工程量試階段

**主要活動**：Transfer Meeting（HW/SE/PE，含 RMA/FAE）、System Reliability Test Report（SE）、DVT Test（DQA）、IRT Test（IRT）、PE Pilot Run、PE Pilot Run Test（板端）、PE 系統 Reliability Test（ESS / Power on-off / power input rating）、PVT Test = Burn-in Test（IRT）

| 文件 | 負責 |
|------|------|
| PE Pilot Run Report | PE |
| DVT Test Report | DQA |
| IRT Test Report | IRT |
| QVL List Final 版 | PM |
| PVT Test Report | IRT |
| MTBF Report | 10F DQA |
| Marketing Material（Photo / Quick Guide / Data Sheet / Manual / Product Launch Note） | PM |
| 環境考量面驗證表 | PM |
| 承認書 | 全部到齊 |

**備料**：Pilot Run 成品/半成品備料計劃 — Pilot Run 前約 **6 週**啟動。

## P5 / C5 產品量試階段

**產出**：

- 產品作業指導書（SOP）
- 產品檢驗規範指導書（固定一份）
- QC 工程表（固定一份）
- FCC / CE / UL 證書與 Report
- 反銀龍料號申請（有 UL Mark 者）

> 建議 C5 Meeting 可和 Close Meeting 一起舉行。

## Close Meeting（結案會議）

| 議題 | 負責 |
|------|------|
| 成功關鍵因素 | PJM |
| 檢討是否如期 / 如質 / 如預算 | PJM |
| Risk Management 回顧 | PJM |
| Lesson & Learn（技術 / 流程） | HW |
| 需導入事項 | PJM |
| 專案評分 | PJM |

> 📌 結案後請將案例歸檔到 [03 產品架構參考庫](../03-architecture-reference/README.md)，把 Lesson & Learn 留給下一個專案。

## 各階段甘特圖

簡報中的 P0~P5 詳細甘特圖（18 週 template）為圖像，請開啟原始簡報查看：[研發C流程簡介_2025_0612.pptx](./attachments/研發C流程簡介_2025_0612.pptx)
