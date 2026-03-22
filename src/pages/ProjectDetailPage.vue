<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projectService } from '@/services/projectService'
import { visitService } from '@/services/visitService'
import type { Project } from '@/types/project'

const route = useRoute()
const router = useRouter()

const project = ref<Project | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  visitService.register(route.path).catch(() => {})
  try {
    project.value = await projectService.get(route.params.id as string)
  } catch {
    error.value = 'Project not found.'
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push({ path: '/', hash: '#projects' })
}
</script>

<template>
  <div class="pd-page">
    <!-- ── NAV ── -->
    <header class="pd-nav">
      <div class="pd-container pd-nav__inner">
        <button class="pd-nav__logo" @click="router.push('/')">maty.</button>
      </div>
    </header>

    <!-- ── CONTENT ── -->
    <main class="pd-main pd-container">
      <div v-if="loading" class="pd-loading">
        <span class="pd-spinner" />
      </div>

      <div v-else-if="error" class="pd-error">
        <p>{{ error }}</p>
        <button class="pd-btn pd-btn--outline" @click="goBack">← Back to portfolio</button>
      </div>

      <template v-else-if="project">
        <button class="pd-back" @click="goBack">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Back to projects
        </button>

        <div class="pd-hero">
          <div class="pd-hero__thumb" />
        </div>

        <div class="pd-body">
          <div class="pd-body__main">
            <div class="pd-tags">
              <span v-for="tech in project.technologies" :key="tech" class="pd-tag">{{ tech }}</span>
            </div>
            <h1 class="pd-title">{{ project.title }}</h1>
            <p class="pd-desc">{{ project.description }}</p>
          </div>

          <aside class="pd-sidebar">
            <div class="pd-card">
              <p class="pd-card__label">Links</p>
              <a
                v-if="project.project_url"
                :href="project.project_url"
                class="pd-link-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke-linecap="round" stroke-linejoin="round" />
                  <polyline points="15 3 21 3 21 9" stroke-linecap="round" stroke-linejoin="round" />
                  <line x1="10" y1="14" x2="21" y2="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Live demo
              </a>
              <a
                v-if="project.repo_url"
                :href="project.repo_url"
                class="pd-link-btn pd-link-btn--secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Source code
              </a>
              <p v-if="!project.project_url && !project.repo_url" class="pd-card__empty">No links available.</p>
            </div>

            <div class="pd-card">
              <p class="pd-card__label">Status</p>
              <span class="pd-status" :class="`pd-status--${project.status}`">
                {{ project.status === 'active' ? 'Active' : 'Archived' }}
              </span>
            </div>
          </aside>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
/* ─── Tokens ─── */
.pd-page {
  --bg: #ffffff;
  --bg-alt: #f7f7f8;
  --fg: #111111;
  --fg-muted: #6b7280;
  --accent: #5b21b6;
  --accent-light: #ede9fe;
  --border: #e5e7eb;
  --radius: 12px;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  background: var(--bg);
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--fg);
}

:global(*, *::before, *::after) { box-sizing: border-box; }
:global(body) { margin: 0; }
:global(button) { cursor: pointer; font: inherit; border: none; background: none; }
:global(a) { text-decoration: none; color: inherit; }

/* ─── Container ─── */
.pd-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ─── Nav ─── */
.pd-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.pd-nav__inner {
  height: 64px;
  display: flex;
  align-items: center;
}
.pd-nav__logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.03em;
}

/* ─── Main ─── */
.pd-main {
  padding: 2.5rem 1.5rem 5rem;
}

/* ─── Back button ─── */
.pd-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--fg-muted);
  margin-bottom: 2rem;
  transition: color var(--transition);
}
.pd-back:hover { color: var(--accent); }

/* ─── Hero thumb ─── */
.pd-hero__thumb {
  width: 100%;
  height: 320px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, var(--accent-light), #ddd6fe);
  margin-bottom: 2.5rem;
}

/* ─── Body grid ─── */
.pd-body {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 3rem;
  align-items: start;
}

/* ─── Tags ─── */
.pd-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 1rem; }
.pd-tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--accent-light);
  color: var(--accent);
}

/* ─── Title / Description ─── */
.pd-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 1.25rem;
}
.pd-desc {
  font-size: 1.0625rem;
  color: var(--fg-muted);
  line-height: 1.75;
  margin: 0;
  white-space: pre-line;
}

/* ─── Sidebar cards ─── */
.pd-sidebar { display: flex; flex-direction: column; gap: 1rem; }
.pd-card {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
}
.pd-card__label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg-muted);
  margin: 0 0 0.875rem;
}
.pd-card__empty { font-size: 0.875rem; color: var(--fg-muted); margin: 0; }

/* ─── Link buttons ─── */
.pd-link-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  background: var(--accent);
  color: #fff;
  margin-bottom: 0.625rem;
  transition: opacity var(--transition);
}
.pd-link-btn:last-child { margin-bottom: 0; }
.pd-link-btn:hover { opacity: 0.85; }
.pd-link-btn--secondary {
  background: transparent;
  color: var(--fg);
  border: 1.5px solid var(--border);
}
.pd-link-btn--secondary:hover { border-color: var(--accent); color: var(--accent); opacity: 1; }

/* ─── Status badge ─── */
.pd-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.8125rem;
  font-weight: 600;
}
.pd-status--active { background: #d1fae5; color: #065f46; }
.pd-status--archived { background: #f3f4f6; color: var(--fg-muted); }

/* ─── Buttons ─── */
.pd-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.375rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  background: var(--accent);
  color: #fff;
  transition: opacity var(--transition);
}
.pd-btn--outline {
  background: transparent;
  color: var(--fg);
  border: 2px solid var(--border);
}
.pd-btn--outline:hover { border-color: var(--accent); color: var(--accent); }

/* ─── Loading / Error ─── */
.pd-loading {
  display: flex;
  justify-content: center;
  padding: 8rem 0;
}
.pd-spinner {
  display: block;
  width: 44px;
  height: 44px;
  border: 3px solid var(--accent-light);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.pd-error {
  text-align: center;
  padding: 6rem 0;
  color: var(--fg-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .pd-body { grid-template-columns: 1fr; }
  .pd-hero__thumb { height: 200px; }
}
</style>
