<script setup lang="ts">
import avatarImg from '@/assets/avatar.png'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const cvUrl = `${import.meta.env.VITE_API_URL}/api/cv`
</script>

<template>
  <section
    id="about"
    class="pf-section pf-about"
  >
    <div class="pf-container pf-about__grid">
      <div class="pf-about__photo reveal reveal--fade-right">
        <div class="pf-about__avatar-wrap">
          <img
            :src="avatarImg"
            alt="Matias Dominguez"
            class="pf-about__avatar"
            loading="lazy"
            width="220"
            height="220"
          >
        </div>
      </div>
      <div class="pf-about__body">
        <p class="pf-section__label reveal reveal--fade-up">
          {{ t('about.label') }}
        </p>
        <h2 class="pf-section__title reveal reveal--fade-up">
          {{ t('about.title').split('\n')[0] }}<br>{{ t('about.title').split('\n')[1] }}
        </h2>
        <p class="pf-about__text reveal reveal--fade-up">
          {{ t('about.text1') }}
        </p>
        <p class="pf-about__text reveal reveal--fade-up">
          {{ t('about.text2') }}
        </p>
        <div class="pf-about__stats reveal reveal--fade-up">
          <div class="pf-stat">
            <span class="pf-stat__value">9+</span>
            <span class="pf-stat__label">{{ t('about.statTech') }}</span>
          </div>
          <div class="pf-stat">
            <span class="pf-stat__value">10+</span>
            <span class="pf-stat__label">{{ t('about.statProjects') }}</span>
          </div>
          <div class="pf-stat">
            <span class="pf-stat__value">2</span>
            <span class="pf-stat__label">{{ t('about.statDegrees') }}</span>
          </div>
        </div>
        <a
          :href="cvUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="pf-btn pf-btn--outline pf-about__cv reveal reveal--fade-up"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ t('about.downloadCv') }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

@media (max-width: 1024px) {
  .pf-about__grid { grid-template-columns: 1fr 2.5fr; gap: 2.5rem; }
}
@media (max-width: 768px) {
  .pf-about__grid { grid-template-columns: 1fr; gap: 2rem; }
  .pf-about__photo { order: -1; }
  .pf-about__avatar-wrap { width: 160px; height: 160px; }
  .pf-about__body { text-align: center; }
  .pf-about__stats { justify-content: center; }
  .pf-about__cv { justify-content: center; }
  .pf-about__text { font-size: 0.9375rem; }
}

@media (max-width: 480px) {
  .pf-about__avatar-wrap { width: 130px; height: 130px; }
  .pf-about__stats { gap: 1.5rem; }
  .pf-stat__value { font-size: 1.625rem; }
}
</style>
