import { PayloadAction, createSlice } from '@reduxjs/toolkit';

//slice:기존의 inital state 와 액션, 리듀서를 하나로 통합하여 만드는 도구
//리덕스 툴킷에는 기본적으로 immer 라는 라이브러리가 내장되어있어 기존에 불변성을 위해 사용되는 concat, map, filter 등을 사용하여 불변성을 관리할 필요없이 알아서 관리

const dateSlice = createSlice({
  name: 'date',
  initialState: {
    date: '',
  },
  reducers: {
    setReduxDate: (state, action: PayloadAction<any>) => {
      state.date = action.payload;
    },
  },
});

export const { setReduxDate } = dateSlice.actions; // 액션 생성 함수
export default dateSlice.reducer; // 리듀서
