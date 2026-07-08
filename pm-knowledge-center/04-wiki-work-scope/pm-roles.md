# PLM 工作範圍與合作對象職掌

> 最後更新：2026-07-08｜維護人：（待指定）｜來源：研發C流程簡介、ODM1 PJM Training
>
> 本頁以 **PLM 為主體**：先講清楚我們自己的工作範圍，再說明各合作對象（PJM / PMC / MPM / RD）負責什麼、我們跟他們的協作介面在哪裡。

## 我們是誰：PLM（Product Line Manager）

**一句話定位**：對產品線的**商業成敗**負責 —— 定義對的產品、賣到對的價錢、管好整個生命週期。

### PLM 核心工作範圍

| 領域 | 工作內容 |
|------|----------|
| **產品規畫** | 蒐集商業輸入（客戶需求、chipset roadmap、技術創新、上級主管策略），決定做什麼產品 |
| **產品定義** | 將商業需求轉為內部規格：主導 **SOW / PSD**（0.x 版 → Kick-off 後 1.x 版） |
| **Roadmap 管理** | 維護產品線 roadmap，追蹤各家 CPU/SoC 方案（見 [02 資料庫](../02-cpu-soc-roadmap/README.md)） |
| **價格與成本** | 可行性分析階段的價格分析；成本評估（Function BOM / 加減件，見[成本評估格式](../05-processes/cost-evaluation.md)）；提供成本評估前需與業務確認**評估數量基礎** |
| **產品上市** | C4 階段 marketing material：Photo / Quick Guide / Data Sheet / Manual / Product Launch Note |
| **生命週期** | EOL 決策、ACR approval impact 評估、長供貨風險管理 |
| **文件責任** | Kick-off 文件內容（SOW / PSD / 環境考量面評估表，由 PMC 發行）、環境考量面驗證表（C4） |

### PLM 在 C 流程各階段的責任節點

| 階段 | PLM 要做的事 |
|------|--------------|
| Pre-Kick-off / C0 | 可行性分析（價格分析、規格取捨）、SOW/PSD 0.x→1.x、Kick-off Presentation |
| C1~C3 | 成本追蹤（Cost BOM review）、規格變更判斷（客戶 spec 異動走 PCR）、open issue 中涉及 product spec 的判斷 |
| C4 | Marketing material 產出、環境考量面驗證表、定價確認 |
| C5 / Close | 產品上市、參加 Close Meeting、把案例歸檔到 [03 參考產品庫](../03-architecture-reference/README.md) |

## 合作對象

### PJM（Project Manager）— 最緊密的合作夥伴

對專案的**如期 / 如質 / 如預算**負責，是專案執行的推進者。

- 將 milestone 轉為細部 schedule、召集 project team
- Kick-off 後：申請成品/半成品 Model Name 料號、申請 Project Code
- C1/C2 Design Check List、QVL List（初版 C2 → Final C4）、各階段備料計劃
- C3/C4 **Open Issue Judgement**：彙整 Redmine open issue 的說明與對策發給各主管
- Close Meeting 主導：成功關鍵因素、如期/如質/如預算檢討、專案評分

**PLM ↔ PJM 協作介面**：PLM 給「做什麼」（SOW/PSD、規格優先序、目標成本），PJM 給「做到哪了」（schedule、風險、open issue）。規格變更由 PLM 判斷商業影響後走 PCR，PJM 執行變更管理。

### RD（研發：HW / SE 等）— 技術實現夥伴

- **HW**：電路圖 / Layout、新電子料料號申請 / Pre-BOM、研發管制表、Engineering Spec、Function Debug、Close Meeting 的 Lesson & Learn（技術/流程）
- **SE**：成品 Pre-BOM、System Reliability Test Plan/Report、Thermal Report、System C3 Test

**PLM ↔ RD 協作介面**：可行性分析階段（技術可行性、thermal simulation）就要拉 RD 進來對規格；PLM 提供市場端規格需求與取捨依據，RD 回饋技術限制與成本影響。不要在沒問過 RD 的情況下對客戶承諾規格。

### PMC（Project Monitoring & Control）

- PLM 系統 PPM 專案啟動（儲存比較基準）、時程監控
- Kick-off 文件發行（內容由 PLM/PJM 提供）、C0 Meeting 匯簽（PLM 系統）、Cost BOM

### MPM（Manufacturing Process Management）

- 工廠端流程管理，工程量試（C4）到量產（C5）的銜接
- 與工廠主要窗口（NPI、ECO）協作

### 其他常合作單位

| 單位 | 負責 | PLM 何時會碰到 |
|------|------|----------------|
| DQA | EVT/DVT Test、MTBF Report | 測試結果影響規格承諾時；MTBF 客戶要求 |
| SQA / EA | 訊號量測（高速/低速） | C3 驗證 |
| PE | Pilot Run 與量產測試 | C4 量試、量產性回饋 |
| IRT | IRT / PVT（Burn-in）Test | C4 |
| 業務 | 客戶需求、報價、數量預估 | 成本評估的數量基礎、價格分析 |

> 詳細各階段活動與文件見 [研發 C 流程](../05-processes/rd-c-process.md)。完整 job description table 請向部門主管索取後補充連結於此。
