<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :class="['btn', `btn--${variant ?? 'primary'}`]"
    :disabled="disabled || loading"
    :type="type ?? 'button'"
  >
    <span v-if="loading" class="btn__spinner" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.125rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s, transform 0.2s;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn:active:not(:disabled) { transform: scale(0.97); }

.btn--primary  { background: #5b21b6; color: #fff; }
.btn--secondary { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
.btn--danger   { background: #fee2e2; color: #dc2626; }

.btn--primary:hover:not(:disabled)   { background: #4c1d95; }
.btn--secondary:hover:not(:disabled) { background: #e5e7eb; }
.btn--danger:hover:not(:disabled)    { background: #fecaca; color: #991b1b; }

.btn__spinner {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
