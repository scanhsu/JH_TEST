# Arm 陣營 SoC 方案

> 最後更新：2026-07-08｜維護人：（待指定）｜資料性質：公開資訊整理，正式規格以各 vendor 文件為準

## Vendor 總覽

| Vendor | 代表系列 | 定位 | 供貨承諾 |
|--------|----------|------|----------|
| NXP | i.MX 8 / i.MX 9、Layerscape | 工業級 AIoT、網路處理 | 10~15 年（Longevity Program） |
| Rockchip | RK3566 / RK3568 / RK3588 | 高性價比 AIoT、邊緣 AI | 約 10 年（依料況） |
| MediaTek | Genio 350/510/700/1200 | AIoT 平台（含 NPU） | 有 longevity 方案 |
| TI | Sitara AM62 / AM64 | 工業控制、閘道器 | 工業級長供貨 |
| Qualcomm | QCS/QCM 系列、Dragonwing | 高階 edge AI、影像 | 依系列 |

## 常用平台速查

| 平台 | CPU | NPU / AI | 重點 I/O | 典型應用 |
|------|-----|----------|----------|----------|
| NXP i.MX 8M Plus | 4×A53 | 2.3 TOPS | 2×GbE(TSN)、MIPI-CSI | 工業 HMI、視覺 |
| NXP i.MX 93 | 2×A55 | Ethos-U65 | 2×GbE、低功耗 | 低階閘道器 |
| NXP i.MX 95 | 6×A55 | eIQ Neutron | 10GbE、PCIe Gen3 | 新一代工業 AIoT |
| Rockchip RK3568 | 4×A55 | 1 TOPS | 2×GbE、PCIe 3.0 | NVR、閘道器 |
| Rockchip RK3588 | 4×A76+4×A55 | 6 TOPS | 8K、PCIe 3.0、2.5GbE | 邊緣 AI 主力 |
| TI AM62x | 4×A53 | （AM62A 含 AI） | 2×GbE、PRU | PLC、閘道器 |
| MediaTek Genio 700 | 2×A78+6×A55 | 4 TOPS | MIPI、GbE | 智慧零售 / HMI |

## 選型筆記

- Arm 方案 **BSP / OS 維護成本**是隱藏成本重點：確認 vendor 的 Linux LTS 維護年限（NXP/TI 較佳，Rockchip 依模組廠）。
- 出貨歐美的案子注意 **供應鏈與資安審查**（部分客戶排除中系 SoC，先問清楚）。
- 記憶體多為 **on-board LPDDR**，開案時就要鎖容量檔位，變更成本高。
- 有量產急迫性時優先考慮 **SoM（核心板）+ 載板**架構，縮短開發時程，成本換時間。

## Roadmap 追蹤

| 日期 | 來源 | 重點摘要 | 資料位置 |
|------|------|----------|----------|
| | | | |

## 評估紀錄

| 日期 | 平台 | 專案 | 結論 |
|------|------|------|------|
| | | | |
