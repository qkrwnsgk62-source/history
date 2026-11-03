/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/sound';

interface TimelineSummaryModalProps {
  onClose: () => void;
}

const TIMELINE_DATA = [
  {
    era: '1. 선사 시대',
    period: '기원전 ~ 초기 철기',
    items: [
      { year: '구석기', title: '이동 생활 & 뗀석기', desc: '동굴·막집 거주, 슴베찌르개·주먹도끼 사용, 무리·평등 사회' },
      { year: '신석기 (BC 8000경)', title: '농경 시작 & 정착 생활', desc: '움집, 빗살무늬 토기, 가락바퀴·뼈바늘(원시 수공업), 조·피 경작' },
      { year: '청동기 (BC 2000~1500경)', title: '계급 발생 & 군장 국가', desc: '비파형 동검, 거푸집, 반달 돌칼(농경 수확), 고인돌, 미송리식 토기' },
      { year: '초기 철기 (BC 5세기경)', title: '철제 농기구 & 독자적 청동기', desc: '세형 동검(한국식 동검), 잔무늬 거울, 명도전·반량전(중국 교류)' },
      { year: 'BC 2333 ~ BC 108', title: '고조선의 성장과 한사군', desc: '단군왕검 건국, 8조법(범금 8조), 위만 집권(BC 194), 한 무제 침공 및 우거왕 전사' },
    ],
  },
  {
    era: '2. 고대 (삼국 ~ 남북국)',
    period: '4세기 ~ 10세기',
    items: [
      { year: '372년 (소수림왕)', title: '고구려 국가 체제 정비', desc: '불교 공인, 율령 반포, 태학 설립으로 중앙 집권화' },
      { year: '4세기 후반 (근초고왕)', title: '백제 전성기 & 고흥 『서기』', desc: '마한 정복, 평양성 공격 고국원왕 전사, 요서·산둥·규슈 진출' },
      { year: '5세기 (광개토·장수왕)', title: '고구려 전성기 & 평양 천도', desc: '신라 침입 왜 격퇴(호우명 그릇), 남진 정책(427), 한강 유역 장악' },
      { year: '6세기 (지증·법흥·진흥왕)', title: '신라의 팽창과 한강 점령', desc: '지증왕(우산국 복속, 동시전), 법흥왕(병부, 율령, 건원), 진흥왕(화랑도, 순수비)' },
      { year: '660 ~ 676년', title: '나·당 전쟁과 삼국 통일', desc: '황산벌 전투(660) → 백강 전투(663) → 매소성·기벌포 전투(675·676) 승리' },
      { year: '698 ~ 926년', title: '발해의 건국과 해동성국', desc: '대조영 동모산 건국, 무왕(등주 공격), 문왕(3성6부), 선왕(해동성국)' },
    ],
  },
  {
    era: '3. 고려 시대',
    period: '918년 ~ 1392년',
    items: [
      { year: '918 ~ 936년', title: '고려 건국과 후삼국 통일', desc: '왕건 건국(918), 공산 전투(927) → 고창 전투(930) → 일리천 전투 승리 통일(936)' },
      { year: '956 ~ 958년 (광종)', title: '왕권 강화와 관제 정비', desc: '노비안검법(956), 과거제 도입(쌍기 건의 958), 광덕·준풍 연호' },
      { year: '982년 (성종)', title: '유교 정치 체제 확립', desc: '최승로 시무 28조 수용, 12목 지방관 파견, 국자감 정비' },
      { year: '993 ~ 1019년', title: '거란 침입 격퇴', desc: '서희의 외교 담판(강동 6주 획득 993) → 강감찬의 귀주 대첩(1019)' },
      { year: '1107 ~ 1170년', title: '여진 정벌과 무신 정변', desc: '윤관 별무반 & 동북 9성(1107) → 정중부 무신정변(1170) → 최충헌 교정도감' },
      { year: '1231 ~ 1374년', title: '대몽 항쟁과 공민왕 개혁', desc: '강화도 천도, 처인성 전투(1232), 삼별초 항쟁 → 공민왕 신돈 등용 전민변정도감' },
    ],
  },
  {
    era: '4. 조선 전기',
    period: '1392년 ~ 16세기 말',
    items: [
      { year: '1392년', title: '조선 건국과 한양 천도', desc: '태조 이성계 건국, 정도전 『조선경국전』, 한양 천도(1394)' },
      { year: '1400 ~ 1418년 (태종)', title: '왕권 강화와 호패법', desc: '6조 직계제, 사병 혁파, 사간원 독립, 호패법 실시' },
      { year: '1418 ~ 1450년 (세종)', title: '민족 문화의 황금기', desc: '집현전 설치, 훈민정음 창제(1443), 공법(전분6등·연분9등), 『농사직설』' },
      { year: '1455 ~ 1494년 (세조·성종)', title: '직전법과 경국대전 완성', desc: '세조 직전법(현직만 수조권), 성종 홍문관 설치 및 『경국대전』 반포(1485)' },
      { year: '1498 ~ 1545년', title: '4대 사화의 전개', desc: '무오사화(조의제문) → 갑자사화(폐비 윤씨) → 기묘사화(조광조 위훈삭제) → 을사사화(외척)' },
      { year: '1592 ~ 1598년', title: '임진왜란과 정유재란', desc: '동래성 함락 → 한산도 대첩(1592) → 평양성 탈환(1593) → 훈련도감 창설 → 명량·노량 해전' },
    ],
  },
  {
    era: '5. 조선 후기',
    period: '17세기 ~ 19세기 중엽',
    items: [
      { year: '1608 ~ 1623년 (광해군)', title: '전란 수습과 기유약조', desc: '대동법 최초 시행(경기도), 『동의보감』 편찬, 기유약조(1609 대일교역 재개)' },
      { year: '1627, 1636년', title: '정묘호란과 병자호란', desc: '인조반정 후 친명배금 → 정묘호란(형제 맹약) → 병자호란(남한산성 삼전도 굴욕)' },
      { year: '1659 ~ 1694년 (현종·숙종)', title: '예송 논쟁과 환국 정치', desc: '기해·갑인예송(복상 기간) → 경신·기사·갑술환국(서인-남인 정권 교체)' },
      { year: '1724 ~ 1800년 (영조·정조)', title: '탕평 정치와 실학 발전', desc: '영조 균역법(결작 부과)·탕평비 → 정조 규장각·장용영·수원화성·신해통공(금난전권 철폐)' },
      { year: '1800 ~ 1863년', title: '세도 정치와 농민 봉기', desc: '안동 김씨·풍양 조씨 세도, 삼정의 문란, 홍경래의 난(1811) → 임술 농민 봉기(1862 진주)' },
    ],
  },
  {
    era: '6. 근대 개항기',
    period: '1863년 ~ 1910년',
    items: [
      { year: '1863 ~ 1873년 (흥선대원군)', title: '대내 개혁과 통상 수교 거부', desc: '경복궁 중건(당백전), 호포제, 서원 철폐(47개소 남김), 병인·신미양요, 척화비' },
      { year: '1876년', title: '강화도 조약(조·일 수호 조규)', desc: '운요호 사건 계기, 최초의 불평등 조약(해안 측량권, 치외법권, 3개항 개항)' },
      { year: '1880 ~ 1884년', title: '개화 추진과 갑신정변', desc: '통리기무아문(1880), 임오군란(1882) → 갑신정변 14개조 정강(1884 호조 재정 일원화)' },
      { year: '1894 ~ 1895년', title: '동학 농민 운동과 갑오개혁', desc: '고부민란 → 전주화약(집강소) → 갑오개혁(신분제 폐지, 과거제 폐지) → 을미사변(1895)' },
      { year: '1897 ~ 1910년', title: '대한 제국과 국권 피탈', desc: '환구단 황제 즉위(광무개혁, 지계 발급), 을사늑약(1905) → 헤이그 특사(1907) → 경술국치(1910)' },
    ],
  },
  {
    era: '7. 일제 강점기',
    period: '1910년 ~ 1945년',
    items: [
      { year: '1910년대 (무단 통치)', title: '헌병 경찰과 토지 조사 사업', desc: '조선 총독부, 조선 태형령, 회사령(허가제), 105인 사건(신민회 해체)' },
      { year: '1919년', title: '3·1 만세 운동과 대한민국 임시정부', desc: '2·8 독립선언(도쿄), 기미독립선언서, 상하이 대한민국 임시정부 수립(연통제·교통국)' },
      { year: '1920년대 (문화 통치 & 투쟁)', title: '독립 전쟁과 민족 유일당', desc: '봉오동·청산리 대첩(1920), 신간회 결성(1927), 광주 학생 항일 운동(1929)' },
      { year: '1931 ~ 1938년', title: '의열 투쟁과 중국 관내 부대', desc: '한인 애국단(이봉창·윤봉길 1932), 조선 의용대 창설(김원봉 1938 한커우)' },
      { year: '1940 ~ 1945년', title: '민족 말살 통치와 한국광복군', desc: '황국 신민화·창씨개명·징용, 한국광복군 창설(1940 충칭), 대일 선전포고 및 국내 진공 작전 준비' },
    ],
  },
  {
    era: '8. 현대',
    period: '1945년 ~ 21세기',
    items: [
      { year: '1945 ~ 1948년', title: '광복과 대한민국 정부 수립', desc: '8·15 광복, 모스크바 3상 회의(1945.12), 좌우합작 7원칙, 5·10 총선거 → 대한민국 정부 수립(1948.8.15)' },
      { year: '1950 ~ 1953년', title: '6·25 전쟁과 한·미 상호 방위 조약', desc: '북한 기습 남침(1950.6.25) → 인천 상륙 작전 → 흥남 철수 → 정전 협정(1953.7.27)' },
      { year: '1960년', title: '4·19 혁명과 장면 내각', desc: '3·15 부정선거 항거, 이승만 하야, 제3차 개헌(의원 내각제·양원제 국회)' },
      { year: '1970 ~ 1987년', title: '민주화 운동의 횃불', desc: '전태일 분신(1970), 유신 체제(1972) → 5·18 광주 민주화 운동(1980) → 6월 민주 항쟁 & 6·29 선언(1987 대통령 직선제)' },
      { year: '1991년 ~ 현재', title: '남북 화해와 평화 통일의 길', desc: '남북한 UN 동시 가입(1991), 남북 기본 합의서(1991), 6·15 남북 공동 선언(2000)' },
    ],
  },
];

