import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    vi.resetModules()
  })

  async function loadTheme() {
    const mod = await import('@/composables/useTheme')
    return mod.useTheme()
  }

  it('defaults to light when no localStorage and no preference', async () => {
    const { theme } = await loadTheme()
    expect(theme.value).toBe('light')
  })

  it('reads theme from localStorage', async () => {
    localStorage.setItem('theme', 'dark')
    const { theme } = await loadTheme()
    expect(theme.value).toBe('dark')
  })

  it('toggles between light and dark', async () => {
    const { theme, toggleTheme } = await loadTheme()
    expect(theme.value).toBe('light')
    toggleTheme()
    expect(theme.value).toBe('dark')
    toggleTheme()
    expect(theme.value).toBe('light')
  })

  it('persists theme to localStorage on toggle', async () => {
    const { toggleTheme } = await loadTheme()
    toggleTheme()
    await nextTick()
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('sets data-theme attribute on document', async () => {
    const { toggleTheme } = await loadTheme()
    toggleTheme()
    await nextTick()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
