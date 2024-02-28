import { ReactNode } from 'react';

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

// [홈] 피드
export interface UserFeedData {
  action?: string;
  message: string;
  date: string;
  feedId?: number;
  nickname: string;
  profileImage: string | null;
  isLike?: boolean;
}
[];

// [홈] 모든 팔로워 정보 props
export interface UserFeedProps {}

// [홈/알림] 피드 공통 부분 모듈화한 컴포넌트
export interface FeedItemProps {
  feed: UserFeedData;
  children?: ReactNode;
  index: number;
  handleLike?: (index: number) => void;
}

// [홈/알림] FeedItem의 상위 컴포넌트 props
export interface FeedContentProps {
  feedData?: UserFeedData[];
  type?: string; // 좋아요 유무
  handleLike?: (index: number) => void;
}

// [홈] 공부 내용 input - error msg
export interface StateValue {
  content: string;
  error: string;
}

// [Nav-Left] 카테고리
export interface Categories {
  href: string;
  text: string;
  svgComponent: React.ReactNode;
}

// [Nav-Left] 리덕스용 타이머
export interface TimerState {
  studyStatus?: string;
  startPoint?: number;
  savedStudyTime?: number;
}

// [Nav-Left] 투두
export interface TodoContent {
  todoId: number;
  todoContent: string;
  todoDate: string;
  nickname: string;
  userId: number;
}
[];

// [Nav-Left] 타이머 아이콘 props
export interface TimerIconProps {
  onClick?: () => void;
}

// [Nav-Top] 팔로워 시간 랭킹
export interface FollowerRank {
  nickname: string;
  profileImage: string | null;
  todayStudyTime: number;
}
[];

export interface SocketMessage {
  action: string;
  feedId: number;
}
