import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const token = ref<string | null>(localStorage.getItem('token'))

export function useAuth() {
  const router = useRouter()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const jwt = await authService.login(username, password)
      token.value = jwt
      localStorage.setItem('token', jwt)
      await router.push({ name: 'admin-projects' })
    } catch {
      error.value = 'Usuario o contraseña incorrectos'
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    localStorage.removeItem('token')
    router.push({ name: 'login' })
  }

  return { isAuthenticated, loading, error, login, logout }
}
