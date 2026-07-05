<template>
  <q-card
    flat
    bordered
    class="agro-card"
    :class="{ 'agro-card-interactive': interactive }"
  >
    <q-card-section v-if="$slots.header" class="agro-card__header">
      <slot name="header" />
    </q-card-section>
    <q-card-section class="agro-card__body">
      <slot />
    </q-card-section>
    <q-card-section v-if="$slots.footer" class="agro-card__footer">
      <slot name="footer" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    interactive?: boolean;
  }>(),
  {
    interactive: false,
  },
);
</script>

<style scoped>
.agro-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.agro-card__header {
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
  padding: var(--spacing-4) var(--card-padding);
}

.agro-card__body {
  padding: var(--card-padding);
}

.agro-card__footer {
  border-top: var(--border-width-thin) solid var(--color-border-default);
  padding: var(--spacing-4) var(--card-padding);
}
</style>
