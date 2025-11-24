import { Platform } from "react-native"

const ANDROID_LOCALHOST = "http://10.0.2.2:5000"
const DEFAULT_LOCALHOST = "http://localhost:5000"

const getBaseUrl = () => {
  const host = Platform.OS === "android" ? ANDROID_LOCALHOST : DEFAULT_LOCALHOST
  return `${host}/api`
}

export const BASE_URL = getBaseUrl()



export const endpoints = {
  BASE_URL,
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/signin",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    LOGOUT_API: BASE_URL+"/auth/signout",
    CREATE_LISTING:BASE_URL+ '/listing/create',
    SHOW_LISTING:BASE_URL+ '/user/listings',
    DELETE_LISTING:BASE_URL+'/listing/delete',
    GET_A_LISTING:BASE_URL+'/listing/get',
    UPDATE_LISTING:BASE_URL+'/listing/update',
    GET_USER:BASE_URL+ "/user",
    GET_LISTING:BASE_URL+'/listing',
    GOOGLE_AUTH: BASE_URL+'/auth/google',
    UPDATE_USER:BASE_URL+'/user/update',
    DELETE_USER:BASE_URL+'/user/delete',
  } 
