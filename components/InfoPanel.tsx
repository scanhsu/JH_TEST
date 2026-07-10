import React from 'react';
import {
  Anchor, Navigation, Waves, Wind, CloudRain, Clock, Gauge, MapPin, Timer,
} from 'lucide-react';
import { ComfortResult, DataSource, HourlyForecast, MarineWeather, ShipPosition } from '../types';
import { SHIP_INFO } from '../services/shipService';
import { ForecastChart } from './ForecastChart';

interface Props {
  position: ShipPosition | null;
  weather: MarineWeather | null;
  comfort: ComfortResult | null;
  forecast: HourlyForecast[];
  dataSource: DataSource;
  aisStatus: string | null;
}

function fmtCoord(lat: number, lon: number): string {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(3)}°${ns}, ${Math.abs(lon).toFixed(3)}°${ew}`;
}

function dirText(deg: number): string {
  const dirs = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
  return dirs[Math.round(deg / 45) % 8];
}

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string; sub?: string }> = ({ icon, label, value, sub }) => (
  <div className="flex items-center gap-2.5 bg-slate-800/60 rounded-xl px-3 py-2.5">
    <div className="text-cyan-400 shrink-0">{icon}</div>
    <div className="min-w-0">
      <div className="text-[11px] text-slate-400 leading-tight">{label}</div>
      <div className="text-sm font-semibold text-slate-100 leading-tight truncate">
        {value}{sub && <span className="text-[11px] text-slate-400 font-normal ml-1">{sub}</span>}
      </div>
    </div>
  </div>
);

export const InfoPanel: React.FC<Props> = ({ position, weather, comfort, forecast, dataSource, aisStatus }) => {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      {/* 船舶資訊 */}
      <section className="glass-panel rounded-2xl p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="font-display text-lg text-white tracking-wide">COSTA SERENA</h1>
            <p className="text-xs text-slate-400">歌詩達莎倫娜號 · IMO {SHIP_INFO.imo} · {SHIP_INFO.flag}籍</p>
          </div>
          <span className={`text-[10px] px-2 py-1 rounded-full font-semibold shrink-0 ${
            dataSource === 'ais'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}>
            {dataSource === 'ais' ? `AIS 即時${aisStatus === 'connected' ? '' : '（連線中）'}` : '模擬航線'}
          </span>
        </div>

        {position ? (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Stat icon={<MapPin size={16} />} label="目前位置" value={fmtCoord(position.lat, position.lon)} />
            <Stat
              icon={position.status === 'inPort' ? <Anchor size={16} /> : <Navigation size={16} />}
              label="狀態"
              value={position.status === 'inPort' ? `停泊 ${position.portName ?? ''}` : '航行中'}
            />
            <Stat icon={<Gauge size={16} />} label="航速" value={position.speedKn.toFixed(1)} sub="節" />
            <Stat icon={<Navigation size={16} />} label="航向" value={`${Math.round(position.headingDeg)}°`} sub={dirText(position.headingDeg)} />
          </div>
        ) : (
          <div className="text-slate-500 text-sm mt-3">定位中…</div>
        )}
        {position && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
            <Clock size={11} />
            更新於 {new Date(position.timestamp).toLocaleTimeString('zh-TW')}
          </div>
        )}
      </section>

      {/* 舒適度指數 */}
      <section className="glass-panel rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Waves size={15} className="text-cyan-400" /> 航行舒適度指數
        </h2>
        {comfort ? (
          <>
            <div className="flex items-center gap-4">
              {/* 圓形量表 */}
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={comfort.color} strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(comfort.index / 100) * 264} 264`}
                    style={{ transition: 'stroke-dasharray 1s ease, stroke .5s' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white leading-none">{comfort.index}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">/ 100</span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold" style={{ color: comfort.color }}>
                  {comfort.emoji} {comfort.level}
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{comfort.motionDesc}</p>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">💡 {comfort.advice}</p>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-3 border-t border-slate-700/60 pt-2">
              估計橫搖幅度約 ±{comfort.estRollDeg}°　·　依波高、波週期與本船船長 290m／自然橫搖週期推算，含減搖鰭效果
            </div>
          </>
        ) : (
          <div className="text-slate-500 text-sm">計算中…</div>
        )}
      </section>

      {/* 船位海氣象 */}
      <section className="glass-panel rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Wind size={15} className="text-cyan-400" /> 船位即時海氣象
        </h2>
        {weather ? (
          <div className="grid grid-cols-2 gap-2">
            <Stat icon={<Waves size={16} />} label="有義波高" value={`${weather.waveHeight.toFixed(1)} m`} sub={`${dirText(weather.waveDirection)}向`} />
            <Stat icon={<Timer size={16} />} label="波浪週期" value={`${weather.wavePeriod.toFixed(1)} s`} />
            <Stat icon={<Wind size={16} />} label="風速" value={`${weather.windSpeed.toFixed(0)} km/h`} sub={`${dirText(weather.windDirection)}風`} />
            <Stat icon={<CloudRain size={16} />} label="時雨量" value={`${weather.precipitation.toFixed(1)} mm`} />
          </div>
        ) : (
          <div className="text-slate-500 text-sm">氣象載入中…</div>
        )}
      </section>

      {/* 48 小時預報 */}
      <section className="glass-panel rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-1 flex items-center gap-2">
          <Clock size={15} className="text-cyan-400" /> 未來 48 小時舒適度預測
        </h2>
        <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-1">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" /> 舒適度</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 bg-cyan-500/30 border-t border-cyan-500/60 inline-block" /> 波高</span>
        </div>
        <ForecastChart forecast={forecast} />
      </section>

      <footer className="text-[10px] text-slate-600 text-center pb-2">
        氣象資料：Open-Meteo Marine API · 雷達：RainViewer · 舒適度為模型估算僅供參考
      </footer>
    </div>
  );
};
