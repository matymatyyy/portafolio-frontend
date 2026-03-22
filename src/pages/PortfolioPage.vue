<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { projectService } from '@/services/projectService'
import { visitService } from '@/services/visitService'
import { contactService } from '@/services/contactService'
import type { Project } from '@/types/project'
import avatarImg from '@/assets/avatar.png'

const activeSection = ref('hero')
const navOpen = ref(false)
const scrolled = ref(false)

const sections = ['hero', 'about', 'skills', 'projects', 'contact']

const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

const skillCategories = [
  {
    title: 'Backend',
    icon: '⚙',
    color: '#5b21b6',
    skills: ['PHP', 'Symfony', 'Python', 'REST APIs'],
  },
  {
    title: 'Frontend',
    icon: '◆',
    color: '#0891b2',
    skills: ['Vue.js', 'TypeScript', 'HTML / CSS', 'Responsive Design'],
  },
  {
    title: 'Architecture & Testing',
    icon: '△',
    color: '#059669',
    skills: ['Hexagonal / DDD', 'PHPUnit', 'PHPStan', 'ECS'],
  },
  {
    title: 'DevOps & Tools',
    icon: '▲',
    color: '#d97706',
    skills: ['Git / GitHub', 'OpenShift', 'CI/CD', 'PostgreSQL', 'Redis'],
  },
]

const projects = ref<Project[]>([])
const projectsLoading = ref(false)
const projectsPerPage = 6
const projectsVisible = ref(projectsPerPage)
const visibleProjects = computed(() => projects.value.slice(0, projectsVisible.value))
const hasMoreProjects = computed(() => projectsVisible.value < projects.value.length)
function showMoreProjects() { projectsVisible.value += projectsPerPage }
const cvUrl = `${import.meta.env.VITE_API_URL}/api/cv`

const techColors: Record<string, [string, string]> = {
  php: ['#4f46e5', '#7c3aed'],
  symfony: ['#1e1e1e', '#444444'],
  vue: ['#10b981', '#059669'],
  'vue.js': ['#10b981', '#059669'],
  typescript: ['#2563eb', '#1d4ed8'],
  javascript: ['#d97706', '#b45309'],
  python: ['#0891b2', '#0e7490'],
  postgresql: ['#2563eb', '#4f46e5'],
  redis: ['#dc2626', '#b91c1c'],
  docker: ['#0284c7', '#0369a1'],
  openshift: ['#dc2626', '#ef4444'],
  default: ['#5b21b6', '#7c3aed'],
}

function getProjectColors(project: Project): [string, string] {
  if (project.technologies.length > 0) {
    const tech = project.technologies[0].toLowerCase()
    for (const [key, colors] of Object.entries(techColors)) {
      if (tech.includes(key)) return colors
    }
  }
  const hash = project.title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const palette: [string, string][] = [
    ['#5b21b6', '#7c3aed'],
    ['#0891b2', '#06b6d4'],
    ['#059669', '#10b981'],
    ['#d97706', '#f59e0b'],
    ['#dc2626', '#ef4444'],
    ['#2563eb', '#3b82f6'],
  ]
  return palette[hash % palette.length]
}

const contactForm = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})
const contactSending = ref(false)
const contactSuccess = ref(false)
const contactError = ref('')

async function sendContact() {
  contactError.value = ''
  contactSuccess.value = false
  contactSending.value = true
  try {
    await contactService.send({ ...contactForm })
    contactSuccess.value = true
    contactForm.name = ''
    contactForm.email = ''
    contactForm.subject = ''
    contactForm.message = ''
  } catch (err) {
    contactError.value = err instanceof Error ? err.message : 'Failed to send message.'
  } finally {
    contactSending.value = false
  }
}

async function fetchProjects() {
  projectsLoading.value = true
  try {
    const result = await projectService.list({ status: 'active', limit: 100 })
    projects.value = result.data
  } finally {
    projectsLoading.value = false
  }
}

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  navOpen.value = false
}

let observer: IntersectionObserver

onMounted(() => {
  fetchProjects()
  visitService.register('/').catch(() => {})

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      })
    },
    { threshold: 0.45 },
  )
  sections.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  observer.disconnect()
  window.removeEventListener('scroll', onScroll)
})

function onScroll() {
  scrolled.value = window.scrollY > 40
}
</script>

