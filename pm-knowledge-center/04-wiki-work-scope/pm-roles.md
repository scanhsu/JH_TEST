# PLM 工作範圍與合作對象職掌

> 最後更新：2026-07-08｜維護人：（待指定）｜來源：研發C流程簡介、ODM1 PJM Training
>
> 本頁以 **PLM 為主體**：先講清楚我們自己的工作範圍，再說明各合作對象（PJM / PMC / MPM / RD）負責什麼、我們跟他們的協作介面在哪裡。

## 我們是誰：PLM（Product Line Manager）＝ 產品架構師

**一句話定位**：對產品線的**商業成敗**負責，同時是**產品架構師（Product Architect）** —— 不只決定「做什麼、賣多少、管到 EOL」，更**親手設計產品的系統架構**。

> **PLM 就是產品架構師**。這是 PLM 與純商業/行銷型 PM 的根本差異：規格不是丟給 RD 去想，**產品架構由 PLM 主導設計** —— 平台選型、系統組成、介面配置、公版與衍生的架構規劃，都是 PLM 自己的產出。RD（HW/SE）負責把 PLM 定義的架構做底層實作與驗證。這也是為什麼 [02 CPU/SoC 資料庫](../02-cpu-soc-roadmap/README.md) 與 [03 架構參考產品庫](../03-architecture-reference/README.md) 是 PLM 的核心資產。

### PLM 核心工作範圍

| 領域 | 工作內容 |
|------|----------|
| **產品規畫** | 蒐集商業輸入（客戶需求、chipset roadmap、技術創新、上級主管策略），決定做什麼產品 |
| **產品架構設計** | 身為產品架構師：主導系統架構、平台選型、介面/功能配置、Block Diagram；公版架構與衍生機種的架構規劃（見 [03 架構參考產品庫](../03-architecture-reference/README.md)、[06 Block Diagram 規範](../06-doc-standards/block-diagram-icons.md)） |
| **產品定義** | 將商業需求與架構轉為內部規格：主導 **SOW / PSD**（0.x 版 → Kick-off 後 1.x 版） |
| **Roadmap 管理** | 維護產品線 roadmap，追蹤各家 CPU/SoC 方案（見 [02 資料庫](../02-cpu-soc-roadmap/README.md)） |
| **價格與成本** | 可行性分析階段的價格分析；成本評估（Function BOM / 加減件，見[成本評估格式](../05-processes/cost-evaluation.md)）；提供成本評估前需與業務確認**評估數量基礎** |
| **產品上市** | C4 階段 marketing material：Photo / Quick Guide / Data Sheet / Manual / Product Launch Note |
| **生命週期** | EOL 決策、ACR approval impact 評估、長供貨風險管理 |
| **文件責任** | Kick-off 文件內容（SOW / PSD / 環境考量面評估表，由 PMC 發行）、環境考量面驗證表（C4） |

### PLM 具體職責（R&R）

以下是 PLM 三大核心職責的展開，這是 PLM 有別於 PJM 的價值所在 —— **對外扛規格與商業承諾、對內扛成本與產品線策略**：

#### 1. RFQ / Bid 接單與規格基線確立

- 解讀客戶的 **RFQ / RFI** 需求，產出 **Compliance Table**（逐項標示符合 / 不符合 / 需妥協）。
- **PLM 身為產品架構師（System Architect）**，主導判斷哪些做得到、哪些需妥協，並提出對應的架構方案；底層實作可行性與風險則與 RD 技術窗口（HW / SE）確認。
- 確定產品**基準線（Baseline）** —— 後續規格變更都以此為比較基準（對應 PCR 發動）。
- 產出銜接：Compliance Table 與 Baseline 是 SOW / PSD 的輸入。

#### 2. BOM Cost 與利潤管理

- 主導產品 **Cost Model**，審核**原物料成本、模具費、NRE（一次性工程費用）**。
- 確保量產出貨時的**毛利符合事業群（BG / BU）預期**。
- 方法遵循 [成本評估格式](../05-processes/cost-evaluation.md)：ODM 案用 Function BOM、標準品客製用加減件；報價前與業務確認評估數量基礎。

#### 3. 標準平台延伸與衍生機種（Derivatives）

- 在**公版架構（Standard Architecture）**上規劃客製化 **SKUs**。
- 提高**設計重複利用率**，降低研發重工成本 —— 這是 PLM 控制 BU 整體研發效率的槓桿。
- 衍生機種（Derivation）走較短開發時程（13 週到 C3，vs New Design 18 週，見 [研發 C 流程](../05-processes/rd-c-process.md)）。
- 產出銜接：衍生 SKU 的規劃可回饋到 [02 CPU/SoC 資料庫](../02-cpu-soc-roadmap/README.md) 與 [03 參考產品庫](../03-architecture-reference/README.md)。

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

#### PJM 具體職責（R&R）

