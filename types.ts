// 船舶位置點
export interface ShipPosition {
  lat: number;
  lon: number;
  timestamp: number;      // ms epoch
  speedKn: number;        // 航速（節）
  headingDeg: number;     // 航向（度，0=北）
  status: 'sailing' | 'inPort';
  portName?: string;      // 停靠港名稱（若在港）
}

export interface TrackPoint {
  lat: number;
  lon: number;
  timestamp: number;
}

// 船隻所在點的即時海氣象
export interface MarineWeather {
  waveHeight: number;     // 有義波高 (m)
  waveDirection: number;  // 波向 (度)
  wavePeriod: number;     // 波週期 (s)
  windSpeed: number;      // 風速 (km/h)
  windDirection: number;  // 風向 (度)
  precipitation: number;  // 時雨量 (mm)
  fetchedAt: number;
}

// 每小時預報（供圖表與舒適度預測）
export interface HourlyForecast {
  time: number;           // ms epoch
  waveHeight: number;
  wavePeriod: number;
  windSpeed: number;
  precipitation: number;
  comfort: number;        // 0-100
}

// 氣象網格點（供地圖圖層渲染）
export interface WeatherGridPoint {
  lat: number;
  lon: number;
  waveHeight: number | null;  // 陸地點為 null
  windSpeed: number;          // km/h
  windDirection: number;      // 來向（度）
  precipitation: number;      // mm/h
}

export interface WeatherGrid {
  points: WeatherGridPoint[];
  rows: number;
  cols: number;
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
  fetchedAt: number;
}

// 舒適度指數
export interface ComfortResult {
  index: number;          // 0-100，越高越舒適
  level: string;          // 等級名稱
  emoji: string;
  color: string;          // 對應顯示色
  motionDesc: string;     // 體感描述
  advice: string;         // 建議
  estRollDeg: number;     // 估計橫搖角（度）
}

export type MapLayerKey = 'wave' | 'wind' | 'rain';

export type DataSource = 'demo' | 'ais';
