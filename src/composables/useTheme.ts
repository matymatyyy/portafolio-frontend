import { ref, watchEffect } from 'vue'

export type Theme = 'light' | 'dark'

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null
const preferred =
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const theme = ref<Theme>((stored as Theme) || preferred)

export function useTheme() {
  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  })

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { theme, toggleTheme }
}
