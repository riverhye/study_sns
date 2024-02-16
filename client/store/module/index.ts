// // rootReducer
// // modules 내에서 정의한 모듈들을 합쳐주는 역할

// // next-redux-wrapper 는 유저가 페이지를 요청할때마다 리덕스 스토어를 생성해야 하기 때문에 makeStore 함수를 정의해서 넘겨줘야함

// import { combineReducers } from 'redux';
// import { HYDRATE } from 'next-redux-wrapper';

// import date from './date';

// // 액션 객체의 타입
// interface Action {
//   type: string;
//   payload?: any;
// }

// interface RootState {
//   date?: {
//     date: string;
//   };
//   // 다른 리듀서 모듈이 있을 경우 이곳에 추가해야 함
// }
// const reducer = (state: RootState | undefined, action: Action) => {
//   if (!state) {
//     state = {}; // 초기 상태를 정의
//   }

//   if (action.type === HYDRATE) {
//     // SSR 작업 수행 시 HYDRATE 라는 액션을 통해서 서버의 스토어와 클라이언트의 스토어를 합쳐주는 작업을 수행
//     return {
//       ...state,
//       ...action.payload,
//     };
//   }
//   return combineReducers({
//     // 정의한 리듀서 모듈들을 결합
//     date,
//     // 리듀서 모듈(slice)을 추가할 때마다 combineReducers 함수의 인자로 전달되는 객체 내부에 추가해줘야함
//   })(state, action as any);
// };

// export default reducer;
