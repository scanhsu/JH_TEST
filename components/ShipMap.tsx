import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLayerKey, ShipPosition, TrackPoint, WeatherGrid } from '../types';

interface ShipMapProps {
  position: ShipPosition | null;
  track: TrackPoint[];
  grid: WeatherGrid | null;
  rainTileUrl: string | null;
  activeLayers: Set<MapLayerKey>;
  followShip: boolean;
}

// ---------- 波高色階（近似 Windy 波浪配色） ----------
const WAVE_STOPS: [number, [number, number, number]][] = [
  [0.0, [30, 64, 175]],
  [0.5, [6, 182, 212]],
  [1.0, [16, 185, 129]],
  [1.5, [234, 179, 8]],
  [2.0, [249, 115, 22]],
  [3.0, [239, 68, 68]],
  [4.0, [168, 85, 247]],
  [6.0, [217, 70, 239]],
];

function waveColor(h: number): [number, number, number] {
  if (h <= WAVE_STOPS[0][0]) return WAVE_STOPS[0][1];
  for (let i = 1; i < WAVE_STOPS.length; i++) {
    const [v1, c1] = WAVE_STOPS[i];
    const [v0, c0] = WAVE_STOPS[i - 1];
    if (h <= v1) {
      const t = (h - v0) / (v1 - v0);
      return [
        Math.round(c0[0] + (c1[0] - c0[0]) * t),
        Math.round(c0[1] + (c1[1] - c0[1]) * t),
        Math.round(c0[2] + (c1[2] - c0[2]) * t),
      ];
    }
  }
  return WAVE_STOPS[WAVE_STOPS.length - 1][1];
}

// ---------- 網格雙線性插值 ----------
function bilinearWind(grid: WeatherGrid, lat: number, lon: number): [number, number] | null {
  const { rows, cols, latMin, latMax, lonMin, lonMax, points } = grid;
  if (lat < latMin || lat > latMax || lon < lonMin || lon > lonMax) return null;
  const fr = ((lat - latMin) / (latMax - latMin)) * (rows - 1);
  const fc = ((lon - lonMin) / (lonMax - lonMin)) * (cols - 1);
  const r0 = Math.min(rows - 2, Math.floor(fr));
  const c0 = Math.min(cols - 2, Math.floor(fc));
  const tr = fr - r0;
  const tc = fc - c0;
  // 以 u/v 分量插值，避免角度跨 0 度問題
  let u = 0, v = 0;
  for (const [dr, dc, w] of [
    [0, 0, (1 - tr) * (1 - tc)], [0, 1, (1 - tr) * tc],
    [1, 0, tr * (1 - tc)], [1, 1, tr * tc],
  ] as [number, number, number][]) {
    const p = points[(r0 + dr) * cols + (c0 + dc)];
    const rad = (p.windDirection + 180) * Math.PI / 180; // 來向 → 去向
    u += Math.sin(rad) * p.windSpeed * w;
    v += Math.cos(rad) * p.windSpeed * w;
  }
  return [u, v]; // km/h，u=東向、v=北向
}

// ---------- Canvas 覆蓋層基底 ----------
class CanvasOverlay {
  canvas: HTMLCanvasElement;
  map: L.Map;
  private onReset: () => void;

  constructor(map: L.Map, pane: string, onReset: () => void) {
    this.map = map;
    this.onReset = onReset;
    this.canvas = L.DomUtil.create('canvas') as HTMLCanvasElement;
    this.canvas.style.position = 'absolute';
    this.canvas.style.pointerEvents = 'none';
    map.getPanes()[pane as 'overlayPane']!.appendChild(this.canvas);
    map.on('moveend zoomend resize', this.reset, this);
    this.reset();
  }

  reset = () => {
    const topLeft = this.map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this.canvas, topLeft);
    const size = this.map.getSize();
    this.canvas.width = size.x;
    this.canvas.height = size.y;
    this.onReset();
  };

  remove() {
    this.map.off('moveend zoomend resize', this.reset, this);
    this.canvas.remove();
  }
}

// ---------- 波浪熱區圖層 ----------
class WaveLayer {
  private overlay: CanvasOverlay;
  private grid: WeatherGrid | null = null;

  constructor(map: L.Map) {
    this.overlay = new CanvasOverlay(map, 'overlayPane', () => this.draw());
  }

  setGrid(grid: WeatherGrid | null) {
    this.grid = grid;
    this.draw();
  }

  draw() {
    if (!this.overlay) return; // 建構期間 CanvasOverlay 會先觸發一次 reset
    const ctx = this.overlay.canvas.getContext('2d');
    if (!ctx) return;
    const { canvas, map } = this.overlay;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!this.grid) return;

