# 공부 알림 SNS
타임라인 기반 공부 SNS
- 개발 기간 : 2024-02-13 ~ 2024-02-29 (약 2주)
- 6인 팀 프로젝트 : 프론트 엔드 3명, 백엔드 3명
<br />

## 팀 구성
|김종빈(BE)|명길식(BE)|박윤혜(FE)|박지원(FE)|이병진(BE)|조연주(FE)|
|---|---|---|---|---|---|
|![종빈](https://github.com/sanppi/talent_market/assets/77149171/953c7199-7fd8-4e02-ae19-a277896a8f7a)|![길식](https://github.com/sanppi/talent_market/assets/77149171/5f1d9421-1685-4299-8dc0-d15fe31dba82)|![윤혜](https://github.com/sanppi/talent_market/assets/77149171/d7b7b5ee-336b-49f2-ad10-a516797a2b60)|![지원](https://github.com/sanppi/talent_market/assets/77149171/c45f495e-373f-4f86-9d3b-63f0df3b3cf2)|![병진](https://github.com/riverhye/study_sns/assets/143552237/39769900-c762-4cf6-8fb3-3c07b808fbd1)|![연주](https://github.com/sanppi/talent_market/assets/77149171/3247e800-50f4-45ba-a9ff-dbaeb5e9db6e)|
|[@kjb990202](https://github.com/kjb990202)|[@KrillM](https://github.com/KrillM)|[@riverhye](https://github.com/riverhye)|[@zyam1](https://github.com/zyam1)|[@blee94](https://github.com/blee94)|[@J-Yeonju](https://github.com/J-Yeonju)
|종빈 내용|회원가입, 로그인, 회원정보 수정, Spring Security, JWT Token, 검색|Websocket / 슬라이드 / To Do 리스트 헤더 연동|지원 내용|Websocket / 피드 / 팔로우 / 좋아요|로그인, 회원가입, 회원정보 수정|

- Notion으로 일별 회고 작성 및 트러블 슈팅

<br />

## 개발환경
### Front
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"><img src="https://img.shields.io/badge/nextjs-000000?style=for-the-badge&logo=react&logoColor=white"><img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=react&logoColor=black"><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=white">

### Back
<img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=Node.js&logoColor=white"><img src="https://img.shields.io/badge/java-FF6600?style=for-the-badge&logo=express&logoColor=white"><img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

### Collaborate & Tools
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"><img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"><img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">

<br />

## 개발 포인트
### 1. 컴포넌트 모듈화
- 사전 회의를 통해 공통 부분이 있는 컴포넌트를 하나로 작성해 코드 재사용성을 높이고자 했습니다.
- 스톱워치를 다른 컴포넌트에서도 재사용할 수 있게 커스텀훅으로 만들었습니다. (useTimer, useTimerFunc)

### 2. 새 기술 사용
**2-1. SSR 프레임워크 Next.js**
- 지난 프로젝트에서 **초기 렌더링 속도**가 느린 리액트의 한계를 느껴 리액트 기반의 SSR 프레임워크인 Next.js를 사용했습니다.
- **메타데이터를 활용해 SEO를 고려**했습니다.
- 14 버전에서 제공하는 Loading UI를 사용해 페이지 로딩 시간이 길 경우를 대비했습니다.

**2-2. 유틸리티 CSS tailwind**
- 유틸리티 퍼스트 CSS 프레임워크인 tailwind를 사용하여 **목적에 맞는 코드 작성에 집중**했습니다.
- 공통 설정을 config 파일에 추가하여 **일관된 스타일링**을 유지하려고 했습니다.

### 3. 웹소켓 : 실시간 알림
- 단순 알림 기능 구현이 목표라서 상대적으로 가벼운 Websocket API을 사용했습니다.
- Websocket API는 헤더에 값을 담을 수 없어서 **쿼리스트링으로 토큰을 전달해 로그인 시 소켓을 오픈**했습니다.
- **쿼리스트링으로 JWT 토큰값 전달**하고, **JSON 형식으로 역직렬화/직렬화**하여 데이터를 송수신했습니다.

<br />

## ERD
<img width="1000" alt="erd" src="https://github.com/riverhye/study_sns/assets/77149171/7693d94a-4e83-4a2f-8cea-b8b3368cd0f0">

<br />
<br />

# 화면 구조도 및 기능
##  [헤더]
<img width="800" alt="타이머 시작" src="https://github.com/riverhye/study_sns/assets/77149171/d4653113-9b7b-4199-898b-d73e1ae0b986">
<img width="800" alt="닉네임 hover" src="https://github.com/riverhye/study_sns/assets/77149171/93d7c8af-4ea5-42f6-a788-1f85b7daf786">

**[Left]**
- 카테고리 클릭 시 UX를 고려하여 해당하는 아이콘의 색이 채워짐
- ‘내 공부’에서 Todo 생성/삭제하면 To Do 리스트에도 실시간 반영
- 공부 내용 입력 후 START 클릭 시 타이머 동작
    - 타이머 시작 or 정지 → 웹소켓으로 실시간 통신 내용이 메인에 표시
- 톱니바퀴 아이콘 hover 시 정보 수정/로그아웃 페이지 이동

**[Top]**
- hover 시 누적 공부 시간이 높은 순으로 유저 10명 슬라이더(`Swiper.js`)로 표시

## [로그인]
<img width="800" alt="홈(로그인x)" src="https://github.com/riverhye/study_sns/assets/77149171/20404a6d-b855-4606-8c69-263408735aaf">

- 회원정보가 존재한다면 토큰을 받아 로그인 구현
- 토큰을 활용하여 서버의 부하를 줄여줌

## [회원가입]
<img width="800" alt="회원가입" src="https://github.com/riverhye/study_sns/assets/77149171/c91973f3-fccc-450e-823c-e0fc34b2f9d9">

- 존재하는 회원의 이메일일 경우 회원가입 불가
  
## [메인]
<img width="800" alt="홈(피드x)" src="https://github.com/riverhye/study_sns/assets/77149171/a084cebc-77c9-4026-bba1-31a910b700d0">
<img width="800" alt="타이머 끝" src="https://github.com/riverhye/study_sns/assets/77149171/c9f719bb-e7ef-4162-aef4-7bb3893ce832">

- 자신의 공부 상태(시작, 끝)를 모아볼 수 있는 공간
- 현재 시각을 기준으로 작성일 표시
- 스톱워치 상태(시작, 일시정지, 끝)에 따라 아이콘을 다르게 적용

## [검색]
<img width="800" alt="검색" src="https://github.com/riverhye/study_sns/assets/77149171/2caa4061-3098-4fd6-a0cc-550afe40c5c9">

- 검색 키워드를 포함하고 있는 사용자를 불러옴


## [랭킹]
<img width="800" alt="랭킹" src="https://github.com/riverhye/study_sns/assets/77149171/7ec8ee5a-6091-41d1-96ea-f76597820ac8">

- 내용


## [내 공부]
<img width="800" alt="내공부" src="https://github.com/riverhye/study_sns/assets/77149171/6f587aff-f8e8-4b42-9675-c4e0cb089be9">

- 내용

## [회원정보 수정]
<img width="800" alt="정보수정" src="https://github.com/riverhye/study_sns/assets/77149171/18066f72-2c09-4e9a-aeaa-4f3d83f79f6f">

- 존재하는 닉네임이 있을 경우 회원정보 수정 불가


# 시연 영상
https://github.com/riverhye/study_sns/assets/77149171/8d1281d2-20c2-438e-aab2-b1ff8246397f

