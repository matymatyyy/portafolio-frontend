import { get, post } from '@/utils/api'
import type { CvResponse } from '@/types/cv'

export const cvService = {
  async upload(file: File): Promise<CvResponse> {
    const form = new FormData()
    form.append('file', file)
    return post<CvResponse>('/api/cv', form)
  },

  async getInfo(): Promise<CvResponse | null> {
    try {
      return await get<CvResponse>('/api/cv/status')
    } catch {
      return null
    }
  },

  downloadUrl(): string {
    return `${import.meta.env.VITE_API_URL}/api/cv`
  },
}
