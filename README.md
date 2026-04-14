# 🎵 Commit Sounds

> GitHub 커밋 히스토리를 음악으로 변환하는 Data Sonification 도구

[![Deploy to GitHub Pages](https://github.com/Dev-2A/commit-sounds/actions/workflows/deploy.yml/badge.svg)](https://github.com/Dev-2A/commit-sounds/actions/workflows/deploy.yml)

**[🎵 Live Demo →](https://dev-2a.github.io/commit-sounds/)**

## ✨ 주요 기능

### 🎹 커밋 → 음악 변환

- **커밋 시간 간격 → 리듬**: 빠른 커밋은 짧은 음표, 느린 커밋은 긴 음표
- **변경 파일 수 → 음높이**: 많은 파일을 수정할수록 높은 음
- **커밋 메시지 감정 → 장조/단조**: feat, add → 🌞 장조 / fix, bug → 🌙 단조
- **변경 규모 → 볼륨**: 큰 변경일수록 큰 소리

### 🎨 실시간 시각화

- **파티클 애니메이션**: 커밋 감정에 따라 다른 색상·모양·방향으로 파티클 폭발
- **타임라인 바**: 날짜별 그룹핑, 클릭으로 탐색, 재생 위치 추적
- **커밋 상세 패널**: 음악 매핑 정보 + 코드 변경 통계 실시간 표시

### 🎛️ 재생 컨트롤

- 재생 / 일시정지 / 정지
- 이전 / 다음 커밋 이동
- 속도 조절 (0.5x ~ 4x)
- 타임라인 클릭으로 특정 커밋 점프

### 🔀 레포 비교 모드

- 두 레포의 커밋을 **좌/우 스테레오 채널**로 동시 재생
- 레포 A는 triangle 음색 (왼쪽), 레포 B는 square 음색 (오른쪽)
- 커밋 수, 장조 비율, 평균 변경 규모 비교 통계

### 📊 통계 대시보드

- 감정 분포 (장조/단조 비율 링)
- 자주 등장하는 음표 Top 5
- 리듬 분포 (커밋 간격 패턴)
- 시간대별 히트맵 + 요일별 커밋 분포
- 가장 큰 커밋 하이라이트

## 🛠️ 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | React 19, Vite |
| Styling | Tailwind CSS v4 |
| Sound | Tone.js |
| API | GitHub REST API (Fetch) |
| Animation | Canvas API |
| Deploy | GitHub Pages + GitHub Actions |

## 🚀 로컬 실행

```bash
# 클론
git clone https://github.com/Dev-2A/commit-sounds.git
cd commit-sounds

# 의존성 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build
```

## 📁 프로젝트 구조

```text
src/
├── components/
│   ├── Player/          # 재생 컨트롤러
│   ├── Timeline/        # 타임라인 시각화
│   ├── Particles/       # 파티클 애니메이션
│   ├── RepoInput/       # 레포 입력 UI + 배지
│   ├── CommitDetail/    # 커밋 상세 패널
│   ├── Compare/         # 레포 비교 모드
│   ├── Stats/           # 통계 대시보드
│   └── Layout.jsx       # 전역 레이아웃
├── hooks/
│   ├── useCommits.js    # 커밋 데이터 페칭
│   ├── usePlayer.js     # 단일 재생 제어
│   └── useCompare.js    # 비교 모드 제어
├── services/
│   ├── github.js        # GitHub API 클라이언트
│   └── sound.js         # Tone.js 사운드 엔진
├── utils/
│   ├── sentiment.js     # 커밋 메시지 감정 분석
│   ├── mapper.js        # 커밋 → 음악 매핑
│   └── stats.js         # 통계 계산
├── constants/
│   ├── music.js         # 음계, 리듬, 색상 상수
│   └── sentiment.js     # 감정 키워드 사전
├── App.jsx
└── index.css
```

## 🎵 음악 매핑 규칙

| 커밋 속성 | 음악 요소 | 매핑 규칙 |
| --- | --- | --- |
| 커밋 시간 간격 | 리듬 (음표 길이) | < 10분: 16분음표 → > 1일: 온음표 |
| 변경 파일 수 | 음높이 | 1파일: C4 → 50+파일: C5 |
| 커밋 메시지 감정 | 장조/단조 | 긍정 키워드 → 장조, 부정 키워드 → 단조 |
| 코드 변경량 | 볼륨 | additions + deletions 비례 |

## ⚠️ 알려진 제한사항

- **GitHub API Rate Limit**: 비인증 요청은 시간당 60회로 제한됩니다
- **감정 분석**: 키워드 기반 휴리스틱으로, 100% 정확하지 않을 수 있습니다
- **변경 파일 수**: API 호출 절약을 위해 커밋 메시지 기반으로 추정합니다

## 📝 라이선스

MIT License

## 🧑‍💻 만든 사람

**Dev-2A** — [GitHub](https://github.com/Dev-2A)

> 🥤 Made with cola and 💙
