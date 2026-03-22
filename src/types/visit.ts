export interface VisitStats {
  total_visits: number
  unique_visitors: number
  visits_by_page: Record<string, number>
  visits_by_day: Array<{ date: string; count: number }>
  top_referrers: Array<{ referrer: string; count: number }>
}

export interface RegisterVisitResponse {
  id: string
  visited_at: string
}
