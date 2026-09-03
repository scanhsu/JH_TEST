# NCS 標準品銘版與網印印刷設計原則（重點摘要）

> 最後更新：2026-07-22｜維護人：（待指定）｜版本：Rev 1.4（2026/04/17）
> 原始檔（以此為準，含正確/錯誤範例圖與各 I/O 標示範例）：[NCS標準品銘版與網印印刷設計原則_v1.4.docx](./attachments/NCS標準品銘版與網印印刷設計原則_v1.4.docx)
>
> 核准：Allan Chiu；製作：Svetlana Lee / Licca Chuang；審核：Jennifer Lan / CL Wu

## 適用範圍

適用**所有 NCS 標準品**（Cyber Security / Edge & Cloud / Network Peripheral / OT Security 各前綴）。ODM 客戶轉標準品者，部分設計沿用 ODM。

## 銘版（Membrane）需定義的項目

1. **PANTONE 色**：主要顏色參照原始檔色表（銘版底色需與機箱一致，可用兩色以上底色）。
2. **孔位定義**：透明孔、沖孔、文字。
3. **NEXCOM logo**。

### 藍色色塊繪製規則
- 左側寬度**固定 75.00 mm**。
- 斜角 **45 度**，直接往上延伸至上緣。
- 右側延伸長條色塊與上緣距離**固定 9.50 mm**（可依 I/O 孔位或通風孔位置調整）。

## 網印文字規則

| 項目 | 規則 |
|------|------|
| 字型 | Arial（Regular 標準），**全大寫**（特殊用詞如 PoE 除外） |
| 樣式 | 不加粗、不使用斜體 |
| 字型大小 | 8pt（空間不足可適當調整） |
| 文字與開孔距離 | 統一間隔 **1.5mm**，文字中心與孔位中心水平或垂直對齊 |
| 對齊 | 水平整排優先靠下沿；垂直整排優先靠左；空間不足可調整字距/字寬 |
| 電源螺母 | 文字印在螺母外側，避免鎖附後被遮蔽 |

## Logo 使用規則

### NEXCOM Logo
- 以 **PANTONE White** 為主。
- 統一寬度 **30mm**，最小 **25mm**。
- 離邊緣至少 **3mm**（最近邊相同距離，最小 3.23mm、最近邊相同距離 5mm）。
- **不可變形、不可加框、不可加陰影**。
- 凡使用 NEXCOM logo **皆須經品牌中心審視核准**。

### NEXBOOT Logo（切換開關 / LED）
- 建議高度 **2.1mm**，長度等比例。
- 檔案位置：`\\10.1.1.96\nds30 ncs\...\Logos\NEXBOOT`（完整路徑見原始檔）。
- 開關由 **ME 設計擺放位置、PLM 控管**，建議設計在產品側邊。
- 橫向：左 I、右 II；直向：上 I、下 II。

## I/O 孔位與 LED 網印標示命名規則

> 通則：多 port 從 **上至下、從左至右**編號；只有 1 個時多半省略編號。

| 項目 | 網印標示 | 編號起點 | 備註 |
|------|----------|----------|------|
| USB | `USB1~#`（僅 1 個寫 `USB`） | 1 | Console+2 USB 時編 USB1/2（左上/右下）；規格 2.0/3.0/TypeC 於 PSD & User manual 說明 |
| LAN（RJ45/SFP/SFP+/SFP28/QSFP+/QSFP28） | `0~#`（僅 1 個寫 `LAN`） | 0 | **不加網速資訊**，速度於 PSD & manual 說明；LAN 模組不需加網速 |
| iNAS（M12 ethernet） | `LAN0~LAN#` | 0 | 特例 |
| Bypass | `BP0~BP#`（僅 1 個寫 `BP`） | 0 | 相同功能的 2 port 需拉線連接 |
| PoE 送電端 | `PoE0~PoE#`（僅 1 個寫 `PoE`） | 0 | P、E 大寫 o 小寫；2 port 拉線；銘版燈不拉線 |
| PoE 受電端 | `PoE PD0~PoE PD#` | 0 | 同上 |
| Management | `MGMT` | — | |
| Console | `CONSOLE` | — | |
| Reset | `RESET` | — | |
| Power 按鈕 | `PWR` | — | 兩種開關鈕都要加註 |
| System status LED | `STATUS` | — | Bi-color Green & Orange |
| SYS LED | `SYS` 或 `SYS1~#` | 1 | Single color Green |
| HDMI | `HDMI` | — | |
| VGA | `VGA` | — | |
| Storage LED（SSD/HDD/NVMe） | `SSD1~#` / `HDD1~#` / `NVMe1~#` | 1 | 僅 1 個省略編號 |
| DC Power input | `DC-IN1 電壓範圍V ~` | 1 | 輸入電壓於 manual 說明 |
| DC Power LED | `PWR1~#`（僅 1 個寫 `PWR`） | 1 | |
| Redundant PSU LED | `PSU1~#`（僅 1 個寫 `PSU`） | 1 | |
| 接地線符號 | 接地符號 icon | — | 建議高度 5.25mm；檔案見原始檔路徑 |

### 孔位拉線定義規則（Bypass / PoE 等）
1. 粗細 **0.57pt（0.2mm）**
2. 轉彎拉到 I/O 中間
3. 線與文字距離 **1.5mm**
4. **不將 I/O 整個框起來**
5. 空間不足可適當調整

## 常見錯誤（來自原始檔錯誤範例）

- 藍色色塊左側寬度尺寸錯誤（應 75.00mm）
- 藍色色塊 45 度未直接延伸至上緣 / 角度錯誤
- 藍色延伸色塊高度尺寸錯誤（應距上緣 9.50mm）
- 文字未全大寫（如 `Consol`、`Reset`、`Status` 應全大寫）
- 文字使用粗體（禁止）

> 上述錯誤在原始檔有對應機種圖例（NSA 3190A / 3180A / 3170A / 5190、FTA 5190），設計審查時對照。
