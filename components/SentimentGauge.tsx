import React from 'react';
import { MarketAssessment } from '../types';
import { SENTIMENT_META, SentimentChip } from './ui';

/**
 * 綜合情緒指數儀表（hero）：半圓弧 + 大字指數。
 * 弧線為 diverging 配置 —— 紅色臂（看空）→ 灰色中性 → 綠色臂（看多），
 * 兩臂各兩階（同色系透明度階，深＝極端）。指標位置以白色刻線標示，
 * 數值與文字標籤為主要編碼，顏色只是輔助。
 */

const BANDS: { from: number; to: number; color: string; opacity: number }[] = [
  { from: 0, to: 25, color: '#d03b3b', opacity: 1 },     // 極度看空
  { from: 25, to: 45, color: '#d03b3b', opacity: 0.5 },  // 偏空
  { from: 45, to: 56, color: '#898781', opacity: 0.45 }, // 中性
  { from: 56, to: 76, color: '#0ca30c', opacity: 0.5 },  // 偏多
  { from: 76, to: 100, color: '#0ca30c', opacity: 1 },   // 極度看多
];

const CX = 130;
const CY = 120;
const R = 100;

function polar(value: number): { x: number; y: number } {
  const angle = Math.PI * (1 - value / 100); // 0 → 180°（左），100 → 0°（右）
  return { x: CX + R * Math.cos(angle), y: CY - R * Math.sin(angle) };
}

function arcPath(from: number, to: number): string {
  const a = polar(from);
  const b = polar(to);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${R} ${R} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

export const SentimentGauge: React.FC<{ assessment: MarketAssessment }> = ({ assessment }) => {
  const { index, bandLabel, direction, totalPosts } = assessment;
  const needle = polar(index);
  const inner = {
    x: CX + (R - 18) * Math.cos(Math.PI * (1 - index / 100)),
    y: CY - (R - 18) * Math.sin(Math.PI * (1 - index / 100)),
  };
  const accent = SENTIMENT_META[direction].color;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 260 132" className="w-full max-w-xs" role="img"
        aria-label={`綜合情緒指數 ${index}，${bandLabel}`}>
        {BANDS.map((band) => (
          <path
            key={band.from}
            d={arcPath(band.from + 0.8, band.to - 0.8)} /* 段與段之間留出表面間隙 */
            stroke={band.color}
            strokeOpacity={band.opacity}
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
          />
        ))}
        <line
          x1={inner.x} y1={inner.y} x2={needle.x} y2={needle.y}
          stroke="#ffffff" strokeWidth={3} strokeLinecap="round"
        />
        <text x={polar(0).x} y={CY + 12} fill="#898781" fontSize="10" textAnchor="middle">看空 0</text>
        <text x={polar(100).x} y={CY + 12} fill="#898781" fontSize="10" textAnchor="middle">100 看多</text>
      </svg>

      <div className="-mt-16 flex flex-col items-center">
        <div className="text-6xl font-bold text-market-ink" style={{ lineHeight: 1 }}>
          {index}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <SentimentChip label={direction} />
          <span className="text-sm font-medium" style={{ color: accent }}>{bandLabel}</span>
        </div>
        <p className="mt-2 text-xs text-market-muted">
          綜合情緒指數（0–100）・樣本 {totalPosts} 則貼文
        </p>
      </div>
    </div>
  );
};