PLM 要看得懂 PJM 在扛什麼，協作才對得上。PJM 五大職責：

1. **主時程規劃與里程碑監控**：制定 **EVT / DVT / PVT → MP** 的 Master Schedule，嚴格監控**關鍵路徑（Critical Path）**，確保客戶排定的發表會或量產日不開天窗。
2. **NPI 物料齊套管制（CTB, Clear To Build）**：打件試產前，協同**物控（MC）與採購**追蹤所有長交期料件（**L/T**）、樣品件，確保試產打件前料件 **100% 齊套**。
3. **內部跨工程整合與戰情會議**：召集 **HW、Layout、ME、BIOS/FW、Thermal、RF、QA** 等工程單位，主導 **Open Issue List** 追蹤，排除產線停滯瓶頸。
4. **工廠試產與製程爬坡（Ramp-up）**：進駐組裝廠/SMT 廠掌控試產**直通率（FPY）**、夾治具就位率（**Fixtures**）、測試程式（**ATE**）部署，協調**生管（PC）**排程。
5. **ECR / ECO 變更推進**：主導變更控制委員會（**CCB**），評估工程缺陷或料源問題導致的設計修改，控管試產在製品（**WIP**）與舊料報廢風險。

**PLM ↔ PJM 協作介面**：

| PLM 給 PJM | PJM 給 PLM |
|-----------|-----------|
| SOW / PSD、規格優先序、Baseline | Master Schedule、Critical Path 風險 |
| 目標成本 / Cost Model | 齊套（CTB）狀態、L/T 料風險 |
| 規格變更的商業判斷（發動 PCR） | Open Issue List、試產 FPY / 良率 |
| 客戶發表會 / 量產日期需求 | ECR/ECO 對成本與時程的衝擊評估 |

規格變更由 **PLM 判斷商業影響**（成本 / 時程 / 其他客戶）後發動，**PJM 於 CCB 執行變更管理**（ECR/ECO、WIP 與舊料報廢控管）。

### RD（研發：HW / SE 等）— 技術實現夥伴

- **HW**：電路圖 / Layout、新電子料料號申請 / Pre-BOM、研發管制表、Engineering Spec、Function Debug、Close Meeting 的 Lesson & Learn（技術/流程）
- **SE**：成品 Pre-BOM、System Reliability Test Plan/Report、Thermal Report、System C3 Test

**PLM ↔ RD 協作介面**：**PLM 設計產品架構，RD 負責底層實作與驗證**。PLM 提出系統架構、平台選型與規格取捨；RD（HW/SE）回饋電路/layout/thermal 等實作可行性、技術限制與成本影響。可行性分析階段（技術可行性、thermal simulation）就要拉 RD 一起確認架構落地性 —— 架構決策權在 PLM，但不要在沒和 RD 確認實作可行性前就對客戶承諾。

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

## 名詞速查（新手 PLM 常見縮寫）

| 縮寫 | 全名 / 意義 | 誰主要在用 |
|------|-------------|-----------|
| RFQ / RFI | Request for Quotation / Information，客戶詢價/需求徵詢 | PLM |
| Compliance Table | 逐項標示需求符合/不符合/需妥協的對照表 | PLM |
| Baseline | 產品基準線，規格變更的比較基準 | PLM |
| System Architect / 產品架構師 | 產品系統架構的設計者 —— **即 PLM 本身的角色** | PLM |
| Cost Model | 產品成本模型（原物料 + 模具 + NRE） | PLM |
| NRE | Non-Recurring Engineering，一次性工程費用 | PLM |
| BG / BU | Business Group / Business Unit，事業群/事業部 | PLM |
| Derivatives | 衍生機種（公版架構延伸的客製 SKU） | PLM |
| SKU | Stock Keeping Unit，可獨立銷售的料號/機種 | PLM |
| Master Schedule | 主時程（EVT/DVT/PVT→MP） | PJM |
| Critical Path | 關鍵路徑（決定專案總工期的作業鏈） | PJM |
| CTB | Clear To Build，打件試產前料件齊套放行 | PJM |
| L/T | Lead Time，料件交期（長交期料需提早追） | PJM |
| MC / PC | 物控 / 生管 | PJM 協作 |
| FPY | First Pass Yield，試產直通率 | PJM |
| Fixtures | 夾治具 | PJM |
| ATE | Automated Test Equipment / 測試程式 | PJM |
| Ramp-up | 量產製程爬坡 | PJM |
| ECR / ECO | Engineering Change Request / Order，工程變更請求/命令 | PJM |
| CCB | Change Control Board，變更控制委員會 | PJM 主導 |
| WIP | Work In Process，在製品 | PJM |

> 詳細各階段活動與文件見 [研發 C 流程](../05-processes/rd-c-process.md)。完整 job description table 請向部門主管索取後補充連結於此。
