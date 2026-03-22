<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const hideNav = computed(() => !!route.meta.hideNav)
</script>

<template>
  <nav v-if="!hideNav" class="navbar">
    <span class="navbar__brand">Portfolio</span>
  </nav>
  <main :class="{ 'main--offset': !hideNav }">
    <RouterView />
  </main>
</template>

<style scoped>
.navbar {
  height: 3.5rem;
  background: #1e40af;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
}
.navbar__brand { color: #fff; font-weight: 700; font-size: 1.125rem; letter-spacing: 0.025em; }
.main--offset { min-height: calc(100vh - 3.5rem); }
</style>
