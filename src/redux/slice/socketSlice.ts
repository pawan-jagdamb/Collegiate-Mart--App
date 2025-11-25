import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface SocketState {
  socket: unknown | null;
}

const initialState: SocketState = {
  socket: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket(state, action: PayloadAction<unknown | null>) {
      state.socket = action.payload;
    },
    resetSocket(state) {
      state.socket = null;
    },
  },
});

export const { setSocket, resetSocket } = socketSlice.actions;

export default socketSlice.reducer;

