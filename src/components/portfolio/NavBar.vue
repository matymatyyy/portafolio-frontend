<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  activeSection: string
  scrolled: boolean
}>()

const navOpen = ref(false)

const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

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
          :key="link.id"
          class="pf-nav__link"
          :class="{ 'pf-nav__link--active': activeSection === link.id }"
          @click="scrollTo(link.id)"
        >
          {{ link.label }}
        </button>
        <button
          class="pf-btn pf-btn--sm"
          @click="scrollTo('contact')"
        >
          Hire me
        </button>
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
  .pf-nav__burger { display: flex; }
  .pf-btn--sm {
    width: 100%;
    justify-content: center;
    padding: 0.75rem;
    margin-top: 0.25rem;
  }
}
</style>
