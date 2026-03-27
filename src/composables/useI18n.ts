import { ref, computed } from 'vue'
import en from '@/i18n/en'
import es from '@/i18n/es'

export type Locale = 'en' | 'es'

type Messages = typeof en
type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`
    }[keyof T & string]
  : never

export type TranslationKey = NestedKeyOf<Messages>

const messages: Record<Locale, Messages> = { en, es }

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null
const locale = ref<Locale>((stored as Locale) || 'en')

export function useI18n() {
  function t(key: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = key.split('.').reduce<any>((obj, k) => obj?.[k], messages[locale.value])
    return typeof result === 'string' ? result : key
  }

  function tm(key: string): unknown {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return key.split('.').reduce<any>((obj, k) => obj?.[k], messages[locale.value])
  }

  function setLocale(newLocale: Locale) {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
    document.documentElement.lang = newLocale
  }

  const otherLocale = computed<Locale>(() => (locale.value === 'en' ? 'es' : 'en'))

  return { t, tm, locale, setLocale, otherLocale }
}
