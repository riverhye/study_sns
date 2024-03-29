import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    token: '',
    nickname: '',
  },
  reducers: {
    setReduxToken: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
      state.nickname = action.payload.nickname;
    },
    resetReduxToken: state => {
      state.token = '';
      state.nickname = '';
    },
  },
});

export const { setReduxToken, resetReduxToken } = tokenSlice.actions; // 액션 생성 함수
export default tokenSlice.reducer; // 리듀서
