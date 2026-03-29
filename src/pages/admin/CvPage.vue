<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { cvService } from '@/services/cvService'
import type { CvResponse } from '@/types/cv'

const currentCv = ref<CvResponse | null>(null)
const uploading = ref(false)
const error = ref('')
const success = ref('')
const dragOver = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(true)

onMounted(async () => {
  currentCv.value = await cvService.getInfo()
  loading.value = false
})

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes  } B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)  } KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)  } MB`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function triggerFileSelect() {
  fileInput.value?.click()
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    handleFile(input.files[0])
  }
}

function onDrop(event: DragEvent) {
  dragOver.value = false
  if (event.dataTransfer?.files.length) {
    handleFile(event.dataTransfer.files[0])
  }
}

async function handleFile(file: File) {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  if (!allowed.includes(file.type)) {
    error.value = 'Only PDF, DOC and DOCX files are allowed.'
    return
  }

  error.value = ''
  success.value = ''
  uploading.value = true

  try {
    currentCv.value = await cvService.upload(file)
    success.value = 'CV uploaded successfully.'
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Upload failed.'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="cv">
    <div class="cv__header">
      <div>
        <h1 class="cv__title">Curriculum Vitae</h1>
        <p class="cv__sub">
          Upload or replace your CV. Visitors can download it from the portfolio.
        </p>
      </div>
    </div>

    <div v-if="loading" class="cv__loading">
      <span class="cv__spinner" />
    </div>
    <div v-else>
      <!-- Current CV info -->
      <div v-if="currentCv" class="cv__current">
        <div class="cv__file-icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5b21b6"
            stroke-width="1.5"
          >
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="cv__file-info">
          <p class="cv__filename">
            {{ currentCv.original_filename }}
          </p>
          <p class="cv__file-meta">
            {{ formatSize(currentCv.file_size) }}
            <template v-if="currentCv.uploaded_at">
              &middot; Uploaded {{ formatDate(currentCv.uploaded_at) }}
            </template>
          </p>
        </div>
        <a :href="cvService.downloadUrl()" target="_blank" class="cv__download-btn">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Preview
        </a>
      </div>

      <!-- Messages -->
      <div v-if="error" class="cv__msg cv__msg--error">
        {{ error }}
      </div>
      <div v-if="success" class="cv__msg cv__msg--success">
        {{ success }}
      </div>

      <!-- Upload area -->
      <!-- eslint-disable vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
      <div
        class="cv__dropzone"
        :class="{ 'cv__dropzone--active': dragOver, 'cv__dropzone--uploading': uploading }"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="onDrop"
        @click="triggerFileSelect"
      >
        <!-- eslint-enable vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
        <input
          ref="fileInput"
          type="file"
          accept=".pdf,.doc,.docx"
          class="cv__file-input"
          aria-label="Upload CV file"
          @change="onFileSelected"
        />
        <div v-if="uploading" class="cv__uploading">
          <span class="cv__spinner" />
          <p>Uploading...</p>
        </div>
        <div v-else class="cv__dropzone-content">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            stroke-width="1.5"
          >
            <path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p class="cv__dropzone-text">
            <span class="cv__dropzone-link">Click to select</span> or drag and drop
          </p>
          <p class="cv__dropzone-hint">PDF, DOC, DOCX — max 10 MB</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cv {
  max-width: 700px;
}

.cv__loading {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.cv__header {
  margin-bottom: 1.75rem;
}

.cv__title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #111;
  margin: 0 0 0.25rem;
}

.cv__sub {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Spinner */
.cv__spinner {
  display: block;
  width: 40px;
  height: 40px;
  border: 3px solid #ede9fe;
  border-top-color: #5b21b6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Current CV */
.cv__current {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.25rem;
}

.cv__file-info {
  flex: 1;
}

.cv__filename {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111;
  margin: 0 0 0.25rem;
}

.cv__file-meta {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
}

.cv__download-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  background: #5b21b6;
  color: #fff;
  text-decoration: none;
  transition: opacity 0.15s;
}

.cv__download-btn:hover {
  opacity: 0.88;
}

/* Messages */
.cv__msg {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
}

.cv__msg--error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.cv__msg--success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

/* Dropzone */
.cv__dropzone {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #fafafa;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.cv__dropzone:hover {
  border-color: #5b21b6;
  background: #faf5ff;
}

.cv__dropzone--active {
  border-color: #5b21b6;
  background: #ede9fe;
}

.cv__dropzone--uploading {
  cursor: default;
  pointer-events: none;
}

.cv__file-input {
  display: none;
}

.cv__dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
}

.cv__dropzone-text {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

.cv__dropzone-link {
  color: #5b21b6;
  font-weight: 600;
  text-decoration: underline;
}

.cv__dropzone-hint {
  font-size: 0.8125rem;
  color: #9ca3af;
  margin: 0;
}

.cv__uploading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  color: #6b7280;
  font-size: 0.9375rem;
}
</style>
