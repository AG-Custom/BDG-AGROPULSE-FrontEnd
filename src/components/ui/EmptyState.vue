<template>
  <div class="empty-state">
    <span class="empty-state__icon">
      <q-icon :name="icon" size="32px" />
    </span>
    <h3 class="empty-state__title text-h3">{{ titulo }}</h3>
    <p v-if="descricao" class="empty-state__desc text-body-md text-secondary">{{ descricao }}</p>
    <div v-if="$slots.default" class="empty-state__action">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    titulo: string;
    descricao?: string;
    icon?: string;
  }>(),
  {
    icon: 'inbox',
  },
);
</script>

<style scoped>
.empty-state {
  align-items: center;
  display: grid;
  gap: var(--spacing-3);
  justify-items: center;
  padding: var(--spacing-10) var(--spacing-6);
  text-align: center;
}

.empty-state__icon {
  align-items: center;
  background: var(--color-icon-bg-primary);
  border-radius: var(--radius-full);
  color: var(--color-primary-500);
  display: flex;
  height: 64px;
  justify-content: center;
  width: 64px;
}

.empty-state__title {
  margin: 0;
}

.empty-state__desc {
  margin: 0;
  max-width: 360px;
}

.empty-state__action {
  margin-top: var(--spacing-2);
}
</style>
