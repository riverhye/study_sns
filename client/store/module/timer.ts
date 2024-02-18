import { TimerState } from '@/type/type';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const timerSlice = createSlice({
  name: 'timer',
  initialState: {
    studyStatus: '',
    startPoint: 0,
    savedStudyTime: 0,
  } as TimerState,
  reducers: {
    setReduxTimer: (state, action: PayloadAction<TimerState>) => {
      state.studyStatus = action.payload.studyStatus ?? state.studyStatus;
      state.startPoint = action.payload.startPoint ?? state.startPoint;
      state.savedStudyTime = action.payload.savedStudyTime ?? state.savedStudyTime;
    },
    resetReduxTimer: () => {
      return { studyStatus: '', startPoint: 0, savedStudyTime: 0 };
    },
  },
});

export const { setReduxTimer, resetReduxTimer } = timerSlice.actions; // 액션 생성 함수
export default timerSlice.reducer; // 리듀서
