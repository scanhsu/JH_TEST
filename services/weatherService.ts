import { HourlyForecast, MarineWeather, WeatherGrid, WeatherGridPoint } from '../types';
import { computeComfort } from './comfortService';

/**
 * 氣象資料來源：Open-Meteo（免費、無需 API Key、支援 CORS）
 *  - marine-api.open-meteo.com：波高、波向、波週期
 *  - api.open-meteo.com：風速、風向、降雨
 * 兩個 API 都支援一次查詢多個座標（batch），供地圖網格圖層使用。
 */

const MARINE_API = 'https://marine-api.open-meteo.com/v1/marine';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  return res.json();
}

/** 船隻所在點的即時海況 + 天氣 */
export async function fetchShipWeather(lat: number, lon: number): Promise<MarineWeather> {
  const [marine, weather] = await Promise.all([
    fetchJson(`${MARINE_API}?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}` +
      `&current=wave_height,wave_direction,wave_period&timezone=auto`),
    fetchJson(`${FORECAST_API}?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}` +
      `&current=wind_speed_10m,wind_direction_10m,precipitation&timezone=auto`),
  ]);
  return {
    waveHeight: marine.current?.wave_height ?? 0,
    waveDirection: marine.current?.wave_direction ?? 0,
    wavePeriod: marine.current?.wave_period ?? 8,
    windSpeed: weather.current?.wind_speed_10m ?? 0,
    windDirection: weather.current?.wind_direction_10m ?? 0,
    precipitation: weather.current?.precipitation ?? 0,
    fetchedAt: Date.now(),
  };
}

/** 船隻所在點未來 48 小時逐時預報（含舒適度） */
export async function fetchShipForecast(lat: number, lon: number): Promise<HourlyForecast[]> {
  const [marine, weather] = await Promise.all([
    fetchJson(`${MARINE_API}?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}` +
      `&hourly=wave_height,wave_period&forecast_days=3&timezone=auto`),
    fetchJson(`${FORECAST_API}?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}` +
      `&hourly=wind_speed_10m,precipitation&forecast_days=3&timezone=auto`),
  ]);
  const times: string[] = marine.hourly?.time ?? [];
  const now = Date.now();
  const result: HourlyForecast[] = [];
  for (let i = 0; i < times.length && result.length < 48; i++) {
    const t = new Date(times[i]).getTime();
    if (t < now - 3600_000) continue;
    const waveHeight = marine.hourly.wave_height?.[i] ?? 0;
    const wavePeriod = marine.hourly.wave_period?.[i] ?? 8;
    const windSpeed = weather.hourly?.wind_speed_10m?.[i] ?? 0;
    result.push({
      time: t,
      waveHeight,
      wavePeriod,
      windSpeed,
      precipitation: weather.hourly?.precipitation?.[i] ?? 0,
      comfort: computeComfort(waveHeight, wavePeriod, windSpeed).index,
    });
  }
  return result;
}

/**
 * 以船位為中心抓取氣象網格（rows × cols），供波浪熱區與風場粒子圖層使用。
 * 使用 Open-Meteo 批次查詢，一次請求取回所有格點。
 */
export async function fetchWeatherGrid(
  centerLat: number,
  centerLon: number,
  spanDeg = 4,
  rows = 8,
  cols = 8,
): Promise<WeatherGrid> {
  const latMin = centerLat - spanDeg;
  const latMax = centerLat + spanDeg;
  const lonMin = centerLon - spanDeg;
  const lonMax = centerLon + spanDeg;
  const lats: number[] = [];
  const lons: number[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      lats.push(latMin + (latMax - latMin) * (r / (rows - 1)));
      lons.push(lonMin + (lonMax - lonMin) * (c / (cols - 1)));
    }
  }
  const latStr = lats.map(v => v.toFixed(2)).join(',');
  const lonStr = lons.map(v => v.toFixed(2)).join(',');

  const [marineRes, weatherRes] = await Promise.all([
    fetchJson(`${MARINE_API}?latitude=${latStr}&longitude=${lonStr}&current=wave_height`)
      .catch(() => null), // 部分格點在陸地上時 marine API 可能整批失敗
    fetchJson(`${FORECAST_API}?latitude=${latStr}&longitude=${lonStr}` +
      `&current=wind_speed_10m,wind_direction_10m,precipitation`),
  ]);

  const marineArr = Array.isArray(marineRes) ? marineRes : marineRes ? [marineRes] : [];
  const weatherArr = Array.isArray(weatherRes) ? weatherRes : [weatherRes];

  const points: WeatherGridPoint[] = lats.map((lat, i) => ({
    lat,
    lon: lons[i],
    waveHeight: marineArr[i]?.current?.wave_height ?? null,
    windSpeed: weatherArr[i]?.current?.wind_speed_10m ?? 0,
    windDirection: weatherArr[i]?.current?.wind_direction_10m ?? 0,
    precipitation: weatherArr[i]?.current?.precipitation ?? 0,
  }));

  return { points, rows, cols, latMin, latMax, lonMin, lonMax, fetchedAt: Date.now() };
}

/** RainViewer 雷達回波圖層（免費、無需 Key）：取得最新一幀的 tile URL 樣板 */
export async function fetchRainTileUrl(): Promise<string | null> {
  try {
    const data = await fetchJson('https://api.rainviewer.com/public/weather-maps.json');
    const frames = data?.radar?.past;
    if (!frames?.length) return null;
    const latest = frames[frames.length - 1];
    // color scheme 2（通用）、smooth=1、snow=1
    return `${data.host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
  } catch {
    return null;
  }
}
