import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SentimentSnapshot } from '../types';

/**
 * 綜合情緒指數趨勢（單一序列 → 藍色 accent，50 為多空分界基準線）。
 * 歷史點來自每次更新後寫入 localStorage 的取樣。
 */

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });

const ChartTooltip: React.FC<{
  active?: boolean;
  payload?: { value: number; payload: SentimentSnapshot }[];
}> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const snap = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-market-card px-3 py-2 text-xs shadow-lg">
      <div className="text-market-muted">{fmtTime(snap.timestamp)}</div>
      <div className="mt-0.5 font-semibold tabular-nums text-market-ink">
        情緒指數 {snap.index}
      </div>
    </div>
  );
};

export const TrendChart: React.FC<{ history: SentimentSnapshot[] }> = ({ history }) => {
  if (history.length < 2) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-market-muted">
        持續監測中——累積兩個以上取樣點後顯示趨勢
      </div>
    );
  }
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={history} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
          <CartesianGrid stroke="#2c2c2a" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={fmtTime}
            tick={{ fill: '#898781', fontSize: 11 }}
            axisLine={{ stroke: '#383835' }}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fill: '#898781', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine
            y={50}
            stroke="#898781"
            strokeDasharray="4 4"
            label={{ value: '多空分界', fill: '#898781', fontSize: 10, position: 'insideTopRight' }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#52514e', strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="index"
            stroke="#3987e5"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3987e5', stroke: '#1a1a19', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
