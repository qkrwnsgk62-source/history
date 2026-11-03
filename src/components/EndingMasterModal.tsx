/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, RotateCcw, X, Share2, Star } from 'lucide-react';
import { sound } from '../utils/sound';

interface EndingMasterModalProps {
  totalScore: number;
  onClose: () => void;
  onResetAll: () => void;
}

export const EndingMasterModal: React.FC<EndingMasterModalProps> = ({
  totalScore,
  onClose,
  onResetAll,
}) => {
  useEffect(() => {
    sound.playStageClear();
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // ignore
    }
  }, []);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border-2 border-amber-500/60 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-10 text-center shadow-2xl">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Certificate Border Accents */}
        <div className="absolute inset-2 pointer-events-none rounded-xl border border-amber-500/20" />

        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 shadow-xl shadow-amber-500/10">
          <Award className="h-10 w-10" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 tracking-widest mb-1">
          <span>명 예 의 전 당</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-black text-white">
          한국사 연대기 마스터 수료증
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
          귀하는 선사 시대부터 현대에 이르기까지 한국사의 8대 시대를 모두 완벽히 정복하여 탁월한 역사적 안목과 연대기적 지식을 갖추었음을 공인합니다.
        </p>

        {/* 8 Era Badges */}
        <div className="my-6 grid grid-cols-4 gap-2 text-left">
          {[
            '1. 선사 시대',
            '2. 삼국·남북국',
            '3. 고려 시대',
            '4. 조선 전기',
            '5. 조선 후기',
            '6. 근대 개항기',
            '7. 일제 강점기',
            '8. 현대사',
          ].map((era, i) => (
            <div
              key={i}
              className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-950/20 p-2 text-[11px] text-amber-300"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{era}</span>
            </div>
          ))}
        </div>

        {/* Stats Strip */}
        <div className="mb-6 flex items-center justify-around rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <div>
            <span className="text-[11px] text-slate-400 block">수여 칭호</span>
            <span className="font-serif text-base font-bold text-amber-300">
              한능검 1급 마스터
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[11px] text-slate-400 block">총 누적 점수</span>
            <span className="font-serif text-base font-bold text-cyan-400 tabular-nums">
              {totalScore.toLocaleString()}점
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[11px] text-slate-400 block">발급 일자</span>
            <span className="font-mono text-xs text-slate-300">{today}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full sm:w-auto flex-1 rounded-xl bg-amber-500 py-3 px-6 text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            확인 및 스테이지로 돌아가기
          </button>
          <button
            onClick={() => {
              sound.playClick();
              if (window.confirm('모든 클리어 기록을 초기화하고 제1스테이지 선사 시대부터 다시 도전하시겠습니까?')) {
                onResetAll();
              }
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 py-3 px-4 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:border-rose-900 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>기록 초기화 후 재도전</span>
          </button>
        </div>
      </div>
    </div>
  );
};
