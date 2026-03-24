<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <h1 class="not-found__code">
      404
    </h1>
    <p class="not-found__msg">
      Page not found.
    </p>
    <button
      class="not-found__btn"
      @click="router.push('/')"
    >
      Go home
    </button>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 0.5rem;
}
.not-found__code { font-size: 5rem; font-weight: 700; color: #d1d5db; margin: 0; }
.not-found__msg  { font-size: 1.125rem; color: #6b7280; }
.not-found__btn  {
  margin-top: 1rem;
  padding: 0.5rem 1.25rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}
</style>
