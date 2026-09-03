# Intel 平台方案

> 最後更新：2026-07-08｜維護人：（待指定）｜資料性質：公開資訊整理，正式規格以 Intel ARK / IOTG roadmap 為準

## 產品線總覽

| 系列 | 定位 | 功耗級距 | 備註 |
|------|------|----------|------|
| Core / Core Ultra（H/P/U） | 主流嵌入式運算 | 15~45W+ | Core Ultra 起內建 NPU |
| Core（S，桌上型） | 高效能工控 / edge server | 35~125W | 搭配 PCH（R680E 等嵌入式 chipset） |
| Atom x 系列（E-core based） | 低功耗無風扇 | 6~12W | 長供貨、寬溫 SKU |
| Atom C 系列 | 網通 / 儲存專用 SoC | 10~50W+ | 內建 QAT、多 LAN、部分含交換功能 |
| Xeon D | 高密度網通 / edge server SoC | 25~125W | 內建 10/25G MAC、QAT |

## 主要世代整理（嵌入式相關）

| 世代 / 代號 | 系列 | 上市（約） | 重點 | 嵌入式長供貨 |
|--------------|------|-----------|------|---------------|
| Elkhart Lake（Atom x6000E） | Atom | 2021 | 10nm、TSN、寬溫 | ✅ |
| Alder Lake / Raptor Lake（12/13/14代） | Core | 2022~2023 | 大小核架構、DDR5、PCIe 5.0（S） | ✅（IOTG SKU） |
| Amston Lake（Atom x7000RE/C 系列同源） | Atom | 2023~2024 | 8×E-core、效率大幅提升 | ✅ |
| Meteor Lake（Core Ultra 100） | Core Ultra | 2023~2024 | 首代內建 NPU、chiplet 架構 | ✅（PS SKU） |
| Twin Lake（N 系列更新） | 入門 Core/N | 2024~2025 | 入門低功耗更新 | 部分 |
| Arrow Lake（Core Ultra 200） | Core Ultra | 2024~2025 | 效能核心更新、NPU 續強 | ✅ |
| Granite Rapids-D | Xeon D 後繼 | 2025 前後 | edge server / vRAN | ✅ |
| Panther Lake（Core Ultra 300） | Core Ultra | 2025~2026 | Intel 18A 製程 | 追蹤中 |

## 網通相關重點（Atom C / Xeon D）

- **Denverton（C3000）**：2017 起長青款網安平台，仍大量出貨中，注意 EOL 時程。
- **Amston Lake C 系列（C1100 等）**：C3000 後繼方向，E-core 架構 + QAT。
- **Xeon D-1700/2700（Ice Lake-D）**：內建 25G MAC + QAT，中高階網安 / uCPE 主力。
- 選型關鍵：LAN 數量與速率、QAT 世代（對 IPsec/TLS throughput 影響大）、PCIe lane 數、記憶體通道。

## Roadmap 追蹤

| 日期 | 來源 | 重點摘要 | 資料位置 |
|------|------|----------|----------|
| （範例）2026-Q1 | Intel IOTG NDA roadmap | （只寫可公開的一句話摘要） | （內部檔案伺服器路徑 / 窗口） |

## 評估紀錄

| 日期 | 平台 | 專案 | 結論 |
|------|------|------|------|
| | | | |
