/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, BookOpen, Award, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenWrongNotes: () => void;
  onOpenTimelineSummary: () => void;
  onResetProgress: () => void;
  onGoHome: () => void;
  wrongNotesCount: number;
  clearedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenWrongNotes,
  onOpenTimelineSummary,
  onResetProgress,
  onGoHome,
  wrongNotesCount,
  clearedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={onGoHome}
          className="group flex items-center gap-2 text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-serif font-black text-lg transition-transform group-hover:scale-105">
            韓
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-slate-100 group-hover:text-amber-400 transition-colors whitespace-nowrap">
              한국사 연대기 마스터
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>한능검 심화</span>
              <span aria-hidden="true">·</span>
              <span>기출 500제 기반</span>
            </div>
          </div>
        </button>

        {/* Zone 2: Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={onGoHome}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            시대별 스테이지
          </button>
          <button
            onClick={onOpenTimelineSummary}
            className="flex items-center gap-1 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            <BookOpen className="h-4 w-4 text-cyan-400" />
            <span>핵심 연표 요약</span>
          </button>
          <button
            onClick={onOpenWrongNotes}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            <span>오답 복습관</span>
            {wrongNotesCount > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.2 text-[11px] font-semibold text-rose-300 tabular-nums">
                {wrongNotesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Utilities & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Quick Action for Wrong Notes */}
          <button
            onClick={onOpenWrongNotes}
            className="md:hidden flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300"
            title="오답 복습관"
          >
            <span>오답</span>
            {wrongNotesCount > 0 && (
              <span className="rounded-full bg-rose-500/20 px-1.5 text-[10px] text-rose-300">
                {wrongNotesCount}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-amber-400" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {/* Reset Confirmation Button */}
          <button
            onClick={() => {
              sound.playClick();
              onResetProgress();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-rose-900 hover:text-rose-400 transition-colors"
            title="기록 초기화"
            aria-label="Reset Progress"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300">
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span>클리어</span>
            <span className="font-semibold text-amber-400 tabular-nums">
              {clearedCount}/8
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
