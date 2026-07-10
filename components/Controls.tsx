import React, { useState } from 'react';
import { Waves, Wind, CloudRain, Crosshair, Settings, X } from 'lucide-react';
import { MapLayerKey } from '../types';

interface LayerControlProps {
  activeLayers: Set<MapLayerKey>;
  onToggle: (key: MapLayerKey) => void;
  followShip: boolean;
  onToggleFollow: () => void;
  onOpenSettings: () => void;
}

const LAYERS: { key: MapLayerKey; label: string; icon: React.ReactNode }[] = [
  { key: 'wave', label: '波浪', icon: <Waves size={16} /> },
  { key: 'wind', label: '風力', icon: <Wind size={16} /> },
  { key: 'rain', label: '雨量', icon: <CloudRain size={16} /> },
];

export const LayerControl: React.FC<LayerControlProps> = ({
  activeLayers, onToggle, followShip, onToggleFollow, onOpenSettings,
}) => (
  <div className="absolute top-3 left-3 z-[500] flex flex-col gap-2">
    <div className="glass-panel rounded-xl p-1.5 flex flex-col gap-1">
      {LAYERS.map(l => (
        <button
          key={l.key}
          onClick={() => onToggle(l.key)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeLayers.has(l.key)
              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:bg-slate-700/50 border border-transparent'
          }`}
        >
          {l.icon}{l.label}
        </button>
      ))}
    </div>
    <div className="glass-panel rounded-xl p-1.5 flex flex-col gap-1">
      <button
        onClick={onToggleFollow}
        title="鏡頭跟隨船隻"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
          followShip
            ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
            : 'text-slate-400 hover:bg-slate-700/50 border border-transparent'
        }`}
      >
        <Crosshair size={16} />跟隨
      </button>
      <button
        onClick={onOpenSettings}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-700/50"
      >
        <Settings size={16} />設定
      </button>
    </div>
  </div>
);

// 波高色階圖例
export const WaveLegend: React.FC = () => (
  <div className="absolute bottom-6 left-3 z-[500] glass-panel rounded-lg px-3 py-2">
    <div className="text-[10px] text-slate-400 mb-1">波高 (m)</div>
    <div className="h-2 w-40 rounded-full"
      style={{ background: 'linear-gradient(90deg,#1e40af,#06b6d4,#10b981,#eab308,#f97316,#ef4444,#a855f7)' }} />
    <div className="flex justify-between text-[9px] text-slate-400 mt-0.5 w-40">
      <span>0</span><span>1</span><span>2</span><span>3</span><span>4+</span>
    </div>
  </div>
);

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  mmsi: string;
  onSave: (apiKey: string, mmsi: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, apiKey, mmsi, onSave }) => {
  const [key, setKey] = useState(apiKey);
  const [m, setM] = useState(mmsi);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="glass-panel rounded-2xl p-5 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">即時 AIS 資料設定</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          預設使用<b className="text-amber-300">模擬航線</b>（依 Costa Serena 基隆—沖繩實際航程型態推算）。
          若要顯示<b className="text-emerald-300">真實即時船位</b>，請至{' '}
          <a href="https://aisstream.io" target="_blank" rel="noreferrer" className="text-cyan-400 underline">aisstream.io</a>{' '}
          免費註冊取得 API Key 後填入下方。金鑰只儲存在你的瀏覽器中。
        </p>
        <label className="block text-xs text-slate-300 mb-1">aisstream.io API Key</label>
        <input
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="留空 = 使用模擬航線"
          className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white mb-3 focus:outline-none focus:border-cyan-500"
        />
        <label className="block text-xs text-slate-300 mb-1">船舶 MMSI</label>
        <input
          value={m}
          onChange={e => setM(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white mb-4 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={() => { onSave(key.trim(), m.trim()); onClose(); }}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg py-2 text-sm transition-colors"
        >
          儲存
        </button>
      </div>
    </div>
  );
};
