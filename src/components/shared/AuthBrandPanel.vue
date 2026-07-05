<template>
  <aside class="auth-brand">
    <div class="auth-brand__content">
      <agro-logo size="lg" />

      <p class="auth-brand__tagline">Gestão agrícola integrada para operações que crescem.</p>

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
      <div class="auth-brand__orb auth-brand__orb--primary" />
      <div class="auth-brand__orb auth-brand__orb--accent" />
      <div class="auth-brand__grid" />
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
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  margin: 0;
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
  background: var(--color-icon-bg-primary);
  border-radius: var(--radius-md);
  color: var(--color-primary-600);
  display: flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  width: 40px;
}

.auth-brand__feature-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
}

.auth-brand__feature-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  margin-top: var(--spacing-1);
}

.auth-brand__decor {
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.auth-brand__orb {
  border-radius: var(--radius-full);
  filter: blur(0);
  position: absolute;
}

.auth-brand__orb--primary {
  background: var(--color-primary-100);
  height: 280px;
  opacity: 0.6;
  right: -80px;
  top: 10%;
  width: 280px;
}

.auth-brand__orb--accent {
  background: var(--color-accent-100);
  bottom: 15%;
  height: 200px;
  left: -60px;
  opacity: 0.5;
  width: 200px;
}

.auth-brand__grid {
  background-image:
    linear-gradient(var(--color-primary-100) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-primary-100) 1px, transparent 1px);
  background-size: 32px 32px;
  inset: 0;
  mask-image: radial-gradient(ellipse at 30% 50%, black 0%, transparent 70%);
  opacity: 0.35;
  position: absolute;
}

@media (min-width: 1024px) {
  .auth-brand {
    display: flex;
    align-items: center;
  }
}
</style>
