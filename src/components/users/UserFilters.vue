<script setup lang="ts">
import { ref } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import type { UserFilters } from '@/types/user'

const emit = defineEmits<{ search: [filters: UserFilters] }>()

const name = ref('')
const email = ref('')

function submit() {
  emit('search', {
    ...(name.value && { name: name.value }),
    ...(email.value && { email: email.value }),
  })
}

function clear() {
  name.value = ''
  email.value = ''
  emit('search', {})
}
</script>

<template>
  <form
    class="filters"
    @submit.prevent="submit"
  >
    <AppInput
      v-model="name"
      placeholder="Filter by name"
    />
    <AppInput
      v-model="email"
      placeholder="Filter by email"
    />
    <AppButton type="submit">
      Search
    </AppButton>
    <AppButton
      variant="secondary"
      @click="clear"
    >
      Clear
    </AppButton>
  </form>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}
</style>
