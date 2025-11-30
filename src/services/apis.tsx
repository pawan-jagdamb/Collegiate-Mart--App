// For Android with ADB port forwarding - localhost works after running: adb reverse tcp:5000 tcp:5000
// export const BASE_URL = "http://localhost:5000/api";

// For iOS Simulator - localhost works:
// export const BASE_URL = "http://localhost:5000/api";

// For physical device - use your computer's local IP address
// Make sure your device and computer are on the same WiFi network
// export const BASE_URL = "http://10.225.4.66:5000/api";

// For production/deployed backend (uncomment to use):
export const BASE_URL = "https://collegiate-mart-backend.onrender.com/api";

// Collegiate Mart
// Backend :https://collegiate-mart-backend.onrender.com
// Frontend : https://collegiate-mart-frontend.onrender.com

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
    GET_LISTING:BASE_URL+'/listing/get',
    GOOGLE_AUTH: BASE_URL+'/auth/google',
    UPDATE_USER:BASE_URL+'/user/update',
    DELETE_USER:BASE_URL+'/user/delete',
    SEND_MESSAGE: BASE_URL + '/v1/message/send',
    GET_MESSAGES: BASE_URL + '/v1/message/get',
  } 
