import { post } from '@/utils/api'

interface LoginResponse {
  token: string
}

export const authService = {
  async login(username: string, password: string): Promise<string> {
    const { token } = await post<LoginResponse>('/api/login', { username, password })
    return token
  },
}
