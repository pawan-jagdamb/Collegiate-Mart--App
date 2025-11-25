import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type GenericUser = Record<string, unknown>;

export interface UserState {
  currentUser: GenericUser | null;
  error: unknown | null;
  loading: boolean;
  authUser: GenericUser | null;
  otherUsers: GenericUser[] | null;
  selectedUser: GenericUser | null;
  onlineUsers: GenericUser[] | null;
}

const initialState: UserState = {
  currentUser: null,
  error: null,
  loading: false,
  authUser: null,
  otherUsers: null,
  selectedUser: null,
  onlineUsers: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: state => {
      state.loading = true;
    },
    signInSuccess: (state, action: PayloadAction<GenericUser | null>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action: PayloadAction<unknown>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: state => {
      state.loading = true;
    },
    updateUserSuccess: (state, action: PayloadAction<GenericUser | null>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action: PayloadAction<unknown>) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: state => {
      state.loading = true;
    },
    deleteUserSuccess: state => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action: PayloadAction<unknown>) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: state => {
      state.loading = true;
    },
    signOutUserSuccess: state => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state, action: PayloadAction<unknown>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAuthUser: (state, action: PayloadAction<GenericUser | null>) => {
      state.authUser = action.payload;
    },
    setOtherUsers: (state, action: PayloadAction<GenericUser[] | null>) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<GenericUser | null>) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action: PayloadAction<GenericUser[] | null>) => {
      state.onlineUsers = action.payload;
    },
    resetUserState: state => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
      state.authUser = null;
      state.otherUsers = null;
      state.selectedUser = null;
      state.onlineUsers = null;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  setAuthUser,
  setOtherUsers,
  setSelectedUser,
  setOnlineUsers,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;

