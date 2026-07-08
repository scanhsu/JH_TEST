# 待補清單（TODO / Contribution Backlog）

> 最後更新：2026-07-08｜維護人：（待指定）
>
> 本知識庫目前為**骨架完整、部分內容待團隊補實**的狀態。本頁彙整所有待補項目，方便分派認領。
> 補完一項就把該列的 `[ ]` 改成 `[x]`，並在對應頁面把 `📝 待補充` / `（待補）` 換成實際內容、更新該頁「最後更新」日期。

---

## 🔴 優先級 1：需要「真實資料」才能填（只有你們內部知道，我無法代填）

這些需要公司內部的實際資訊，請分派給知道的人填寫。

### A. 系統帳號申請窗口
📄 檔案：`04-wiki-work-scope/onboarding-guide.md`（系統帳號申請清單表格）

- [ ] PLM 系統 — 申請窗口 / 流程
- [ ] PPM — 申請窗口
- [ ] Easy Flow — 申請窗口
- [ ] Tip Top（ERP） — 申請窗口
- [ ] Redmine — 申請窗口
- [ ] 檔案伺服器 — 申請窗口 / 路徑

### B. 系統操作速查表
📄 檔案：`05-processes/bom-eco-systems.md`

- [ ] PLM 系統 **常用流程代號**（做成速查表）
- [ ] Easy Flow **常用表單**清單
- [ ] Tip Top **常用指令**（做成速查表）
- [ ] ECO/DCR/PCR 表單設定與 model naming rule

### C. 工廠協作實務
📄 檔案：`04-wiki-work-scope/work-essentials.md`（Part 2）

- [ ] 工廠主要窗口名單（NPI / ECO 實際窗口）
- [ ] 特材單：適用時機、表單位置、簽核路徑、常見退件原因
- [ ] 重工流程（E 料號）：發起條件、流程、成本歸屬
- [ ] Label making（Bartender）：模板位置與申請流程

### D. 各頁「維護人」指定
📄 全部頁面的標頭 `維護人：（待指定）`

- [ ] 指派每一區 / 每一頁的維護負責人（建議一區一個 owner）

---

## 🟡 優先級 2：需要 PLM 補「專業內容」（有教材/經驗即可寫，我可協助整理）

這些訓練簡報只給了標題、細節在課堂教材裡。若你提供教材或口述，我可以幫忙整理成頁面。

### E. BOM 結構細節
📄 檔案：`05-processes/bom-eco-systems.md`（BOM 結構表格）

- [ ] Naming rule（料號 / 品名命名規則）
- [ ] Board assemble number（板階組裝料號結構）
- [ ] 標準品與 ODM BOM 差異（BOM 建法差異）
- [ ] A 料號（定義與使用時機）
- [ ] E 料號（重工用，與工作要領交叉引用）

### F. 真實產品案例（取代示範案例）
📄 檔案：`03-architecture-reference/`

- [ ] 用 `_template-reference-design.md` 建立**至少 2~3 個真實結案產品**案例
- [ ] 案例齊了之後，可考慮移除或保留 `example-network-appliance.md`（目前標明「示範用」）
- [ ] 更新 `03-architecture-reference/README.md` 的案例索引表

### G. 產品知識首發內容
📄 檔案：`01-product-knowledge/`

- [ ] 用 `_template-knowledge-share.md` 補第一篇分享（產品線介紹 / 技術筆記皆可）
- [ ] 更新 `01-product-knowledge/README.md` 的文件索引表

### H. 主管 / 窗口名單確認
📄 檔案：`04-wiki-work-scope/work-essentials.md`、`pm-roles.md`

- [ ] Open Issue Judgement 主管分派名單（目前沿用訓練教材：Allan / Jovanni / Cobalt / Nick / Kent）— 確認是否為現況
- [ ] 各合作單位（DQA / SQA / PE / IRT / 業務）實際窗口名單

---

## 🟢 優先級 3：需要「持續更新」的動態內容（不是一次補完，是例行維護）

### I. CPU / SoC Roadmap 資料庫
📄 檔案：`02-cpu-soc-roadmap/*.md`

- [ ] 校對 Intel / AMD / Arm / 網通 SoC 四頁的世代整理表（目前是公開資訊 seed，請對照你們實際在用/評估的平台修正）
- [ ] 填入各頁「Roadmap 追蹤」表（拿到 vendor NDA roadmap 後，只放可公開摘要 + 存放位置索引）
- [ ] 填入各頁「評估紀錄」表（評估過的平台留結論，含沒採用的原因）
- [ ] 補上你們常用但清單沒列到的平台 / vendor（用 `_template-platform.md`）

---

## 📌 我（可協助）vs 你們（需提供）分工參考

| 類型 | 誰來做 |
|------|--------|
| 🔴 系統窗口、代號、工廠窗口、維護人 | **你們填**（內部資訊，我無從得知） |
| 🟡 BOM 細節、真實案例、產品知識 | **你們提供教材/資料 → 我可代為整理成頁面** |
| 🟢 Roadmap / 評估紀錄 | **你們持續更新**（我可先幫忙校對公開資訊部分） |

> 想讓我幫忙整理 🟡 類的哪一項，把教材貼給我或口述重點即可。
