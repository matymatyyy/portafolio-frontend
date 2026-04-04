import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types/api'

const MAX_RETRIES = 5
const BASE_DELAY = 3_000

function isRetryable(error: AxiosError): boolean {
  if (error.config?.method !== 'get') return false
  if (!error.response) return true // network error / timeout (backend still starting)
  return error.response.status >= 500
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? (import.meta.env.VITE_API_URL as string) : '',
  timeout: 60_000,
})

// Attach JWT on every request if present
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Retry GET requests on network errors / 5xx (handles backend cold start)
http.interceptors.response.use(undefined, async (error: AxiosError<ApiError>) => {
  const config = error.config as AxiosRequestConfig & { _retryCount?: number }
  if (config && isRetryable(error)) {
    config._retryCount = (config._retryCount ?? 0) + 1
    if (config._retryCount <= MAX_RETRIES) {
      await delay(BASE_DELAY * Math.pow(2, config._retryCount - 1))
      return http(config)
    }
  }
  return Promise.reject(error)
})

// Normalize error responses
http.interceptors.response.use(undefined, (error: AxiosError<ApiError>) => {
  const isLoginRequest = error.config?.url?.includes('/api/login')
  if (error.response?.status === 401 && !isLoginRequest) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  const message = error.response?.data?.message ?? error.message ?? 'Unexpected error'
  return Promise.reject(new Error(message))
})

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await http.get<T>(url, config)
  return data
}

export async function post<T>(
  url: string,
  payload?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await http.post<T>(url, payload, config)
  return data
}

export async function put<T>(
  url: string,
  payload?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await http.put<T>(url, payload, config)
  return data
}

export async function del<T>(url: string): Promise<T> {
  const { data } = await http.delete<T>(url)
  return data
}
