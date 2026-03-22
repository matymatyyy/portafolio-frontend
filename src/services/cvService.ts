import axios from 'axios'
import type { CvResponse } from '@/types/cv'

const baseURL = import.meta.env.VITE_API_URL as string

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const cvService = {
  async upload(file: File): Promise<CvResponse> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await axios.post<CvResponse>(`${baseURL}/api/cv`, form, {
      headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async getInfo(): Promise<CvResponse | null> {
    try {
      const { data } = await axios.get<CvResponse>(`${baseURL}/api/cv/status`, {
        headers: authHeaders(),
      })
      return data
    } catch {
      return null
    }
  },

  downloadUrl(): string {
    return `${baseURL}/api/cv`
  },
}
