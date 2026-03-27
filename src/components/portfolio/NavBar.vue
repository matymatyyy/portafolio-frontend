<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from '@/composables/useI18n'

defineProps<{
  activeSection: string
  scrolled: boolean
}>()

const { theme, toggleTheme } = useTheme()
const { t, locale, setLocale, otherLocale } = useI18n()
const navOpen = ref(false)

const navLinks = ['about', 'skills', 'experience', 'projects', 'contact'] as const

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  navOpen.value = false
}
</script>

<template>
  <header
    class="pf-nav"
    :class="{ 'pf-nav--scrolled': scrolled }"
  >
    <div class="pf-nav__inner">
      <button
        class="pf-nav__logo"
        @click="scrollTo('hero')"
      >
        maty.
      </button>

      <nav
        id="main-nav"
        class="pf-nav__links"
        :class="{ 'pf-nav__links--open': navOpen }"
        aria-label="Main navigation"
      >
        <button
          v-for="link in navLinks"
          :key="link"
          class="pf-nav__link"
          :class="{ 'pf-nav__link--active': activeSection === link }"
          @click="scrollTo(link)"
        >
          {{ t(`nav.${link}`) }}
        </button>

        <div class="pf-nav__controls">
          <button
            class="pf-nav__icon-btn"
            :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme"
          >
            <!-- Sun -->
            <svg
              v-if="theme === 'dark'"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ><circle
              cx="12"
              cy="12"
              r="5"
            /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            <!-- Moon -->
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
          </button>

          <button
            class="pf-nav__icon-btn pf-nav__lang"
            :aria-label="`Switch to ${otherLocale === 'es' ? 'Spanish' : 'English'}`"
            @click="setLocale(otherLocale)"
          >
            {{ locale.toUpperCase() }}
          </button>

          <button
            class="pf-btn pf-btn--sm"
            @click="scrollTo('contact')"
          >
            {{ t('nav.hireMe') }}
          </button>
        </div>
      </nav>

      <button
        class="pf-nav__burger"
        :class="{ open: navOpen }"
        :aria-expanded="navOpen"
        aria-controls="main-nav"
        aria-label="Toggle navigation menu"
        @click="navOpen = !navOpen"
      >
        <span /><span /><span />
      </button>
    </div>
  </header>
</template>

<style scoped>
.pf-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  transition: background var(--transition), box-shadow var(--transition);
}
.pf-nav--scrolled {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 var(--border);
}

[data-theme='dark'] .pf-nav--scrolled {
  background: rgba(15, 15, 17, 0.9);
}

.pf-nav__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pf-nav__logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.03em;
}
.pf-nav__links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.pf-nav__link {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--fg-muted);
  transition: color var(--transition), background var(--transition);
}
.pf-nav__link:hover { color: var(--fg); background: var(--bg-alt); }
.pf-nav__link--active { color: var(--accent); background: var(--accent-light); }

.pf-nav__controls {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: 0.5rem;
}

.pf-nav__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: var(--fg-muted);
  transition: color var(--transition), background var(--transition);
}
.pf-nav__icon-btn:hover {
  color: var(--accent);
  background: var(--accent-light);
}

.pf-nav__lang {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.pf-nav__burger { display: none; flex-direction: column; gap: 5px; padding: 4px; }
.pf-nav__burger span {
  display: block;
  width: 22px; height: 2px;
  background: var(--fg);
  border-radius: 2px;
  transition: transform var(--transition), opacity var(--transition);
}
.pf-nav__burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.pf-nav__burger.open span:nth-child(2) { opacity: 0; }
.pf-nav__burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 768px) {
  .pf-nav__links {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 64px; left: 0; right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(16px);
    padding: 0.75rem 1rem 1rem;
    border-bottom: 1px solid var(--border);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    gap: 0.25rem;
    transform: translateY(-110%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
  }

  [data-theme='dark'] .pf-nav__links {
    background: rgba(15, 15, 17, 0.98);
  }

  .pf-nav__links--open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .pf-nav__link {
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 8px;
  }
  .pf-nav__controls {
    width: 100%;
    margin-left: 0;
    margin-top: 0.25rem;
    justify-content: center;
    gap: 0.5rem;
  }
  .pf-nav__burger { display: flex; }
  .pf-nav__controls .pf-btn--sm {
    flex: 1;
    justify-content: center;
    padding: 0.75rem;
  }
}
</style>
