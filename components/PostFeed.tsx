import React from 'react';
import { Heart } from 'lucide-react';
import { SocialPost } from '../types';
import { SentimentChip, SourceBadge, timeAgo } from './ui';

/** 熱門貼文流：依互動量排序，每則附來源、時間、標的與情緒判定 */
export const PostFeed: React.FC<{ posts: SocialPost[]; limit?: number }> = ({
  posts,
  limit = 12,
}) => (
  <ul className="divide-y divide-white/5">
    {posts.slice(0, limit).map((p) => (
      <li key={p.id} className="py-3">
        <div className="flex items-center gap-2 text-xs text-market-muted">
          <SourceBadge source={p.source} />
          <span className="font-medium text-market-ink2">{p.author}</span>
          <span>・{timeAgo(p.createdAt)}</span>
          <span className="ml-auto inline-flex items-center gap-1 tabular-nums">
            <Heart size={12} aria-hidden />
            {p.engagement.toLocaleString()}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-market-ink">
          {p.url ? (
            <a href={p.url} target="_blank" rel="noreferrer" className="hover:underline">
              {p.text}
            </a>
          ) : (
            p.text
          )}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <SentimentChip label={p.label} />
          {p.tickers.slice(0, 4).map((sym) => (
            <span
              key={sym}
              className="rounded bg-market-line px-1.5 py-0.5 font-mono text-[10px] text-market-ink2"
            >
              ${sym}
            </span>
          ))}
        </div>
      </li>
    ))}
  </ul>
);
