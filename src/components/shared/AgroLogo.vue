<template>
  <div class="agro-logo" :class="`agro-logo--${size}`">
    <svg
      class="agro-logo__mark"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" class="agro-logo__bg" />
      <path
        d="M20 8C14 8 10 13 10 18C10 24 14 28 20 32C26 28 30 24 30 18C30 13 26 8 20 8Z"
        class="agro-logo__leaf"
      />
      <path
        d="M20 14V26M14 20H26"
        class="agro-logo__pulse"
        fill="none"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
    <span v-if="showText" class="agro-logo__text">AgroPulse</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
  }>(),
  {
    size: 'md',
    showText: true,
  },
);
</script>

<style scoped>
.agro-logo {
  align-items: center;
  display: inline-flex;
  gap: var(--spacing-2);
}

.agro-logo__mark {
  flex-shrink: 0;
}

.agro-logo__bg {
  fill: var(--color-primary-500);
}

.agro-logo__leaf {
  fill: var(--color-primary-100);
}

.agro-logo__pulse {
  stroke: var(--color-neutral-0);
}

.agro-logo__text {
  color: var(--color-text-primary);
  font-family: var(--font-family-display);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-tight);
  line-height: var(--line-height-tight);
}

.agro-logo--sm .agro-logo__mark {
  height: 28px;
  width: 28px;
}

.agro-logo--sm .agro-logo__text {
  font-size: var(--font-size-md);
}

.agro-logo--md .agro-logo__mark {
  height: 36px;
  width: 36px;
}

.agro-logo--md .agro-logo__text {
  font-size: var(--font-size-lg);
}

.agro-logo--lg .agro-logo__mark {
  height: 48px;
  width: 48px;
}

.agro-logo--lg .agro-logo__text {
  font-size: var(--font-size-2xl);
}
</style>
