import {
  MarketAssessment,
  MonitorState,
  SentimentLabel,
  SocialPost,
  SourceResult,
  SourceSummary,
  TickerSentiment,
} from '../types';

/**
 * 金融領域情緒詞典（lexicon-based scoring）。
 * 權重代表詞彙的情緒強度：±2 強烈、±1 一般、±0.5 弱訊號（常見但語意模糊的詞）。
 * 多字詞（片語）優先比對，比對後即從文本移除，避免重複計分。
 */
const LEXICON: Record<string, number> = {
  // ---- 看多：強烈 ----
  'to the moon': 2, 'moon': 2, 'mooning': 2, 'rocket': 2, '🚀': 2, '📈': 1.5,
  'all time high': 2, 'all-time high': 2, 'ath': 1.5, 'breakout': 2,
  'melt up': 2, 'bull run': 2, 'short squeeze': 2, 'squeeze': 1.5,
  'buy the dip': 1.5, 'btfd': 1.5, 'tendies': 1.5, 'diamond hands': 1.5,
  // ---- 看多：一般 ----
  'bull': 1, 'bullish': 1, 'bulls': 1, 'calls': 1, 'long': 1, 'longs': 1,
  'rally': 1, 'rallying': 1, 'rallies': 1, 'surge': 1, 'surging': 1,
  'soar': 1, 'soaring': 1, 'rebound': 1, 'bounce': 1, 'recovery': 1,
  'upgrade': 1, 'upgraded': 1, 'undervalued': 1, 'oversold': 1,
  'beat earnings': 1.5, 'earnings beat': 1.5, 'strong earnings': 1.5,
  'rate cut': 1, 'rate cuts': 1, 'dovish': 1, 'soft landing': 1,
  'outperform': 1, 'accumulate': 1, 'accumulating': 1, 'printing': 1,
  // ---- 看多：弱 ----
  'buy': 0.5, 'buying': 0.5, 'bought': 0.5, 'green': 0.5, 'gains': 0.5,
  'gain': 0.5, 'up': 0.5, 'upside': 0.5, 'higher': 0.5, 'winning': 0.5,

  // ---- 看空：強烈 ----
  'crash': -2, 'crashing': -2, 'collapse': -2, 'collapsing': -2,
  'capitulation': -2, 'bloodbath': -2, 'tank': -2, 'tanking': -2,
  'plummet': -2, 'plummeting': -2, 'plunge': -2, 'plunging': -2,
  'death cross': -2, 'black swan': -2, 'rug pull': -2, '📉': -1.5,
  'drill': -1.5, 'drilling': -1.5, 'pump and dump': -1.5,
  // ---- 看空：一般 ----
  'bear': -1, 'bearish': -1, 'bears': -1, 'puts': -1, 'short': -1,
  'shorts': -1, 'shorting': -1, 'dump': -1, 'dumping': -1,
  'sell-off': -1, 'selloff': -1, 'sell off': -1, 'correction': -1,
  'recession': -1, 'stagflation': -1, 'bubble': -1, 'overvalued': -1,
  'overbought': -1, 'downgrade': -1, 'downgraded': -1,
  'missed earnings': -1.5, 'earnings miss': -1.5, 'weak guidance': -1.5,
  'cut guidance': -1.5, 'guidance cut': -1.5,
  'rate hike': -1, 'rate hikes': -1, 'hawkish': -1, 'inflation': -1,
  'layoffs': -1, 'bagholder': -1, 'bag holder': -1, 'capitulate': -1,
  'panic': -1, 'fear': -1, 'underperform': -1, 'bleeding': -1,
  // ---- 看空：弱 ----
  'sell': -0.5, 'selling': -0.5, 'sold': -0.5, 'red': -0.5, 'loss': -0.5,
  'losses': -0.5, 'down': -0.5, 'downside': -0.5, 'lower': -0.5, 'weak': -0.5,
};

/** 否定詞：出現在情緒詞前 1~2 個 token 時將分數反轉 */
const NEGATORS = new Set([
  'not', 'no', 'never', 'isnt', "isn't", 'dont', "don't", 'wont', "won't",
  'aint', "ain't", 'cant', "can't", 'without', 'hardly',
]);

