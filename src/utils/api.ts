import axios, { type AxiosInstance, type AxiosRequestConfig, AxiosError } from 'axios'
import type { ApiError } from '@/types/api'

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? (import.meta.env.VITE_API_URL as string) : '',
  timeout: 30_000,
})

// Attach JWT on every request if present
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalize error responses
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const isLoginRequest = error.config?.url?.includes('/api/login')
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    const message =
      error.response?.data?.message ?? error.message ?? 'Unexpected error'
    return Promise.reject(new Error(message))
  },
)

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await http.get<T>(url, config)
  return data
}

export async function post<T>(url: string, payload?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await http.post<T>(url, payload, config)
  return data
}

export async function put<T>(url: string, payload?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await http.put<T>(url, payload, config)
  return data
}

export async function del<T>(url: string): Promise<T> {
  const { data } = await http.delete<T>(url)
  return data
}
