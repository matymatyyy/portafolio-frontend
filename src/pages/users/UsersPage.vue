<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import UserTable from '@/components/users/UserTable.vue'
import UserFilters from '@/components/users/UserFilters.vue'
import Pagination from '@/components/common/Pagination.vue'
import AppButton from '@/components/common/AppButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useUsers } from '@/composables/useUsers'
import type { UserFilters as Filters } from '@/types/user'

const { users, loading, error, pagination, fetchUsers, applyFilters, deleteUser } = useUsers()

onMounted(fetchUsers)

async function handleDelete(id: string) {
  if (!confirm('Delete this user?')) return
  await deleteUser(id)
}

function handleSearch(filters: Filters) {
  applyFilters(filters)
  fetchUsers()
}
</script>

<template>
  <div class="page">
    <header class="page__header">
      <div>
        <h1 class="page__title">Users</h1>
        <p class="page__sub">Manage admin accounts</p>
      </div>
      <RouterLink :to="{ name: 'user-create' }">
        <AppButton>+ New User</AppButton>
      </RouterLink>
    </header>

    <UserFilters @search="handleSearch" />

    <div v-if="error" class="alert alert--error">{{ error }}</div>

    <div v-if="loading && users.length === 0" class="page__loading">
      <LoadingSpinner size="lg" />
    </div>

    <template v-else>
      <UserTable :users="users" :loading="loading" @delete="handleDelete" />

      <Pagination
        v-if="pagination.meta.value"
        :meta="pagination.meta.value"
        :current-page="pagination.page.value"
        @change="pagination.goTo"
      />
    </template>
  </div>
</template>

<style scoped>
.page { max-width: 1000px; }
.page__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.75rem;
}
.page__title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #111;
  margin: 0 0 0.25rem;
}
.page__sub {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
.page__loading { display: flex; justify-content: center; padding: 3rem 0; }
.alert { padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.875rem; }
.alert--error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
</style>
