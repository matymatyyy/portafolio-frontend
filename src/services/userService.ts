import { get, post, put, del } from '@/utils/api'
import type { User, CreateUserPayload, UpdateUserPayload, UserFilters } from '@/types/user'
import type { PaginatedResponse } from '@/types/api'

interface ListUsersParams extends UserFilters {
  page?: number
  limit?: number
}

export const userService = {
  list(params: ListUsersParams = {}): Promise<PaginatedResponse<User>> {
    return get<PaginatedResponse<User>>('/api/users', { params })
  },

  get(id: string): Promise<User> {
    return get<User>(`/api/users/${id}`)
  },

  create(payload: CreateUserPayload): Promise<User> {
    return post<User>('/api/users', payload)
  },

  update(id: string, payload: UpdateUserPayload): Promise<User> {
    return put<User>(`/api/users/${id}`, payload)
  },

  delete(id: string): Promise<void> {
    return del<void>(`/api/users/${id}`)
  },
}
