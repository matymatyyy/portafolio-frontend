<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <footer class="pf-footer">
    <div class="pf-container pf-footer__inner">
      <span class="pf-footer__brand">maty.</span>
      <p class="pf-footer__copy">
        &copy; {{ new Date().getFullYear() }} &mdash; {{ t('footer.builtWith') }}
      </p>
      <div class="pf-footer__social">
        <a
          href="https://github.com/matymatyyy"
          target="_blank"
          rel="noopener noreferrer"
          class="pf-footer__social-link"
          aria-label="GitHub"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          ><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
        </a>
        <a
          href="https://www.linkedin.com/in/matias-dom%C3%ADnguez-79333b259"
          target="_blank"
          rel="noopener noreferrer"
          class="pf-footer__social-link"
          aria-label="LinkedIn"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          ><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
        </a>
        <RouterLink
          to="/login"
          class="pf-footer__social-link pf-footer__social-link--admin"
          aria-label="Admin panel"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          ><path
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
            stroke-linecap="round"
            stroke-linejoin="round"
          /><path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg>
        </RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.pf-footer {
  background: #111111;
  color: #fff;
  padding: 2rem 0;
}
.pf-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.pf-footer__brand { font-size: 1.125rem; font-weight: 800; color: #a78bfa; }
.pf-footer__copy { font-size: 0.8125rem; color: #9ca3af; margin: 0; }
.pf-footer__social { display: flex; gap: 0.75rem; }
.pf-footer__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: color var(--transition), transform var(--transition);
}
.pf-footer__social-link:hover { color: #fff; transform: translateY(-2px); }
.pf-footer__social-link--admin { opacity: 0.3; }
.pf-footer__social-link--admin:hover { opacity: 0.7; }

@media (max-width: 768px) {
  .pf-footer__inner { flex-direction: column; text-align: center; }
}
</style>
