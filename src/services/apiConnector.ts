import axios, { AxiosRequestConfig, Method } from "axios"

export const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export const apiConnector = <T = unknown>(
  method: Method,
  url: string,
  bodyData?: AxiosRequestConfig["data"],
  headers?: AxiosRequestConfig["headers"],
  params?: AxiosRequestConfig["params"],
) => {
  // Merge headers properly
  const mergedHeaders = headers 
    ? { ...axiosInstance.defaults.headers.common, ...headers }
    : axiosInstance.defaults.headers.common;

  const requestConfig: AxiosRequestConfig = {
    method,
    url,
    data: bodyData ?? undefined,
    headers: mergedHeaders,
    params,
    timeout: 30000,
  }

  return axiosInstance.request<T>(requestConfig)
}