<template>
  <!-- ───── NAV ───── -->
  <header class="pf-nav" :class="{ 'pf-nav--scrolled': scrolled }">
    <div class="pf-nav__inner">
      <button class="pf-nav__logo" @click="scrollTo('hero')">maty.</button>

      <nav class="pf-nav__links" :class="{ 'pf-nav__links--open': navOpen }">
        <button
          v-for="link in navLinks"
          :key="link.id"
          class="pf-nav__link"
          :class="{ 'pf-nav__link--active': activeSection === link.id }"
          @click="scrollTo(link.id)"
        >
          {{ link.label }}
        </button>
        <button class="pf-btn pf-btn--sm" @click="scrollTo('contact')">Hire me</button>
      </nav>

      <button class="pf-nav__burger" :class="{ open: navOpen }" @click="navOpen = !navOpen" aria-label="Menu">
        <span /><span /><span />
      </button>
    </div>
  </header>

  <!-- ───── HERO ───── -->
  <section id="hero" class="pf-hero">
    <div class="pf-hero__inner pf-container">
      <p class="pf-hero__eyebrow">Hello, I'm</p>
      <h1 class="pf-hero__name">Matias Dominguez</h1>
      <h2 class="pf-hero__title">Full Stack Developer</h2>
      <p class="pf-hero__sub">
        Specialized in clean architecture and scalable backends with PHP/Symfony, paired with modern Vue.js interfaces. Focused on code quality, testing, and delivering products that last.
      </p>
      <div class="pf-hero__actions">
        <button class="pf-btn" @click="scrollTo('projects')">View my work</button>
        <button class="pf-btn pf-btn--outline" @click="scrollTo('contact')">Get in touch</button>
      </div>
    </div>
    <div class="pf-hero__scroll" aria-hidden="true">
      <span class="pf-hero__scroll-line" />
    </div>
  </section>

  <!-- ───── ABOUT ───── -->
  <section id="about" class="pf-section pf-about">
    <div class="pf-container pf-about__grid">
      <div class="pf-about__photo">
        <div class="pf-about__avatar-wrap">
          <img :src="avatarImg" alt="Matias Dominguez" class="pf-about__avatar" />
        </div>
      </div>
      <div class="pf-about__body">
        <p class="pf-section__label">About me</p>
        <h2 class="pf-section__title">Turning ideas into<br />polished products</h2>
        <p class="pf-about__text">
          Full Stack Developer with a backend-oriented profile. Professional experience with
          PHP/Symfony, hexagonal architecture, testing and code quality (PHPUnit, PHPStan, ECS).
          Educated in Systems Analysis and Programming.
        </p>
        <p class="pf-about__text">
          Currently working as a Full Stack Developer at VarCreative, building backend services
          with Symfony, integrating reactive interfaces with Vue.js, and deploying on OpenShift
          environments. Committed to best practices and continuous learning.
        </p>
        <div class="pf-about__stats">
          <div class="pf-stat">
            <span class="pf-stat__value">9+</span>
            <span class="pf-stat__label">Technologies</span>
          </div>
          <div class="pf-stat">
            <span class="pf-stat__value">10+</span>
            <span class="pf-stat__label">Projects</span>
          </div>
          <div class="pf-stat">
            <span class="pf-stat__value">2</span>
            <span class="pf-stat__label">Degrees</span>
          </div>
        </div>
        <a :href="cvUrl" target="_blank" class="pf-btn pf-btn--outline pf-about__cv">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Download CV
        </a>
      </div>
    </div>
  </section>

  <!-- ───── SKILLS ───── -->
  <section id="skills" class="pf-section pf-skills">
    <div class="pf-container">
      <p class="pf-section__label pf-section__label--center">What I work with</p>
      <h2 class="pf-section__title pf-section__title--center">Skills &amp; Stack</h2>
      <div class="pf-skills__grid">
        <div v-for="cat in skillCategories" :key="cat.title" class="pf-skill-card">
          <div class="pf-skill-card__header">
            <span class="pf-skill-card__icon" :style="{ background: cat.color + '18', color: cat.color }">{{ cat.icon }}</span>
            <span class="pf-skill-card__name">{{ cat.title }}</span>
          </div>
          <div class="pf-skill-card__tags">
            <span v-for="skill in cat.skills" :key="skill" class="pf-skill-tag" :style="{ '--tag-color': cat.color }">{{ skill }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ───── PROJECTS ───── -->
  <section id="projects" class="pf-section pf-projects">
    <div class="pf-container">
      <p class="pf-section__label pf-section__label--center">What I've built</p>
      <h2 class="pf-section__title pf-section__title--center">Selected Projects</h2>
      <div v-if="projectsLoading" class="pf-projects__loading">
        <span class="pf-projects__spinner" />
      </div>
      <div v-else class="pf-projects__grid">
        <article v-for="project in visibleProjects" :key="project.id" class="pf-project-card">
          <div
            class="pf-project-card__thumb"
            aria-hidden="true"
            :style="{ background: `linear-gradient(135deg, ${getProjectColors(project)[0]}, ${getProjectColors(project)[1]})` }"
          >
            <span class="pf-project-card__thumb-letter">{{ project.title.charAt(0) }}</span>
          </div>
          <div class="pf-project-card__body">
            <h3 class="pf-project-card__title">{{ project.title }}</h3>
            <p class="pf-project-card__desc">{{ project.description }}</p>
            <div class="pf-project-card__tags">
              <span v-for="tech in project.technologies" :key="tech" class="pf-tag">{{ tech }}</span>
            </div>
          </div>
          <RouterLink
            :to="{ name: 'project-detail', params: { id: project.id } }"
            class="pf-project-card__link"
            aria-label="View project"
          >
            View details
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </RouterLink>
        </article>
      </div>
      <div v-if="hasMoreProjects" class="pf-projects__more">
        <button class="pf-btn pf-btn--outline" @click="showMoreProjects">Show more projects</button>
      </div>
    </div>
  </section>

  <!-- ───── CONTACT ───── -->
  <section id="contact" class="pf-section pf-contact">
    <div class="pf-container pf-contact__inner">
      <p class="pf-section__label pf-section__label--center">Let's work together</p>
      <h2 class="pf-section__title pf-section__title--center">Get in Touch</h2>
      <p class="pf-contact__sub">
        Have a project in mind or just want to say hi? My inbox is always open.
      </p>
      <a href="mailto:matydominguez554@gmail.com" class="pf-contact__email">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        matydominguez554@gmail.com
      </a>
      <p v-if="contactSuccess" class="pf-form__success">Message sent successfully!</p>
      <p v-if="contactError" class="pf-form__error">{{ contactError }}</p>
      <form class="pf-form" @submit.prevent="sendContact">
        <div class="pf-form__row">
          <div class="pf-form__field">
            <label class="pf-form__label" for="cf-name">Name</label>
            <input id="cf-name" v-model="contactForm.name" class="pf-form__input" type="text" placeholder="Your name" required minlength="2" maxlength="100" />
          </div>
          <div class="pf-form__field">
            <label class="pf-form__label" for="cf-email">Email</label>
            <input id="cf-email" v-model="contactForm.email" class="pf-form__input" type="email" placeholder="your@email.com" required />
          </div>
        </div>
        <div class="pf-form__field">
          <label class="pf-form__label" for="cf-subject">Subject</label>
          <input id="cf-subject" v-model="contactForm.subject" class="pf-form__input" type="text" placeholder="What's this about?" required minlength="2" maxlength="200" />
        </div>
        <div class="pf-form__field">
          <label class="pf-form__label" for="cf-message">Message</label>
          <textarea id="cf-message" v-model="contactForm.message" class="pf-form__input pf-form__textarea" placeholder="Tell me about your project…" rows="5" required minlength="10" maxlength="5000" />
        </div>
        <button type="submit" class="pf-btn pf-btn--full" :disabled="contactSending">
          {{ contactSending ? 'Sending…' : 'Send message' }}
        </button>
      </form>
    </div>
  </section>

  <!-- ───── FOOTER ───── -->
  <footer class="pf-footer">
    <div class="pf-container pf-footer__inner">
      <span class="pf-footer__brand">maty.</span>
      <p class="pf-footer__copy">© {{ new Date().getFullYear() }} — Built with Vue 3 + TypeScript</p>
      <div class="pf-footer__social">
        <a href="https://github.com/matymatyyy" target="_blank" rel="noopener" class="pf-footer__social-link" aria-label="GitHub">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
        <a href="https://www.linkedin.com/in/matias-dom%C3%ADnguez-79333b259" target="_blank" rel="noopener" class="pf-footer__social-link" aria-label="LinkedIn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <RouterLink to="/login" class="pf-footer__social-link pf-footer__social-link--admin" aria-label="Admin">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ─── Design tokens ─── */
.pf-hero,
.pf-about,
.pf-skills,
.pf-projects,
.pf-contact,
.pf-footer,
.pf-nav {
  --bg: #ffffff;
  --bg-alt: #f7f7f8;
  --fg: #111111;
  --fg-muted: #6b7280;
  --accent: #5b21b6;
  --accent-light: #ede9fe;
  --border: #e5e7eb;
  --radius: 12px;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ─── Global resets (scoped to template root) ─── */
:global(html) { scroll-behavior: smooth; }
:global(body) { margin: 0; font-family: 'Inter', system-ui, sans-serif; background: #fff; color: #111; }
:global(*, *::before, *::after) { box-sizing: border-box; }
:global(button) { cursor: pointer; font: inherit; border: none; background: none; }
:global(a) { text-decoration: none; color: inherit; }

/* ─── Container ─── */
.pf-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ─── Navbar ─── */
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

/* ─── Buttons ─── */
.pf-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.375rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  background: var(--accent);
  color: #fff;
  transition: opacity var(--transition), transform var(--transition);
}
.pf-btn:hover { opacity: 0.88; transform: translateY(-1px); }
.pf-btn--outline {
  background: transparent;
  color: var(--fg);
  border: 2px solid var(--border);
}
.pf-btn--outline:hover { border-color: var(--accent); color: var(--accent); }
.pf-btn--sm { padding: 0.375rem 0.875rem; font-size: 0.875rem; }
.pf-btn--full { width: 100%; justify-content: center; padding: 0.75rem; }
.pf-btn--cv { text-decoration: none; }

/* ─── Section shared ─── */
.pf-section { padding: 96px 0; }
.pf-section__label {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 0.5rem;
}
.pf-section__label--center { text-align: center; }
.pf-section__title {
  font-size: clamp(1.75rem, 4vw, 2.625rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--fg);
  margin: 0 0 2.5rem;
}
.pf-section__title--center { text-align: center; }

/* ─── Hero ─── */
.pf-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 60%);
}
.pf-hero__inner { text-align: center; }
.pf-hero__eyebrow {
  font-size: 1rem;
  font-weight: 500;
  color: var(--fg-muted);
  margin: 0 0 0.5rem;
  letter-spacing: 0.04em;
}
.pf-hero__name {
  font-size: clamp(3rem, 9vw, 6.5rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1;
  color: var(--fg);
  margin: 0 0 0.5rem;
}
.pf-hero__title {
  font-size: clamp(1.25rem, 3.5vw, 2rem);
  font-weight: 600;
  color: var(--accent);
  margin: 0 0 1.25rem;
  letter-spacing: -0.02em;
}
.pf-hero__sub {
  max-width: 520px;
  margin: 0 auto 2.25rem;
  font-size: 1.0625rem;
  color: var(--fg-muted);
  line-height: 1.7;
}
.pf-hero__actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
.pf-hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pf-hero__scroll-line {
  display: block;
  width: 1.5px;
  height: 48px;
  background: linear-gradient(to bottom, var(--accent), transparent);
  animation: scrollPulse 1.8s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
  50% { opacity: 1; transform: scaleY(1); }
}

/* ─── About ─── */
.pf-about { background: var(--bg-alt); }
.pf-about__grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  align-items: center;
}
.pf-about__photo { display: flex; justify-content: center; }
.pf-about__avatar-wrap {
  position: relative;
  width: 220px;
  height: 220px;
}
.pf-about__avatar-wrap::before {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 28px;
  background: linear-gradient(135deg, var(--accent), #7c3aed, #0891b2);
  opacity: 0.2;
  animation: avatarPulse 3s ease-in-out infinite;
}
@keyframes avatarPulse {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.03); }
}
.pf-about__avatar {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  object-fit: cover;
  position: relative;
  box-shadow: 0 20px 60px rgba(91, 33, 182, 0.3);
}
.pf-about__text {
  color: var(--fg-muted);
  line-height: 1.75;
  margin: 0 0 1rem;
  font-size: 1rem;
}
.pf-about__stats { display: flex; gap: 2rem; margin-top: 1.75rem; }
.pf-stat { display: flex; flex-direction: column; gap: 0.125rem; }
.pf-stat__value { font-size: 2rem; font-weight: 800; color: var(--accent); line-height: 1; }
.pf-stat__label { font-size: 0.8125rem; color: var(--fg-muted); font-weight: 500; }
.pf-about__cv { margin-top: 1.75rem; text-decoration: none; }

