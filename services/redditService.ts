import { SocialPost, SourceResult } from '../types';
import { demoPosts } from './demoData';
import { extractTickers, scorePost } from './sentimentEngine';
import { fetchJsonWithTimeout } from './http';

/**
 * Reddit 公開 JSON API（免金鑰）。
 * 開發模式走 vite proxy（/api/reddit → www.reddit.com）繞過 CORS；
 * 失敗時回退為示範資料並標示 live: false。
 */
const SUBREDDITS = 'wallstreetbets+stocks+StockMarket+investing';
const ENDPOINT = `/api/reddit/r/${SUBREDDITS}/hot.json?limit=60&raw_json=1`;

interface RedditChild {
  data: {
    id: string;
    title: string;
    selftext?: string;
    author: string;
    permalink: string;
    created_utc: number;
    ups: number;
    num_comments: number;
    stickied?: boolean;
  };
}

export async function fetchRedditPosts(): Promise<SourceResult> {
  try {
    const json = await fetchJsonWithTimeout<{ data: { children: RedditChild[] } }>(ENDPOINT);
    const posts: SocialPost[] = json.data.children
      .filter((c) => !c.data.stickied)
      .map((c) => {
        const d = c.data;
        const text = [d.title, (d.selftext ?? '').slice(0, 400)].filter(Boolean).join(' — ');
        const { score, label } = scorePost(text);
        return {
          id: `reddit-${d.id}`,
          source: 'reddit' as const,
          author: `u/${d.author}`,
          text,
          url: `https://www.reddit.com${d.permalink}`,
          createdAt: new Date(d.created_utc * 1000).toISOString(),
          engagement: (d.ups ?? 0) + (d.num_comments ?? 0),
          tickers: extractTickers(text),
          score,
          label,
        };
      });
    if (posts.length === 0) throw new Error('empty response');
    return { source: 'reddit', live: true, posts };
  } catch (err) {
    return {
      source: 'reddit',
      live: false,
      error: err instanceof Error ? err.message : String(err),
      posts: demoPosts('reddit'),
    };
  }
}
