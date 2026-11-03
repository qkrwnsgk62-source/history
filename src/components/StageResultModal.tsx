/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowRight, Home, Star, Skull, BookOpen } from 'lucide-react';
import { sound } from '../utils/sound';

interface StageResultModalProps {
  stageId: number;
  stageTitle: string;
  stageEra: string;
  isSuccess: boolean;
  score: number;
  remainingHearts: number;
  maxCombo: number;
  isLastStage: boolean;
  onRetry: () => void;
  onNextStage: () => void;
  onGoHome: () => void;
  onOpenWrongNotes: () => void;
  onOpenMasterEnding?: () => void;
}

export const StageResultModal: React.FC<StageResultModalProps> = ({
  stageId,
  stageTitle,
  stageEra,
  isSuccess,
  score,
  remainingHearts,
  maxCombo,
  isLastStage,
  onRetry,
  onNextStage,
  onGoHome,
  onOpenWrongNotes,
  onOpenMasterEnding,
}) => {
  useEffect(() => {
    if (isSuccess) {
      sound.playStageClear();
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#38bdf8', '#10b981', '#f43f5e'],
        });
      } catch {
        // ignore
      }
    } else {
      sound.playWrong();
    }
  }, [isSuccess]);

  const stars = Math.max(1, remainingHearts);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center shadow-2xl">
        {isSuccess ? (
          <>
            {/* Success Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="h-8 w-8" />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
              <span>{stageTitle}</span>
              <span aria-hidden="true">·</span>
              <span>{stageEra}</span>
            </div>

            <h2 className="font-serif text-2xl font-extrabold text-white">
              스테이지 클리어!
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              해당 시대의 역사적 연대기 순서와 핵심 개념을 멋지게 통과했습니다!
            </p>

            {/* Stars */}
            <div className="my-5 flex items-center justify-center gap-2">
              {[1, 2, 3].map((starIdx) => (
                <div
                  key={starIdx}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                    starIdx <= stars
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-md shadow-amber-500/20'
                      : 'border-slate-800 bg-slate-950/60 text-slate-700'
                  }`}
                >
                  <Star className={`h-6 w-6 ${starIdx <= stars ? 'fill-amber-400' : ''}`} />
                </div>
              ))}
            </div>

            {/* Score Summary Box */}
            <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-left">
              <div>
                <span className="text-[11px] text-slate-400">획득 점수</span>
                <p className="font-serif text-lg font-bold text-cyan-300 tabular-nums">
                  {score.toLocaleString()}점
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">최대 연속 콤보</span>
                <p className="font-serif text-lg font-bold text-amber-300 tabular-nums">
                  {maxCombo}연속 정답
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {isLastStage && onOpenMasterEnding ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenMasterEnding();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 py-3 px-4 text-xs sm:text-sm font-bold text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
                >
                  <span>대한민국 역사 마스터 인증서 확인</span>
                  <Trophy className="h-4 w-4" />
                </button>
              ) : stageId < 8 ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    onNextStage();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 px-4 text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <span>다음 시대로 나아가기</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : null}

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    sound.playClick();
                    onRetry();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>다시 플레이</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onGoHome();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>스테이지 로드맵</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Failure Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Skull className="h-8 w-8" />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-semibold mb-1">
              <span>생명력 소진</span>
              <span aria-hidden="true">·</span>
              <span>{stageTitle}</span>
            </div>

            <h2 className="font-serif text-2xl font-extrabold text-white">
              스테이지 도전 실패
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              하트 3개가 모두 소모되었습니다. 틀렸던 문제는 오답 노트에 자동 저장되었으니 복습 후 다시 도전해 보세요!
            </p>

            <div className="my-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">이번 도전 점수</span>
                <span className="font-bold text-slate-200 tabular-nums">{score.toLocaleString()}점</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">최대 연속 정답</span>
                <span className="font-bold text-amber-400 tabular-nums">{maxCombo}회</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  sound.playClick();
                  onRetry();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 px-4 text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
              >
                <RotateCcw className="h-4 w-4" />
                <span>처음부터 다시 도전하기</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenWrongNotes();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                  <span>오답 노트 확인</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onGoHome();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>스테이지 목록</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
