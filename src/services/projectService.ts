import { get, post, put, del } from '@/utils/api'
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectFilters,
} from '@/types/project'
import type { PaginatedResponse } from '@/types/api'

interface ListProjectsParams extends ProjectFilters {
  page?: number
  limit?: number
}

export const projectService = {
  list(params: ListProjectsParams = {}): Promise<PaginatedResponse<Project>> {
    return get<PaginatedResponse<Project>>('/api/projects', { params })
  },

  get(id: string): Promise<Project> {
    return get<Project>(`/api/projects/${id}`)
  },

  create(payload: CreateProjectPayload): Promise<Project> {
    return post<Project>('/api/projects', payload)
  },

  update(id: string, payload: UpdateProjectPayload): Promise<Project> {
    return put<Project>(`/api/projects/${id}`, payload)
  },

  delete(id: string): Promise<void> {
    return del<void>(`/api/projects/${id}`)
  },

  uploadImage(file: File): Promise<{ url: string }> {
    const form = new FormData()
    form.append('file', file)
    return post<{ url: string }>('/api/images', form)
  },
}
