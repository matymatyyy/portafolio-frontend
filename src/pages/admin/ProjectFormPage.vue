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

// Image upload state
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const dragOver = ref(false)

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

function triggerFileSelect() {
  fileInput.value?.click()
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.length) handleImageUpload(input.files[0])
}

function onDrop(event: DragEvent) {
  dragOver.value = false
  if (event.dataTransfer?.files.length) handleImageUpload(event.dataTransfer.files[0])
}

async function handleImageUpload(file: File) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) {
    uploadError.value = 'Only JPG, PNG, WebP and GIF files are allowed.'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'Image must be under 5 MB.'
    return
  }

  uploadError.value = ''
  uploading.value = true
  try {
    const { url } = await projectService.uploadImage(file)
    form.value.imageUrl = url
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : 'Upload failed.'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function removeImage() {
  form.value.imageUrl = ''
}

function validate(): boolean {
  errors.value = {}
  if (!form.value.title || form.value.title.length < 2)
    {errors.value.title = 'Title must be at least 2 characters.'}
  if (!form.value.description) errors.value.description = 'Description is required.'
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
      imageUrl: form.value.imageUrl || null,
      projectUrl: form.value.projectUrl || null,
      repoUrl: form.value.repoUrl || null,
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
      <h1 class="page__title">
        {{ isEditing ? 'Edit Project' : 'New Project' }}
      </h1>
      <p class="page__sub">
        {{ isEditing ? 'Update project details' : 'Add a new project to your portfolio' }}
      </p>
    </div>

    <div v-if="fetching" class="page__loading">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else class="form-card">
      <form class="form" @submit.prevent="submit">
        <div v-if="serverError" class="alert alert--error">
          {{ serverError }}
        </div>

        <AppInput
          v-model="form.title"
          label="Title"
          placeholder="My awesome project"
          :error="errors.title"
        />

        <div class="field">
          <label class="field__label" for="pf-description">Description</label>
          <textarea
            id="pf-description"
            v-model="form.description"
            class="field__textarea"
            :class="{ 'field__textarea--error': errors.description }"
            placeholder="Brief description of the project…"
            rows="3"
          />
          <span v-if="errors.description" class="field__error">{{ errors.description }}</span>
        </div>

        <!-- Image upload -->
        <div class="field">
          <label class="field__label" for="pf-image">Project Image (optional)</label>

          <!-- Preview -->
          <div v-if="form.imageUrl" class="img-preview">
            <img :src="form.imageUrl" alt="Project image" class="img-preview__img" />
            <div class="img-preview__actions">
              <button type="button" class="img-preview__remove" @click="removeImage">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" stroke-linecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" stroke-linecap="round" />
                </svg>
                Remove
              </button>
              <button type="button" class="img-preview__change" @click="triggerFileSelect">
                Change image
              </button>
            </div>
          </div>

          <!-- Dropzone -->
          <!-- eslint-disable vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
          <div
            v-else
            class="img-dropzone"
            :class="{ 'img-dropzone--active': dragOver, 'img-dropzone--uploading': uploading }"
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="dragOver = false"
            @drop.prevent="onDrop"
            @click="triggerFileSelect"
          >
            <!-- eslint-enable vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
            <div v-if="uploading" class="img-dropzone__uploading">
              <span class="img-spinner" />
              <p>Uploading...</p>
            </div>
            <div v-else class="img-dropzone__content">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="8.5" cy="8.5" r="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M21 15l-5-5L5 21" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p class="img-dropzone__text">
                <span class="img-dropzone__link">Click to select</span> or drag and drop
              </p>
              <p class="img-dropzone__hint">JPG, PNG, WebP, GIF — max 5 MB</p>
            </div>
          </div>

          <input
            id="pf-image"
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            class="img-file-input"
            aria-label="Upload project image"
            @change="onFileSelected"
          />
          <span v-if="uploadError" class="field__error">{{ uploadError }}</span>
        </div>
        <AppInput
          v-model="form.projectUrl"
          label="Project URL (optional)"
          placeholder="https://myproject.com"
        />
        <AppInput
          v-model="form.repoUrl"
          label="Repository URL (optional)"
          placeholder="https://github.com/user/repo"
        />

        <AppInput
          v-model="form.technologies"
          label="Technologies (comma separated)"
          placeholder="Vue 3, TypeScript, Tailwind"
        />

        <div class="field">
          <label class="field__label" for="pf-status">Status</label>
          <select id="pf-status" v-model="form.status" class="field__select">
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div class="form__actions">
          <AppButton type="submit" :loading="loading">
            {{ isEditing ? 'Save Changes' : 'Create Project' }}
          </AppButton>
          <AppButton variant="secondary" @click="$router.back()"> Cancel </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 640px;
}
.page__header {
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
.page__loading {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.form-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.form__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}
.alert--error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.field__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.field__textarea,
.field__select {
  padding: 0.5rem 0.875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  background: #fff;
  resize: vertical;
}

.field__textarea:focus,
.field__select:focus {
  border-color: #5b21b6;
  box-shadow: 0 0 0 3px #ede9fe;
}
.field__textarea--error {
  border-color: #ef4444;
}
.field__textarea--error:focus {
  box-shadow: 0 0 0 3px #fee2e2;
}
.field__error {
  font-size: 0.75rem;
  color: #ef4444;
}

/* ─── Image upload ─── */
.img-file-input {
  display: none;
}

.img-dropzone {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  background: #fafafa;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.img-dropzone:hover {
  border-color: #5b21b6;
  background: #faf5ff;
}
.img-dropzone--active {
  border-color: #5b21b6;
  background: #ede9fe;
}
.img-dropzone--uploading {
  cursor: default;
  pointer-events: none;
}
.img-dropzone__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
}
.img-dropzone__text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
.img-dropzone__link {
  color: #5b21b6;
  font-weight: 600;
  text-decoration: underline;
}
.img-dropzone__hint {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}
.img-dropzone__uploading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}
.img-spinner {
  display: block;
  width: 32px;
  height: 32px;
  border: 3px solid #ede9fe;
  border-top-color: #5b21b6;
  border-radius: 50%;
  animation: img-spin 0.7s linear infinite;
}
@keyframes img-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ─── Image preview ─── */
.img-preview {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #f9fafb;
}
.img-preview__img {
  display: block;
  width: 100%;
  max-height: 240px;
  object-fit: cover;
}
.img-preview__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
}
.img-preview__remove,
.img-preview__change {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  transition:
    background 0.15s,
    color 0.15s;
}
.img-preview__remove {
  color: #dc2626;
}
.img-preview__remove:hover {
  background: #fef2f2;
}
.img-preview__change {
  color: #5b21b6;
}
.img-preview__change:hover {
  background: #faf5ff;
}
</style>
