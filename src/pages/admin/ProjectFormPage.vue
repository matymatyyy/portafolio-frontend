<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { projectService } from '@/services/projectService'

const route = useRoute()
const router = useRouter()

const projectId = computed(() => route.params.id as string | undefined)
const isEditing = computed(() => !!projectId.value)

const form = ref({
  title: '',
  description: '',
  imageUrl: '',
  projectUrl: '',
  repoUrl: '',
  technologies: '',
  status: 'active' as 'active' | 'archived',
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const fetching = ref(false)
const serverError = ref<string | null>(null)

onMounted(async () => {
  if (!isEditing.value) return
  fetching.value = true
  try {
    const project = await projectService.get(projectId.value!)
    form.value.title = project.title
    form.value.description = project.description
    form.value.imageUrl = project.image_url ?? ''
    form.value.projectUrl = project.project_url ?? ''
    form.value.repoUrl = project.repo_url ?? ''
    form.value.technologies = project.technologies.join(', ')
    form.value.status = project.status
  } catch {
    serverError.value = 'Failed to load project'
  } finally {
    fetching.value = false
  }
})

function validate(): boolean {
  errors.value = {}
  if (!form.value.title || form.value.title.length < 2)
    errors.value.title = 'Title must be at least 2 characters.'
  if (!form.value.description)
    errors.value.description = 'Description is required.'
  return Object.keys(errors.value).length === 0
}

function parseTechnologies(): string[] {
  return form.value.technologies
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

async function submit() {
  if (!validate()) return
  loading.value = true
  serverError.value = null
  try {
    const payload = {
      title: form.value.title,
      description: form.value.description,
      image_url: form.value.imageUrl || null,
      project_url: form.value.projectUrl || null,
      repo_url: form.value.repoUrl || null,
      technologies: parseTechnologies(),
      status: form.value.status,
    }
    if (isEditing.value) {
      await projectService.update(projectId.value!, payload)
    } else {
      await projectService.create(payload)
    }
    router.push({ name: 'admin-projects' })
  } catch (e) {
    serverError.value = e instanceof Error ? e.message : 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ isEditing ? 'Edit Project' : 'New Project' }}</h1>
      <p class="page__sub">{{ isEditing ? 'Update project details' : 'Add a new project to your portfolio' }}</p>
    </div>

    <div v-if="fetching" class="page__loading">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else class="form-card">
      <form class="form" @submit.prevent="submit">
        <div v-if="serverError" class="alert alert--error">{{ serverError }}</div>

      <AppInput v-model="form.title" label="Title" placeholder="My awesome project" :error="errors.title" />

      <div class="field">
        <label class="field__label">Description</label>
        <textarea
          v-model="form.description"
          class="field__textarea"
          :class="{ 'field__textarea--error': errors.description }"
          placeholder="Brief description of the project…"
          rows="3"
        />
        <span v-if="errors.description" class="field__error">{{ errors.description }}</span>
      </div>

      <AppInput v-model="form.imageUrl" label="Image URL (optional)" placeholder="https://example.com/image.png" />
      <AppInput v-model="form.projectUrl" label="Project URL (optional)" placeholder="https://myproject.com" />
      <AppInput v-model="form.repoUrl" label="Repository URL (optional)" placeholder="https://github.com/user/repo" />

      <AppInput
        v-model="form.technologies"
        label="Technologies (comma separated)"
        placeholder="Vue 3, TypeScript, Tailwind"
      />

      <div class="field">
        <label class="field__label">Status</label>
        <select v-model="form.status" class="field__select">
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

        <div class="form__actions">
          <AppButton type="submit" :loading="loading">
            {{ isEditing ? 'Save Changes' : 'Create Project' }}
          </AppButton>
          <AppButton variant="secondary" @click="$router.back()">Cancel</AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 640px; }
.page__header { margin-bottom: 1.75rem; }
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

.form-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.form { display: flex; flex-direction: column; gap: 1.25rem; }
.form__actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }

.alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.875rem; }
.alert--error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

.field { display: flex; flex-direction: column; gap: 0.375rem; }
.field__label { font-size: 0.875rem; font-weight: 600; color: #374151; }

.field__textarea,
.field__select {
  padding: 0.5rem 0.875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff;
  resize: vertical;
}

.field__textarea:focus,
.field__select:focus {
  border-color: #5b21b6;
  box-shadow: 0 0 0 3px #ede9fe;
}
.field__textarea--error { border-color: #ef4444; }
.field__textarea--error:focus { box-shadow: 0 0 0 3px #fee2e2; }
.field__error { font-size: 0.75rem; color: #ef4444; }
</style>
