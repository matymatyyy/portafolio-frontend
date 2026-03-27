import { watchEffect } from 'vue'
import { useI18n } from './useI18n'

export function useSeo() {
  const { locale } = useI18n()

  watchEffect(() => {
    document.documentElement.lang = locale.value

    setMeta('og:locale', locale.value === 'en' ? 'en_US' : 'es_AR')
  })

  injectJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Matias Dominguez',
    jobTitle: 'Full Stack Developer',
    url: window.location.origin,
    sameAs: [
      'https://github.com/matymatyyy',
      'https://www.linkedin.com/in/matias-dom%C3%ADnguez-79333b259',
    ],
    knowsAbout: [
      'PHP',
      'Symfony',
      'Vue.js',
      'TypeScript',
      'Hexagonal Architecture',
      'PostgreSQL',
      'Redis',
      'OpenShift',
    ],
  })
}

function setMeta(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function injectJsonLd(data: Record<string, unknown>) {
  const id = 'jsonld-person'
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}
