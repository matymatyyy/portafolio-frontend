import { get, post } from '@/utils/api'
import type { VisitStats, RegisterVisitResponse } from '@/types/visit'

export const visitService = {
  register(page: string): Promise<RegisterVisitResponse> {
    return post<RegisterVisitResponse>('/api/visits', { page })
  },

  getStats(days = 30): Promise<VisitStats> {
    return get<VisitStats>('/api/visits/stats', { params: { days } })
  },
}
