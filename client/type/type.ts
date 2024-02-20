export interface User {
  name: string;
  image?: string;
  email: string;
}

//스터디페이지 조회
export interface studyPageData {}

// 유저 메인피드
export interface UserFeedData {
  nickname: string;
  image: string;
  content: string;
  type: string;
  date: Date;
  isLike: boolean;
}
[];

// 유저 메인피드 props
export interface UserFeedProps {}

export interface TimerState {
  studyStatus?: string;
  startPoint?: number;
  savedStudyTime?: number;
}

//내공부페이지 쿼리값가져올때 props

export interface NicknamePropsType {
  params: { nickname: string };
  searchParams: {};
  //추가 가능성있음
}
