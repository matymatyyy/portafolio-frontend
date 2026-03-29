<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { userService } from '@/services/userService'

const route = useRoute()
const router = useRouter()

const userId = computed(() => route.params.id as string | undefined)
const isEditing = computed(() => !!userId.value)

const form = ref({ name: '', email: '', password: '' })
const errors = ref<Record<string, string>>({})
const loading = ref(false)
const fetching = ref(false)
const serverError = ref<string | null>(null)

onMounted(async () => {
  if (!isEditing.value) return
  fetching.value = true
  try {
    const user = await userService.get(userId.value!)
    form.value.name = user.name
    form.value.email = user.email
  } catch {
    serverError.value = 'Failed to load user'
  } finally {
    fetching.value = false
  }
})

function validate(): boolean {
  errors.value = {}
  if (!form.value.name || form.value.name.length < 2)
    {errors.value.name = 'Name must be at least 2 characters.'}
  if (!form.value.email || !/\S+@\S+\.\S+/.test(form.value.email))
    {errors.value.email = 'Enter a valid email.'}
  if (!isEditing.value && (!form.value.password || form.value.password.length < 8))
    {errors.value.password = 'Password must be at least 8 characters.'}
  return Object.keys(errors.value).length === 0
}

async function submit() {
  if (!validate()) return
  loading.value = true
  serverError.value = null
  try {
    if (isEditing.value) {
      const payload = {
        name: form.value.name,
        email: form.value.email,
        ...(form.value.password && { password: form.value.password }),
      }
      await userService.update(userId.value!, payload)
    } else {
      await userService.create(form.value)
    }
    router.push({ name: 'users' })
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
        {{ isEditing ? 'Edit User' : 'New User' }}
      </h1>
      <p class="page__sub">
        {{ isEditing ? 'Update user details' : 'Create a new admin account' }}
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

        <AppInput v-model="form.name" label="Name" placeholder="John Doe" :error="errors.name" />
        <AppInput
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          :error="errors.email"
        />
        <AppInput
          v-model="form.password"
          label="Password"
          type="password"
          :placeholder="isEditing ? 'Leave blank to keep current' : 'Min. 8 characters'"
          :error="errors.password"
        />

        <div class="form__actions">
          <AppButton type="submit" :loading="loading">
            {{ isEditing ? 'Save Changes' : 'Create User' }}
          </AppButton>
          <AppButton variant="secondary" @click="$router.back()"> Cancel </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 520px;
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
</style>
