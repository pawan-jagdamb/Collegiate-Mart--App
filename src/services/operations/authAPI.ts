import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { Toast } from 'toastify-react-native';

import { AppDispatch } from '../../redux/store/store';
import { setLoading, setToken } from '../../redux/slice/authSlice';
import { setUser as setProfileUser } from '../../redux/slice/profileSlice';
import {
  resetUserState,
  setAuthUser,
  setOtherUsers,
  signInSuccess,
  signInFailure,
  signInStart,
} from '../../redux/slice/userSlice';
import { apiConnector } from '../apiConnector';
import { endpoints } from '../apis';

type GenericUser = Record<string, unknown>;

const { SENDOTP_API, SIGNUP_API, LOGIN_API, RESETPASSTOKEN_API, RESETPASSWORD_API, LOGOUT_API, BASE_URL } = endpoints;

type NavigateFn = (route: string) => void;

export const sendOtp =
  (email: string, navigate: NavigateFn) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    Toast.info('Sending OTP...');
    try {
      const response = await apiConnector('POST', SENDOTP_API, { email, checkUserPresent: true });
      const data = response.data as { success: boolean; message?: string };
      console.log("Data in response",data)
      if (!data.success) {
        console.log("Data in response not success",response)
        throw new Error(data.message);
      }
      Toast.success('OTP sent successfully');
      navigate('VerifyEmail');
    } catch (error: any) {
        console.log(error)
      const message = error?.response?.data?.message ?? 'Failed to send OTP';
      Toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const signUp =
  (
    userName: string,
    email: string,
    password: string,
    confirmPassword: string,
    otp: string,
    navigate: NavigateFn,
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    Toast.info('Signing up...');
    try {
      const response = await apiConnector('POST', SIGNUP_API, {
        userName,
        email,
        password,
        confirmPassword,
        otp,
      });
      const data = response.data as { success: boolean; message?: string };
      if (!data.success) {
        throw new Error(data.message);
      }
      Toast.success('Signup successful');
      navigate('Login');
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Signup failed';
      Toast.error(message);
      navigate('Signup');
    } finally {
      dispatch(setLoading(false));
    }
  };

export const login =
  (email: string, password: string, navigate: NavigateFn) => async (dispatch: AppDispatch) => {
    dispatch(signInStart());
    console.log('Login request:', email, password);
    dispatch(setLoading(true));
    // Toast.info('Logging in...');
    console.log('1')
    try {
        console.log('2')

    // const response1 = await axios.post('http://192.168.1.5:5000/health');
    // console.log("Response from health check",response1)
    // return
      const response = await apiConnector('POST', LOGIN_API, { email, password });
      const data = response.data as { success: boolean; token: string; user: GenericUser };
      console.log('Login response:', data);
      if (!data.success) {

        console.log("Login failed",data)
        throw new Error('Login failed');
      }
      const otherUsersResponse = await axios.get(`${BASE_URL}/v1/user/`);
      dispatch(setOtherUsers(otherUsersResponse.data));

      const { token, user } = data;
      dispatch(setToken(token));
      dispatch(signInSuccess(user));
      dispatch(setProfileUser(user));
      dispatch(setAuthUser(user));

      await Keychain.setGenericPassword('auth', token, {
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
      await AsyncStorage.setItem('user', JSON.stringify(user));

      Toast.success('Login successful');
      navigate('Drawer');
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Login failed';
      console.log("Error in login",error)
      dispatch(signInFailure(message));
      Toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const logout =
  (navigate: NavigateFn) => async (dispatch: AppDispatch) => {
    dispatch(signInStart());
    Toast.info('Signing out...');
    try {
      const response = await apiConnector('GET', LOGOUT_API);
      const data = response.data as { success: boolean; message?: string };
      if (!data.success) {
        throw new Error(data.message);
      }

      dispatch(setToken(null));
      dispatch(resetUserState());
      dispatch(signInSuccess(null));
      await Keychain.resetGenericPassword();
      await AsyncStorage.multiRemove(['persist:root', 'user']);

      Toast.success(data.message ?? 'Signed out');
      navigate('Start');
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Logout failed';
      dispatch(signInFailure(message));
      Toast.error(message);
    }
  };

export const getPasswordResetToken =
  (email: string, setEmailSent: (value: boolean) => void) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    Toast.info('Sending reset link...');
    try {
      const response = await apiConnector('POST', RESETPASSTOKEN_API, { email });
      const data = response.data as { success: boolean; message?: string };
      if (!data.success) {
        throw new Error(data.message);
      }
      Toast.success('Reset email sent');
      setEmailSent(true);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to send reset email';
      Toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const resetPassword =
  (password: string, confirmPassword: string, token: string, navigate?: NavigateFn) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    Toast.info('Resetting password...');
    try {
      const response = await apiConnector('POST', RESETPASSWORD_API, { password, confirmPassword, token });
      const data = response.data as { success: boolean; message?: string };
      if (!data.success) {
        throw new Error(data.message);
      }
      Toast.success(data.message ?? 'Password reset successful');
      if (navigate) {
        navigate('Login');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Password reset failed';
      Toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

