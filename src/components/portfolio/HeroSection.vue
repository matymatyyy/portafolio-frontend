<script setup lang="ts">
function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="hero" class="pf-hero" role="main">
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
</template>

<style scoped>
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
.pf-hero__actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; padding: 0 1rem; }
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

@media (max-width: 768px) {
  .pf-hero { min-height: calc(100vh - 64px); min-height: calc(100dvh - 64px); }
  .pf-hero__inner { padding: 0 0.5rem; }
  .pf-hero__eyebrow { font-size: 0.875rem; }
  .pf-hero__sub { font-size: 0.9375rem; line-height: 1.6; margin-bottom: 2rem; padding: 0 0.5rem; }
  .pf-hero__scroll { bottom: 1.25rem; }
  .pf-hero__scroll-line { height: 36px; }
}

@media (max-width: 480px) {
  .pf-hero__actions { flex-direction: column; width: 100%; gap: 0.625rem; }
  .pf-hero__actions .pf-btn { width: 100%; justify-content: center; padding: 0.75rem 1.5rem; }
}
</style>
