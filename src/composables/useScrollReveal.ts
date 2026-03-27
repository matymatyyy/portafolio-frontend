import { onMounted, onUnmounted, nextTick } from 'vue'

export function useScrollReveal() {
  let intersectionObserver: IntersectionObserver
  let mutationObserver: MutationObserver

  function observe(el: Element) {
    if (!el.classList.contains('revealed')) {
      intersectionObserver.observe(el)
    }
  }

  onMounted(async () => {
    await nextTick()

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            intersectionObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    document.querySelectorAll('.reveal').forEach(observe)

    // Watch for dynamically added .reveal elements (e.g. after async data loads)
    mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('reveal')) observe(node)
            node.querySelectorAll('.reveal').forEach(observe)
          }
        }
      }
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })
  })

  onUnmounted(() => {
    intersectionObserver?.disconnect()
    mutationObserver?.disconnect()
  })
}
