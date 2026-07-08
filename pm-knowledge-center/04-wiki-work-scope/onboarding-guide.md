# 新任 PLM 入職指南（PLM Onboarding）

> 最後更新：2026-07-08｜維護人：（待指定）
>
> 對象：新加入的 **PLM 產品經理**。目標：一個月內能看懂進行中的案子、兩個月內能參與新產品規畫。

## 第 1 週：帳號與環境

### 系統帳號申請清單

| 系統 | PLM 用途 | 申請窗口 |
|------|----------|----------|
| PLM 系統 | BOM / 簽核流程、Kick-off 文件、C0 匯簽 | （待補） |
| PPM | 專案時程查看（執行面由 PJM/PMC 主導） | （待補） |
| Easy Flow | 電子表單簽核 | （待補） |
| Tip Top（ERP） | 料況 / 成本 / 出貨查詢 | （待補） |
| Redmine | 專案 issue 追蹤（product spec 相關 issue 需 PLM 判斷） | （待補） |
| 檔案伺服器 | 產品文件 / vendor roadmap 存放 | （待補） |

### 必認識的人

| 對象 | 為什麼 |
|------|--------|
| 部門主管 / mentor（資深 PLM） | 分派產品線與提問窗口 |
| **PJM 團隊** | 最緊密的合作夥伴：專案執行、schedule、open issue |
| **RD 窗口（HW / SE）** | 規格可行性、技術限制的討論對象 |
| 業務窗口 | 客戶需求、報價、數量預估（成本評估的數量基礎） |
| PMC | 文件發行與會議行政 |
| 各 vendor FAE / 代理商窗口 | CPU/SoC roadmap 與技術支援來源 |

## 第 2 週：必讀文件

1. [PLM 工作範圍與合作對象](./pm-roles.md) — 先弄清楚自己的責任節點與 PJM / RD 的分工
2. [研發 C 流程](../05-processes/rd-c-process.md) — C0~C5 全流程，重點看 **PLM 視角**段落
3. Q410-000 設計／開發管制程序（最新版）— 正式管制文件（PLM 系統取得）
4. [成本評估格式](../05-processes/cost-evaluation.md) — PLM 基本功：Function BOM 與加減件
5. 自己產品線的 roadmap 與 [02 CPU/SoC 資料庫](../02-cpu-soc-roadmap/README.md)

## 第 3~4 週：必修主題

### PLM 核心必修（要能自己動手）

- [ ] SOW / PSD 的結構與寫法（找 mentor 拿 2~3 份過去的範例讀）
- [ ] 成本評估實作：Function BOM 與加減件格式、Golden BOM 比對、數量基礎確認
- [ ] 價格分析與可行性評估的做法（Pre-Kick-off 階段 PLM 的功課）
- [ ] 產品 roadmap 的維護方式與 vendor roadmap 取得管道（NDA 流程）
- [ ] EOL process：ACR approval impact、Regular BOM scan

### 協作理解（懂概念、知道找誰，不必自己操作）

- [ ] 研發 C 流程 Project template（PJM 主導，PLM 要看得懂 schedule）
- [ ] BOM 結構：Naming rule、標準品與 ODM BOM 差異、A 料號
- [ ] ECO / DCR / PCR 流程 — 尤其 **PCR**（客戶 spec 異動時 PLM 是發動者）
- [ ] PLM 系統 / Easy Flow / Tip Top 基本操作與常用代號
- [ ] 認證與法規常識：安規、RoHS / REACH / WEEE、MTBF
- [ ] 工廠協作常識：NPI / ECO 窗口、特材單、重工流程（E 料號）

## 第 1 個月結束前

- [ ] 跟著資深 PLM 參加至少一次 check point meeting（C0~C5 任一）
- [ ] 讀完 [03 參考產品庫](../03-architecture-reference/README.md) 至少 2 個案例，能說出各案的選型理由
- [ ] 挑一份進行中案子的 SOW/PSD，向 mentor 解釋這個產品「為什麼這樣定義」
- [ ] 和 mentor 對一次 [工作要領](./work-essentials.md) 的疑問清單
