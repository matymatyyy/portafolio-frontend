<script setup lang="ts">
const skillCategories = [
  {
    title: 'Backend',
    color: '#5b21b6',
    skills: ['PHP', 'Symfony', 'Python', 'REST APIs'],
  },
  {
    title: 'Frontend',
    color: '#0891b2',
    skills: ['Vue.js', 'TypeScript', 'HTML / CSS', 'Responsive Design'],
  },
  {
    title: 'Architecture & Testing',
    color: '#059669',
    skills: ['Hexagonal / DDD', 'PHPUnit', 'PHPStan', 'ECS'],
  },
  {
    title: 'DevOps & Tools',
    color: '#d97706',
    skills: ['Git / GitHub', 'OpenShift', 'CI/CD', 'PostgreSQL', 'Redis'],
  },
]
</script>

<template>
  <section id="skills" class="pf-section pf-skills">
    <div class="pf-container">
      <p class="pf-section__label pf-section__label--center">What I work with</p>
      <h2 class="pf-section__title pf-section__title--center">Skills &amp; Stack</h2>
      <div class="pf-skills__grid">
        <div v-for="cat in skillCategories" :key="cat.title" class="pf-skill-card">
          <div class="pf-skill-card__header">
            <span class="pf-skill-card__icon" :style="{ background: cat.color + '18', color: cat.color }">
              <!-- Backend -->
              <svg v-if="cat.title === 'Backend'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="6" cy="18" r="1" fill="currentColor" stroke="none"/></svg>
              <!-- Frontend -->
              <svg v-else-if="cat.title === 'Frontend'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              <!-- Architecture -->
              <svg v-else-if="cat.title.includes('Architecture')" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              <!-- DevOps -->
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </span>
            <span class="pf-skill-card__name">{{ cat.title }}</span>
          </div>
          <div class="pf-skill-card__tags">
            <span
              v-for="skill in cat.skills"
              :key="skill"
              class="pf-skill-tag"
              :style="({ '--tag-color': cat.color } as Record<string, string>)"
            >{{ skill }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

/* Fallback for browsers without color-mix support */
@supports not (background: color-mix(in srgb, red 10%, transparent)) {
  .pf-skill-tag {
    background: var(--accent-light);
    color: var(--tag-color);
    border-color: var(--border);
  }
}

@media (max-width: 1024px) {
  .pf-skills__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 580px) {
  .pf-skills__grid { grid-template-columns: 1fr; }
  .pf-skill-card { padding: 1.25rem; }
}
</style>
