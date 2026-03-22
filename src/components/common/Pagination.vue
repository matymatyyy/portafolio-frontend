<script setup lang="ts">
import type { PaginationMeta } from '@/types/api'

defineProps<{
  meta: PaginationMeta
  currentPage: number
}>()

const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <div class="pagination">
    <span class="pagination__info">
      {{ (currentPage - 1) * meta.limit + 1 }}–{{ Math.min(currentPage * meta.limit, meta.total) }}
      of {{ meta.total }}
    </span>
    <div class="pagination__controls">
      <button
        class="pagination__btn"
        :disabled="currentPage <= 1"
        @click="emit('change', currentPage - 1)"
      >
        &lsaquo; Prev
      </button>
      <span class="pagination__pages">{{ currentPage }} / {{ meta.total_pages }}</span>
      <button
        class="pagination__btn"
        :disabled="currentPage >= meta.total_pages"
        @click="emit('change', currentPage + 1)"
      >
        Next &rsaquo;
      </button>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}
.pagination__info { font-size: 0.8125rem; }
.pagination__controls { display: flex; align-items: center; gap: 0.5rem; }
.pagination__btn {
  padding: 0.4rem 0.875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  color: #374151;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.pagination__btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pagination__btn:hover:not(:disabled) { border-color: #5b21b6; color: #5b21b6; }
.pagination__pages {
  font-weight: 600;
  color: #5b21b6;
  padding: 0.4rem 0.75rem;
  background: #ede9fe;
  border-radius: 8px;
  font-size: 0.8125rem;
}
</style>
