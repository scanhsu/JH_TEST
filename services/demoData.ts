import { SocialPost, SourceId } from '../types';
import { extractTickers, scorePost } from './sentimentEngine';

/**
 * 示範資料：當來源 API 無法連線（CORS / 網路）或未設定金鑰時使用，
 * 並在 UI 上明確標示「示範資料」。內容為擬真的英文社群貼文樣本。
 */

interface RawDemoPost {
  author: string;
  text: string;
  engagement: number;
  minutesAgo: number;
  declared?: 'bullish' | 'bearish';
}

const X_POSTS: RawDemoPost[] = [
  { author: '@MarketRebels', text: 'Breadth improving all week. $SPY holding above the 20-day, semis leading again. This tape wants higher. 📈', engagement: 1840, minutesAgo: 12 },
  { author: '@FinTwitDaily', text: 'CPI print tomorrow. If it comes in soft, the rate cut trade is back on and $QQQ rips to a new all time high.', engagement: 960, minutesAgo: 25 },
  { author: '@BearCaveNotes', text: 'Credit spreads widening quietly while indexes sit at highs. This is how corrections start. Hedged with $SPY puts.', engagement: 720, minutesAgo: 33 },
  { author: '@ChipStackTrader', text: '$NVDA demand commentary from the supply chain still absurd. Accumulating on every dip, target unchanged.', engagement: 1510, minutesAgo: 41 },
  { author: '@MacroAlfKing', text: 'Labor market cracking under the surface. Layoffs up, quits down. Recession risk is being mispriced here.', engagement: 880, minutesAgo: 58 },
  { author: '@OptionsFlowBot', text: 'Unusual activity: heavy call buying in $META and $AMZN ahead of earnings. Smart money positioning bullish.', engagement: 640, minutesAgo: 66 },
  { author: '@ValueVult', text: 'Everyone is euphoric. VIX at lows, retail all-in, insiders selling. Not bullish — this is what tops feel like.', engagement: 430, minutesAgo: 79 },
  { author: '@TechTapeReader', text: '$TSLA breakout confirmed on volume. Shorts getting squeezed hard into the close. 🚀', engagement: 1120, minutesAgo: 95 },
];

const REDDIT_POSTS: RawDemoPost[] = [
  { author: 'u/DeepValueDegen', text: 'YOLO update: doubled my $PLTR calls. AI spending is not slowing down, earnings will beat. Tendies incoming 🚀🚀', engagement: 3200, minutesAgo: 18 },
  { author: 'u/QuietCompounder', text: 'Reminder that time in the market beats timing the market. Kept buying $SPY through every dip since 2020 and it worked.', engagement: 2100, minutesAgo: 36 },
  { author: 'u/PermabearPatrol', text: 'Margin debt at record highs, valuations at 99th percentile. I am short $QQQ and sleeping fine. This bubble pops.', engagement: 1450, minutesAgo: 47 },
  { author: 'u/SemiconductorSage', text: '$AMD datacenter share gains are real. Street estimates too low for next quarter. Loaded up on shares and leaps.', engagement: 980, minutesAgo: 62 },
  { author: 'u/IndexAndChill', text: 'Sold everything into cash last month and the market just kept rallying without me. Capitulating and buying back in.', engagement: 1720, minutesAgo: 71 },
  { author: 'u/GammaGobbler', text: 'Puts printed today on the $GME dump. Rolling profits into more puts, this thing drills to 15.', engagement: 860, minutesAgo: 84 },
  { author: 'u/DividendDadOf3', text: 'Rate cuts plus resilient earnings is a decent setup for the second half. Staying long, adding $COST and $WMT.', engagement: 540, minutesAgo: 102 },
  { author: 'u/WSBQuant', text: 'Sentiment here is getting frothy again which historically means chop ahead. Trimming winners, holding cash.', engagement: 690, minutesAgo: 115 },
];

const STOCKTWITS_POSTS: RawDemoPost[] = [
  { author: 'BullRunBenny', text: '$SPY next leg higher starts this week. Breadth thrust confirmed.', engagement: 210, minutesAgo: 9, declared: 'bullish' },
  { author: 'FadeTheHype', text: '$NVDA parabolic move is exhausted. Distribution everywhere on the tape.', engagement: 130, minutesAgo: 22, declared: 'bearish' },
  { author: 'SwingKingTrades', text: '$AAPL coiling under resistance, breakout imminent with the product cycle news.', engagement: 95, minutesAgo: 35, declared: 'bullish' },
  { author: 'MacroMarge', text: '$TLT bond market is screaming slowdown and equities are not listening. Reduce risk.', engagement: 88, minutesAgo: 49, declared: 'bearish' },
  { author: 'MomentumMike', text: '$MSFT cloud numbers will beat again. Long into earnings.', engagement: 150, minutesAgo: 63, declared: 'bullish' },
  { author: 'TapeReaderTom', text: '$IWM small caps finally participating. Rotation is healthy for the bull market.', engagement: 76, minutesAgo: 78, declared: 'bullish' },
  { author: 'RiskOffRita', text: '$VIX way too cheap here. Grabbing protection before the CPI print.', engagement: 64, minutesAgo: 92, declared: 'bearish' },
  { author: 'GrindItOutGreg', text: '$COIN holding support, higher lows all month. Long with a tight stop.', engagement: 58, minutesAgo: 110, declared: 'bullish' },
];

function build(source: SourceId, raws: RawDemoPost[]): SocialPost[] {
  const now = Date.now();
  return raws.map((raw, i) => {
    const { score, label } = scorePost(raw.text, raw.declared);
    return {
      id: `demo-${source}-${i}`,
      source,
      author: raw.author,
      text: raw.text,
      createdAt: new Date(now - raw.minutesAgo * 60_000).toISOString(),
      engagement: raw.engagement,
      tickers: extractTickers(raw.text),
      score,
      label,
      declaredSentiment: raw.declared,
    };
  });
}

export function demoPosts(source: SourceId): SocialPost[] {
  switch (source) {
    case 'x': return build('x', X_POSTS);
    case 'reddit': return build('reddit', REDDIT_POSTS);
    case 'stocktwits': return build('stocktwits', STOCKTWITS_POSTS);
  }
}
