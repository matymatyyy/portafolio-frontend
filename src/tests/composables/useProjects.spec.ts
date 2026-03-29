import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Project } from '@/types/project'
import type { PaginatedResponse } from '@/types/api'

vi.mock('@/services/projectService', () => ({
  projectService: {
    list: vi.fn(),
    delete: vi.fn(),
  },
}))

import { useProjects } from '@/composables/useProjects'
import { projectService } from '@/services/projectService'

const mockProject: Project = {
  id: '1',
  title: 'Test Project',
  slug: 'test-project',
  description: 'A test project',
  image_url: null,
  project_url: null,
  repo_url: null,
  technologies: ['Vue.js', 'TypeScript'],
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockResponse: PaginatedResponse<Project> = {
  data: [mockProject],
  meta: { total: 1, page: 1, limit: 10, total_pages: 1 },
}

describe('useProjects', () => {
  beforeEach(() => {
    vi.mocked(projectService.list).mockReset()
    vi.mocked(projectService.delete).mockReset()
  })

  it('fetchProjects populates projects and pagination', async () => {
    vi.mocked(projectService.list).mockResolvedValue(mockResponse)

    const { projects, loading, error, fetchProjects, pagination } = useProjects()
    await fetchProjects()

    expect(projects.value).toEqual([mockProject])
    expect(pagination.meta.value).toEqual(mockResponse.meta)
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fetchProjects handles errors', async () => {
    vi.mocked(projectService.list).mockRejectedValue(new Error('Network error'))

    const { projects, error, fetchProjects } = useProjects()
    await fetchProjects()

    expect(projects.value).toEqual([])
    expect(error.value).toBe('Network error')
  })

  it('fetchProjects sets generic error for non-Error exceptions', async () => {
    vi.mocked(projectService.list).mockRejectedValue('unknown')

    const { error, fetchProjects } = useProjects()
    await fetchProjects()

    expect(error.value).toBe('Failed to load projects')
  })

  it('sets loading to true while fetching', async () => {
    let resolveList: (value: PaginatedResponse<Project>) => void
    vi.mocked(projectService.list).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveList = resolve
        }),
    )

    const { loading, fetchProjects } = useProjects()
    const promise = fetchProjects()
    expect(loading.value).toBe(true)

    resolveList!(mockResponse)
    await promise
    expect(loading.value).toBe(false)
  })

  it('applyFilters resets pagination to page 1', () => {
    const { filters, pagination, applyFilters } = useProjects()
    pagination.goTo(3)

    applyFilters({ status: 'archived', title: 'test' })

    expect(filters.value).toEqual({ status: 'archived', title: 'test' })
    expect(pagination.page.value).toBe(1)
  })

  it('deleteProject calls service and refetches', async () => {
    vi.mocked(projectService.delete).mockResolvedValue(undefined)
    vi.mocked(projectService.list).mockResolvedValue(mockResponse)

    const { deleteProject } = useProjects()
    await deleteProject('1')

    expect(projectService.delete).toHaveBeenCalledWith('1')
    expect(projectService.list).toHaveBeenCalled()
  })

  it('passes filters and pagination to service', async () => {
    vi.mocked(projectService.list).mockResolvedValue(mockResponse)

    const { fetchProjects, applyFilters } = useProjects()
    applyFilters({ status: 'active' })
    await fetchProjects()

    expect(projectService.list).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'active', page: 1, limit: 10 }),
    )
  })
})
