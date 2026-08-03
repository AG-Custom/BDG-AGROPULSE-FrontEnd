<template>
  <div class="superhost-banner" role="status">
    <div class="superhost-banner__inner">
      <q-icon name="admin_panel_settings" size="18px" aria-hidden="true" />
      <span class="superhost-banner__label">SuperHost</span>
      <span class="superhost-banner__sep" aria-hidden="true">·</span>
      <span class="superhost-banner__text">{{ texto }}</span>
      <agro-btn
        v-if="mostrarVoltarConsole"
        flat
        dense
        no-caps
        class="superhost-banner__action"
        label="Voltar ao console"
        descricao="Sair da visão da empresa e voltar ao console da plataforma"
        icon="arrow_back"
        :to="{ name: 'plataforma' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  temEmpresa: boolean;
}>();

const route = useRoute();

const noConsole = computed(() => route.meta.plataforma === true);

const texto = computed(() => {
  if (noConsole.value) {
    return 'Console da plataforma — gerencie empresas e contratos';
  }

  if (props.temEmpresa) {
    return 'Você está acessando uma empresa como dono da plataforma';
  }

  return 'Visão de dono da plataforma';
});

const mostrarVoltarConsole = computed(() => props.temEmpresa && !noConsole.value);
</script>

<style scoped>
.superhost-banner {
  background: var(--color-sidebar-bg);
  border-bottom: var(--border-width-accent) solid var(--color-sidebar-accent);
  color: var(--color-sidebar-text);
}

.superhost-banner__inner {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  min-height: 36px;
  padding: var(--spacing-1) var(--spacing-4);
}

.superhost-banner__label {
  font-family: var(--font-family-display);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.superhost-banner__sep {
  color: var(--color-sidebar-text-muted);
}

.superhost-banner__text {
  color: var(--color-sidebar-text-muted);
  flex: 1 1 auto;
  font-size: var(--font-size-sm);
}

.superhost-banner__action {
  color: var(--color-sidebar-accent) !important;
  margin-left: auto;
}
</style>
