# 工作要領（日常實務主題）

> 最後更新：2026-07-08｜維護人：（待指定）｜來源：ODM1 PJM Training 主題大綱
>
> 本頁以 PJM Training 的主題為骨架，各主題細節請資深成員持續補充（標「📝 待補充」者尤其歡迎認領）。

## 工廠協作

### 工廠主要窗口

- **NPI**：新產品導入（試產安排、上線問題）
- **ECO**：工程變更執行
- 要領：試產前先跟 NPI 對清楚備料與治具狀況；ECO 生效日與在庫/在途料的處理方式要先講好。📝 待補充窗口名單

### 特材單

- 用途：特殊材料需求申請。📝 待補充：適用時機、表單位置、簽核路徑
- 常見退件原因與範例：📝 待補充（訓練教材中有退件範例，請補上）

### 重工流程（E 料號）

- 重工作業使用 E 料號管理。📝 待補充：發起條件、流程、成本歸屬

## 產品生命週期

### EOL Process

- **ACR approval impact**：ACR 核准對 EOL 的影響評估
- **Regular BOM scan**：定期掃描 BOM 中零件的生命週期狀態，提早發現停產風險
- 要領：不要等 vendor 發 EOL 通知才動，Regular BOM scan 要成為例行工作；長供貨承諾（見 [02 資料庫](../02-cpu-soc-roadmap/README.md)）在選型時就要確認。

### Product Roadmap 維護

- PLM 負責產品線 roadmap，資料來源包含 chipset roadmap（見 [02 資料庫](../02-cpu-soc-roadmap/README.md)）、客戶需求、競品動態。

## 認證與法規

| 主題 | 重點 |
|------|------|
| 安規（UL 等） | C5 需 FCC / CE / UL 證書與 report；有 UL Mark 需申請反銀龍料號 |
| RoHS / REACH / WEEE | 環境法規符合性；環境考量面評估表（C0 發行）→ 驗證表（C4，PM 負責） |
| MTBF | C4 產出 MTBF Report（10F DQA）；客戶常要求，規格承諾前先確認計算標準（如 Telcordia） |
| Label making | 使用 Bartender 製作標籤；📝 待補充：模板位置與申請流程 |

## 文件與 BOM 紀律

- **標準品 vs ODM BOM 差異**、A 料號規則：見 [BOM / ECO / 系統操作說明](../05-processes/bom-eco-systems.md)
- Spec 變更一律走 **PCR**，不做口頭承諾
- 成本評估遵循 [成本評估格式](../05-processes/cost-evaluation.md)：Summary 用公式引用避免前後不一致；BOM cost review 先與 Golden BOM cost 比對異常項

## 主管分工參考（Open Issue Judgement 分派對象）

C3/C4 open issue 彙整後發給各主管，分工如下（依訓練教材，人員異動請隨時更新）：

| 負責範圍 | 主管 |
|----------|------|
| Sales / Product Spec | Allan |
| EE | Jovanni |
| SW & FAE | Cobalt |
| DQA | Nick / Kent |
