export interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  password?: string
}

export interface UserFilters {
  name?: string
  email?: string
}
