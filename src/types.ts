/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuizType = 'timeline' | 'keyword' | 'ox';

export interface TimelineItem {
  id: string; // e.g., 'a', 'b', 'c', 'd'
  symbol: string; // e.g. '㉠', '㉡', '㉢', '㉣', '㉤'
  text: string;
  year?: string;
  details?: string;
}

export interface Question {
  id: string;
  stageId: number;
  stageName: string;
  topic: string;
  type: QuizType;
  frequency: '빈출★' | '고난도' | '필수';
  question: string;
  passage?: string;
  blankPrompt?: string;
  options?: string[]; // for keyword or ox
  answer: string | string[]; // string for ox & keyword, array of timeline IDs for timeline
  timelineItems?: TimelineItem[];
  correctOrder?: string[]; // IDs in chronological order
  explanation: string;
  mnemonicTip?: string;
  sourceRef?: string;
}

export interface Stage {
  id: number;
  title: string;
  era: string;
  subtitle: string;
  description: string;
  keyEvents: string[];
  color: string;
  badgeBg: string;
}

export interface StageProgress {
  stageId: number;
  unlocked: boolean;
  cleared: boolean;
  highScore: number;
  stars: number; // 0 to 3
  bestCombo: number;
  lastPlayedAt?: number;
}

export interface UserStats {
  unlockedStage: number; // 1 to 8
  totalScore: number;
  stages: Record<number, StageProgress>;
  wrongNotes: {
    questionId: string;
    stageId: number;
    recordedAt: number;
  }[];
  soundEnabled: boolean;
}
