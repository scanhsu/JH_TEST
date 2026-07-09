# 美股市場情緒監測器 (US Market Sentiment Monitor)

彙整 **X (Twitter)**、**Reddit**（r/wallstreetbets、r/stocks、r/StockMarket、r/investing）、
**StockTwits** 的社群討論，以金融詞典式情緒分析即時評估美股市場多空方向，
輸出 0–100 的綜合情緒指數（50 為多空分界）。

## 系統架構

```
┌─────────────┐  ┌─────────────┐  ┌──────────────┐
│  X API v2   │  │ Reddit JSON │  │ StockTwits   │   資料收集層
│ (需 Bearer) │  │  (免金鑰)   │  │  (免金鑰)    │   （dev 經 vite proxy 繞過 CORS，
└──────┬──────┘  └──────┬──────┘  └──────┬───────┘    失敗時回退示範資料並標示）
       └────────────────┼────────────────┘
                        ▼
              sentimentEngine.ts                      分析層
   金融詞典評分（±2/±1/±0.5 權重、否定詞視窗、
   片語優先比對）＋ StockTwits 使用者標記混合
                        ▼
   貼文互動量對數加權 → 各來源分數 →                  彙總層
   來源以 √樣本數 加權 → 指數 = 50 + 50 × overall
                        ▼
   儀表板：情緒儀表 / 來源分佈 / 趨勢圖 /              呈現層
   熱門標的 / 熱門貼文（localStorage 保存歷史取樣）
```

## 情緒指數區間

| 指數 | 判定 |
|------|------|
| 76–100 | 極度看多 |
| 56–75 | 偏多 |
| 45–55 | 中性 |
| 25–44 | 偏空 |
| 0–24 | 極度看空 |

## 本機執行

```bash
npm install
npm run dev        # http://localhost:3000
```

Reddit 與 StockTwits 為公開 API、免金鑰，dev server 啟動即可取得即時資料。

### 啟用 X (Twitter) 即時資料（選用）

X API 需要付費方案的 Bearer Token。在專案根目錄建立 `.env.local`：

```
VITE_X_BEARER_TOKEN=你的_X_API_Bearer_Token
```

未設定時，X 來源會使用擬真示範資料並在 UI 上標示「示範資料」。

> ⚠️ 把 token 放進前端環境變數僅適合本機原型。正式部署請改由後端 /
> edge function 代理呼叫 X API（同時取代 vite proxy 的角色），
> 避免金鑰暴露在瀏覽器。

## 評分方法

1. **單文評分**：金融領域詞典（moon / breakout / rate cut… vs. crash /
   puts / recession…）比對，片語優先且比對後移除避免重複計分；
   情緒詞前 1–2 個 token 出現否定詞（not / don't…）時分數反轉；
   總分經 `tanh(raw/3)` 壓縮到 −1～+1。
2. **使用者標記**：StockTwits 訊息若帶 Bullish/Bearish 標籤，
   以標記 0.7、文本 0.3 的比重混合。
3. **加權彙總**：貼文權重 = `1 + log10(1 + 互動量)`；
   來源分數為加權平均，再以 `√樣本數` 對來源加權合成整體分數，
   線性映射為 0–100 指數。
4. **標的排行**：`$CASHTAG` 一律採計，裸寫代號需在常見代號白名單內，
   降低一般英文字的誤判。

## 免責聲明

本工具為社群情緒的量化觀測原型，僅供研究參考，非投資建議。
