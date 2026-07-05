<template>
  <q-card flat bordered class="metric-tile agro-card-interactive" :class="{ 'metric-tile--accent': accent }">
    <q-card-section class="metric-tile__body">
      <div class="metric-tile__top">
        <span class="metric-tile__icon" :class="{ 'metric-tile__icon--accent': accent }">
          <q-icon :name="icon" size="22px" />
        </span>
        <agro-badge v-if="trend" :label="trend" :variant="trendVariant" />
      </div>
      <div class="metric-tile__label text-caption text-secondary">{{ label }}</div>
      <div class="metric-tile__value text-tabular">{{ value }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    icon: string;
    trend?: string;
    accent?: boolean;
  }>(),
  {
    accent: false,
  },
);

const trendVariant = computed(() => {
  if (!props.trend) {
    return 'default' as const;
  }
  if (props.trend.startsWith('+') || props.trend.includes('↑')) {
    return 'success' as const;
  }
  if (props.trend.startsWith('-') || props.trend.includes('↓')) {
    return 'error' as const;
  }
  return 'default' as const;
});
</script>

<style scoped>
.metric-tile {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.metric-tile--accent {
  border-color: var(--color-accent-200);
}

.metric-tile__body {
  display: grid;
  gap: var(--spacing-2);
  padding: var(--spacing-5);
}

.metric-tile__top {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.metric-tile__icon {
  align-items: center;
  background: var(--color-icon-bg-primary);
  border-radius: var(--radius-md);
  color: var(--color-primary-600);
  display: flex;
  height: 44px;
  justify-content: center;
  width: 44px;
}

.metric-tile__icon--accent {
  background: var(--color-icon-bg-accent);
  color: var(--color-accent-600);
}

.metric-tile__value {
  color: var(--color-text-primary);
  font-family: var(--font-family-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}
</style>
