import { SocialPost, SourceResult } from '../types';
import { demoPosts } from './demoData';
import { extractTickers, scorePost } from './sentimentEngine';
import { fetchJsonWithTimeout } from './http';

/**
 * X (Twitter) API v2 recent search。X 的 API 需要付費金鑰：
 * 在 .env.local 設定 VITE_X_BEARER_TOKEN 後即走即時資料
 * （開發模式經 vite proxy /api/x → api.twitter.com）。
 * 未設定金鑰或請求失敗時回退為示範資料並標示 live: false。
 *
 * 注意：把 bearer token 放進前端只適合本機原型；正式部署應改由
 * 後端代理呼叫 X API，金鑰不落地到瀏覽器。
 */
const QUERY = encodeURIComponent(
  '($SPY OR $QQQ OR $NVDA OR $TSLA OR #stockmarket OR #stocks) lang:en -is:retweet',
);
const ENDPOINT =
  `/api/x/2/tweets/search/recent?query=${QUERY}` +
  '&max_results=50&tweet.fields=public_metrics,created_at&expansions=author_id&user.fields=username';

interface XTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: { like_count: number; retweet_count: number; reply_count: number };
}

interface XResponse {
  data?: XTweet[];
  includes?: { users?: { id: string; username: string }[] };
}

export async function fetchXPosts(): Promise<SourceResult> {
  const token = import.meta.env.VITE_X_BEARER_TOKEN as string | undefined;
  if (!token) {
    return {
      source: 'x',
      live: false,
      error: '未設定 VITE_X_BEARER_TOKEN',
      posts: demoPosts('x'),
    };
  }

  try {
    const json = await fetchJsonWithTimeout<XResponse>(ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const users = new Map((json.includes?.users ?? []).map((u) => [u.id, u.username]));
    const posts: SocialPost[] = (json.data ?? []).map((t) => {
      const { score, label } = scorePost(t.text);
      const m = t.public_metrics;
      return {
        id: `x-${t.id}`,
        source: 'x' as const,
        author: `@${users.get(t.author_id) ?? t.author_id}`,
        text: t.text,
        url: `https://x.com/i/status/${t.id}`,
        createdAt: t.created_at,
        engagement: m.like_count + m.retweet_count + m.reply_count,
        tickers: extractTickers(t.text),
        score,
        label,
      };
    });
    if (posts.length === 0) throw new Error('empty response');
    return { source: 'x', live: true, posts };
  } catch (err) {
    return {
      source: 'x',
      live: false,
      error: err instanceof Error ? err.message : String(err),
      posts: demoPosts('x'),
    };
  }
}
