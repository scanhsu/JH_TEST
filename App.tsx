import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ShipMap } from './components/ShipMap';
import { InfoPanel } from './components/InfoPanel';
import { LayerControl, SettingsModal, WaveLegend } from './components/Controls';
import {
  ComfortResult, DataSource, HourlyForecast, MapLayerKey, MarineWeather,
  ShipPosition, TrackPoint, WeatherGrid,
} from './types';
import {
  SHIP_INFO, connectAisStream, getDemoPosition, getDemoTrack,
  appendStoredTrack, loadStoredTrack, loadLastPosition, saveLastPosition, AisHandle,
} from './services/shipService';
import {
  fetchRainTileUrl, fetchShipForecast, fetchShipWeather, fetchWeatherGrid,
} from './services/weatherService';
import { computeComfort } from './services/comfortService';

const SETTINGS_KEY = 'costa_serena_settings_v1';
const TRACK_DAYS = 5;

// 可在專案根目錄建立 .env.local 設定 VITE_AIS_API_KEY，作為預設金鑰
// （.env.local 已被 .gitignore 排除，不會進版本庫）
const ENV_AIS_KEY: string = (import.meta as any).env?.VITE_AIS_API_KEY ?? '';

interface Settings {
  aisApiKey: string;
  mmsi: string;
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // 遷移：舊版曾預設錯誤的 MMSI，自動更正為正確船號
      const mmsi = !saved.mmsi || saved.mmsi === '247281000' ? SHIP_INFO.defaultMmsi : saved.mmsi;
      return { aisApiKey: saved.aisApiKey || ENV_AIS_KEY, mmsi };
    }
  } catch { /* ignore */ }
  return { aisApiKey: ENV_AIS_KEY, mmsi: SHIP_INFO.defaultMmsi };
}

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [position, setPosition] = useState<ShipPosition | null>(null);
  const [track, setTrack] = useState<TrackPoint[]>([]);
  const [weather, setWeather] = useState<MarineWeather | null>(null);
  const [forecast, setForecast] = useState<HourlyForecast[]>([]);
  const [grid, setGrid] = useState<WeatherGrid | null>(null);
  const [rainTileUrl, setRainTileUrl] = useState<string | null>(null);
  const [activeLayers, setActiveLayers] = useState<Set<MapLayerKey>>(new Set(['wave', 'wind']));
  const [followShip, setFollowShip] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aisStatus, setAisStatus] = useState<string | null>(null);
  const [aisDetail, setAisDetail] = useState<string | null>(null);
  const [hasAisFix, setHasAisFix] = useState(false); // 本次連線是否已收到即時訊號

  const dataSource: DataSource = settings.aisApiKey ? 'ais' : 'demo';

  // ---------- 船位資料來源 ----------
  useEffect(() => {
    let ais: AisHandle | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    if (settings.aisApiKey) {
      // 真實 AIS：即時位置 + localStorage 累積 5 天航跡
      setHasAisFix(false);
      setAisDetail(null);
      setTrack(loadStoredTrack(TRACK_DAYS));
      setPosition(loadLastPosition()); // 先顯示上次收到的船位，等待新訊號
      ais = connectAisStream(settings.aisApiKey, settings.mmsi, (pos) => {
        setHasAisFix(true);
        setPosition(pos);
        saveLastPosition(pos);
        setTrack(appendStoredTrack({ lat: pos.lat, lon: pos.lon, timestamp: pos.timestamp }, TRACK_DAYS));
      }, (status, detail) => {
        setAisStatus(status);
        if (detail) setAisDetail(detail);
      });
    } else {
      // 模擬航線：每 30 秒推進
      setAisStatus(null);
      setAisDetail(null);
      setHasAisFix(false);
      const update = () => {
        const now = Date.now();
        setPosition(getDemoPosition(now));
        setTrack(getDemoTrack(now, TRACK_DAYS));
      };
      update();
      timer = setInterval(update, 30_000);
    }
    return () => {
      ais?.close();
      if (timer) clearInterval(timer);
    };
  }, [settings.aisApiKey, settings.mmsi]);

  // ---------- 船位點氣象（移動超過 ~15km 或 15 分鐘更新） ----------
  const weatherAnchor = useRef<{ lat: number; lon: number; t: number } | null>(null);
  useEffect(() => {
    if (!position) return;
    const a = weatherAnchor.current;
    const moved = !a || Math.hypot(position.lat - a.lat, position.lon - a.lon) > 0.15;
    const stale = !a || Date.now() - a.t > 15 * 60_000;
    if (!moved && !stale) return;
    weatherAnchor.current = { lat: position.lat, lon: position.lon, t: Date.now() };
    fetchShipWeather(position.lat, position.lon).then(setWeather).catch(console.error);
    fetchShipForecast(position.lat, position.lon).then(setForecast).catch(console.error);
  }, [position]);

  // ---------- 氣象網格（移動超過 ~1° 或 30 分鐘更新） ----------
  const gridAnchor = useRef<{ lat: number; lon: number; t: number } | null>(null);
  useEffect(() => {
    if (!position) return;
    const a = gridAnchor.current;
    const moved = !a || Math.hypot(position.lat - a.lat, position.lon - a.lon) > 1;
    const stale = !a || Date.now() - a.t > 30 * 60_000;
    if (!moved && !stale) return;
    gridAnchor.current = { lat: position.lat, lon: position.lon, t: Date.now() };
    fetchWeatherGrid(position.lat, position.lon).then(setGrid).catch(console.error);
  }, [position]);

  // ---------- 雨量雷達（每 10 分鐘刷新最新一幀） ----------
  useEffect(() => {
    const load = () => fetchRainTileUrl().then(setRainTileUrl).catch(() => {});
    load();
    const timer = setInterval(load, 10 * 60_000);
    return () => clearInterval(timer);
  }, []);

  // ---------- 舒適度 ----------
  const comfort: ComfortResult | null = useMemo(() => {
    if (!weather) return null;
    return computeComfort(weather.waveHeight, weather.wavePeriod, weather.windSpeed);
  }, [weather]);

  const toggleLayer = useCallback((key: MapLayerKey) => {
    setActiveLayers(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const saveSettings = useCallback((aisApiKey: string, mmsi: string) => {
    const next = { aisApiKey, mmsi: mmsi || SHIP_INFO.defaultMmsi };
    setSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-slate-950 overflow-hidden">
      {/* 地圖區 */}
      <div className="relative flex-1 min-h-0">
        <ShipMap
          position={position}
          track={track}
          grid={grid}
          rainTileUrl={rainTileUrl}
          activeLayers={activeLayers}
          followShip={followShip}
        />
        <LayerControl
          activeLayers={activeLayers}
          onToggle={toggleLayer}
          followShip={followShip}
          onToggleFollow={() => setFollowShip(f => !f)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        {activeLayers.has('wave') && <WaveLegend />}

        {/* AIS 連線狀態橫幅 */}
        {dataSource === 'ais' && !hasAisFix && (
          <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-[600] glass-panel rounded-xl px-4 py-2 text-xs max-w-[85%] text-center ${
            aisStatus === 'error' ? 'text-red-300' : 'text-cyan-200'
          }`}>
            {aisStatus === 'error' ? (
              <>⚠️ AIS 連線異常{aisDetail ? `：${aisDetail}` : ''}，15 秒後自動重試（請確認 API Key 是否正確）</>
            ) : aisStatus === 'connected' ? (
              <>🛰️ 已連上 aisstream.io，等待 Costa Serena（MMSI {settings.mmsi}）的下一筆訊號…
                {position ? ' 目前顯示為最後回報位置' : ' 航行中通常數秒～數分鐘，靠港時可能較久'}</>
            ) : (
              <>📡 正在連線 aisstream.io…</>
            )}
          </div>
        )}
      </div>

      {/* 資訊面板：桌機右側、手機下方 */}
      <aside className="w-full md:w-[400px] md:h-full h-[46vh] shrink-0 bg-slate-900/95 border-t md:border-t-0 md:border-l border-slate-700/50">
        <InfoPanel
          position={position}
          weather={weather}
          comfort={comfort}
          forecast={forecast}
          dataSource={dataSource}
          aisStatus={aisStatus}
        />
      </aside>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={settings.aisApiKey}
        mmsi={settings.mmsi}
        onSave={saveSettings}
      />
    </div>
  );
};

export default App;
