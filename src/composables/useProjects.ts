import { ref, watch } from 'vue'
import { projectService } from '@/services/projectService'
import { usePagination } from '@/composables/usePagination'
import type { Project, ProjectFilters } from '@/types/project'

export function useProjects() {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<ProjectFilters>({})

  const pagination = usePagination()

  async function fetchProjects() {
    loading.value = true
    error.value = null
    try {
      const result = await projectService.list({
        page: pagination.page.value,
        limit: pagination.limit.value,
        ...filters.value,
      })
      projects.value = result.data
      pagination.setMeta(result.meta)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load projects'
    } finally {
      loading.value = false
    }
  }

  function applyFilters(newFilters: ProjectFilters) {
    filters.value = newFilters
    pagination.reset()
  }

  async function deleteProject(id: string) {
    await projectService.delete(id)
    await fetchProjects()
  }

  watch(pagination.page, fetchProjects)

  return {
    projects,
    loading,
    error,
    filters,
    pagination,
    fetchProjects,
    applyFilters,
    deleteProject,
  }
}
