<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <a
    href="#main-content"
    class="skip-link"
  >Skip to content</a>
  <RouterView v-slot="{ Component }">
    <transition
      name="fade"
      mode="out-in"
    >
      <component :is="Component" />
    </transition>
  </RouterView>
</template>
