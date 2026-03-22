import { ref, computed } from 'vue'
import type { PaginationMeta } from '@/types/api'

export function usePagination(defaultLimit = 10) {
  const page = ref(1)
  const limit = ref(defaultLimit)
  const meta = ref<PaginationMeta | null>(null)

  const totalPages = computed(() => meta.value?.total_pages ?? 0)
  const hasPrev = computed(() => page.value > 1)
  const hasNext = computed(() => page.value < totalPages.value)

  function setMeta(newMeta: PaginationMeta) {
    meta.value = newMeta
  }

  function goTo(newPage: number) {
    page.value = newPage
  }

  function prev() {
    if (hasPrev.value) page.value--
  }

  function next() {
    if (hasNext.value) page.value++
  }

  function reset() {
    page.value = 1
  }

  return { page, limit, meta, totalPages, hasPrev, hasNext, setMeta, goTo, prev, next, reset }
}
