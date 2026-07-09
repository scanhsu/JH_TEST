import { SentimentLabel, SocialPost, SourceResult } from '../types';
import { demoPosts } from './demoData';
import { extractTickers, scorePost } from './sentimentEngine';
import { fetchJsonWithTimeout } from './http';

/**
 * StockTwits 公開 API（免金鑰）。trending 訊息流自帶使用者標記的
 * Bullish / Bearish 情緒標籤，是品質最高的訊號來源之一。
 * 開發模式走 vite proxy（/api/stocktwits → api.stocktwits.com）。
 */
const ENDPOINT = '/api/stocktwits/api/2/streams/trending.json?limit=30';

interface StMessage {
  id: number;
  body: string;
  created_at: string;
  user: { username: string };
  entities?: { sentiment?: { basic?: 'Bullish' | 'Bearish' } | null };
  likes?: { total?: number };
  symbols?: { symbol: string }[];
}

export async function fetchStocktwitsPosts(): Promise<SourceResult> {
  try {
    const json = await fetchJsonWithTimeout<{ messages: StMessage[] }>(ENDPOINT);
    const posts: SocialPost[] = json.messages.map((m) => {
      const declared: SentimentLabel | undefined =
        m.entities?.sentiment?.basic === 'Bullish' ? 'bullish' :
        m.entities?.sentiment?.basic === 'Bearish' ? 'bearish' : undefined;
      const { score, label } = scorePost(m.body, declared);
      const symbolTags = (m.symbols ?? []).map((s) => s.symbol.toUpperCase());
      return {
        id: `st-${m.id}`,
        source: 'stocktwits' as const,
        author: m.user.username,
        text: m.body,
        url: `https://stocktwits.com/${m.user.username}/message/${m.id}`,
        createdAt: new Date(m.created_at).toISOString(),
        engagement: m.likes?.total ?? 0,
        tickers: [...new Set([...symbolTags, ...extractTickers(m.body)])],
        score,
        label,
        declaredSentiment: declared,
      };
    });
    if (posts.length === 0) throw new Error('empty response');
    return { source: 'stocktwits', live: true, posts };
  } catch (err) {
    return {
      source: 'stocktwits',
      live: false,
      error: err instanceof Error ? err.message : String(err),
      posts: demoPosts('stocktwits'),
    };
  }
}
