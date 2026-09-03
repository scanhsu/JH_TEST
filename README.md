<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# JH_TEST

## 📚 PLM 產品經理知識及方案中心

PLM 團隊知識庫入口：[pm-knowledge-center/](./pm-knowledge-center/README.md)（產品知識分享、CPU/SoC roadmap 資料庫、參考產品庫、PLM 工作範圍 wiki、研發流程說明）

---

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1a3T_OGvTeBwuOSjDsgkmqbDhFBDJIMJ9

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 附加教學模組：台灣風的四季

本專案另附一份**獨立、零相依**的國中地球科學教學模型，與主 App 並存、互不影響：

- 互動模擬器：[`public/taiwan-wind/index.html`](public/taiwan-wind/index.html)
  （直接用瀏覽器開啟即可；`npm run dev` 執行時可透過 `/taiwan-wind/` 存取）
- 教師手冊：[`docs/taiwan-wind/教師手冊.md`](docs/taiwan-wind/教師手冊.md)
- 學習單：[`docs/taiwan-wind/學習單.md`](docs/taiwan-wind/學習單.md)

模擬台灣周圍春夏秋冬的風場，涵蓋季風、地形效應、颱風與海陸風，內含每月圖鑑、知識庫與測驗。