/** 片語（含空白或 emoji）需在 token 化之前先比對 */
const PHRASES = Object.keys(LEXICON)
  .filter((k) => k.includes(' ') || /[^\w'-]/.test(k))
  .sort((a, b) => b.length - a.length);

/** 常見美股代號白名單：允許不加 $ 的裸寫代號，避免一般英文字誤判 */
const KNOWN_TICKERS = new Set([
  'SPY', 'QQQ', 'SPX', 'NDX', 'DIA', 'IWM', 'VIX', 'TLT', 'SOXL', 'TQQQ',
  'TSLA', 'NVDA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'GOOG', 'META', 'AMD',
  'NFLX', 'PLTR', 'COIN', 'GME', 'AMC', 'SMCI', 'AVGO', 'INTC', 'MU', 'BA',
  'DIS', 'SOFI', 'HOOD', 'RIVN', 'BABA', 'TSM', 'ARM', 'CRWD', 'SNOW',
  'UBER', 'XOM', 'CVX', 'JPM', 'BAC', 'GS', 'WMT', 'COST', 'MSTR', 'ORCL',
  'LLY', 'UNH', 'V', 'MA', 'PYPL', 'SQ', 'SHOP', 'NIO', 'LCID', 'DKNG',
]);

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function labelForScore(score: number): SentimentLabel {
  if (score > 0.15) return 'bullish';
  if (score < -0.15) return 'bearish';
  return 'neutral';
}

/**
 * 對單段文字做詞典式情緒評分，回傳 -1 ～ +1。
 * 流程：片語比對（先移除避免重複計分）→ token 化 → 帶否定詞視窗的逐詞計分 → tanh 壓縮。
 */
export function scoreText(text: string): number {
  let working = ` ${text.toLowerCase()} `;
  let raw = 0;

  for (const phrase of PHRASES) {
    let idx = working.indexOf(phrase);
    while (idx !== -1) {
      raw += LEXICON[phrase];
      working = working.slice(0, idx) + ' ' + working.slice(idx + phrase.length);
      idx = working.indexOf(phrase);
    }
  }

  const tokens = working.split(/[^a-z0-9'$-]+/).filter(Boolean);
  tokens.forEach((token, i) => {
    const weight = LEXICON[token];
    if (weight === undefined || token.includes(' ')) return;
    const negated =
      (i >= 1 && NEGATORS.has(tokens[i - 1])) ||
      (i >= 2 && NEGATORS.has(tokens[i - 2]));
    raw += negated ? -weight : weight;
  });

  return Math.tanh(raw / 3);
}

/**
 * 為貼文計算最終情緒分數。若使用者已自行標記（如 StockTwits 的
 * Bullish/Bearish 標籤），以標記為主（0.7）、文本分析為輔（0.3）混合。
 */
export function scorePost(
  text: string,
  declaredSentiment?: SentimentLabel,
): { score: number; label: SentimentLabel } {
  const textScore = scoreText(text);
  let score = textScore;
  if (declaredSentiment === 'bullish') score = 0.7 * 0.8 + 0.3 * textScore;
  if (declaredSentiment === 'bearish') score = 0.7 * -0.8 + 0.3 * textScore;
  score = clamp(score, -1, 1);
  return { score, label: labelForScore(score) };
}

/** 從文字擷取美股代號：$CASHTAG 一律接受；裸寫代號需在白名單內 */
export function extractTickers(text: string): string[] {
  const found = new Set<string>();
  for (const m of text.matchAll(/\$([A-Za-z]{1,5})\b/g)) {
    const sym = m[1].toUpperCase();
    if (!/^\d+$/.test(sym)) found.add(sym);
  }
  for (const m of text.matchAll(/\b([A-Z]{2,5})\b/g)) {
    if (KNOWN_TICKERS.has(m[1])) found.add(m[1]);
  }
  return [...found];
}

/** 互動量加權：貼文權重 = 1 + log10(1 + engagement) */
const postWeight = (p: SocialPost) => 1 + Math.log10(1 + Math.max(0, p.engagement));

function summarizeSource(result: SourceResult): SourceSummary {
  const { posts } = result;
  const counts = { bullish: 0, neutral: 0, bearish: 0 };
  let weighted = 0;
  let totalWeight = 0;
  for (const p of posts) {
    counts[p.label] += 1;
    const w = postWeight(p);
    weighted += p.score * w;
    totalWeight += w;
  }
  const n = posts.length || 1;
  return {
    source: result.source,
    live: result.live,
    error: result.error,
    postCount: posts.length,
    bullishPct: Math.round((counts.bullish / n) * 100),
    neutralPct: Math.round((counts.neutral / n) * 100),
    bearishPct: Math.round((counts.bearish / n) * 100),
    score: totalWeight > 0 ? weighted / totalWeight : 0,
  };
}

function rankTickers(posts: SocialPost[]): TickerSentiment[] {
  const map = new Map<string, TickerSentiment>();
  for (const p of posts) {
    for (const sym of p.tickers) {
      const t = map.get(sym) ?? {
        symbol: sym, mentions: 0, bullish: 0, bearish: 0, neutral: 0, score: 0,
      };
      t.mentions += 1;
      t[p.label] += 1;
      t.score += p.score;
      map.set(sym, t);
    }
  }
  return [...map.values()]
    .map((t) => ({ ...t, score: t.score / t.mentions }))
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 8);
}

/**
 * 彙總所有來源 → 綜合情緒指數。
 * 各來源分數以 sqrt(樣本數) 加權平均（樣本多的來源更可信，但不至於獨大），
 * 再線性映射到 0～100：index = 50 + 50 × overall。
 */
export function aggregate(results: SourceResult[]): MonitorState {
  const summaries = results.map(summarizeSource);
  const posts = results
    .flatMap((r) => r.posts)
    .sort((a, b) => b.engagement - a.engagement);

  let weighted = 0;
  let totalWeight = 0;
  for (const s of summaries) {
    if (s.postCount === 0) continue;
    const w = Math.sqrt(s.postCount);
    weighted += s.score * w;
    totalWeight += w;
  }
  const overall = totalWeight > 0 ? weighted / totalWeight : 0;
  const index = clamp(Math.round(50 + overall * 50), 0, 100);

  const bandLabel =
    index >= 76 ? '極度看多' :
    index >= 56 ? '偏多' :
    index >= 45 ? '中性' :
    index >= 25 ? '偏空' : '極度看空';

  const assessment: MarketAssessment = {
    index,
    direction: index >= 56 ? 'bullish' : index <= 44 ? 'bearish' : 'neutral',
    bandLabel,
    totalPosts: posts.length,
    generatedAt: new Date().toISOString(),
  };

  return { assessment, summaries, tickers: rankTickers(posts), posts };
}
