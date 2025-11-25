import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface MessageState {
  messages: unknown[] | null;
}

const initialState: MessageState = {
  messages: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<unknown[] | null>) => {
      state.messages = action.payload;
    },
    resetMessages: state => {
      state.messages = null;
    },
  },
});

export const { setMessages, resetMessages } = messageSlice.actions;

export default messageSlice.reducer;

