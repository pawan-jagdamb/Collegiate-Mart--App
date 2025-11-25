import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  signupData: Record<string, unknown> | null;
  loading: boolean;
  token: string | null;
}

const initialState: AuthState = {
  signupData: null,
  loading: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSignupData(state, action: PayloadAction<Record<string, unknown> | null>) {
      state.signupData = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    resetAuthState(state) {
      state.signupData = null;
      state.loading = false;
      state.token = null;
    },
  },
});

export const { setSignupData, setLoading, setToken, resetAuthState } = authSlice.actions;

export default authSlice.reducer;

