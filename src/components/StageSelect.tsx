/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Stage, UserStats } from '../types';
import { Lock, CheckCircle2, Star, Sparkles, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';
import { sound } from '../utils/sound';

interface StageSelectProps {
  stages: Stage[];
  userStats: UserStats;
  onSelectStage: (stageId: number) => void;
  onOpenWrongNotes: () => void;
  onOpenTimelineSummary: () => void;
  onOpenMasterEnding?: () => void;
}

export const StageSelect: React.FC<StageSelectProps> = ({
  stages,
  userStats,
  onSelectStage,
  onOpenWrongNotes,
  onOpenTimelineSummary,
  onOpenMasterEnding,
}) => {
  const clearedCount = Object.values(userStats.stages).filter((s) => s.cleared).length;
  const isAllCleared = clearedCount === 8;

  const getRankTitle = (cleared: number) => {
    if (cleared >= 8) return { title: '한국사 마스터 (한능검 1급)', sub: '모든 시대를 완벽 정복하였습니다!' };
    if (cleared >= 6) return { title: '대한제국 애국지사', sub: '근현대사 합격권 진입' };
    if (cleared >= 4) return { title: '조선실록 사관', sub: '조선 왕조 통치 완벽 이해' };
    if (cleared >= 2) return { title: '고려 개경 성균관 생도', sub: '중세사 정복 중' };
    if (cleared >= 1) return { title: '삼국시대 화랑', sub: '기초 연대기 다지는 중' };
    return { title: '역사 새내기 학도', sub: '선사 시대부터 출발하세요!' };
  };

  const rank = getRankTitle(clearedCount);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero & Progress Overview Strip */}
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>한국사능력검정시험 심화 대비</span>
              <span aria-hidden="true">·</span>
              <span>기출 압축 연대기 서바이벌</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              한국사 8대 시대 연대기 클리어
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
              선사 시대부터 현대까지 각 시대의 사건 순서 나열, 핵심 빈칸 채우기, 양자택일 기출 문제를 풀어 시대를 잠금 해제하세요. 생명 3개로 도전하는 긴장감 넘치는 학습 게임입니다.
            </p>
          </div>

          {/* User Score & Rank Box */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
            <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 min-w-[160px]">
              <span className="text-xs text-slate-400">나의 현재 칭호</span>
              <div className="my-1">
                <span className="font-serif text-base font-bold text-amber-300">
                  {rank.title}
                </span>
                <p className="text-[11px] text-slate-400">{rank.sub}</p>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-800 pt-2">
                <span className="text-slate-400">누적 점수</span>
                <span className="font-bold text-cyan-400 tabular-nums">
                  {userStats.totalScore.toLocaleString()}점
                </span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="flex flex-col justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4 min-w-[180px]">
              <div>
                <span className="text-xs text-slate-400">진행도: {clearedCount} / 8 시대 클리어</span>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${(clearedCount / 8) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenTimelineSummary();
                  }}
                  className="flex-1 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors text-center"
                >
                  연표 요약
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenWrongNotes();
                  }}
                  className="flex-1 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors text-center"
                >
                  오답 노트 ({userStats.wrongNotes.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Master Ending Banner if cleared all */}
        {isAllCleared && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-yellow-900/30 to-amber-950/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <Star className="h-5 w-5 fill-amber-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-200">
                  축하합니다! 8대 시대 연대기 완전 정복
                </h2>
                <p className="text-xs text-amber-300/80">
                  한국사능력검정시험 심화 1급 명예의 전당 인증서를 확인하세요.
                </p>
              </div>
            </div>
            {onOpenMasterEnding && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenMasterEnding();
                }}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap"
              >
                <span>인증서 보기</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stage Roadmap Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-white">
            시대별 스테이지 로드맵
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            1번 선사 시대부터 순서대로 클리어해야 다음 시대로 나아갈 수 있습니다.
          </p>
        </div>
      </div>

      {/* Stage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stages.map((stage) => {
          const progress = userStats.stages[stage.id] || {
            stageId: stage.id,
            unlocked: stage.id === 1,
            cleared: false,
            highScore: 0,
            stars: 0,
            bestCombo: 0,
          };

          const isUnlocked = progress.unlocked;
          const isCleared = progress.cleared;

          return (
            <div
              key={stage.id}
              className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 ${
                isUnlocked
                  ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/40'
                  : 'border-slate-800/40 bg-slate-950/60 opacity-60'
              }`}
            >
              {/* Top Meta */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-xs font-semibold text-slate-400">
                      {stage.title}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400">{stage.era}</span>
                  </div>

                  {/* Status Indicator */}
                  {isCleared ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>완료</span>
                    </div>
                  ) : isUnlocked ? (
                    <span className="text-xs font-medium text-amber-400">
                      도전 가능
                    </span>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Lock className="h-3.5 w-3.5" />
                      <span>잠김</span>
                    </div>
                  )}
                </div>

                {/* Subtitle & Title */}
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {stage.subtitle}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
                  {stage.description}
                </p>

                {/* Star Rating if Cleared */}
                {isCleared && (
                  <div className="mt-3 flex items-center gap-1">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`h-4 w-4 ${
                          starIdx <= progress.stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-[11px] text-slate-400 tabular-nums">
                      최고 {progress.highScore.toLocaleString()}점
                    </span>
                  </div>
                )}

                {/* Key Events bullets */}
                <div className="mt-4 border-t border-slate-800/80 pt-3">
                  <span className="text-[11px] font-medium text-slate-400">
                    핵심 출제 테마
                  </span>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-400">
                    {stage.keyEvents.slice(0, 3).map((event, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                        <span className="text-amber-400/80">›</span>
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                {isUnlocked ? (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectStage(stage.id);
                    }}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-xs font-semibold transition-all ${
                      isCleared
                        ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold shadow-md shadow-amber-500/10'
                    }`}
                  >
                    <span>{isCleared ? '다시 도전' : '시대 입장'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 py-2.5 text-xs text-slate-500">
                    <Lock className="h-3.5 w-3.5" />
                    <span>이전 시대 클리어 필요</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
