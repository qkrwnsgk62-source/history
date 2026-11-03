/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QUESTIONS, STAGES } from '../questions';
import { X, Trash2, CheckCircle, BookOpen, AlertCircle } from 'lucide-react';
import { sound } from '../utils/sound';

interface WrongNotesModalProps {
  wrongNotes: { questionId: string; stageId: number; recordedAt: number }[];
  onRemoveNote: (questionId: string) => void;
  onClose: () => void;
}

export const WrongNotesModal: React.FC<WrongNotesModalProps> = ({
  wrongNotes,
  onRemoveNote,
  onClose,
}) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<number | 'all'>('all');

  const filteredNotes = wrongNotes.filter((note) => {
    if (selectedStageFilter === 'all') return true;
    return note.stageId === selectedStageFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                오답 노트 복습관
              </h2>
              <p className="text-xs text-slate-400">
                퀴즈 중 틀렸던 문제들을 복습하고 확실하게 내 것으로 만드세요 ({wrongNotes.length}개 보관됨)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-800/80 bg-slate-950/40 px-5 py-2.5 text-xs">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedStageFilter('all');
            }}
            className={`rounded-lg px-3 py-1 font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedStageFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            전체 보기 ({wrongNotes.length})
          </button>
          {STAGES.map((s) => {
            const count = wrongNotes.filter((n) => n.stageId === s.id).length;
            if (count === 0) return null;
            return (
              <button
                key={s.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedStageFilter(s.id);
                }}
                className={`rounded-lg px-3 py-1 font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedStageFilter === s.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.era} ({count})
              </button>
            );
          })}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <p className="font-serif text-base font-bold text-slate-200">
                오답 노트가 비어 있습니다!
              </p>
              <p className="mt-1 text-xs text-slate-400">
                퀴즈 서바이벌에서 틀린 문제가 발생하면 여기에 자동으로 기록됩니다.
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const question = QUESTIONS.find((q) => q.id === note.questionId);
              if (!question) return null;

              return (
                <div
                  key={note.questionId}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-xs font-semibold text-rose-300">
                        {question.stageName}
                      </span>
                      <span className="text-xs text-slate-400">· {question.topic}</span>
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onRemoveNote(question.id);
                      }}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-400"
                      title="완전 암기 완료 (노트에서 삭제)"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>복습 완료 삭제</span>
                    </button>
                  </div>

                  <h3 className="font-serif text-sm sm:text-base font-bold text-white mb-2">
                    {question.question}
                  </h3>

                  {question.passage && (
                    <div className="mb-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs sm:text-sm text-slate-300 font-serif leading-relaxed">
                      {question.passage}
                    </div>
                  )}

                  {/* Correct Answer Display */}
                  <div className="mb-2 text-xs">
                    <span className="font-bold text-emerald-400">정답: </span>
                    <span className="font-semibold text-emerald-300">
                      {question.type === 'timeline' && question.timelineItems && question.correctOrder
                        ? question.correctOrder
                            .map((id) => question.timelineItems!.find((t) => t.id === id)?.symbol)
                            .join(' → ')
                        : String(question.answer)}
                    </span>
                  </div>

                  {/* Explanation */}
                  <p className="text-xs leading-relaxed text-slate-400 border-t border-slate-800/80 pt-2">
                    {question.explanation}
                  </p>

                  {question.mnemonicTip && (
                    <div className="mt-2 text-[11px] text-amber-300/90 font-medium">
                      💡 암기 팁: {question.mnemonicTip}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4 text-right">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
