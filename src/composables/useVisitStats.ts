import { ref } from 'vue'
import { visitService } from '@/services/visitService'
import type { VisitStats } from '@/types/visit'

export function useVisitStats() {
  const stats = ref<VisitStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const days = ref(30)

  async function fetchStats() {
    loading.value = true
    error.value = null
    try {
      stats.value = await visitService.getStats(days.value)
    } catch {
      error.value = 'Failed to load visitor stats.'
    } finally {
      loading.value = false
    }
  }

  async function setDays(d: number) {
    days.value = d
    await fetchStats()
  }

  return { stats, loading, error, days, fetchStats, setDays }
}
