
/** 資料來源代號 */
export type SourceId = 'x' | 'reddit' | 'stocktwits';

export type SentimentLabel = 'bullish' | 'neutral' | 'bearish';

/** 單則社群貼文（已完成情緒評分） */
export interface SocialPost {
  id: string;
  source: SourceId;
  author: string;
  text: string;
  url?: string;
  createdAt: string; // ISO 8601
  /** 互動量（讚 + 留言 / 轉推等的加總），作為加權依據 */
  engagement: number;
  tickers: string[];
  /** 情緒分數 -1（極空）～ +1（極多） */
  score: number;
  label: SentimentLabel;
  /** 使用者自行標記的情緒（StockTwits 的 Bullish/Bearish 標籤） */
  declaredSentiment?: SentimentLabel;
}

/** 單一資料來源的抓取結果 */
export interface SourceResult {
  source: SourceId;
  /** true = 即時 API 資料；false = 示範資料（API 不可用或未設定金鑰） */
  live: boolean;
  error?: string;
  posts: SocialPost[];
}

/** 單一資料來源的彙總統計 */
export interface SourceSummary {
  source: SourceId;
  live: boolean;
  error?: string;
  postCount: number;
  bullishPct: number;
  neutralPct: number;
  bearishPct: number;
  /** 互動量加權後的來源情緒分數 -1 ～ +1 */
  score: number;
}

/** 個股 / ETF 的討論熱度與情緒 */
export interface TickerSentiment {
  symbol: string;
  mentions: number;
  bullish: number;
  bearish: number;
  neutral: number;
  score: number; // -1 ～ +1
}

/** 情緒指數的歷史取樣點（存於 localStorage 供趨勢圖使用） */
export interface SentimentSnapshot {
  timestamp: string;
  index: number; // 0 ~ 100
}

/** 整體市場情緒評估 */
export interface MarketAssessment {
  /** 綜合情緒指數 0（極度看空）～ 100（極度看多） */
  index: number;
  direction: SentimentLabel;
  /** 中文區間標籤，如「偏多」 */
  bandLabel: string;
  totalPosts: number;
  generatedAt: string;
}

/** 一次完整更新後的儀表板狀態 */
export interface MonitorState {
  assessment: MarketAssessment;
  summaries: SourceSummary[];
  tickers: TickerSentiment[];
  posts: SocialPost[];
}
