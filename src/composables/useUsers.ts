import { ref, watch } from 'vue'
import { userService } from '@/services/userService'
import { usePagination } from '@/composables/usePagination'
import type { User, UserFilters } from '@/types/user'

export function useUsers() {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<UserFilters>({})

  const pagination = usePagination()

  async function fetchUsers() {
    loading.value = true
    error.value = null
    try {
      const result = await userService.list({
        page: pagination.page.value,
        limit: pagination.limit.value,
        ...filters.value,
      })
      users.value = result.data
      pagination.setMeta(result.meta)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load users'
    } finally {
      loading.value = false
    }
  }

  function applyFilters(newFilters: UserFilters) {
    filters.value = newFilters
    pagination.reset()
  }

  async function deleteUser(id: string) {
    await userService.delete(id)
    await fetchUsers()
  }

  // Re-fetch when page changes
  watch(pagination.page, fetchUsers)

  return { users, loading, error, filters, pagination, fetchUsers, applyFilters, deleteUser }
}
