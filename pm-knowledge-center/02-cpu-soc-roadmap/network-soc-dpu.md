# 網通 SoC / DPU / 加速方案

> 最後更新：2026-07-08｜維護人：（待指定）｜資料性質：公開資訊整理

網通產品線專用：封包處理 SoC、DPU / SmartNIC、交換晶片與加速方案。

## 方案總覽

| 類別 | 代表方案 | 定位 |
|------|----------|------|
| 網通 Arm SoC | Marvell OCTEON 10、NXP Layerscape LS1/LS2/LX2 | 路由器、uCPE、5G 設備 |
| x86 網通 SoC | Intel Atom C、Xeon D（詳見 [Intel](./intel.md)） | 網安設備主流 |
| DPU / SmartNIC | NVIDIA BlueField-2/3、Intel IPU、AMD Pensando | 卸載 / 加速、雲端邊緣 |
| 交換晶片 | Broadcom（Trident/Tomahawk）、Marvell Prestera、Microchip | Switch 產品 |
| 加密 / 壓縮加速 | Intel QAT（內建或 PCIe 卡） | VPN / TLS throughput |

## 選型筆記

- **x86 vs Arm 網通 SoC**：x86 生態成熟（DPDK、VNF 相容性佳）；Arm（OCTEON / Layerscape）在 performance-per-watt 與內建加速器有優勢，但軟體移植成本高，客戶軟體堆疊決定一切。
- **QAT 世代差異大**：規格書標示的 crypto throughput 要對到客戶實際 workload（IMIX、封包大小）再承諾。
- **交換晶片**通常伴隨 vendor SDK 授權議題（Broadcom SDK / SONiC 支援），開案前確認軟體授權成本與窗口。
- 5G / TSN / 時間同步需求（PTP、SyncE）要在選型階段確認 MAC/PHY 支援，事後補救困難。

## Roadmap 追蹤

| 日期 | 來源 | 重點摘要 | 資料位置 |
|------|------|----------|----------|
| | | | |

## 評估紀錄

| 日期 | 平台 | 專案 | 結論 |
|------|------|------|------|
| | | | |
