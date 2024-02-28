import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const triggerSlice = createSlice({
  name: 'todoTrigger',
  initialState: {
    trigger: false,
  },
  reducers: {
    setReduxTrigger: (state, action: PayloadAction<any>) => {
      state.trigger = action.payload;
    },
    resetReduxTrigger: state => {
      state.trigger = !state.trigger;
    },
  },
});

export const { setReduxTrigger, resetReduxTrigger } = triggerSlice.actions; // 액션 생성 함수
export default triggerSlice.reducer; // 리듀서
