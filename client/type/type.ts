export interface User {
  name: string;
  image?: string;
  email: string;
}

//스터디페이지 조회
export interface studyPageData {}

//내공부페이지 쿼리값가져올때 props

export interface NicknamePropsType {
  params: { nickname: string };
  searchParams: {};
  //추가 가능성있음
}

// [피드] 모든 팔로워 정보
export interface UserFeedData {
  feedId: number;
  nickname: string;
  image: string;
  content: string;
  type: string;
  date: Date;
  isLike: boolean;
}
[];

// [피드] 모든 팔로워 정보 props
export interface UserFeedProps {}

// [피드] 공통 부분 모듈화
export interface FeedItemProps {
  feed: UserFeedData;
  index: number;
  handleLike: (index: number) => void;
  children?: ReactNode;
}

// [피드] props
export interface FeedContentProps {
  feedData?: UserFeedData[];
  initialFeedData: UserFeedData[]; // temp
  handleLike: (index: number) => void;
}

// 타이머
export interface TimerState {
  studyStatus?: string;
  startPoint?: number;
  savedStudyTime?: number;
}

export interface StateValue {
  content: string;
  error: string;
}

// [Nav] Left 요청 받아온 데이터
export interface HeaderLeftData {
  content: string[];
  // timer fields
}

// [Nav] 카테고리
export interface Categories {
  href: string;
  text: string;
  svgComponent: React.ReactNode;
}

// [Nav] 투두 props
export interface TodoHeaderProps {
  content: string[];
}
