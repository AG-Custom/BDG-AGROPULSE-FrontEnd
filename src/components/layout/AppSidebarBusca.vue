<template>
  <div v-if="!collapsed" class="sidebar-busca" role="search">
    <q-input
      :model-value="modelValue"
      outlined
      dense
      dark
      hide-bottom-space
      label="Buscar no menu"
      aria-controls="busca-menu-resultados"
      @update:model-value="atualizar"
    >
      <template #prepend>
        <q-icon name="search" size="18px" />
      </template>
      <template v-if="modelValue" #append>
        <q-btn flat round dense icon="close" aria-label="Limpar busca" @click="emit('update:modelValue', '')" />
      </template>
    </q-input>
    <div v-if="termoAtivo" id="busca-menu-resultados">
      <app-sidebar-busca-resultados :resultados="resultados" :termo="modelValue" @abrir="abrir" />
    </div>
  </div>

  <q-item
    v-else
    clickable
    v-ripple
    class="sidebar-busca__atalho"
    aria-label="Buscar no menu"
    aria-haspopup="dialog"
  >
    <q-item-section avatar class="sidebar-busca__atalho-icone">
      <q-icon name="search" size="20px" />
    </q-item-section>
    <q-tooltip anchor="center right" self="center left" :offset="[8, 0]">
      Buscar no menu
    </q-tooltip>
    <q-menu
      anchor="center right"
      self="center left"
      :offset="[8, 0]"
      content-class="sidebar-busca-menu"
      @before-show="emit('update:modelValue', '')"
    >
      <div class="sidebar-busca sidebar-busca--painel" role="search">
        <q-input
          :model-value="modelValue"
          outlined
          dense
          dark
          hide-bottom-space
          autofocus
          label="Buscar no menu"
          aria-controls="busca-menu-resultados-painel"
          @update:model-value="atualizar"
        >
          <template #prepend>
            <q-icon name="search" size="18px" />
          </template>
        </q-input>
        <div v-if="termoAtivo" id="busca-menu-resultados-painel">
          <app-sidebar-busca-resultados :resultados="resultados" :termo="modelValue" @abrir="abrir" />
        </div>
      </div>
    </q-menu>
  </q-item>
</template>

<script setup lang="ts">
import AppSidebarBuscaResultados from 'components/layout/AppSidebarBuscaResultados.vue';
import { useNavegacaoModulos } from 'composables/useNavegacaoModulos';
import type { GrupoNavegacaoVisivel, ModuloNavegacaoVisivel } from 'composables/useNavegacaoModulos';
import { buscarMenu, type ModuloBuscaMenu } from 'utils/navegacao-busca';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  collapsed?: boolean;
  grupos: GrupoNavegacaoVisivel[];
  dashboard: ModuloNavegacaoVisivel | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [string];
}>();

const { definirModuloPreferido } = useNavegacaoModulos();
const termoAtivo = computed(() => props.modelValue.trim().length > 0);

const catalogo = computed<ModuloBuscaMenu[]>(() => {
  const lista: ModuloBuscaMenu[] = [];
  if (props.dashboard) {
    lista.push({
      grupoLabel: '',
      id: props.dashboard.id,
      label: props.dashboard.label,
      icon: props.dashboard.icon,
      filhos: props.dashboard.filhosVisiveis,
    });
  }
  for (const grupo of props.grupos) {
    for (const modulo of grupo.modulos) {
      lista.push({
        grupoLabel: grupo.label,
        id: modulo.id,
        label: modulo.label,
        icon: modulo.icon,
        filhos: modulo.filhosVisiveis,
      });
    }
  }
  return lista;
});

const resultados = computed(() => buscarMenu(catalogo.value, props.modelValue));

function atualizar(valor: string | number | null): void {
  emit('update:modelValue', String(valor ?? ''));
}

function abrir(moduloId: string): void {
  definirModuloPreferido(moduloId);
  emit('update:modelValue', '');
}
</script>

<style scoped>
.sidebar-busca {
  padding: var(--spacing-2) var(--spacing-2) 0;
}

.sidebar-busca--painel {
  padding: var(--spacing-3);
  width: 280px;
}

.sidebar-busca__atalho {
  border-radius: var(--radius-md);
  color: var(--color-sidebar-text-secondary);
  justify-content: center;
  min-height: 40px;
  padding: var(--spacing-2);
}

.sidebar-busca__atalho-icone {
  min-width: 0;
  padding-right: 0;
}

.sidebar-busca__atalho-icone :deep(.q-icon) {
  color: var(--color-sidebar-text-muted);
}

.sidebar-busca :deep(.q-field__control) {
  background: var(--color-sidebar-item-hover);
  min-height: 40px;
}

.sidebar-busca :deep(.q-field--outlined .q-field__control:before) {
  border-color: var(--color-sidebar-border);
}

.sidebar-busca :deep(.q-field--outlined .q-field__control:hover:before) {
  border-color: var(--color-sidebar-text-muted);
}

.sidebar-busca :deep(.q-field--outlined.q-field--focused .q-field__control:before) {
  border-color: var(--color-sidebar-accent);
}

.sidebar-busca :deep(.q-field__native),
.sidebar-busca :deep(.q-field__append .q-icon),
.sidebar-busca :deep(.q-btn) {
  color: var(--color-sidebar-text);
}

.sidebar-busca :deep(.q-field__label),
.sidebar-busca :deep(.q-field--dark .q-field__label),
.sidebar-busca :deep(.q-field__prepend .q-icon) {
  color: var(--color-sidebar-text-secondary);
}
</style>

<style>
.sidebar-busca-menu {
  background: var(--color-sidebar-bg);
  border: var(--border-width-thin) solid var(--color-sidebar-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}
</style>
