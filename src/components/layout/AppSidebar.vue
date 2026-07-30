<template>
  <nav class="app-sidebar" :class="{ 'app-sidebar--collapsed': collapsed }" aria-label="Módulos">
    <div
      v-if="badgeTipoNegocio && !collapsed"
      class="app-sidebar__badge"
      :class="
        badgeTipoNegocio === 'industria'
          ? 'app-sidebar__badge--industria'
          : 'app-sidebar__badge--revenda'
      "
    >
      {{ badgeTipoNegocio === 'industria' ? 'Indústria' : 'Revenda' }}
    </div>

    <q-item
      v-if="dashboardVisivel"
      clickable
      v-ripple
      :to="{ name: dashboardVisivel.routeNameDestino }"
      active-class=""
      exact-active-class=""
      class="app-sidebar__item"
      :class="{ 'app-sidebar__item--active': moduloAtivo?.id === 'dashboard' }"
      aria-label="Dashboard"
    >
      <q-item-section avatar class="app-sidebar__icon">
        <q-icon name="dashboard" size="20px" />
      </q-item-section>
      <q-item-section v-if="!collapsed" class="app-sidebar__label">
        Dashboard
      </q-item-section>
      <q-tooltip v-if="collapsed" anchor="center right" self="center left" :offset="[8, 0]">
        Dashboard
      </q-tooltip>
    </q-item>

    <div
      v-for="grupo in gruposVisiveis"
      :key="grupo.id"
      class="app-sidebar__grupo"
    >
      <div v-if="!collapsed" class="app-sidebar__grupo-label">
        {{ grupo.label }}
      </div>
      <q-item
        v-for="modulo in grupo.modulos"
        :key="modulo.id"
        clickable
        v-ripple
        :to="modulo.routeNameDestino ? { name: modulo.routeNameDestino } : undefined"
        active-class=""
        exact-active-class=""
        class="app-sidebar__item"
        :class="{ 'app-sidebar__item--active': moduloAtivo?.id === modulo.id }"
        :aria-label="modulo.label"
      >
        <q-item-section avatar class="app-sidebar__icon">
          <q-icon :name="modulo.icon" size="20px" />
        </q-item-section>
        <q-item-section v-if="!collapsed" class="app-sidebar__label">
          {{ modulo.label }}
        </q-item-section>
        <q-tooltip v-if="collapsed" anchor="center right" self="center left" :offset="[8, 0]">
          {{ modulo.label }}
        </q-tooltip>
      </q-item>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useNavegacaoModulos } from 'composables/useNavegacaoModulos';

defineProps<{
  collapsed?: boolean;
}>();

const {
  badgeTipoNegocio,
  dashboardVisivel,
  gruposVisiveis,
  moduloAtivo,
} = useNavegacaoModulos();
</script>

<style scoped>
.app-sidebar {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--spacing-1);
  min-height: 0;
  overflow-y: auto;
  padding: var(--spacing-2);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.app-sidebar::-webkit-scrollbar {
  display: none;
}

.app-sidebar__badge {
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-1) var(--spacing-2) var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-2);
}

.app-sidebar__badge--revenda {
  background: color-mix(in srgb, var(--color-sidebar-accent) 20%, transparent);
  color: var(--color-sidebar-accent);
}

.app-sidebar__badge--industria {
  background: color-mix(in srgb, var(--color-info-500) 22%, transparent);
  color: var(--color-info-50);
}

.app-sidebar__grupo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  margin-top: var(--spacing-3);
}

.app-sidebar__grupo-label {
  color: var(--color-sidebar-text-muted);
  font-family: var(--font-family-display);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.06em;
  padding: 0 var(--spacing-3) var(--spacing-1);
  text-transform: uppercase;
}

.app-sidebar__item {
  border-radius: var(--radius-md);
  color: var(--color-sidebar-text-secondary);
  min-height: 40px;
  padding: var(--spacing-2) var(--spacing-3);
  transition: var(--transition-bg), var(--transition-color);
}

.app-sidebar__item:hover {
  background: var(--color-sidebar-item-hover);
  color: var(--color-sidebar-text);
}

.app-sidebar__item:hover :deep(.q-icon) {
  color: var(--color-sidebar-text);
}

.app-sidebar__icon {
  min-width: 28px;
  padding-right: var(--spacing-2);
}

.app-sidebar__icon :deep(.q-icon) {
  color: var(--color-sidebar-text-muted);
}

.app-sidebar__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.app-sidebar--collapsed .app-sidebar__item {
  justify-content: center;
  padding-left: var(--spacing-2);
  padding-right: var(--spacing-2);
}

.app-sidebar--collapsed .app-sidebar__icon {
  min-width: 0;
  padding-right: 0;
}

.app-sidebar--collapsed .app-sidebar__grupo {
  margin-top: var(--spacing-2);
}

:deep(.app-sidebar__item--active),
.app-sidebar__item--active {
  background: var(--color-sidebar-item-active-bg);
  border-left: var(--border-width-accent) solid var(--color-sidebar-accent);
  color: var(--color-sidebar-item-active-text);
  font-weight: var(--font-weight-medium);
}

:deep(.app-sidebar__item--active) .q-icon,
.app-sidebar__item--active :deep(.q-icon) {
  color: var(--color-sidebar-accent);
}
</style>
