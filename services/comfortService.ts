import { ComfortResult } from '../types';
import { SHIP_INFO } from './shipService';

/**
 * 波浪 → 船隻搖晃 → 舒適度指數（0-100）
 *
 * 模型說明：
 * 大型郵輪（Costa Serena：290m、11.4 萬噸、配備減搖鰭）對波浪的反應
 * 取決於「波高」與「波週期」的組合，而非波高本身：
 *
 * 1. 短週期波（T < 7s，波長 < 80m）：波長遠小於船長，船體橫跨多個
 *    波峰，幾乎感覺不到 —— 週期因子低。
 * 2. 波長接近船長（T ≈ 13-14s，波長 ≈ 290m）：縱搖（pitch）共振區。
 * 3. 週期接近船的自然橫搖週期（約 17s）：橫搖（roll）共振區，
 *    即使波不高也會明顯搖晃。
 * 4. 更長的湧浪（T > 22s）：船隨波緩慢起伏，體感反而輕微。
 *
 * 「有效波高」= 波高 × 週期因子，再依風速加成（風浪疊加、甲板體感），
 * 最後以指數衰減映射為 0-100 舒適度。
 */

// 縱搖共振週期：波長等於船長時 T = sqrt(L / 1.56)
const PITCH_RESONANCE_S = Math.sqrt(SHIP_INFO.lengthM / 1.56); // ≈ 13.6s
const ROLL_RESONANCE_S = SHIP_INFO.naturalRollPeriodS;         // 17s

/** 週期因子 0~1：波浪週期對這艘船的「有感程度」 */
export function periodFactor(wavePeriodS: number): number {
  if (!isFinite(wavePeriodS) || wavePeriodS <= 0) return 0.5;
  // 兩個高斯峰：縱搖共振 + 橫搖共振，底部保留基礎值
  const pitch = Math.exp(-((wavePeriodS - PITCH_RESONANCE_S) ** 2) / (2 * 4.5 ** 2));
  const roll = Math.exp(-((wavePeriodS - ROLL_RESONANCE_S) ** 2) / (2 * 5 ** 2));
  const resonance = Math.max(pitch, roll * 0.9);
  // 短週期衰減：T=4s 幾乎無感
  const shortWaveCut = 1 / (1 + Math.exp(-(wavePeriodS - 6.5) / 1.2));
  return Math.min(1, (0.15 + 0.85 * resonance) * shortWaveCut + 0.05);
}

export function computeComfort(
  waveHeightM: number,
  wavePeriodS: number,
  windSpeedKmh: number,
): ComfortResult {
  const pf = periodFactor(wavePeriodS);
  // 強風（>40km/h）造成的風浪疊加與甲板體感，換算為等效波高
  const windExtra = Math.max(0, (windSpeedKmh - 40)) * 0.015;
  const effectiveH = Math.max(0, waveHeightM) * pf + windExtra;

  // 減搖鰭在航行時約可削減 40% 橫搖，已隱含在係數中
  const index = Math.round(100 * Math.exp(-Math.pow(effectiveH / 3.5, 1.25)));

  // 粗估橫搖角（度）：大型穩定郵輪經驗係數
  const estRollDeg = Math.round(effectiveH * 2.3 * 10) / 10;

  const clamped = Math.max(0, Math.min(100, index));
  return { ...gradeComfort(clamped), index: clamped, estRollDeg };
}

function gradeComfort(index: number): Omit<ComfortResult, 'index' | 'estRollDeg'> {
  if (index >= 90) return {
    level: '非常平穩', emoji: '😌', color: '#10b981',
    motionDesc: '幾乎感覺不到晃動，杯中的水面平靜',
    advice: '盡情享受所有活動，是用餐與看秀的好時機',
  };
  if (index >= 75) return {
    level: '平穩', emoji: '🙂', color: '#34d399',
    motionDesc: '偶爾輕微起伏，走路完全不受影響',
    advice: '一切照常，泳池、甲板活動皆宜',
  };
  if (index >= 60) return {
    level: '輕微搖晃', emoji: '😐', color: '#facc15',
    motionDesc: '能感覺到規律的緩慢搖擺，杯中水面微晃',
    advice: '容易暈船者建議選擇船身中段低樓層活動',
  };
  if (index >= 40) return {
    level: '中度搖晃', emoji: '😟', color: '#fb923c',
    motionDesc: '走路需注意平衡，掛衣架會擺動，睡覺能感到搖動',
    advice: '敏感者建議提前服用暈船藥，避免長時間閱讀或看手機',
  };
  if (index >= 20) return {
    level: '明顯搖晃', emoji: '🤢', color: '#f87171',
    motionDesc: '行走需扶欄杆，未固定物品可能滑動，多數人有感',
    advice: '服用暈船藥並多休息，戶外甲板可能關閉，留意廣播',
  };
  return {
    level: '劇烈搖晃', emoji: '🥴', color: '#ef4444',
    motionDesc: '強烈搖晃，站立困難，物品翻倒',
    advice: '請待在艙房臥床休息，遵循船方安全指示',
  };
}
