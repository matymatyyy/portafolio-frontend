import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { VisitStats } from '@/types/visit'

vi.mock('@/services/visitService', () => ({
  visitService: {
    getStats: vi.fn(),
    register: vi.fn(),
  },
}))

import { useVisitStats } from '@/composables/useVisitStats'
import { visitService } from '@/services/visitService'

const mockStats: VisitStats = {
  total_visits: 150,
  unique_visitors: 80,
  visits_by_page: { '/': 100, '/projects/1': 50 },
  visits_by_day: [
    { date: '2024-06-01', count: 10 },
    { date: '2024-06-02', count: 15 },
  ],
  top_referrers: [{ referrer: 'google.com', count: 40 }],
}

describe('useVisitStats', () => {
  beforeEach(() => {
    vi.mocked(visitService.getStats).mockReset()
  })

  it('initializes with default values', () => {
    const { stats, loading, error, days } = useVisitStats()
    expect(stats.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(days.value).toBe(30)
  })

  it('fetchStats populates stats', async () => {
    vi.mocked(visitService.getStats).mockResolvedValue(mockStats)

    const { stats, fetchStats } = useVisitStats()
    await fetchStats()

    expect(stats.value).toEqual(mockStats)
    expect(visitService.getStats).toHaveBeenCalledWith(30)
  })

  it('fetchStats handles errors', async () => {
    vi.mocked(visitService.getStats).mockRejectedValue(new Error('Server error'))

    const { error, fetchStats } = useVisitStats()
    await fetchStats()

    expect(error.value).toBe('Failed to load visitor stats.')
  })

  it('sets loading to true while fetching', async () => {
    let resolveStats: (value: VisitStats) => void
    vi.mocked(visitService.getStats).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveStats = resolve
        }),
    )

    const { loading, fetchStats } = useVisitStats()
    const promise = fetchStats()
    expect(loading.value).toBe(true)

    resolveStats!(mockStats)
    await promise
    expect(loading.value).toBe(false)
  })

  it('setDays updates days and refetches', async () => {
    vi.mocked(visitService.getStats).mockResolvedValue(mockStats)

    const { days, setDays } = useVisitStats()
    await setDays(7)

    expect(days.value).toBe(7)
    expect(visitService.getStats).toHaveBeenCalledWith(7)
  })

  it('clears previous error on successful fetch', async () => {
    vi.mocked(visitService.getStats).mockRejectedValueOnce(new Error('fail'))

    const { error, fetchStats } = useVisitStats()
    await fetchStats()
    expect(error.value).toBe('Failed to load visitor stats.')

    vi.mocked(visitService.getStats).mockResolvedValueOnce(mockStats)
    await fetchStats()
    expect(error.value).toBeNull()
  })
})
