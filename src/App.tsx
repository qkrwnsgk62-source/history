/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { STAGES, QUESTIONS } from './questions';
import { UserStats } from './types';
import {
  getInitialStats,
  saveStageCompletion,
  addWrongNote,
  removeWrongNote,
  setSoundSetting,
  resetAllProgress,
} from './utils/storage';
import { sound } from './utils/sound';
import { Header } from './components/Header';
import { StageSelect } from './components/StageSelect';
import { QuizArena } from './components/QuizArena';
import { WrongNotesModal } from './components/WrongNotesModal';
import { TimelineSummaryModal } from './components/TimelineSummaryModal';
import { EndingMasterModal } from './components/EndingMasterModal';

export default function App() {
  const [userStats, setUserStats] = useState<UserStats>(getInitialStats);
  const [activeStageId, setActiveStageId] = useState<number | null>(null);

  // Modals
  const [showWrongNotes, setShowWrongNotes] = useState(false);
  const [showTimelineSummary, setShowTimelineSummary] = useState(false);
  const [showMasterEnding, setShowMasterEnding] = useState(false);

  // Initialize sound on mount
  useEffect(() => {
    sound.setEnabled(userStats.soundEnabled);
  }, [userStats.soundEnabled]);

  const refreshStats = () => {
    setUserStats(getInitialStats());
  };

  const handleSelectStage = (stageId: number) => {
    setActiveStageId(stageId);
  };

  const handleStageCleared = (score: number, remainingHearts: number, maxCombo: number) => {
    if (!activeStageId) return;
    const result = saveStageCompletion(activeStageId, score, remainingHearts, maxCombo);
    refreshStats();

    // If player just cleared Stage 8, trigger ending certificate!
    if (activeStageId === 8 && result.isNewClear) {
      setTimeout(() => {
        setShowMasterEnding(true);
      }, 1000);
    }
  };

  const handleRecordWrongAnswer = (questionId: string) => {
    if (!activeStageId) return;
    addWrongNote(questionId, activeStageId);
    refreshStats();
  };

  const handleRemoveWrongNote = (questionId: string) => {
    removeWrongNote(questionId);
    refreshStats();
  };

  const handleToggleSound = () => {
    const nextVal = !userStats.soundEnabled;
    setSoundSetting(nextVal);
    sound.setEnabled(nextVal);
    setUserStats((prev) => ({ ...prev, soundEnabled: nextVal }));
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        '모든 스테이지 진행 상황, 최고 점수, 별점 및 오답 노트가 초기화됩니다.\n정말 초기화하시겠습니까?'
      )
    ) {
      resetAllProgress();
      setActiveStageId(null);
      refreshStats();
    }
  };

  const activeStage = activeStageId ? STAGES.find((s) => s.id === activeStageId) : null;
  const activeQuestions = activeStageId
    ? QUESTIONS.filter((q) => q.stageId === activeStageId)
    : [];

  const clearedCount = Object.values(userStats.stages).filter((s) => s.cleared).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3-zone Header */}
      <Header
        soundEnabled={userStats.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenWrongNotes={() => setShowWrongNotes(true)}
        onOpenTimelineSummary={() => setShowTimelineSummary(true)}
        onResetProgress={handleResetProgress}
        onGoHome={() => setActiveStageId(null)}
        wrongNotesCount={userStats.wrongNotes.length}
        clearedCount={clearedCount}
      />

      {/* Main Container */}
      <main className="flex-1">
        {activeStage && activeQuestions.length > 0 ? (
          <QuizArena
            stage={activeStage}
            questions={activeQuestions}
            onExit={() => setActiveStageId(null)}
            onStageCleared={handleStageCleared}
            onRecordWrongAnswer={handleRecordWrongAnswer}
            onOpenWrongNotes={() => setShowWrongNotes(true)}
            onOpenTimelineSummary={() => setShowTimelineSummary(true)}
            onOpenMasterEnding={() => setShowMasterEnding(true)}
          />
        ) : (
          <StageSelect
            stages={STAGES}
            userStats={userStats}
            onSelectStage={handleSelectStage}
            onOpenWrongNotes={() => setShowWrongNotes(true)}
            onOpenTimelineSummary={() => setShowTimelineSummary(true)}
            onOpenMasterEnding={() => setShowMasterEnding(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-400">한국사 연대기 마스터</span>
            <span aria-hidden="true">·</span>
            <span>한능검(심화) 기출 500제 기반 퀴즈 서바이벌</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>선사 · 고대 · 고려 · 조선 · 근대 · 일제 · 현대</span>
            <span aria-hidden="true">·</span>
            <span>Local Storage 저장 지원</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showWrongNotes && (
        <WrongNotesModal
          wrongNotes={userStats.wrongNotes}
          onRemoveNote={handleRemoveWrongNote}
          onClose={() => setShowWrongNotes(false)}
        />
      )}

      {showTimelineSummary && (
        <TimelineSummaryModal onClose={() => setShowTimelineSummary(false)} />
      )}

      {showMasterEnding && (
        <EndingMasterModal
          totalScore={userStats.totalScore}
          onClose={() => setShowMasterEnding(false)}
          onResetAll={handleResetProgress}
        />
      )}
    </div>
  );
}
