<script setup lang="ts">
import { ref, reactive } from 'vue'
import { contactService } from '@/services/contactService'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})
const sending = ref(false)
const success = ref(false)
const error = ref('')

let successTimeout: ReturnType<typeof setTimeout> | undefined

async function sendContact() {
  error.value = ''
  success.value = false
  sending.value = true
  try {
    await contactService.send({ ...form })
    success.value = true
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    clearTimeout(successTimeout)
    successTimeout = setTimeout(() => {
      success.value = false
    }, 5000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('contact.error')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section id="contact" class="pf-section pf-contact">
    <div class="pf-container pf-contact__inner">
      <p class="pf-section__label pf-section__label--center reveal reveal--fade-up">
        {{ t('contact.label') }}
      </p>
      <h2 class="pf-section__title pf-section__title--center reveal reveal--fade-up">
        {{ t('contact.title') }}
      </h2>
      <p class="pf-contact__sub reveal reveal--fade-up">
        {{ t('contact.subtitle') }}
      </p>
      <a href="mailto:matydominguez554@gmail.com" class="pf-contact__email reveal reveal--fade-up">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect
            x="2"
            y="4"
            width="20"
            height="16"
            rx="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        matydominguez554@gmail.com
      </a>

      <p v-if="success" class="pf-form__success" role="status">
        {{ t('contact.success') }}
      </p>
      <p v-if="error" class="pf-form__error" role="alert">
        {{ error }}
      </p>

      <form class="pf-form reveal reveal--fade-up" @submit.prevent="sendContact">
        <div class="pf-form__row">
          <div class="pf-form__field">
            <label class="pf-form__label" for="cf-name">{{ t('contact.name') }}</label>
            <input
              id="cf-name"
              v-model="form.name"
              class="pf-form__input"
              type="text"
              :placeholder="t('contact.namePlaceholder')"
              required
              minlength="2"
              maxlength="100"
            />
          </div>
          <div class="pf-form__field">
            <label class="pf-form__label" for="cf-email">{{ t('contact.email') }}</label>
            <input
              id="cf-email"
              v-model="form.email"
              class="pf-form__input"
              type="email"
              :placeholder="t('contact.emailPlaceholder')"
              required
            />
          </div>
        </div>
        <div class="pf-form__field">
          <label class="pf-form__label" for="cf-subject">{{ t('contact.subject') }}</label>
          <input
            id="cf-subject"
            v-model="form.subject"
            class="pf-form__input"
            type="text"
            :placeholder="t('contact.subjectPlaceholder')"
            required
            minlength="2"
            maxlength="200"
          />
        </div>
        <div class="pf-form__field">
          <label class="pf-form__label" for="cf-message">{{ t('contact.message') }}</label>
          <textarea
            id="cf-message"
            v-model="form.message"
            class="pf-form__input pf-form__textarea"
            :placeholder="t('contact.messagePlaceholder')"
            rows="5"
            required
            minlength="10"
            maxlength="5000"
          />
        </div>
        <button type="submit" class="pf-btn pf-btn--full" :disabled="sending">
          {{ sending ? t('contact.sending') : t('contact.send') }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.pf-contact {
  background: var(--bg);
}
.pf-contact__inner {
  max-width: 640px;
}
.pf-contact__sub {
  text-align: center;
  color: var(--fg-muted);
  margin: -1.5rem 0 1.25rem;
  font-size: 1.0625rem;
  line-height: 1.7;
}
.pf-contact__email {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 2rem;
  transition: opacity var(--transition);
}
.pf-contact__email:hover {
  opacity: 0.75;
}

.pf-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.pf-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.pf-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.pf-form__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--fg);
}
.pf-form__input {
  padding: 0.625rem 0.875rem;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font: inherit;
  font-size: 0.9375rem;
  color: var(--fg);
  background: var(--bg);
  transition:
    border-color var(--transition),
    box-shadow var(--transition);
  outline: none;
  resize: none;
}
.pf-form__input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
}
.pf-form__textarea {
  resize: vertical;
}
.pf-form__success {
  text-align: center;
  color: #16a34a;
  font-weight: 600;
  font-size: 0.9375rem;
  margin: 0 0 1rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}
.pf-form__error {
  text-align: center;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.9375rem;
  margin: 0 0 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

[data-theme='dark'] .pf-form__success {
  background: #052e16;
  border-color: #166534;
}
[data-theme='dark'] .pf-form__error {
  background: #450a0a;
  border-color: #991b1b;
}

@media (max-width: 768px) {
  .pf-form__row {
    grid-template-columns: 1fr;
  }
  .pf-contact__sub {
    font-size: 0.9375rem;
    margin: -1rem 0 1rem;
  }
  .pf-form__input {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
  .pf-contact__email {
    font-size: 0.875rem;
    word-break: break-all;
  }
}
</style>
