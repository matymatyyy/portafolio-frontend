<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import { formatDate } from '@/utils/formatters'
import type { User } from '@/types/user'

defineProps<{ users: User[]; loading?: boolean }>()

const emit = defineEmits<{ delete: [id: string] }>()
</script>

<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="4" class="table__empty">Loading…</td>
        </tr>
        <tr v-else-if="users.length === 0">
          <td colspan="4" class="table__empty">No users found.</td>
        </tr>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ formatDate(user.created_at) }}</td>
          <td class="table__actions">
            <RouterLink :to="{ name: 'user-edit', params: { id: user.id } }">
              <AppButton variant="secondary" size="sm"> Edit </AppButton>
            </RouterLink>
            <AppButton variant="danger" @click="emit('delete', user.id)"> Delete </AppButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.table th,
.table td {
  padding: 0.875rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}
.table th {
  font-weight: 700;
  color: #6b7280;
  background: #f9fafb;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.table th:first-child {
  border-radius: 12px 0 0 0;
}
.table th:last-child {
  border-radius: 0 12px 0 0;
}
.table tr:last-child td {
  border-bottom: none;
}
.table tr:hover td {
  background: #faf5ff;
}
.table__empty {
  text-align: center;
  color: #9ca3af;
  padding: 2rem;
}
.table__actions {
  display: flex;
  gap: 0.5rem;
}
</style>
