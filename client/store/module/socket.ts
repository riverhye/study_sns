// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { AppThunk } from '../store';
// import { w3cwebsocket } from 'websocket';

// interface WebSocketState {
//   socket: w3cwebsocket | null;
// }

// const initialState: WebSocketState = {
//   socket: null,
// };

// const webSocketSlice = createSlice({
//   name: 'webSocket',
//   initialState,
//   reducers: {
//     setSocket: (state, action: PayloadAction<w3cwebsocket | null>) => {
//       state.socket = action.payload;
//     },
//   },
// });

// export const { setSocket } = webSocketSlice.actions;

// export const initializeWebSocket = (): AppThunk => dispatch => {
//   const token = localStorage.getItem('accessToken');
//   const socket = new w3cwebsocket(`ws://localhost:8080/socket?token=${token}`);

//   socket.onopen = () => {
//     console.log('WebSocket Client Connected');
//     dispatch(setSocket(socket));
//   };

//   socket.onerror = (e: any) => {
//     console.log('Connection Error', e);
//   };

//   socket.onclose = () => {
//     console.log('Connection Closed');
//     dispatch(setSocket(null));
//   };
// };

// export default webSocketSlice.reducer;
