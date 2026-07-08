# 02 CPU / SoC 方案及 Roadmap 資料庫

> 最後更新：2026-07-08｜維護人：（待指定）

各家 CPU / SoC 平台的方案整理與 roadmap 追蹤，供產品規畫選型使用。這是 **PLM 的核心資產**：roadmap 判斷與平台選型是 PLM 的責任，本庫由 PLM 團隊共同維護。

## ⚠️ 使用注意

- 本頁內容為**公開資訊整理**，實際規格、上市時程、EOL 以 vendor 正式文件為準。
- **NDA roadmap 簡報不得放入本庫**，只在對應頁面留「資料存放位置 + 取得窗口」索引。
- 選型時務必確認 **embedded 長供貨承諾**（Intel IOTG / AMD Embedded 通常 7~10 年，consumer SKU 沒有）。

## 平台索引

| 頁面 | 涵蓋範圍 | 典型應用 |
|------|----------|----------|
| [Intel](./intel.md) | Core / Core Ultra、Atom x / C 系列、Xeon D | 主流嵌入式、網路設備、edge server |
| [AMD](./amd.md) | Ryzen Embedded、EPYC Embedded | 嵌入式運算、網安設備、儲存 |
| [Arm 陣營 SoC](./arm-soc.md) | NXP i.MX / Layerscape、Rockchip、MediaTek Genio、TI Sitara、Qualcomm | 低功耗嵌入式、AIoT、閘道器 |
| [網通 SoC / DPU / 加速](./network-soc-dpu.md) | Marvell OCTEON、NVIDIA BlueField、Intel IPU、交換晶片 | 網通專用、SmartNIC、加速卡 |

## 快速選型對照（粗略級距）

| 需求 | 建議先看 |
|------|----------|
| 無風扇、<15W、成本敏感 | Intel Atom x 系列、Arm SoC（i.MX / Rockchip） |
| 主流工控 / 邊緣運算 15~45W | Intel Core（H/U/P）、AMD Ryzen Embedded |
| 網安 / 網通設備（多網口、QAT/加密） | Intel Atom C、Xeon D、Marvell OCTEON |
| Edge AI（NPU 需求） | Intel Core Ultra（Meteor Lake 之後）、AMD Ryzen AI、Qualcomm、MediaTek Genio |
| 高密度伺服器級 | Xeon D、EPYC Embedded |

## 維護規則

1. 每季（或拿到新 roadmap 時）檢視一次各頁面，更新「Roadmap 追蹤」表。
2. 新平台評估過就留紀錄：即使沒採用，也在對應頁面「評估紀錄」寫一行結論（為什麼沒用）。
3. 新增 vendor 時複製 [`_template-platform.md`](./_template-platform.md)。
