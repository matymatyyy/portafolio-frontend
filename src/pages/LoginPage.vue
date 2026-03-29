<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login, loading, error } = useAuth()

const form = ref({ username: '', password: '' })
</script>

<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="login-card__header">
        <span class="login-card__logo">maty.</span>
        <h1 class="login-card__title">Admin Panel</h1>
        <p class="login-card__sub">Sign in to manage your portfolio</p>
      </div>

      <form class="login-form" @submit.prevent="login(form.username, form.password)">
        <div v-if="error" class="login-alert">
          {{ error }}
        </div>

        <div class="login-field">
          <label class="login-field__label" for="email">Email</label>
          <input
            id="email"
            v-model="form.username"
            class="login-field__input"
            type="email"
            placeholder="admin@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="login-field">
          <label class="login-field__label" for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            class="login-field__input"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <button class="login-btn" type="submit" :disabled="loading">
          <span v-if="loading" class="login-btn__spinner" />
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <RouterLink to="/" class="login-back"> ← Back to portfolio </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  padding: 1.5rem;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
}

.login-card__header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-card__logo {
  font-size: 1.5rem;
  font-weight: 900;
  color: #5b21b6;
  letter-spacing: -0.05em;
}

.login-card__title {
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0.5rem 0 0.25rem;
  color: #111;
}

.login-card__sub {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-alert {
  background: #fee2e2;
  color: #991b1b;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.login-field__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.login-field__input {
  padding: 0.625rem 0.875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.login-field__input:focus {
  border-color: #5b21b6;
  box-shadow: 0 0 0 3px #ede9fe;
}

.login-btn {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #5b21b6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s;
  font-family: inherit;
}

.login-btn:hover:not(:disabled) {
  opacity: 0.88;
}
.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-btn__spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-back {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.login-back:hover {
  color: #5b21b6;
}
</style>
