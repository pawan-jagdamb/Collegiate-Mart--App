// export const BASE_URL = "http://192.168.1.5:5000/api";

// Collegiate Mart
// Backend :https://collegiate-mart-backend.onrender.com
// Frontend : https://collegiate-mart-frontend.onrender.com

export const BASE_URL = "http://localhost:5000/api";

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
