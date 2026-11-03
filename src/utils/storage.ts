/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LocalStorage management for game progression, stage unlocks, and wrong notes
 */

import { StageProgress, UserStats } from '../types';

const STORAGE_KEYS = {
  STATS: 'korean_history_stats_v1',
  WRONG_NOTES: 'korean_history_wrong_notes_v1',
  SOUND: 'korean_history_sound_v1',
};

const defaultInitialStages: Record<number, StageProgress> = {
  1: { stageId: 1, unlocked: true, cleared: false, highScore: 0, stars: 0, bestCombo: 0 },
  2: { stageId: 2, unlocked: false, cleared: false, highScore: 0, stars: 0, bestCombo: 0 },
  3: { stageId: 3, unlocked: false, cleared: false, highScore: 0, stars: 0, bestCombo: 0 },
  4: { stageId: 4, unlocked: false, cleared: false, highScore: 0, stars: 0, bestCombo: 0 },
  5: { stageId: 5, unlocked: false, cleared: false, highScore: 0, stars: 0, bestCombo: 0 },
  6: { stageId: 6, unlocked: false, cleared: false, highScore: 0, stars: 0, bestCombo: 0 },
  7: { stageId: 7, unlocked: false, cleared: false, highScore: 0, stars: 0, bestCombo: 0 },
  8: { stageId: 8, unlocked: false, cleared: false, highScore: 0, stars: 0, bestCombo: 0 },
};

export const getInitialStats = (): UserStats => {
  if (typeof window === 'undefined') {
    return {
      unlockedStage: 1,
      totalScore: 0,
      stages: defaultInitialStages,
      wrongNotes: [],
      soundEnabled: true,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    const soundRaw = localStorage.getItem(STORAGE_KEYS.SOUND);
    const wrongRaw = localStorage.getItem(STORAGE_KEYS.WRONG_NOTES);

    const stages = raw ? JSON.parse(raw) : defaultInitialStages;
    const wrongNotes = wrongRaw ? JSON.parse(wrongRaw) : [];
    const soundEnabled = soundRaw !== null ? soundRaw === 'true' : true;

    // determine highest unlocked
    let unlocked = 1;
    for (let i = 1; i <= 8; i++) {
      if (stages[i]?.unlocked) {
        unlocked = i;
      }
    }

    let totalScore = 0;
    Object.values(stages as Record<number, StageProgress>).forEach((s) => {
      totalScore += s.highScore || 0;
    });

    return {
      unlockedStage: unlocked,
      totalScore,
      stages: { ...defaultInitialStages, ...stages },
      wrongNotes,
      soundEnabled,
    };
  } catch (e) {
    console.error('Failed to load storage', e);
    return {
      unlockedStage: 1,
      totalScore: 0,
      stages: defaultInitialStages,
      wrongNotes: [],
      soundEnabled: true,
    };
  }
};

export const saveStageCompletion = (
  stageId: number,
  score: number,
  remainingHearts: number,
  combo: number
): { isNewClear: boolean; newUnlocked: boolean; stars: number } => {
  const stats = getInitialStats();
  const prevProgress = stats.stages[stageId] || {
    stageId,
    unlocked: true,
    cleared: false,
    highScore: 0,
    stars: 0,
    bestCombo: 0,
  };

  const isNewClear = !prevProgress.cleared;
  // Stars formula: 3 hearts = 3 stars, 2 hearts = 2 stars, 1 heart = 1 star
  const earnedStars = Math.max(1, remainingHearts);
  const stars = Math.max(prevProgress.stars, earnedStars);
  const highScore = Math.max(prevProgress.highScore, score);
  const bestCombo = Math.max(prevProgress.bestCombo, combo);

  stats.stages[stageId] = {
    stageId,
    unlocked: true,
    cleared: true,
    highScore,
    stars,
    bestCombo,
    lastPlayedAt: Date.now(),
  };

  // Unlock next stage if exists
  let newUnlocked = false;
  const nextStageId = stageId + 1;
  if (nextStageId <= 8 && !stats.stages[nextStageId]?.unlocked) {
    stats.stages[nextStageId] = {
      stageId: nextStageId,
      unlocked: true,
      cleared: false,
      highScore: 0,
      stars: 0,
      bestCombo: 0,
    };
    newUnlocked = true;
    stats.unlockedStage = Math.max(stats.unlockedStage, nextStageId);
  }

  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats.stages));
  } catch (e) {
    console.error('Failed to save stage completion', e);
  }

  return { isNewClear, newUnlocked, stars: earnedStars };
};

export const addWrongNote = (questionId: string, stageId: number) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WRONG_NOTES);
    const list: { questionId: string; stageId: number; recordedAt: number }[] = raw ? JSON.parse(raw) : [];
    
    // Avoid duplicates
    if (!list.some((item) => item.questionId === questionId)) {
      list.unshift({ questionId, stageId, recordedAt: Date.now() });
      localStorage.setItem(STORAGE_KEYS.WRONG_NOTES, JSON.stringify(list));
    }
  } catch (e) {
    console.error('Failed to record wrong note', e);
  }
};

export const removeWrongNote = (questionId: string) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WRONG_NOTES);
    if (!raw) return;
    const list: { questionId: string; stageId: number; recordedAt: number }[] = JSON.parse(raw);
    const filtered = list.filter((item) => item.questionId !== questionId);
    localStorage.setItem(STORAGE_KEYS.WRONG_NOTES, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to remove wrong note', e);
  }
};

export const setSoundSetting = (enabled: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND, String(enabled));
  } catch (e) {
    console.error('Failed to save sound preference', e);
  }
};

export const resetAllProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.WRONG_NOTES);
  } catch (e) {
    console.error('Failed to reset progress', e);
  }
};