    // 相鄰格點的像素距離，決定漸層半徑
    const p0 = map.latLngToContainerPoint([this.grid.latMin, this.grid.lonMin]);
    const p1 = map.latLngToContainerPoint([
      this.grid.latMin + (this.grid.latMax - this.grid.latMin) / (this.grid.rows - 1),
      this.grid.lonMin + (this.grid.lonMax - this.grid.lonMin) / (this.grid.cols - 1),
    ]);
    const radius = Math.max(24, Math.hypot(p1.x - p0.x, p1.y - p0.y) * 0.95);

    for (const pt of this.grid.points) {
      if (pt.waveHeight == null) continue; // 陸地
      const cp = map.latLngToContainerPoint([pt.lat, pt.lon]);
      if (cp.x < -radius || cp.y < -radius ||
          cp.x > canvas.width + radius || cp.y > canvas.height + radius) continue;
      const [r, g, b] = waveColor(pt.waveHeight);
      const grad = ctx.createRadialGradient(cp.x, cp.y, 0, cp.x, cp.y, radius);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.42)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cp.x, cp.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 高倍率時標示波高數值
    if (map.getZoom() >= 7) {
      ctx.font = '11px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      for (const pt of this.grid.points) {
        if (pt.waveHeight == null) continue;
        const cp = map.latLngToContainerPoint([pt.lat, pt.lon]);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText(`${pt.waveHeight.toFixed(1)}m`, cp.x, cp.y + 4);
      }
    }
  }

  remove() { this.overlay.remove(); }
}

// ---------- 風場粒子圖層（Windy 風格動畫） ----------
interface Particle { x: number; y: number; age: number; }

class WindParticleLayer {
  private overlay: CanvasOverlay;
  private grid: WeatherGrid | null = null;
  private particles: Particle[] = [];
  private raf = 0;
  private readonly COUNT = 700;
  private readonly MAX_AGE = 90;

  constructor(map: L.Map) {
    this.overlay = new CanvasOverlay(map, 'overlayPane', () => this.seed());
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  setGrid(grid: WeatherGrid | null) {
    this.grid = grid;
    this.seed();
  }

  private seed() {
    if (!this.overlay) return; // 建構期間 CanvasOverlay 會先觸發一次 reset
    const { canvas } = this.overlay;
    this.particles = Array.from({ length: this.COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      age: Math.random() * this.MAX_AGE,
    }));
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  }