/* ─── Skills ─── */
.pf-skills { background: var(--bg); }
.pf-skills__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}
.pf-skill-card {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: box-shadow var(--transition), transform var(--transition);
}
.pf-skill-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
.pf-skill-card__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.125rem;
}
.pf-skill-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
}
.pf-skill-card__name { font-weight: 700; font-size: 1rem; }
.pf-skill-card__tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.pf-skill-tag {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  border-radius: 99px;
  font-size: 0.8125rem;
  font-weight: 600;
  background: color-mix(in srgb, var(--tag-color) 10%, transparent);
  color: var(--tag-color);
  border: 1px solid color-mix(in srgb, var(--tag-color) 20%, transparent);
}

/* ─── Projects ─── */
.pf-projects { background: var(--bg-alt); }
.pf-projects__loading {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}
.pf-projects__spinner {
  display: block;
  width: 40px;
  height: 40px;
  border: 3px solid var(--accent-light);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.pf-projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
.pf-projects__more {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
.pf-project-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition), box-shadow var(--transition);
}
.pf-project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.1);
}
.pf-project-card__thumb {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.pf-project-card__thumb-letter {
  font-size: 4rem;
  font-weight: 900;
  color: rgba(255,255,255,0.25);
  text-transform: uppercase;
  user-select: none;
}
.pf-project-card__body { padding: 1.25rem; flex: 1; }
.pf-project-card__title { font-size: 1.0625rem; font-weight: 700; margin: 0 0 0.5rem; }
.pf-project-card__desc { font-size: 0.9rem; color: var(--fg-muted); line-height: 1.65; margin: 0 0 1rem; }
.pf-project-card__tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }
.pf-project-card__link {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem 1.25rem;
  color: var(--accent);
  border-top: 1px solid var(--border);
  font-size: 0.875rem;
  font-weight: 600;
  gap: 0.375rem;
  transition: gap var(--transition), color var(--transition);
}
.pf-project-card__link:hover { gap: 0.625rem; }

