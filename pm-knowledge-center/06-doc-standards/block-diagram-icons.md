# Block Diagram 圖示與繪製規範（重點摘要）

> 最後更新：2026-07-22｜維護人：（待指定）｜版本：Rev 1.1（2026/03/17）
> 原始檔（可直接複製取用圖示素材）：[Block_Diagram_Icons_v1.1.pptx](./attachments/Block_Diagram_Icons_v1.1.pptx)

畫產品 block diagram（PSD、提案簡報、datasheet 架構圖）時，使用這套**統一圖示與繪製規範**，讓所有產品的架構圖有一致視覺語言。字型：Arial，大小可調整。

## 標準圖示庫（分類）

原始檔提供以下零件的標準圖示，畫圖時直接複製貼上：

| 類別 | 圖示項目 |
|------|----------|
| **運算 / 記憶體** | CPU、PCH、Switch IC、IC、SIP、U/LR/R DIMM、SODIMM、DDR5 onboard、Low power DDR5、LPDDR5、LPDDR5 onboard、Chip/DIMM |
| **管理 / 電源模組** | Run BMC、PoE Module、OCP |
| **儲存** | HDD、3.5" HDD、mSATA、M.2 2280、M.2 2242、SATA、SATA DOM |
| **擴充槽 / 介面** | Slot、PCIe Slot、PCIe x8、OCP Slot、SATA slot、B2B、miniSAS、Mini PCIe、M.2 connector、TPM、TPM Pin Header |
| **顯示 / 擴充卡** | Graphic card、GPU card (HL/FL)、RAID card、全高全長 / 半高半長 |
| **I/O 連接埠** | RJ45、SFP/SFP+、QSFP28、USB（2.0/3.0/TypeC）、Micro USB、Console、Console+USB、VGA、HDMI、DC Jack、Reset/Power Button、LCM、Micro SD、SIM、WiFi Antenna、LED、Bypass、I/O、NEXBOOT Slider Switch |
| **電源 / 連接器** | Power supply、CRPS、Dual Slim、Terminal block、Power/FAN、M12 X code、M12 A code |
| **LAN 模組** | LAN Module |

## Port 編號畫法

- Port 依實體排列標號（`0 1 2 3…` 或 `P1 P2…`），與[銘版網印命名](./silkprint-membrane-rules.md)一致。
- Combo port、PoE port、不同速率（2.5GbE / 1GbE）在圖上要能區分。

### 標示不同功能的四種方法
可透過 **(1) 文字　(2) 雙色　(3) 標線　(4) 色塊** 來標示不同功能。

> ⚠️ 原則：**產品鎖定的應用須明確，介面不需要過度複雜。**

## 訊號線顏色與線型規範

| 訊號類型 | 顏色 | 範例 |
|----------|------|------|
| **Data** | 黑色 Black | PCIe, USB, HDMI, SATA, Memory, BIOS Flash |
| **Control** | 藍色 Blue | I2C, SMBus, SPI, eSPI, UART |
| **Power** | 紅色 Red | 54V input |

線型格式（format）另以：
- **粗細** 表示頻寬
- **虛實** 表示 Option（虛線＝選配）
- **箭頭** 表示方向（雙向無箭頭；強調方向可加箭頭，如 Host to device）

## 使用要點

1. 一律從原始 PPTX **複製既有圖示**，不要自己重畫，確保跨產品一致。
2. 訊號線顏色嚴格依 Data/Control/Power 三色，不要混用。
3. 圖示更新（新增零件）時，更新原始 PPTX 並在此頁補上，同步 Rev。
