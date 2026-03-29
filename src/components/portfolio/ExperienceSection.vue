<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t, tm } = useI18n()

interface Job {
  role: string
  company: string
  start: string
  end: string
  description: string
  technologies: string[]
}

function getJobs(): Job[] {
  return tm('experience.jobs') as Job[]
}
</script>

<template>
  <section id="experience" class="pf-section pf-experience">
    <div class="pf-container">
      <p class="pf-section__label pf-section__label--center reveal reveal--fade-up">
        {{ t('experience.label') }}
      </p>
      <h2 class="pf-section__title pf-section__title--center reveal reveal--fade-up">
        {{ t('experience.title') }}
      </h2>

      <div class="pf-timeline">
        <article
          v-for="(job, i) in getJobs()"
          :key="i"
          class="pf-timeline__item reveal reveal--fade-up"
        >
          <div class="pf-timeline__dot" />
          <div class="pf-timeline__card">
            <div class="pf-timeline__header">
              <div>
                <h3 class="pf-timeline__role">
                  {{ job.role }}
                </h3>
                <p class="pf-timeline__company">
                  {{ job.company }}
                </p>
              </div>
              <span class="pf-timeline__period">
                {{ job.start }} — {{ job.end || t('experience.present') }}
              </span>
            </div>
            <p class="pf-timeline__desc">
              {{ job.description }}
            </p>
            <div class="pf-timeline__tags">
              <span v-for="tech in job.technologies" :key="tech" class="pf-tag">{{ tech }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pf-experience {
  background: var(--bg);
}

.pf-timeline {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  padding-left: 2rem;
}
.pf-timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--accent), var(--border));
  border-radius: 2px;
}

.pf-timeline__item {
  position: relative;
  padding-bottom: 2.5rem;
}
.pf-timeline__item:last-child {
  padding-bottom: 0;
}

.pf-timeline__dot {
  position: absolute;
  left: -2rem;
  top: 0.25rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  border: 3px solid var(--bg);
  box-shadow: 0 0 0 2px var(--accent);
  z-index: 1;
}

.pf-timeline__card {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition:
    box-shadow var(--transition),
    transform var(--transition);
}
.pf-timeline__card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.pf-timeline__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.pf-timeline__role {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--fg);
  margin: 0;
}
.pf-timeline__company {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--accent);
  margin: 0.125rem 0 0;
}
.pf-timeline__period {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--fg-muted);
  white-space: nowrap;
  background: var(--bg);
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  border: 1px solid var(--border);
}

.pf-timeline__desc {
  font-size: 0.9375rem;
  color: var(--fg-muted);
  line-height: 1.7;
  margin: 0 0 1rem;
}

.pf-timeline__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

@media (max-width: 768px) {
  .pf-timeline {
    padding-left: 1.75rem;
  }
  .pf-timeline__dot {
    left: -1.75rem;
    width: 14px;
    height: 14px;
  }
  .pf-timeline__header {
    flex-direction: column;
    gap: 0.5rem;
  }
  .pf-timeline__period {
    align-self: flex-start;
  }
  .pf-timeline__card {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .pf-timeline {
    padding-left: 1.5rem;
  }
  .pf-timeline__dot {
    left: -1.5rem;
    width: 12px;
    height: 12px;
  }
  .pf-timeline__card {
    padding: 1rem;
  }
  .pf-timeline__role {
    font-size: 1rem;
  }
  .pf-timeline__desc {
    font-size: 0.875rem;
  }
}
</style>
