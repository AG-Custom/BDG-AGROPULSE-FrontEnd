<template>
  <header class="app-page-header">
    <div class="app-page-header__text">
      <h1 class="app-page-header__title text-h2">{{ titulo }}</h1>
      <p v-if="subtitulo" class="app-page-header__subtitle text-body-md text-secondary">
        {{ subtitulo }}
      </p>
      <div class="app-page-header__accent" aria-hidden="true" />
    </div>
    <div v-if="$slots.default" class="app-page-header__actions">
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  titulo: string;
  subtitulo?: string;
}>();
</script>

<style scoped>
.app-page-header {
  align-items: flex-start;
  display: flex;
  gap: var(--spacing-6);
  justify-content: space-between;
  margin-bottom: var(--spacing-6);
}

.app-page-header__text {
  display: grid;
  gap: var(--spacing-2);
  position: relative;
}

.app-page-header__title {
  margin: 0;
}

.app-page-header__subtitle {
  margin: 0;
}

.app-page-header__accent {
  background: var(--color-accent-500);
  border-radius: var(--radius-full);
  height: 3px;
  margin-top: var(--spacing-1);
  width: 48px;
}

.app-page-header__actions {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: var(--spacing-3);
}
</style>
