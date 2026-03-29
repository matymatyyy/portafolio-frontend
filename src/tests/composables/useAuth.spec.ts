import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}))

import { authService } from '@/services/authService'

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
    vi.mocked(authService.login).mockReset()
    vi.resetModules()
  })

  async function loadAuth() {
    const mod = await import('@/composables/useAuth')
    return mod.useAuth()
  }

  it('starts as unauthenticated when no token in localStorage', async () => {
    const { isAuthenticated } = await loadAuth()
    expect(isAuthenticated.value).toBe(false)
  })

  it('login stores token and navigates to admin', async () => {
    vi.mocked(authService.login).mockResolvedValue('jwt-token-123')

    const { login, isAuthenticated, loading, error } = await loadAuth()
    await login('admin', 'password')

    expect(isAuthenticated.value).toBe(true)
    expect(localStorage.getItem('token')).toBe('jwt-token-123')
    expect(mockPush).toHaveBeenCalledWith({ name: 'admin-projects' })
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('login sets error on failure', async () => {
    vi.mocked(authService.login).mockRejectedValue(new Error('Unauthorized'))

    const { login, isAuthenticated, error, loading } = await loadAuth()
    await login('admin', 'wrong')

    expect(isAuthenticated.value).toBe(false)
    expect(error.value).toBe('Invalid username or password')
    expect(loading.value).toBe(false)
  })

  it('logout removes token and navigates to login', async () => {
    vi.mocked(authService.login).mockResolvedValue('jwt-token-123')

    const { login, logout, isAuthenticated } = await loadAuth()
    await login('admin', 'password')
    expect(isAuthenticated.value).toBe(true)

    logout()

    expect(isAuthenticated.value).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
    expect(mockPush).toHaveBeenCalledWith({ name: 'login' })
  })

  it('sets loading to true during login', async () => {
    let resolveLogin: (value: string) => void
    vi.mocked(authService.login).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve
        }),
    )

    const { login, loading } = await loadAuth()
    const loginPromise = login('admin', 'password')
    expect(loading.value).toBe(true)

    resolveLogin!('token')
    await loginPromise
    expect(loading.value).toBe(false)
  })
})
