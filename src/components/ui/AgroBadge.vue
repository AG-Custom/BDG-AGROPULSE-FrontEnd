<template>
  <span class="agro-badge" :class="`agro-badge--${variant}`">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  }>(),
  {
    variant: 'default',
  },
);
</script>

<style scoped>
.agro-badge {
  border-radius: var(--radius-full);
  display: inline-flex;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-wide);
  line-height: 1;
  padding: var(--spacing-1) var(--spacing-2);
  white-space: nowrap;
}

.agro-badge--default {
  background: var(--color-neutral-100);
  color: var(--color-text-secondary);
}

.agro-badge--success {
  background: var(--color-success-50);
  color: var(--color-success-700);
}

.agro-badge--warning {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
}

.agro-badge--error {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

.agro-badge--info {
  background: var(--color-info-50);
  color: var(--color-info-700);
}

.agro-badge--accent {
  background: var(--color-accent-50);
  color: var(--color-accent-700);
}
</style>
