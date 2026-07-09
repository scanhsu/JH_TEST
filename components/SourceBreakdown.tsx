import React from 'react';
import { SourceSummary } from '../types';
import { LiveChip, SOURCE_META, SourceBadge } from './ui';

/**
 * 各來源情緒分佈：以中性為中心的 diverging stacked bar。
 * 看空（紅）向左、看多（綠）向右、中性（灰）跨在中線上；
 * 段間留 2px 表面間隙，百分比一律以文字直接標示。
 */
const Bar: React.FC<{ s: SourceSummary }> = ({ s }) => {
  // 寬度縮放 0.5：即使 100% 單邊也不超出容器（中線在 50%）
  const bear = s.bearishPct / 2;
  const neutral = s.neutralPct / 2;
  const bull = s.bullishPct / 2;
  const start = 50 - (bear + neutral / 2);

  return (
    <div className="relative h-4 w-full overflow-hidden rounded bg-black/20">
      {/* 中線（基準線） */}
      <div className="absolute inset-y-0 left-1/2 w-px bg-market-line" aria-hidden />
      {bear > 0 && (
        <div
          className="absolute inset-y-0 rounded-l"
          style={{ left: `${start}%`, width: `calc(${bear}% - 1px)`, backgroundColor: '#d03b3b' }}
        />
      )}
      {neutral > 0 && (
        <div
          className="absolute inset-y-0"
          style={{
            left: `calc(${start + bear}% + 1px)`,
            width: `calc(${neutral}% - 2px)`,
            backgroundColor: '#898781',
            opacity: 0.45,
          }}
        />
      )}
      {bull > 0 && (
        <div
          className="absolute inset-y-0 rounded-r"
          style={{
            left: `calc(${start + bear + neutral}% + 1px)`,
            width: `calc(${bull}% - 1px)`,
            backgroundColor: '#0ca30c',
          }}
        />
      )}
    </div>
  );
};

export const SourceBreakdown: React.FC<{ summaries: SourceSummary[] }> = ({ summaries }) => (
  <div className="space-y-5">
    {summaries.map((s) => (
      <div key={s.source}>
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SourceBadge source={s.source} />
            <span className="text-sm font-medium text-market-ink">{SOURCE_META[s.source].name}</span>
            <LiveChip live={s.live} />
          </div>
          <span className="text-xs tabular-nums text-market-muted">{s.postCount} 則</span>
        </div>
        <Bar s={s} />
        <div className="mt-1.5 flex justify-between text-xs tabular-nums text-market-ink2">
          <span>
            <span aria-hidden className="mr-1 inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: '#d03b3b' }} />
            看空 {s.bearishPct}%
          </span>
          <span className="text-market-muted">中性 {s.neutralPct}%</span>
          <span>
            看多 {s.bullishPct}%
            <span aria-hidden className="ml-1 inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: '#0ca30c' }} />
          </span>
        </div>
      </div>
    ))}
  </div>
);
