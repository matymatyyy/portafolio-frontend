<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import Pagination from '@/components/common/Pagination.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useProjects } from '@/composables/useProjects'
import { formatDate } from '@/utils/formatters'
import type { ProjectFilters } from '@/types/project'

const { projects, loading, error, pagination, fetchProjects, applyFilters, deleteProject } = useProjects()

const searchTitle = ref('')
const searchStatus = ref('')

onMounted(fetchProjects)

async function handleDelete(id: string) {
  if (!confirm('Delete this project?')) return
  await deleteProject(id)
}

function handleSearch() {
  const filters: ProjectFilters = {}
  if (searchTitle.value) filters.title = searchTitle.value
  if (searchStatus.value) filters.status = searchStatus.value
  applyFilters(filters)
  fetchProjects()
}

function clearSearch() {
  searchTitle.value = ''
  searchStatus.value = ''
  applyFilters({})
  fetchProjects()
}
</script>

<template>
  <div class="page">
    <header class="page__header">
      <div>
        <h1 class="page__title">
          Projects
        </h1>
        <p class="page__sub">
          Manage your portfolio projects
        </p>
      </div>
      <RouterLink :to="{ name: 'admin-project-create' }">
        <AppButton>+ New Project</AppButton>
      </RouterLink>
    </header>

    <!-- Filters -->
    <div class="filters">
      <input
        v-model="searchTitle"
        class="filters__input"
        placeholder="Search by title…"
        @keyup.enter="handleSearch"
      >
      <select
        v-model="searchStatus"
        class="filters__select"
        @change="handleSearch"
      >
        <option value="">
          All statuses
        </option>
        <option value="active">
          Active
        </option>
        <option value="archived">
          Archived
        </option>
      </select>
      <AppButton
        variant="secondary"
        @click="handleSearch"
      >
        Search
      </AppButton>
      <AppButton
        variant="secondary"
        @click="clearSearch"
      >
        Clear
      </AppButton>
    </div>

    <div
      v-if="error"
      class="alert alert--error"
    >
      {{ error }}
    </div>

    <div
      v-if="loading && projects.length === 0"
      class="page__loading"
    >
      <LoadingSpinner size="lg" />
    </div>

    <template v-else>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Technologies</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td
                colspan="6"
                class="table__empty"
              >
                Loading…
              </td>
            </tr>
            <tr v-else-if="projects.length === 0">
              <td
                colspan="6"
                class="table__empty"
              >
                No projects found.
              </td>
            </tr>
            <tr
              v-for="project in projects"
              :key="project.id"
            >
              <td class="table__title">
                {{ project.title }}
              </td>
              <td class="table__muted">
                {{ project.slug }}
              </td>
              <td>
                <div class="tags">
                  <span
                    v-for="tech in project.technologies.slice(0, 3)"
                    :key="tech"
                    class="tag"
                  >{{ tech }}</span>
                  <span
                    v-if="project.technologies.length > 3"
                    class="tag tag--more"
                  >+{{ project.technologies.length - 3 }}</span>
                </div>
              </td>
              <td>
                <span
                  class="badge"
                  :class="project.status === 'active' ? 'badge--active' : 'badge--archived'"
                >
                  {{ project.status }}
                </span>
              </td>
              <td class="table__muted">
                {{ formatDate(project.created_at) }}
              </td>
              <td class="table__actions">
                <RouterLink :to="{ name: 'admin-project-edit', params: { id: project.id } }">
                  <AppButton variant="secondary">
                    Edit
                  </AppButton>
                </RouterLink>
                <AppButton
                  variant="danger"
                  @click="handleDelete(project.id)"
                >
                  Delete
                </AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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

.filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filters__input,
.filters__select {
  padding: 0.5rem 0.75rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
  background: #fff;
}

.filters__input { flex: 1; min-width: 180px; }
.filters__input:focus,
.filters__select:focus {
  border-color: #5b21b6;
  box-shadow: 0 0 0 3px #ede9fe;
}

.alert { padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.875rem; }
.alert--error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

.table-wrapper {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.table th, .table td { padding: 0.875rem 1.25rem; text-align: left; border-bottom: 1px solid #f3f4f6; }
.table th {
  font-weight: 700;
  color: #6b7280;
  background: #f9fafb;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.table th:first-child { border-radius: 12px 0 0 0; }
.table th:last-child { border-radius: 0 12px 0 0; }
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: #faf5ff; }
.table__empty { text-align: center; color: #9ca3af; padding: 2rem; }
.table__actions { display: flex; gap: 0.5rem; }
.table__title { font-weight: 600; color: #111; }
.table__muted { color: #6b7280; font-size: 0.8125rem; }

.tags { display: flex; gap: 0.25rem; flex-wrap: wrap; }
.tag {
  padding: 0.125rem 0.5rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #ede9fe;
  color: #5b21b6;
}
.tag--more { background: #f3f4f6; color: #6b7280; }

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge--active { background: #d1fae5; color: #065f46; }
.badge--archived { background: #f3f4f6; color: #6b7280; }
</style>
