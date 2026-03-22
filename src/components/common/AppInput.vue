<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="field">
    <label v-if="label" class="field__label">{{ label }}</label>
    <input
      :value="modelValue"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['field__input', { 'field__input--error': error }]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="field__error">{{ error }}</span>
  </div>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 0.375rem; }
.field__label { font-size: 0.875rem; font-weight: 600; color: #374151; }
.field__input {
  padding: 0.5rem 0.875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.field__input:focus {
  border-color: #5b21b6;
  box-shadow: 0 0 0 3px #ede9fe;
}
.field__input--error { border-color: #ef4444; }
.field__input--error:focus { box-shadow: 0 0 0 3px #fee2e2; }
.field__input:disabled { background: #f9fafb; cursor: not-allowed; }
.field__error { font-size: 0.75rem; color: #ef4444; }
</style>