/* ─── Tags ─── */
.pf-tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--accent-light);
  color: var(--accent);
}

/* ─── Contact ─── */
.pf-contact { background: var(--bg); }
.pf-contact__inner { max-width: 640px; }
.pf-contact__sub {
  text-align: center;
  color: var(--fg-muted);
  margin: -1.5rem 0 1.25rem;
  font-size: 1.0625rem;
  line-height: 1.7;
}
.pf-contact__email {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 2rem;
  transition: opacity var(--transition);
}
.pf-contact__email:hover { opacity: 0.75; }

/* ─── Form ─── */
.pf-form { display: flex; flex-direction: column; gap: 1.25rem; }
.pf-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.pf-form__field { display: flex; flex-direction: column; gap: 0.375rem; }
.pf-form__label { font-size: 0.875rem; font-weight: 600; color: var(--fg); }
.pf-form__input {
  padding: 0.625rem 0.875rem;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font: inherit;
  font-size: 0.9375rem;
  color: var(--fg);
  background: var(--bg);
  transition: border-color var(--transition), box-shadow var(--transition);
  outline: none;
  resize: none;
}
.pf-form__input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
}
.pf-form__textarea { resize: vertical; }
.pf-form__success {
  text-align: center;
  color: #16a34a;
  font-weight: 600;
  font-size: 0.9375rem;
  margin: 0 0 1rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}
