<template>
  <div class="agro-logo" :class="[`agro-logo--${size}`, { 'agro-logo--inverse': inverse }]">
    <svg
      class="agro-logo__mark"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="agro-logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" class="agro-logo__gradient-start" />
          <stop offset="1" class="agro-logo__gradient-end" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#agro-logo-gradient)" />
      <path
        d="M20 6.5C13.5 9.5 10.5 14.5 11 20.5C11.5 26.5 15 31 20 33.5C25 31 28.5 26.5 29 20.5C29.5 14.5 26.5 9.5 20 6.5Z"
        class="agro-logo__leaf"
      />
      <path
        d="M8 21H14L17 13.5L21.5 27L24.5 21H32"
        class="agro-logo__pulse"
        fill="none"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span v-if="showText" class="agro-logo__text">
      Agro<span class="agro-logo__text-accent">Pulse</span>
    </span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    inverse?: boolean;
  }>(),
  {
    size: 'md',
    showText: true,
    inverse: false,
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

.agro-logo__gradient-start {
  stop-color: var(--color-primary-400);
}

.agro-logo__gradient-end {
  stop-color: var(--color-forest-900);
}

.agro-logo__leaf {
  fill: rgba(255, 255, 255, 0.16);
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

.agro-logo__text-accent {
  color: var(--color-primary-600);
}

.agro-logo--inverse .agro-logo__text {
  color: var(--color-sidebar-text);
}

.agro-logo--inverse .agro-logo__text-accent {
  color: var(--color-primary-300);
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
