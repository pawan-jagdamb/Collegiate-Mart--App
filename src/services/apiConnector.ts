import axios, { AxiosRequestConfig, Method } from "axios"

export const axiosInstance = axios.create({})

export const apiConnector = <T = unknown>(
  method: Method,
  url: string,
  bodyData?: AxiosRequestConfig["data"],
  headers?: AxiosRequestConfig["headers"],
  params?: AxiosRequestConfig["params"],
) => {
  const requestConfig: AxiosRequestConfig = {
    method,
    url,
    data: bodyData ?? undefined,
    headers,
    params,
  }

  return axiosInstance.request<T>(requestConfig)
}