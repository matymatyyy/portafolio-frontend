import { describe, it, expect } from 'vitest'
import { usePagination } from '@/composables/usePagination'

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { page, limit } = usePagination()
    expect(page.value).toBe(1)
    expect(limit.value).toBe(10)
  })

  it('navigates forward and backward', () => {
    const { page, meta, setMeta, next, prev } = usePagination()
    setMeta({ total: 30, page: 1, limit: 10, total_pages: 3 })

    next()
    expect(page.value).toBe(2)

    prev()
    expect(page.value).toBe(1)
  })

  it('does not go below page 1', () => {
    const { page, prev } = usePagination()
    prev()
    expect(page.value).toBe(1)
  })

  it('resets to page 1', () => {
    const { page, goTo, reset } = usePagination()
    goTo(5)
    expect(page.value).toBe(5)
    reset()
    expect(page.value).toBe(1)
  })
})