export const TimelineSummaryModal: React.FC<TimelineSummaryModalProps> = ({ onClose }) => {
  const [activeEraTab, setActiveEraTab] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                한국사 8대 시대 핵심 연표 총정리
              </h2>
              <p className="text-xs text-slate-400">
                한능검 심화 시험에 반드시 출제되는 시대별 사건 흐름을 한눈에 살펴보세요
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

        {/* Era Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-800/80 bg-slate-950/40 px-5 py-2.5 text-xs">
          {TIMELINE_DATA.map((data, idx) => (
            <button
              key={idx}
              onClick={() => {
                sound.playClick();
                setActiveEraTab(idx);
              }}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeEraTab === idx
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {data.era}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="mb-4">
            <span className="font-serif text-base font-bold text-amber-300">
              {TIMELINE_DATA[activeEraTab].era}
            </span>
            <span className="ml-2 text-xs text-slate-400">
              ({TIMELINE_DATA[activeEraTab].period})
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800 pl-8">
            {TIMELINE_DATA[activeEraTab].items.map((item, idx) => (
              <div key={idx} className="relative rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="absolute -left-6.5 top-4.5 h-3 w-3 rounded-full border-2 border-cyan-400 bg-slate-950" />
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-serif text-sm font-bold text-white">
                    {item.title}
                  </span>
                  <span className="font-mono text-xs font-semibold text-cyan-400 tabular-nums">
                    {item.year}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
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
