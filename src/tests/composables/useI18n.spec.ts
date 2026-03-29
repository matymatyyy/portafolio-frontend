import { describe, it, expect, beforeEach } from 'vitest'
import { useI18n } from '@/composables/useI18n'

describe('useI18n', () => {
  beforeEach(() => {
    const { setLocale } = useI18n()
    setLocale('en')
  })

  it('returns English translations by default', () => {
    const { t } = useI18n()
    expect(t('hero.eyebrow')).toBe("Hello, I'm")
    expect(t('nav.about')).toBe('About')
  })

  it('switches to Spanish translations', () => {
    const { t, setLocale } = useI18n()
    setLocale('es')
    expect(t('hero.eyebrow')).toBe('Hola, soy')
    expect(t('nav.about')).toBe('Sobre mí')
  })

  it('returns the key when translation is not found', () => {
    const { t } = useI18n()
    expect(t('nonexistent.key')).toBe('nonexistent.key')
  })

  it('returns deeply nested translations', () => {
    const { t } = useI18n()
    expect(t('contact.namePlaceholder')).toBe('Your name')
  })

  it('tm() returns arrays for jobs', () => {
    const { tm } = useI18n()
    const jobs = tm('experience.jobs')
    expect(Array.isArray(jobs)).toBe(true)
    expect((jobs as Array<{ company: string }>)[0].company).toBe('VarCreative')
  })

  it('computes otherLocale correctly', () => {
    const { otherLocale, setLocale } = useI18n()
    expect(otherLocale.value).toBe('es')
    setLocale('es')
    expect(otherLocale.value).toBe('en')
  })

  it('persists locale to localStorage', () => {
    const { setLocale } = useI18n()
    setLocale('es')
    expect(localStorage.getItem('locale')).toBe('es')
  })

  it('updates document lang attribute', () => {
    const { setLocale } = useI18n()
    setLocale('es')
    expect(document.documentElement.lang).toBe('es')
  })

  it('locale is reactive and shared across instances', () => {
    const i18n1 = useI18n()
    const i18n2 = useI18n()
    i18n1.setLocale('es')
    expect(i18n2.locale.value).toBe('es')
    expect(i18n2.t('nav.about')).toBe('Sobre mí')
  })
})
