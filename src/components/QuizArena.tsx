/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Question, Stage } from '../types';
import { Heart, ArrowLeft, ArrowUp, ArrowDown, RotateCcw, Check, Sparkles, HelpCircle } from 'lucide-react';
import { sound } from '../utils/sound';
import { ExplanationModal } from './ExplanationModal';
import { StageResultModal } from './StageResultModal';

interface QuizArenaProps {
  stage: Stage;
  questions: Question[];
  onExit: () => void;
  onStageCleared: (score: number, remainingHearts: number, maxCombo: number) => void;
  onRecordWrongAnswer: (questionId: string) => void;
  onOpenWrongNotes: () => void;
  onOpenTimelineSummary: () => void;
  onOpenMasterEnding?: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  stage,
  questions,
  onExit,
  onStageCleared,
  onRecordWrongAnswer,
  onOpenWrongNotes,
  onOpenTimelineSummary,
  onOpenMasterEnding,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  // Current Question
  const currentQ = questions[currentIndex];

  // Interactive Timeline sorting state
  const [timelineOrder, setTimelineOrder] = useState<string[]>([]);
  // Visual feedback states
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccessPulsing, setIsSuccessPulsing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Modals
  const [showExplanation, setShowExplanation] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isStageSuccess, setIsStageSuccess] = useState(false);

  // Initialize question state when index changes
  useEffect(() => {
    if (currentQ?.type === 'timeline' && currentQ.timelineItems) {
      // Start with empty slots so user builds the sequence
      setTimelineOrder([]);
    }
    setSelectedOption(null);
    setIsShaking(false);
    setIsSuccessPulsing(false);
  }, [currentIndex, currentQ]);

  // Handle Correct Answer
  const handleCorrect = () => {
    sound.playCorrect();
    setIsSuccessPulsing(true);

    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);

    // Score calculation: 100 base + 25 * combo
    const points = 100 + (newCombo - 1) * 25;
    setScore((prev) => prev + points);

    if (newCombo >= 3) {
      sound.playCombo();
    }

    setTimeout(() => {
      setIsSuccessPulsing(false);
      goToNextQuestion();
    }, 700);
  };

  // Handle Incorrect Answer
  const handleWrong = (selectedAns: string | string[]) => {
    sound.playWrong();
    setIsShaking(true);
    setCombo(0);

    const newHearts = hearts - 1;
    setHearts(newHearts);

    onRecordWrongAnswer(currentQ.id);

    setTimeout(() => {
      setIsShaking(false);
      if (newHearts <= 0) {
        setIsStageSuccess(false);
        setShowResult(true);
      } else {
        setShowExplanation(true);
      }
    }, 400);
  };

  const goToNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Stage Cleared!
      setIsStageSuccess(true);
      setShowResult(true);
      onStageCleared(score + 100, hearts, maxCombo);
    }
  };

  // Timeline ordering handlers
  const handleToggleTimelineItem = (itemId: string) => {
    sound.playClick();
    if (timelineOrder.includes(itemId)) {
      setTimelineOrder((prev) => prev.filter((id) => id !== itemId));
    } else {
      setTimelineOrder((prev) => [...prev, itemId]);
    }
  };

  const handleMoveTimelineItem = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    const newOrder = [...timelineOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setTimelineOrder(newOrder);
  };

  const handleSubmitTimeline = () => {
    if (!currentQ.correctOrder || timelineOrder.length !== currentQ.correctOrder.length) return;

    const isMatch = timelineOrder.every((id, idx) => id === currentQ.correctOrder![idx]);
    if (isMatch) {
      handleCorrect();
    } else {
      handleWrong(timelineOrder);
    }
  };

  // Keyword / OX choice handler
  const handleSelectChoice = (option: string) => {
    if (selectedOption !== null || isShaking || isSuccessPulsing) return;
    setSelectedOption(option);

    if (option === currentQ.answer) {
      handleCorrect();
    } else {
      handleWrong(option);
    }
  };

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Top Game HUD Strip */}
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Back & Stage info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onExit();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white transition-colors"
              title="스테이지 목록으로 나가기"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                <span>{stage.title}</span>
                <span aria-hidden="true">·</span>
                <span>{stage.era}</span>
              </div>
              <h2 className="font-serif text-sm font-bold text-slate-100 line-clamp-1">
                {stage.subtitle}
              </h2>
            </div>
          </div>

          {/* Hearts & Score & Combo */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Combo Streak */}
            {combo >= 2 && (
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400 animate-pulse">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{combo}연속 정답!</span>
              </div>
            )}

            {/* Score */}
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">점수</span>
              <span className="font-serif text-sm sm:text-base font-bold text-cyan-300 tabular-nums">
                {score.toLocaleString()}점
              </span>
            </div>

            {/* 3 Hearts */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
              {[1, 2, 3].map((heartIdx) => (
                <Heart
                  key={heartIdx}
                  className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 ${
                    heartIdx <= hearts
                      ? 'fill-rose-500 text-rose-500 scale-100'
                      : 'text-slate-800 fill-slate-900 scale-90 opacity-40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-950">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-medium text-slate-400 tabular-nums shrink-0">
            {currentIndex + 1} / {questions.length} 문제
          </span>
        </div>
      </div>

      {/* Main Question Arena Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-md transition-all ${
          isShaking ? 'animate-shake border-rose-500/80 bg-rose-950/10' : ''
        } ${isSuccessPulsing ? 'animate-success border-emerald-500/80 bg-emerald-950/10' : ''}`}
      >
        {/* Question Header Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-xs font-bold text-amber-300">
              Q{currentIndex + 1}. {currentQ.topic}
            </span>
            <span className="text-xs text-rose-400 font-semibold">{currentQ.frequency}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>
              {currentQ.type === 'timeline' && '연대기 순서 정렬'}
              {currentQ.type === 'keyword' && '빈칸 키워드 선택'}
              {currentQ.type === 'ox' && '기출 양자택일 / O·X'}
            </span>
          </div>
        </div>

        {/* Question Prompt */}
        <h3 className="font-serif text-lg sm:text-xl font-bold leading-relaxed text-white">
          {currentQ.question}
        </h3>

        {/* Excerpt Passage (if any) */}
        {currentQ.passage && (
          <div className="my-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5 text-sm sm:text-base leading-relaxed text-slate-200 font-serif">
            {currentQ.type === 'keyword' ? (
              <span>
                {currentQ.passage.split('(      )').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="inline-block mx-1 rounded bg-amber-500/20 border border-amber-400/50 px-3 py-0.5 text-xs sm:text-sm font-sans font-bold text-amber-300 animate-pulse">
                        [ ? ]
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </span>
            ) : (
              currentQ.passage
            )}
          </div>
        )}

        {/* Dynamic Interactive Input by Question Type */}

        {/* TYPE 1: Timeline Ordering (연대기 순서 맞추기) */}
        {currentQ.type === 'timeline' && currentQ.timelineItems && (
          <div className="mt-6 space-y-6">
            {/* Guide Hint */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <HelpCircle className="h-4 w-4 text-cyan-400" />
              <span>
                아래 보기 사건들을 클릭하여 일어난 순서대로 1번부터 차례대로 배치하세요.
              </span>
            </div>

            {/* Chosen Order Slots */}
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-4">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                <span className="font-medium">
                  나의 선택 순서 ({timelineOrder.length} / {currentQ.timelineItems.length})
                </span>
                {timelineOrder.length > 0 && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setTimelineOrder([]);
                    }}
                    className="flex items-center gap-1 text-slate-400 hover:text-rose-400 text-xs"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>순서 초기화</span>
                  </button>
                )}
              </div>

              {timelineOrder.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  아래 보기 카드를 클릭하면 순서대로 이곳에 배치됩니다.
                </div>
              ) : (
                <div className="space-y-2">
                  {timelineOrder.map((id, idx) => {
                    const item = currentQ.timelineItems!.find((t) => t.id === id);
                    if (!item) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-xs sm:text-sm text-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 font-bold text-amber-300 text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-amber-400">{item.symbol}</span>
                          <span className="leading-snug">{item.text}</span>
                        </div>

                        {/* Order Adjustment Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleMoveTimelineItem(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            title="위로 이동"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveTimelineItem(idx, 'down')}
                            disabled={idx === timelineOrder.length - 1}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                            title="아래로 이동"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleTimelineItem(id)}
                            className="ml-1 text-xs text-rose-400 hover:underline"
                            title="취소"
                          >
                            제거
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Candidate Items Pool */}
            <div>
              <span className="text-xs font-medium text-slate-400 block mb-2">
                사건 보기 (클릭하여 선택 또는 해제)
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.timelineItems.map((item) => {
                  const isSelected = timelineOrder.includes(item.id);
                  const selectedIdx = timelineOrder.indexOf(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggleTimelineItem(item.id)}
                      className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-xs sm:text-sm transition-all ${
                        isSelected
                          ? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
                          : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="font-bold text-cyan-400 mt-0.5">{item.symbol}</span>
                        <span className="leading-relaxed">{item.text}</span>
                      </div>
                      {isSelected ? (
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300 shrink-0 ml-2">
                          {selectedIdx + 1}번 배치됨
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 shrink-0 ml-2">선택</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Timeline Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmitTimeline}
                disabled={timelineOrder.length !== currentQ.timelineItems.length}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-sm font-bold transition-all ${
                  timelineOrder.length === currentQ.timelineItems.length
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check className="h-4 w-4" />
                <span>
                  {timelineOrder.length === currentQ.timelineItems.length
                    ? '연대기 순서 정답 제출하기'
                    : `모든 사건(${currentQ.timelineItems.length}개)의 순서를 배치해 주세요`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TYPE 2: Keyword Choice (빈칸 채우기) */}
        {currentQ.type === 'keyword' && currentQ.options && (
          <div className="mt-6">
            <span className="text-xs font-medium text-slate-400 block mb-3">
              알맞은 핵심 키워드를 선택하세요:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = isSuccessPulsing && isSelected;
                const isWrong = isShaking && isSelected;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectChoice(opt)}
                    className={`group flex items-center justify-between rounded-xl border p-4 text-left font-serif text-sm sm:text-base font-semibold transition-all ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                        : isWrong
                        ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                        : 'border-slate-800 bg-slate-950/70 text-slate-200 hover:border-amber-500/50 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-mono text-slate-400 group-hover:text-amber-400">
                        {idx + 1}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TYPE 3: OX / Binary Choice (양자택일 퀴즈) */}
        {currentQ.type === 'ox' && currentQ.options && (
          <div className="mt-6">
            <span className="text-xs font-medium text-slate-400 block mb-3">
              맞는 역사적 사실을 선택하세요:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = isSuccessPulsing && isSelected;
                const isWrong = isShaking && isSelected;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectChoice(opt)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-6 text-center font-serif text-base sm:text-lg font-bold transition-all ${
                      isCorrect
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 scale-102'
                        : isWrong
                        ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                        : 'border-slate-800 bg-slate-950/80 text-slate-200 hover:border-amber-500/60 hover:bg-slate-900 hover:shadow-lg'
                    }`}
                  >
                    <span className="text-xs font-mono text-slate-500 mb-2">
                      선택지 {idx === 0 ? 'A' : 'B'}
                    </span>
                    <span className="font-serif text-lg sm:text-xl text-white">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Explanation Modal on Wrong Answer */}
      {showExplanation && (
        <ExplanationModal
          question={currentQ}
          selectedAnswer={selectedOption || timelineOrder}
          heartsLeft={hearts}
          onContinue={() => {
            setShowExplanation(false);
            goToNextQuestion();
          }}
        />
      )}

      {/* Stage Result Modal on Clear or Failure */}
      {showResult && (
        <StageResultModal
          stageId={stage.id}
          stageTitle={stage.title}
          stageEra={stage.era}
          isSuccess={isStageSuccess}
          score={score}
          remainingHearts={hearts}
          maxCombo={maxCombo}
          isLastStage={stage.id === 8}
          onRetry={() => {
            setCurrentIndex(0);
            setHearts(3);
            setScore(0);
            setCombo(0);
            setMaxCombo(0);
            setShowResult(false);
          }}
          onNextStage={() => {
            setShowResult(false);
            onExit();
          }}
          onGoHome={() => {
            setShowResult(false);
            onExit();
          }}
          onOpenWrongNotes={onOpenWrongNotes}
          onOpenMasterEnding={onOpenMasterEnding}
        />
      )}
    </div>
  );
};
