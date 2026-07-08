# PM 角色與職掌（PLM / PJM / PMC / MPM）

> 最後更新：2026-07-08｜維護人：（待指定）｜來源：研發C流程簡介、ODM1 PJM Training

## 四種 PM 角色

| 角色 | 全名 | 一句話定位 |
|------|------|-----------|
| **PLM** | Product Line Manager | 產品線經理：對產品的商業成敗負責（定義產品、定價、roadmap） |
| **PJM** | Project Manager | 專案經理：對專案的如期 / 如質 / 如預算負責 |
| **PMC** | Project Monitoring & Control（Product Management & Coordination） | 專案監控：時程監控、文件發行、會議匯簽 |
| **MPM** | Manufacturing Process Management | 製造流程管理：工廠端流程與量產銜接 |

## 職掌分工重點

### PLM（Product Line Manager）

- 蒐集商業輸入：客戶需求、Chipset roadmap、技術創新、上級主管策略
- 將商業需求轉為內部規格：主導 **SOW / PSD** 內容
- 產品 roadmap 維護、定價與成本目標
- 成本評估：提供成本評估前需與業務確認**評估數量基礎**（詳見 [成本評估格式](../05-processes/cost-evaluation.md)）

### PJM（Project Manager）

- 將 milestone 轉為細部 schedule，召集 project team
- 專案執行推進：C0~C5 各階段的文件、備料、跨部門協調
- 正式 Kick-off 後：申請成品/半成品 Model Name 料號（通知 HW & SE）、申請 Project Code
- C2 提供 **QVL List 初版**給 HW / SQA / DQA / QT / PE 參考
- C3/C4 **Open Issue Judgement**：請相關單位對 Redmine open issue 說明與對策，彙整後發給各主管
- Close Meeting 主導：成功關鍵因素、如期/如質/如預算檢討、風險管理回顧、需導入事項、專案評分

### PMC（Project Monitoring & Control）

- PLM 系統 PPM 專案啟動（**記得儲存比較基準**）
- Kick-off 文件發行：SOW / PSD / 環境考量面評估表（PLM/PJM 提供內容，PMC 發行）
- C0 Meeting 匯簽（PLM 系統）
- 時程監控與各 check point 會議行政

### MPM（Manufacturing Process Management）

- 工廠端流程管理，工程量試（C4）到量產（C5）的銜接
- 與工廠主要窗口（NPI、ECO）協作

## 各階段誰做什麼（速查）

| 階段 | PLM | PJM | PMC |
|------|-----|-----|-----|
| Pre-Kick-off / C0 | SOW/PSD 0.x→1.x、價格分析 | Schedule、召集 team、料號/Project Code 申請 | PPM 啟動、文件發行、C0 匯簽 |
| C1 | 成本追蹤 | C1 Design Check List、備料計劃 | Cost BOM、時程監控 |
| C2 | | C2 Design Check List、QVL 初版、系統料備料 | 時程監控 |
| C3 | | Open Issue Judgement 彙整 | 時程監控 |
| C4 | Marketing material 確認 | QVL Final、行銷文件（Photo/Quick Guide/Data Sheet/Manual/Product Launch Note）、環境考量面驗證表 | 時程監控 |
| C5 / Close | 產品上市 | Close Meeting 主導 | 會議行政 |

> 詳細各階段活動與文件見 [研發 C 流程](../05-processes/rd-c-process.md)。完整 PM job description table 請向部門主管索取後補充連結於此。
