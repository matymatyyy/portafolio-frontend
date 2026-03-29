<template>
  <div class="skeleton-card">
    <div class="skeleton-card__thumb skeleton-shimmer" />
    <div class="skeleton-card__body">
      <div class="skeleton-card__title skeleton-shimmer" />
      <div class="skeleton-card__line skeleton-shimmer" />
      <div class="skeleton-card__line skeleton-card__line--short skeleton-shimmer" />
      <div class="skeleton-card__tags">
        <span class="skeleton-card__tag skeleton-shimmer" />
        <span class="skeleton-card__tag skeleton-shimmer" />
        <span class="skeleton-card__tag skeleton-shimmer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.skeleton-card__thumb {
  height: 160px;
}
.skeleton-card__body {
  padding: 1.25rem;
}
.skeleton-card__title {
  height: 1.125rem;
  width: 60%;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}
.skeleton-card__line {
  height: 0.875rem;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
.skeleton-card__line--short {
  width: 75%;
}
.skeleton-card__tags {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.75rem;
}
.skeleton-card__tag {
  height: 1.5rem;
  width: 4rem;
  border-radius: 99px;
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 0%,
    var(--skeleton-shine) 50%,
    var(--skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 640px) {
  .skeleton-card__thumb {
    height: 130px;
  }
  .skeleton-card__body {
    padding: 1rem;
  }
}
</style>
