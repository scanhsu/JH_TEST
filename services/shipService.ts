import { ShipPosition, TrackPoint } from '../types';

// Costa Serena 船舶基本資料
export const SHIP_INFO = {
  name: 'Costa Serena（歌詩達莎倫娜號）',
  imo: '9343132',
  defaultMmsi: '247187600', // MarineTraffic / VesselFinder 登錄之 MMSI，可於設定中修改
  flag: '義大利',
  grossTonnage: 114261,
  lengthM: 290,
  beamM: 35.5,
  // 大型郵輪自然橫搖週期（有減搖鰭），舒適度模型使用
  naturalRollPeriodS: 17,
};

interface Waypoint {
  lat: number;
  lon: number;
  tStart: number; // 週期內小時
  tEnd: number;
  port?: string;
}

// 模擬航線：基隆母港出發之沖繩／先島群島 5 天航次（循環）
// Costa Serena 近年以基隆為母港行駛石垣島、宮古島、那霸航線
const CYCLE_HOURS = 120;
const SCHEDULE: Waypoint[] = [
  { lat: 25.151, lon: 121.749, tStart: 0, tEnd: 9, port: '基隆' },
  { lat: 24.336, lon: 124.156, tStart: 22, tEnd: 30, port: '石垣島' },
  { lat: 24.804, lon: 125.281, tStart: 38, tEnd: 47, port: '宮古島' },
  { lat: 26.212, lon: 127.679, tStart: 60, tEnd: 76, port: '那霸' },
  { lat: 25.151, lon: 121.749, tStart: 108, tEnd: 120, port: '基隆' },
];

const NM_PER_DEG = 60; // 每度緯度約 60 海里

function bearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = Math.PI / 180;
  const dLon = (lon2 - lon1) * toRad;
  const y = Math.sin(dLon) * Math.cos(lat2 * toRad);
  const x =
    Math.cos(lat1 * toRad) * Math.sin(lat2 * toRad) -
    Math.sin(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.cos(dLon);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function distanceNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) ** 2;
  return 2 * Math.asin(Math.sqrt(a)) * 3440.065;
}

// 平滑插值（緩入緩出），模擬進出港加減速
function easeInOut(t: number): number {
  return t * t * (3 - 2 * t);
}

/** 取得模擬船位（依真實時間推算航程進度） */
export function getDemoPosition(atMs: number): ShipPosition {
  const cycleMs = CYCLE_HOURS * 3600_000;
  // 對齊固定基準時間，讓每次載入的航程進度一致
  const epoch = Date.UTC(2026, 0, 5, 10, 0, 0); // 週期起點（基隆在港）
  const h = ((atMs - epoch) % cycleMs + cycleMs) % cycleMs / 3600_000;

  for (let i = 0; i < SCHEDULE.length; i++) {
    const wp = SCHEDULE[i];
    if (h >= wp.tStart && h < wp.tEnd) {
      // 在港中
      const next = SCHEDULE[(i + 1) % SCHEDULE.length];
      return {
        lat: wp.lat,
        lon: wp.lon,
        timestamp: atMs,
        speedKn: 0,
        headingDeg: bearingDeg(wp.lat, wp.lon, next.lat, next.lon),
        status: 'inPort',
        portName: wp.port,
      };
    }
    const next = SCHEDULE[i + 1];
    if (next && h >= wp.tEnd && h < next.tStart) {
      // 航行段
      const frac = easeInOut((h - wp.tEnd) / (next.tStart - wp.tEnd));
      const lat = wp.lat + (next.lat - wp.lat) * frac;
      const lon = wp.lon + (next.lon - wp.lon) * frac;
      // 加一點垂直於航向的緩慢擺動，讓航跡更像真實航線
      const heading = bearingDeg(wp.lat, wp.lon, next.lat, next.lon);
      const wobble = Math.sin(h * 0.9 + i) * 0.03;
      const perp = (heading + 90) * Math.PI / 180;
      const dist = distanceNm(wp.lat, wp.lon, next.lat, next.lon);
      const legHours = next.tStart - wp.tEnd;
      // 以 easeInOut 微分近似瞬時速度
      const t = (h - wp.tEnd) / legHours;
      const speedFactor = 6 * t * (1 - t); // easeInOut 導數（峰值 1.5）
      const speedKn = Math.min(21, (dist / legHours) * speedFactor);
      return {
        lat: lat + Math.sin(perp) * wobble,
        lon: lon + Math.cos(perp) * wobble,
        timestamp: atMs,
        speedKn: Math.round(speedKn * 10) / 10,
        headingDeg: heading,
        status: 'sailing',
      };
    }
  }
  // 理論上不會到這裡
  const wp = SCHEDULE[0];
  return { lat: wp.lat, lon: wp.lon, timestamp: atMs, speedKn: 0, headingDeg: 0, status: 'inPort', portName: wp.port };
}

