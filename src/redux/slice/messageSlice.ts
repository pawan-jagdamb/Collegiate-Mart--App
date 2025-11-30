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
    addMessage: (state, action: PayloadAction<unknown>) => {
      if (state.messages === null) {
        state.messages = [action.payload];
      } else {
        state.messages = [...state.messages, action.payload];
      }
    },
    updateMessage: (state, action: PayloadAction<{ tempId: string; message: unknown }>) => {
      if (state.messages && Array.isArray(state.messages)) {
        state.messages = state.messages.map((msg: any) =>
          msg._id === action.payload.tempId ? action.payload.message : msg
        );
      }
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      if (state.messages && Array.isArray(state.messages)) {
        state.messages = state.messages.filter((msg: any) => msg._id !== action.payload);
      }
    },
    resetMessages: state => {
      state.messages = null;
    },
  },
});

export const { setMessages, addMessage, updateMessage, removeMessage, resetMessages } = messageSlice.actions;

export default messageSlice.reducer;

