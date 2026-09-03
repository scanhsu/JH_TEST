# NCS Datasheet 編輯規則（重點摘要）

> 最後更新：2026-07-22｜維護人：（待指定）｜版本：Rev 3.0（2024/11/15）
> 原始檔（以此為準，含完整範例 NSA 1170）：[NCS_Datasheet編輯說明_v3.0.docx](./attachments/NCS_Datasheet編輯說明_v3.0.docx)

## 核心原則（最容易出錯，優先記住）

1. **每一個獨立料號都有獨立的 datasheet**；不同料號的主要規格差異，在 Main Feature / Overview 說明（例：support redundant PSU、4 LAN modules、QAT、IPMI）。
2. **Datasheet 一律核對實際 BOM list**，確保正確與一致。寫 eNews 時**參考 Datasheet，不參考 PSD**。
3. **不能寫 BOM 沒建的功能**（照片、規格、ordering info 都一樣）。
4. **規格需參閱 `10_Specification Table`**（標準品相關資訊，路徑見原始檔 Rev 3.0 備註）。

## Product Positioning（產品定位分類）

Datasheet 第一步先勾選產品定位，對應型號前綴：

| Solution 類別 | 型號前綴 | 子類 |
|---------------|----------|------|
| Cyber Security Solutions | DNA / NSA | Desktop / Rackmount（SoC / X86 Entry / Mainstream / Performance）、LAN Module、Expansion Card |
| Edge & Cloud Solutions | DTA / DFA / TCA / FTA | nexCPE / uCPE / Edge / SD-WAN / Datacenter Appliance |
| Network Peripheral Solutions | PNSA / iNAS | NVR / Storage |
| OT Security Solutions | ISA | X86 Based / DIN Rail |

> 完整 Product Positioning Check List 見原始檔（含 X86 based 分級定義）。

## 規格 wording 規則

### Memory
- **Main Features** 寫全系統上限：`2 x DDR4 ECC SO-DIMM slots, up to XXGB`（per whole system）
- **Detailed Spec** 寫每條規格：`2 x DDR4 2400 ECC SO-DIMM slots, up to XXGB per slot`
- 一律以 `up to 容量` 結尾；兩條要特別註明每條個別容量。
- 檢查 CPU max memory speed / capacity，選用的記憶體不可高於 CPU 支援上限。

### Mainboard
- CPU socket 規格與支援世代（例：Skylake and Kabylake）；SoC 則寫 onboard CPU 世代型號（例：Skylake-D D-2123IT）。
- 標註 QAT、PCH 型號（例：C621）、IPMI / TPM / Dual BIOS 等 onboard 功能。
- **Onboard 指直接打件**；模組則寫在 Interface Internal。

### Storage
- 尺寸寫清楚：`M.2 Key B 2280`、`2.5" internal SSD/HDD`、`2.5" hot swappable SSD/HDD`。
- `Key M` 後、`SSD` 前要加 `SATA`。

### Interface External / Internal
- **External**：不開蓋可存取的介面（LED/Button、USB、LAN port、Console、LAN module slot、PCIe slot、FAN、LCM、Antenna…），外觀看得到有功能的都要寫。
- **Internal**：要開蓋的擴充介面（minicard、PCIe card slot、M.2 slot、TPM module pin head、RunBMC…），尺寸限制要註明（例：`PCIe x8 slot support FHHL PCIe card`）。
- Shared 介面要備註（例：`shared with mSATA`）或標訊號（例：`M.2 2280 B key (PCIe x2, SATA x1)`）。
- **TPM 2.0 (on board)** 與 **TPM 2.0 module** 要區別，module 放 Interface Internal。
- M.2 2242/2280 螺絲孔會干涉，**只寫實際可裝的一種**。
- 不含不建議客戶自用的介面（USB pin head、UART pin head…）。

### Power
- 成本佔比高，Single / Redundant 差異、瓦數要寫清楚。
- Wording 統一，例：`1 x power inlet` → `1 x AC power inlet`。

### Module / Card 用字
- 若 module/card **已建入 BOM** → 用 `module` / `card` 字樣；**未建** → 用 `slot`。

### Optional
- 統一寫成 `(Optional)`。
- 互斥的 option（規格上不能並存）→ 另在 datasheet page 2 用 **matrix table** 呈現。

## 照片規則

- 一律**外拍**，四個角度：正面、背面、左上 45°正面、右上 45°正面。
- 用型號（料號）**BOM 規格的最大組合**拍：BOM 有建的（如 4×USB）照片就要有；BOM 沒建的不要有。
- 有支援 LAN module / 天線等外觀組件，**組裝上去**拍。
- 放 Datasheet 上一律**正面一張、背面一張**。
- 有 LAN module slot 的機種，照片上要**插滿 LAN modules**；插卡組態由 PLM 依產品特性定義，PLM 須提供拍照說明給 PJM。
- LAN Module 拍照統一上 TRAY，傾斜角度由行銷部門統一定義。

## Ordering Information

- 型號 + 料號 + 描述；描述要能辨別不同料號主要差異（CPU、LAN module 數、Redundant PSU…），且**不含 BOM 沒建的功能**。
- 範例：
  ```
  NSA 3180A  (P/N: 10S00318000X0)
  1U w/ Intel® Coffee Lake Processor, 8 x 1GbE ports, 1 x LAN module slot, single PSU
  NSA 3180HA (P/N: 10S00318001X0)
  1U w/ Intel® Coffee Lake Processor, 8 x 1GbE ports, 1 x LAN module slot, dual PSU
  ```

## LAN Module Datasheet Rule

- Dimension 部分需有 **LAN TRAY 和 PCBA**，多加一個 Dimension Drawing。
- 右上角寫**歸屬的速度**（例：`Intel 40G Fiber LAN module`），不以 major chip 命名。
- 機構圖請提供 **DXF 與 PDF 檔**。
- 固定 LAN module 配置的系統，Ordering info 要附對應可搭配的 LAN module 資訊表。

## 檢查清單（交件前）

- [ ] 每個料號獨立 datasheet，差異在 Main Feature/Overview 說清楚
- [ ] 全篇對照實際 BOM，沒有 BOM 未建的功能
- [ ] Memory 的 Main Feature（全系統）與 Detailed（per slot）寫法正確
- [ ] Onboard vs module 分別放對位置；TPM module 在 Interface Internal
- [ ] Optional 統一 `(Optional)`；互斥 option 有 matrix table
- [ ] 照片為最大 BOM 組合、LAN slot 插滿、正背面各一張
- [ ] Ordering info 描述能區分料號差異
