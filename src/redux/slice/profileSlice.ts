import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ProfileState {
  user: Record<string, unknown> | null;
  loading: boolean;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Record<string, unknown> | null>) {
      state.user = action.payload;
    },
    setProfileLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    resetProfile(state) {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setUser, setProfileLoading, resetProfile } = profileSlice.actions;

export default profileSlice.reducer;

