import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { MonitorState, SentimentSnapshot } from './types';
import { aggregate } from './services/sentimentEngine';
import { fetchRedditPosts } from './services/redditService';
import { fetchStocktwitsPosts } from './services/stocktwitsService';
import { fetchXPosts } from './services/xService';
import { SentimentGauge } from './components/SentimentGauge';
import { SourceBreakdown } from './components/SourceBreakdown';
import { TrendChart } from './components/TrendChart';
import { TickerBoard } from './components/TickerBoard';
import { PostFeed } from './components/PostFeed';
import { Card } from './components/ui';

const HISTORY_KEY = 'us_sentiment_history_v1';
const MAX_HISTORY = 96;
const MIN_SAMPLE_GAP_MS = 3 * 60_000; // 至少間隔 3 分鐘才寫入新取樣點
const REFRESH_INTERVAL_MS = 5 * 60_000;

function loadHistory(): SentimentSnapshot[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('讀取歷史取樣失敗：', err);
  }
  return [];
}

const App: React.FC = () => {
  const [state, setState] = useState<MonitorState | null>(null);
  const [history, setHistory] = useState<SentimentSnapshot[]>(loadHistory);
  const [refreshing, setRefreshing] = useState(false);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setRefreshing(true);
    try {
      const results = await Promise.all([
        fetchXPosts(),
        fetchRedditPosts(),
        fetchStocktwitsPosts(),
      ]);
      const next = aggregate(results);
      setState(next);
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && Date.now() - new Date(last.timestamp).getTime() < MIN_SAMPLE_GAP_MS) {
          return prev;
        }
        const updated = [
          ...prev,
          { timestamp: next.assessment.generatedAt, index: next.assessment.index },
        ].slice(-MAX_HISTORY);
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        } catch (err) {
          console.error('寫入歷史取樣失敗：', err);
        }
        return updated;
      });
    } finally {
      inFlight.current = false;
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  return (
    <div className="min-h-screen bg-market-page text-market-ink">
      <header className="border-b border-white/10 bg-market-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <Activity className="text-market-accent" size={22} aria-hidden />
          <div>
            <h1 className="text-lg font-bold">美股市場情緒監測器</h1>
            <p className="text-xs text-market-muted">
              彙整 X・Reddit・StockTwits 社群討論，即時評估市場多空方向
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {state && (
              <span className="hidden text-xs tabular-nums text-market-muted sm:block">
                更新於{' '}
                {new Date(state.assessment.generatedAt).toLocaleTimeString('zh-TW', {
                  hour12: false,
                })}
              </span>
            )}
            <button
              onClick={refresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-market-line/50 px-3 py-1.5 text-sm text-market-ink2 transition hover:bg-market-line disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} aria-hidden />
              重新整理
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {!state ? (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-market-muted">
            <RefreshCw className="animate-spin" size={28} aria-hidden />
            正在收集社群討論…
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <SentimentGauge assessment={state.assessment} />
            </Card>

            <Card title="各來源情緒分佈" className="lg:col-span-2">
              <SourceBreakdown summaries={state.summaries} />
            </Card>

            <Card title="情緒指數趨勢" className="lg:col-span-2">
              <TrendChart history={history} />
            </Card>

            <Card title="熱門討論標的" className="lg:col-span-1">
              <TickerBoard tickers={state.tickers} />
            </Card>

            <Card title="熱門貼文" className="lg:col-span-3">
              <PostFeed posts={state.posts} />
            </Card>
          </div>
        )}

        <footer className="mt-8 space-y-1 border-t border-white/10 pt-4 text-xs leading-relaxed text-market-muted">
          <p>
            評分方法：金融詞典式文本分析（含否定詞處理與 StockTwits 使用者標記），
            貼文以互動量對數加權，各來源以樣本數平方根加權合成 0–100 指數；50 為多空分界。
          </p>
          <p>
            標示「示範資料」的來源代表 API 目前不可用或未設定金鑰（X 需在 .env.local
            設定 VITE_X_BEARER_TOKEN）。本工具僅供研究參考，非投資建議。
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
