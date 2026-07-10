import React from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { HourlyForecast } from '../types';

interface Props {
  forecast: HourlyForecast[];
}

/** 未來 48 小時：舒適度指數 + 波高 */
export const ForecastChart: React.FC<Props> = ({ forecast }) => {
  if (!forecast.length) {
    return <div className="text-slate-500 text-sm py-6 text-center">預報載入中…</div>;
  }
  const data = forecast.map(f => ({
    ...f,
    label: new Date(f.time).toLocaleString('zh-TW', { hour: '2-digit', day: 'numeric', month: 'numeric' }),
    hour: new Date(f.time).getHours(),
  }));

  return (
    <ResponsiveContainer width="100%" height={170}>
      <ComposedChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
        <XAxis
          dataKey="time"
          tickFormatter={(t: number) => {
            const d = new Date(t);
            return d.getHours() === 0
              ? `${d.getMonth() + 1}/${d.getDate()}`
              : `${d.getHours()}時`;
          }}
          interval={7}
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={{ stroke: '#334155' }}
          tickLine={false}
        />
        <YAxis
          yAxisId="comfort"
          domain={[0, 100]}
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis yAxisId="wave" orientation="right" domain={[0, (max: number) => Math.max(3, Math.ceil(max))]} hide />
        <Tooltip
          contentStyle={{
            background: 'rgba(15,23,42,.95)', border: '1px solid #334155',
            borderRadius: 8, fontSize: 12, color: '#e2e8f0',
          }}
          labelFormatter={(t: number) =>
            new Date(t).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          formatter={(value: number, name: string) => {
            if (name === 'comfort') return [`${value}`, '舒適度'];
            if (name === 'waveHeight') return [`${value.toFixed(1)} m`, '波高'];
            return [value, name];
          }}
        />
        <ReferenceLine yAxisId="comfort" y={60} stroke="#facc15" strokeDasharray="4 4" strokeOpacity={0.5} />
        <Area
          yAxisId="wave"
          dataKey="waveHeight"
          type="monotone"
          fill="rgba(6,182,212,0.18)"
          stroke="rgba(6,182,212,0.6)"
          strokeWidth={1.5}
          name="waveHeight"
        />
        <Line
          yAxisId="comfort"
          dataKey="comfort"
          type="monotone"
          stroke="#34d399"
          strokeWidth={2}
          dot={false}
          name="comfort"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
