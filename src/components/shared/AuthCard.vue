<template>
  <section class="auth-card">
    <header class="auth-card__header">
      <agro-logo size="sm" />
      <div class="text-body-md text-secondary">{{ subtitulo }}</div>
    </header>

    <div class="auth-card__content">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="auth-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import AgroLogo from 'components/shared/AgroLogo.vue';

defineProps<{
  subtitulo: string;
}>();
</script>

<style scoped>
.auth-card {
  background: var(--color-surface-default);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-lg);
  border-top: var(--border-width-accent) solid var(--color-accent-500);
  box-shadow: var(--shadow-brand);
  display: grid;
  gap: var(--spacing-6);
  max-width: 480px;
  padding: var(--spacing-8);
  width: 100%;
}

.auth-card__header {
  display: grid;
  gap: var(--spacing-2);
}

.auth-card__content {
  display: grid;
  gap: var(--spacing-4);
}

.auth-card__footer {
  border-top: var(--border-width-thin) solid var(--color-border-default);
  padding-top: var(--spacing-4);
  text-align: center;
}
</style>
