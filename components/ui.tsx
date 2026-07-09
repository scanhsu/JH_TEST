import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SentimentLabel, SourceId } from '../types';

export const SOURCE_META: Record<SourceId, { name: string; short: string }> = {
  x: { name: 'X (Twitter)', short: 'X' },
  reddit: { name: 'Reddit', short: 'RD' },
  stocktwits: { name: 'StockTwits', short: 'ST' },
};

export const SENTIMENT_META: Record<
  SentimentLabel,
  { zh: string; color: string; Icon: typeof TrendingUp }
> = {
  bullish: { zh: '看多', color: '#0ca30c', Icon: TrendingUp },
  neutral: { zh: '中性', color: '#898781', Icon: Minus },
  bearish: { zh: '看空', color: '#d03b3b', Icon: TrendingDown },
};

/** 情緒標籤 chip：一律「圖示 + 文字」，不以顏色單獨承載語意 */
export const SentimentChip: React.FC<{ label: SentimentLabel }> = ({ label }) => {
  const { zh, color, Icon } = SENTIMENT_META[label];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
      style={{ color, borderColor: `${color}55`, backgroundColor: `${color}14` }}
    >
      <Icon size={12} aria-hidden />
      {zh}
    </span>
  );
};

/** 來源狀態 chip：即時（綠點）或示範資料（琥珀點），點 + 文字雙重編碼 */
export const LiveChip: React.FC<{ live: boolean }> = ({ live }) => (
  <span className="inline-flex items-center gap-1.5 text-xs text-market-muted">
    <span
      className="h-1.5 w-1.5 rounded-full"
      style={{ backgroundColor: live ? '#0ca30c' : '#fab219' }}
      aria-hidden
    />
    {live ? '即時' : '示範資料'}
  </span>
);

export const SourceBadge: React.FC<{ source: SourceId }> = ({ source }) => (
  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-market-line px-1.5 font-mono text-[10px] font-bold text-market-ink2">
    {SOURCE_META[source].short}
  </span>
);

export function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 1) return '剛剛';
  if (mins < 60) return `${mins} 分鐘前`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} 小時前`;
  return `${Math.floor(hrs / 24)} 天前`;
}

export const Card: React.FC<{ title?: string; className?: string; children: React.ReactNode }> = ({
  title,
  className = '',
  children,
}) => (
  <section className={`rounded-xl border border-white/10 bg-market-card p-5 ${className}`}>
    {title && <h2 className="mb-4 text-sm font-semibold text-market-ink2">{title}</h2>}
    {children}
  </section>
);
