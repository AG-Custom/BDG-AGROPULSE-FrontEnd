<template>
  <aside class="auth-brand">
    <div class="auth-brand__content">
      <agro-logo size="lg" inverse />

      <div>
        <p class="auth-brand__tagline">Gestão agrícola integrada para operações que crescem.</p>
        <p class="auth-brand__subtagline">
          Do campo à decisão — dados confiáveis, em um só lugar.
        </p>
      </div>

      <ul class="auth-brand__features">
        <li v-for="item in features" :key="item.title" class="auth-brand__feature">
          <span class="auth-brand__feature-icon">
            <q-icon :name="item.icon" size="20px" />
          </span>
          <div>
            <div class="auth-brand__feature-title">{{ item.title }}</div>
            <div class="auth-brand__feature-desc">{{ item.description }}</div>
          </div>
        </li>
      </ul>
    </div>

    <div class="auth-brand__decor" aria-hidden="true">
      <svg
        class="auth-brand__field-lines"
        viewBox="0 0 600 800"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-40 780 Q 300 640 640 760" stroke="currentColor" stroke-width="1.5" />
        <path d="M-40 730 Q 300 580 640 700" stroke="currentColor" stroke-width="1.5" />
        <path d="M-40 680 Q 300 520 640 640" stroke="currentColor" stroke-width="1.5" />
        <path d="M-40 630 Q 300 460 640 580" stroke="currentColor" stroke-width="1.5" />
        <path d="M-40 580 Q 300 400 640 520" stroke="currentColor" stroke-width="1.5" />
        <path d="M-40 530 Q 300 340 640 460" stroke="currentColor" stroke-width="1.5" />
      </svg>
      <div class="auth-brand__glow" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import AgroLogo from 'components/shared/AgroLogo.vue';

const features = [
  {
    icon: 'hub',
    title: 'Gestão integrada',
    description: 'Empresa, unidades e operações em um só lugar.',
  },
  {
    icon: 'insights',
    title: 'Dados em tempo real',
    description: 'Decisões baseadas em indicadores confiáveis.',
  },
  {
    icon: 'agriculture',
    title: 'Feito para o agro',
    description: 'Fluxos pensados para o dia a dia do campo.',
  },
];
</script>

<style scoped>
.auth-brand {
  background: linear-gradient(160deg, var(--color-forest-800) 0%, var(--color-forest-950) 100%);
  display: none;
  flex: 1;
  overflow: hidden;
  padding: var(--spacing-12) var(--spacing-10);
  position: relative;
}

.auth-brand__content {
  display: grid;
  gap: var(--spacing-8);
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.auth-brand__tagline {
  color: var(--color-sidebar-text);
  font-family: var(--font-family-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-tight);
  line-height: var(--line-height-snug);
  margin: 0;
}

.auth-brand__subtagline {
  color: var(--color-sidebar-text-secondary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-relaxed);
  margin: var(--spacing-3) 0 0;
}

.auth-brand__features {
  display: grid;
  gap: var(--spacing-5);
  list-style: none;
  margin: 0;
  padding: 0;
}

.auth-brand__feature {
  align-items: flex-start;
  display: flex;
  gap: var(--spacing-4);
}

.auth-brand__feature-icon {
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: var(--border-width-thin) solid var(--color-sidebar-border);
  border-radius: var(--radius-md);
  color: var(--color-accent-400);
  display: flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  width: 40px;
}

.auth-brand__feature-title {
  color: var(--color-sidebar-text);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
}

.auth-brand__feature-desc {
  color: var(--color-sidebar-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  margin-top: var(--spacing-1);
}

.auth-brand__decor {
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.auth-brand__field-lines {
  bottom: 0;
  color: var(--color-primary-300);
  height: 100%;
  left: 0;
  opacity: 0.14;
  position: absolute;
  width: 100%;
}

.auth-brand__glow {
  background: radial-gradient(circle at 85% 8%, rgba(63, 169, 106, 0.22) 0%, transparent 55%);
  inset: 0;
  position: absolute;
}

@media (min-width: 1024px) {
  .auth-brand {
    display: flex;
    align-items: center;
  }
}
</style>
