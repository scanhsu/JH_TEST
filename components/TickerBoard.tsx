import React from 'react';
import { TickerSentiment } from '../types';
import { SENTIMENT_META } from './ui';
import { labelForScore } from '../services/sentimentEngine';

/** 討論熱度最高的個股 / ETF，附各自的多空計數與淨情緒 */
export const TickerBoard: React.FC<{ tickers: TickerSentiment[] }> = ({ tickers }) => {
  if (tickers.length === 0) {
    return <div className="py-6 text-center text-sm text-market-muted">尚無足夠的個股討論</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-market-muted">
            <th className="pb-2 font-medium">代號</th>
            <th className="pb-2 text-right font-medium">提及</th>
            <th className="pb-2 text-right font-medium">看多 / 看空</th>
            <th className="pb-2 text-right font-medium">淨情緒</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {tickers.map((t) => {
            const label = labelForScore(t.score);
            const meta = SENTIMENT_META[label];
            const Icon = meta.Icon;
            return (
              <tr key={t.symbol} className="border-t border-white/5">
                <td className="py-2 font-mono font-semibold text-market-ink">${t.symbol}</td>
                <td className="py-2 text-right text-market-ink2">{t.mentions}</td>
                <td className="py-2 text-right text-market-ink2">
                  {t.bullish} / {t.bearish}
                </td>
                <td className="py-2">
                  <span className="flex items-center justify-end gap-1" style={{ color: meta.color }}>
                    <Icon size={14} aria-hidden />
                    <span className="w-12 text-right">
                      {t.score >= 0 ? '+' : ''}{(t.score * 100).toFixed(0)}
                    </span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
