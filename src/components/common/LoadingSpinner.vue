<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' }>()
</script>

<template>
  <div
    :class="['spinner', `spinner--${size ?? 'md'}`]"
    role="status"
    aria-label="Loading"
  />
</template>

<style scoped>
.spinner {
  display: inline-block;
  border-radius: 50%;
  border: 3px solid #ede9fe;
  border-top-color: #5b21b6;
  animation: spin 0.7s linear infinite;
}
.spinner--sm { width: 1rem; height: 1rem; }
.spinner--md { width: 2rem; height: 2rem; }
.spinner--lg { width: 3rem; height: 3rem; }

@keyframes spin { to { transform: rotate(360deg); } }
</style>