.pf-form__error {
  text-align: center;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.9375rem;
  margin: 0 0 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}
.pf-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ─── Footer ─── */
.pf-footer {
  background: var(--fg);
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

/* ─── Responsive ─── */
@media (max-width: 1024px) {
  .pf-about__grid { grid-template-columns: 1fr 2.5fr; gap: 2.5rem; }
  .pf-skills__grid { grid-template-columns: repeat(2, 1fr); }
  .pf-projects__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .pf-nav__links {
    display: none;
    flex-direction: column;
    position: fixed;
    top: 64px; left: 0; right: 0;
    background: #fff;
    padding: 1rem;
    border-bottom: 1px solid var(--border);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    gap: 0.25rem;
  }
  .pf-nav__links--open { display: flex; }
  .pf-nav__link { width: 100%; text-align: left; padding: 0.625rem 0.75rem; }
  .pf-btn--sm { width: 100%; justify-content: center; }
  .pf-nav__burger { display: flex; }

  .pf-about__grid { grid-template-columns: 1fr; gap: 2rem; }
  .pf-about__photo { order: -1; }
  .pf-form__row { grid-template-columns: 1fr; }
  .pf-footer__inner { flex-direction: column; text-align: center; }
  .pf-section { padding: 64px 0; }
}
</style>
