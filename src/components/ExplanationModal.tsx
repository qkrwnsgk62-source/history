/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Question } from '../types';
import { AlertTriangle, CheckCircle, ArrowRight, Lightbulb, BookOpen } from 'lucide-react';
import { sound } from '../utils/sound';

interface ExplanationModalProps {
  question: Question;
  selectedAnswer: string | string[];
  heartsLeft: number;
  onContinue: () => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  question,
  selectedAnswer,
  heartsLeft,
  onContinue,
}) => {
  const getFormattedCorrectAnswer = () => {
    if (question.type === 'timeline') {
      if (!question.timelineItems || !question.correctOrder) return '';
      return question.correctOrder
        .map((id) => {
          const item = question.timelineItems!.find((t) => t.id === id);
          return item ? `${item.symbol} ${item.text.slice(0, 18)}...` : id;
        })
        .join('  →  ');
    }
    return String(question.answer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-rose-900/60 bg-slate-900 p-6 sm:p-7 shadow-2xl">
        {/* Top Warning Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-rose-300">
                오답 발생! 기출 핵심 해설
              </h2>
              <span className="text-xs text-slate-400">
                생명 1개가 차감되었습니다 (남은 생명: {heartsLeft}개)
              </span>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-medium border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded">
            {question.topic}
          </span>
        </div>

        {/* Correct Answer Focus */}
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <CheckCircle className="h-4 w-4" />
            <span>올바른 정답</span>
          </div>
          <div className="font-serif text-base font-bold text-emerald-200 leading-snug">
            {getFormattedCorrectAnswer()}
          </div>
          {question.type === 'timeline' && question.timelineItems && (
            <div className="mt-2.5 space-y-1.5 border-t border-emerald-900/40 pt-2 text-xs text-emerald-300/90">
              {question.correctOrder?.map((id, idx) => {
                const item = question.timelineItems!.find((t) => t.id === id);
                return (
                  <div key={id} className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-400">{idx + 1}. {item?.symbol}</span>
                    <span className="flex-1">{item?.text}</span>
                    {item?.year && <span className="text-emerald-400/80 font-mono text-[11px] shrink-0">({item.year})</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Explanation */}
        <div className="mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <BookOpen className="h-4 w-4 text-cyan-400" />
            <span>상세 해설</span>
            {question.sourceRef && (
              <span className="text-[11px] text-slate-500">({question.sourceRef})</span>
            )}
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
            {question.explanation}
          </p>
        </div>

        {/* Mnemonic / Memorization Tip if available */}
        {question.mnemonicTip && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 text-xs text-amber-200">
            <Lightbulb className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400">한능검 암기 꿀팁: </span>
              <span>{question.mnemonicTip}</span>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={() => {
            sound.playClick();
            onContinue();
          }}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 px-4 text-xs sm:text-sm font-bold text-slate-950 hover:bg-white transition-colors"
        >
          <span>이해 완료하고 계속 진행하기</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