/** 產生過去 N 天的模擬航跡（每 30 分鐘一點） */
export function getDemoTrack(nowMs: number, days = 5): TrackPoint[] {
  const points: TrackPoint[] = [];
  const stepMs = 30 * 60_000;
  for (let t = nowMs - days * 86400_000; t <= nowMs; t += stepMs) {
    const p = getDemoPosition(t);
    points.push({ lat: p.lat, lon: p.lon, timestamp: t });
  }
  return points;
}

// ---------- AIS 即時資料（aisstream.io，選用） ----------

const TRACK_STORAGE_KEY = 'costa_serena_ais_track_v1';
const LAST_POS_STORAGE_KEY = 'costa_serena_last_pos_v1';

/** 儲存最後一筆 AIS 船位，重新整理後可立即顯示（標示回報時間） */
export function saveLastPosition(pos: ShipPosition): void {
  try {
    localStorage.setItem(LAST_POS_STORAGE_KEY, JSON.stringify(pos));
  } catch { /* ignore */ }
}

export function loadLastPosition(): ShipPosition | null {
  try {
    const raw = localStorage.getItem(LAST_POS_STORAGE_KEY);
    return raw ? JSON.parse(raw) as ShipPosition : null;
  } catch {
    return null;
  }
}

export function loadStoredTrack(days = 5): TrackPoint[] {
  try {
    const raw = localStorage.getItem(TRACK_STORAGE_KEY);
    if (!raw) return [];
    const cutoff = Date.now() - days * 86400_000;
    return (JSON.parse(raw) as TrackPoint[]).filter(p => p.timestamp >= cutoff);
  } catch {
    return [];
  }
}

export function appendStoredTrack(point: TrackPoint, days = 5): TrackPoint[] {
  const track = loadStoredTrack(days);
  const last = track[track.length - 1];
  // 至少間隔 3 分鐘才記一點，避免無限膨脹
  if (!last || point.timestamp - last.timestamp > 3 * 60_000) {
    track.push(point);
    try {
      localStorage.setItem(TRACK_STORAGE_KEY, JSON.stringify(track));
    } catch { /* 空間不足時忽略 */ }
  }
  return track;
}

export interface AisHandle {
  close: () => void;
}

/**
 * 連線 aisstream.io 接收 Costa Serena 即時 AIS 位置。
 * 需要免費 API Key（https://aisstream.io 註冊取得）。
 */
export type AisStatus = 'connecting' | 'connected' | 'error' | 'closed';

export function connectAisStream(
  apiKey: string,
  mmsi: string,
  onPosition: (pos: ShipPosition) => void,
  onStatus: (status: AisStatus, detail?: string) => void,
): AisHandle {
  let closed = false;
  let ws: WebSocket | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const connect = () => {
    if (closed) return;
    onStatus('connecting');
    ws = new WebSocket('wss://stream.aisstream.io/v0/stream');
    ws.onopen = () => {
      onStatus('connected');
      ws!.send(JSON.stringify({
        APIKey: apiKey,
        BoundingBoxes: [[[-90, -180], [90, 180]]],
        FiltersShipMMSI: [mmsi],
        FilterMessageTypes: ['PositionReport'],
      }));
    };
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string);
        if (msg?.error) {
          // aisstream 的錯誤訊息（金鑰錯誤、訂閱格式錯誤等）
          onStatus('error', String(msg.error));
          return;
        }
        const r = msg?.Message?.PositionReport;
        if (!r) return;
        onPosition({
          lat: r.Latitude,
          lon: r.Longitude,
          timestamp: Date.now(),
          speedKn: r.Sog ?? 0,
          headingDeg: (r.TrueHeading && r.TrueHeading < 360) ? r.TrueHeading : (r.Cog ?? 0),
          status: (r.Sog ?? 0) > 0.5 ? 'sailing' : 'inPort',
        });
      } catch { /* 忽略格式錯誤的訊息 */ }
    };
    ws.onerror = () => { if (!closed) onStatus('error'); };
    ws.onclose = () => {
      if (closed) return; // 主動關閉（如元件卸載）不得再回報狀態
      onStatus('error');
      retryTimer = setTimeout(connect, 15_000); // 斷線自動重連
    };
  };
  connect();

  return {
    close: () => {
      closed = true;
      if (retryTimer) clearTimeout(retryTimer);
      ws?.close();
    },
  };
}
