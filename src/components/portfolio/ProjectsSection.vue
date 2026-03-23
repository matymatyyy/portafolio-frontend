<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { projectService } from '@/services/projectService'
import type { Project } from '@/types/project'

const projects = ref<Project[]>([])
const loading = ref(false)
const projectsPerPage = 6
const visible = ref(projectsPerPage)
const visibleProjects = computed(() => projects.value.slice(0, visible.value))
const hasMore = computed(() => visible.value < projects.value.length)

function showMore() { visible.value += projectsPerPage }

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

onMounted(async () => {
  loading.value = true
  try {
    const result = await projectService.list({ status: 'active', limit: 100 })
    projects.value = result.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section id="projects" class="pf-section pf-projects">
    <div class="pf-container">
      <p class="pf-section__label pf-section__label--center">What I've built</p>
      <h2 class="pf-section__title pf-section__title--center">Selected Projects</h2>

      <div v-if="loading" class="pf-projects__loading">
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
            :aria-label="`View details for ${project.title}`"
          >
            View details
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </RouterLink>
        </article>
      </div>

      <div v-if="hasMore" class="pf-projects__more">
        <button class="pf-btn pf-btn--outline" @click="showMore">Show more projects</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

@media (max-width: 1024px) {
  .pf-projects__grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
