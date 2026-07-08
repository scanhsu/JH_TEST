# ODM 與客製成本評估格式

> 最後更新：2026-07-08｜維護人：（待指定）｜來源：ODM與客製成本評估格式.pptx
> Excel 格式範例畫面請見[原始簡報](./attachments/ODM與客製成本評估格式.pptx)。

## 使用原則

1. **ODM 案**（須改 PCB 與機構設計）：用 **Function BOM** 計算成本。
2. **標準品客製**（只改 BOM、不動 PCB）：用**加減件**計算成本；若 KA（關鍵客戶）需要，仍用 Function BOM 計算。
3. **Summary 計算一律套用公式引用**，避免手動調整後前後資訊不一致。
4. **BOM cost review** 時，須先與 **Golden BOM cost** 比對，找出有異常的項目。
5. PLM 提供成本評估前，需與業務確定**評估數量基礎**；PCB、Power、Heatsink 與機構件須依數量基礎**重新詢價或考慮開模價**。

## 方法一：Function BOM（ODM 案）

### 檔案結構（Function BOM Summary）

| 分頁 | 內容 |
|------|------|
| Summary | Function BOM cost 樞紐分析（公式引用，不手動改） |
| 主 Bare BOM by function | Board level 明細 |
| System level / A0 周邊 | 系統層與周邊 |
| 其他小卡 | 其他參考的成本佐證 |
| 製造成本 | |
| 參考報價 | |

### Function BOM 分類方式

**Level**：分 Board level、System level 與周邊的 A0 階。

**Function** 分類：

| Function | 涵蓋內容 |
|----------|----------|
| CPU | |
| Key IC | |
| PCB | |
| I/O | External 與 Internal |
| Daughter board | 其他小卡 |
| Chassis | 含螺絲、銅柱等細節，與附屬機構件（bracket、handle、ear、rubber foot、rail kit……） |
| Thermal | 含 Heatsink、Thermal pad、Fan、Fan bracket |
| Power supply | |
| System module | 例：Swappable Fan kit、Swappable HDD tray |
| System cable | |
| Packing | 含包材內的 cable，**不含**附屬機構件 |

**Item**：各 Function 下列出每一項的品名與功能。

**RBOM（Rest BOM）**：不屬於上述分類、且總金額 **1 USD 以下**的零件歸入 RBOM。

## 方法二：加減件（標準品客製）

### 檔案結構（加減件 Summary）

| 分頁 | 內容 |
|------|------|
| Summary | 基礎 Bare BOM cost ± 加減件（公式引用） |
| 主 Bare BOM Cost 明細 | 基礎 Bare BOM cost |
| 減件 | 移除項目明細 |
| 加件 | 新增項目明細 + 成本佐證 |
| 製造成本 | |
| 參考報價 | |

## 常見錯誤 checklist

- [ ] Summary 有人手動蓋掉公式 → 交件前檢查公式完整性
- [ ] 沒跟業務確認數量基礎就報價 → PCB / Power / Heatsink / 機構件價格失真
- [ ] 沒和 Golden BOM 比對 → 異常單價沒被抓出來
- [ ] 客製案客戶是 KA 卻只做加減件 → KA 需求時要用 Function BOM