  private loop() {
    this.raf = requestAnimationFrame(this.loop);
    const ctx = this.overlay.canvas.getContext('2d');
    if (!ctx || !this.grid) return;
    const { canvas, map } = this.overlay;

    // 殘影淡出
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = 'rgba(0,0,0,0.94)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';

    // 風速 km/h → 每幀像素位移（隨緯度像素密度縮放）
    const zoomScale = Math.pow(2, map.getZoom() - 6);
    const speedScale = 0.035 * Math.min(3, Math.max(0.4, zoomScale));

    for (const p of this.particles) {
      p.age++;
      if (p.age > this.MAX_AGE || p.x < 0 || p.y < 0 || p.x > canvas.width || p.y > canvas.height) {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
        p.age = 0;
        continue;
      }
      const ll = map.containerPointToLatLng([p.x, p.y]);
      const wind = bilinearWind(this.grid, ll.lat, ll.lng);
      if (!wind) { p.age = this.MAX_AGE + 1; continue; }
      const [u, v] = wind;
      const speed = Math.hypot(u, v);
      const nx = p.x + u * speedScale;
      const ny = p.y - v * speedScale; // 螢幕 y 軸向下

      // 依風速上色：微風青→強風洋紅
      const t = Math.min(1, speed / 60);
      const alpha = 0.75 * (1 - p.age / this.MAX_AGE * 0.4);
      ctx.strokeStyle = `rgba(${Math.round(110 + t * 145)},${Math.round(220 - t * 120)},255,${alpha})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      p.x = nx;
      p.y = ny;
    }
  }

  remove() {
    cancelAnimationFrame(this.raf);
    this.overlay.remove();
  }
}

// ---------- 船隻圖示 ----------
function shipIcon(heading: number, live: boolean): L.DivIcon {
  const pulse = live
    ? `<span style="position:absolute;inset:-10px;border-radius:9999px;border:2px solid rgba(34,211,238,.6);animation:shipPing 1.8s cubic-bezier(0,0,.2,1) infinite"></span>`
    : '';
  return L.divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: `<div style="position:relative;width:40px;height:40px">${pulse}
      <svg viewBox="0 0 40 40" width="40" height="40" style="transform:rotate(${heading}deg);filter:drop-shadow(0 1px 4px rgba(0,0,0,.6))">
        <path d="M20 3 L27 14 L27 32 Q20 37 13 32 L13 14 Z" fill="#f8fafc" stroke="#0ea5e9" stroke-width="1.6"/>
        <rect x="16" y="14" width="8" height="12" rx="2" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
        <circle cx="20" cy="9.5" r="1.6" fill="#0ea5e9"/>
      </svg></div>`,
  });
}

// ---------- 主元件 ----------
export const ShipMap: React.FC<ShipMapProps> = ({
  position, track, grid, rainTileUrl, activeLayers, followShip,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const trackRef = useRef<L.LayerGroup | null>(null);
  const waveRef = useRef<WaveLayer | null>(null);
  const windRef = useRef<WindParticleLayer | null>(null);
  const rainRef = useRef<L.TileLayer | null>(null);
  const didFitRef = useRef(false);

  // 初始化地圖（一次）
  useEffect(() => {
    if (!divRef.current || mapRef.current) return;
    const map = L.map(divRef.current, {
      center: [25.2, 124.5],
      zoom: 7,
      zoomControl: false,
      attributionControl: true,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO | 氣象: Open-Meteo / RainViewer',
      maxZoom: 12,
      minZoom: 4,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      waveRef.current?.remove();
      windRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 船隻標記
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !position) return;
    const icon = shipIcon(position.headingDeg, position.status === 'sailing');
    if (!markerRef.current) {
      markerRef.current = L.marker([position.lat, position.lon], { icon, zIndexOffset: 1000 }).addTo(map);
    } else {
      markerRef.current.setLatLng([position.lat, position.lon]);
      markerRef.current.setIcon(icon);
    }
    markerRef.current.bindTooltip(
      `<b>Costa Serena</b><br/>${position.status === 'inPort'
        ? `停泊中：${position.portName ?? ''}`
        : `航行中 ${position.speedKn.toFixed(1)} 節 / ${Math.round(position.headingDeg)}°`}`,
      { direction: 'top', offset: [0, -18] },
    );
    if (followShip) map.panTo([position.lat, position.lon], { animate: true });
  }, [position, followShip]);

  // 5 天航跡（依時間遠近分段淡出）
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    trackRef.current?.remove();
    if (track.length < 2) return;
    const group = L.layerGroup();
    const now = track[track.length - 1].timestamp;
    const SEGMENTS = 5;
    const span = now - track[0].timestamp;
    for (let s = 0; s < SEGMENTS; s++) {
      const t0 = track[0].timestamp + span * (s / SEGMENTS);
      const t1 = track[0].timestamp + span * ((s + 1) / SEGMENTS);
      const pts = track.filter(p => p.timestamp >= t0 - 1 && p.timestamp <= t1 + 1)
        .map(p => [p.lat, p.lon] as [number, number]);
      if (pts.length < 2) continue;
      L.polyline(pts, {
        color: '#22d3ee',
        weight: 2.5,
        opacity: 0.15 + 0.65 * ((s + 1) / SEGMENTS),
      }).addTo(group);
    }
    group.addTo(map);
    trackRef.current = group;

    if (!didFitRef.current) {
      didFitRef.current = true;
      map.fitBounds(L.latLngBounds(track.map(p => [p.lat, p.lon] as [number, number])).pad(0.25));
    }
  }, [track]);

  // 波浪圖層
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (activeLayers.has('wave')) {
      if (!waveRef.current) waveRef.current = new WaveLayer(map);
      waveRef.current.setGrid(grid);
    } else {
      waveRef.current?.remove();
      waveRef.current = null;
    }
  }, [grid, activeLayers]);

  // 風場粒子圖層
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (activeLayers.has('wind')) {
      if (!windRef.current) windRef.current = new WindParticleLayer(map);
      windRef.current.setGrid(grid);
    } else {
      windRef.current?.remove();
      windRef.current = null;
    }
  }, [grid, activeLayers]);

  // 雨量雷達圖層
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    rainRef.current?.remove();
    rainRef.current = null;
    if (activeLayers.has('rain') && rainTileUrl) {
      rainRef.current = L.tileLayer(rainTileUrl, { opacity: 0.65, maxZoom: 12 }).addTo(map);
    }
  }, [rainTileUrl, activeLayers]);

  return (
    <>
      <style>{`@keyframes shipPing{0%{transform:scale(.6);opacity:1}80%,100%{transform:scale(1.6);opacity:0}}
        .leaflet-container{background:#0b1120;font-family:"Noto Sans TC",sans-serif}
        .leaflet-tooltip{background:rgba(15,23,42,.92);color:#e2e8f0;border:1px solid rgba(148,163,184,.3);border-radius:8px}
        .leaflet-tooltip-top:before{border-top-color:rgba(15,23,42,.92)}`}</style>
      <div ref={divRef} className="absolute inset-0 z-0" />
    </>
  );
};
