<template>
  <q-btn-dropdown
    unelevated
    no-caps
    dense
    label="Ações"
    dropdown-icon="expand_more"
    class="agro-acoes-menu__trigger"
    content-class="agro-acoes-menu__dropdown"
    menu-anchor="bottom end"
    menu-self="top end"
    aria-label="Ações"
    :disable="disable"
  >
    <q-list class="agro-acoes-menu__list" role="menu">
      <q-item
        v-if="mostrarVisualizar"
        v-close-popup
        clickable
        dense
        class="agro-acoes-menu__item"
        role="menuitem"
        :disable="!podeVisualizar"
        :to="visualizarTo"
        :aria-label="visualizarLabel"
        @click="onVisualizar"
      >
        <q-item-section avatar>
          <span class="agro-acoes-menu__icon agro-acoes-menu__icon--view" aria-hidden="true">
            <q-icon name="visibility" size="16px" />
          </span>
        </q-item-section>
        <q-item-section>{{ visualizarLabel }}</q-item-section>
      </q-item>

      <q-item
        v-if="mostrarEditar"
        v-close-popup
        clickable
        dense
        class="agro-acoes-menu__item"
        role="menuitem"
        :disable="!podeEditar"
        :to="editarTo"
        :aria-label="editarLabel"
        @click="onEditar"
      >
        <q-item-section avatar>
          <span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit" aria-hidden="true">
            <q-icon name="edit" size="16px" />
          </span>
        </q-item-section>
        <q-item-section>{{ editarLabel }}</q-item-section>
      </q-item>

      <q-item
        v-if="mostrarStatus"
        v-close-popup
        clickable
        dense
        class="agro-acoes-menu__item"
        role="menuitem"
        :disable="!podeAlterarStatus || loadingStatus"
        :aria-label="rotuloStatus"
        @click="onStatus"
      >
        <q-item-section avatar>
          <span
            class="agro-acoes-menu__icon"
            :class="ativo ? 'agro-acoes-menu__icon--danger' : 'agro-acoes-menu__icon--success'"
            aria-hidden="true"
          >
            <q-icon :name="ativo ? 'delete' : 'check_circle'" size="16px" />
          </span>
        </q-item-section>
        <q-item-section>{{ rotuloStatus }}</q-item-section>
        <q-item-section v-if="loadingStatus" side>
          <q-spinner size="16px" color="primary" />
        </q-item-section>
      </q-item>

      <q-item
        v-if="mostrarExcluir"
        v-close-popup
        clickable
        dense
        class="agro-acoes-menu__item"
        role="menuitem"
        :disable="!podeExcluir || loadingExcluir"
        :aria-label="excluirLabel"
        @click="onExcluir"
      >
        <q-item-section avatar>
          <span class="agro-acoes-menu__icon agro-acoes-menu__icon--danger" aria-hidden="true">
            <q-icon name="delete_forever" size="16px" />
          </span>
        </q-item-section>
        <q-item-section>{{ excluirLabel }}</q-item-section>
        <q-item-section v-if="loadingExcluir" side>
          <q-spinner size="16px" color="primary" />
        </q-item-section>
      </q-item>

      <slot />
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    mostrarVisualizar?: boolean;
    mostrarEditar?: boolean;
    mostrarStatus?: boolean;
    mostrarExcluir?: boolean;
    podeVisualizar?: boolean;
    podeEditar?: boolean;
    podeAlterarStatus?: boolean;
    podeExcluir?: boolean;
    ativo?: boolean;
    desabilitarLabel?: string;
    ativarLabel?: string;
    visualizarLabel?: string;
    editarLabel?: string;
    excluirLabel?: string;
    visualizarTo?: RouteLocationRaw;
    editarTo?: RouteLocationRaw;
    loadingStatus?: boolean;
    loadingExcluir?: boolean;
    disable?: boolean;
  }>(),
  {
    mostrarVisualizar: true,
    mostrarEditar: true,
    mostrarStatus: true,
    mostrarExcluir: false,
    podeVisualizar: true,
    podeEditar: true,
    podeAlterarStatus: true,
    podeExcluir: true,
    ativo: true,
    desabilitarLabel: 'Inativar',
    ativarLabel: 'Ativar',
    visualizarLabel: 'Visualizar',
    editarLabel: 'Editar',
    excluirLabel: 'Excluir',
    loadingStatus: false,
    loadingExcluir: false,
    disable: false,
  },
);

const emit = defineEmits<{
  visualizar: [];
  editar: [];
  desabilitar: [];
  ativar: [];
  excluir: [];
}>();

const rotuloStatus = computed(() =>
  props.ativo ? props.desabilitarLabel : props.ativarLabel,
);

function onVisualizar(): void {
  if (!props.podeVisualizar) {
    return;
  }
  if (!props.visualizarTo) {
    emit('visualizar');
  }
}

function onEditar(): void {
  if (!props.podeEditar) {
    return;
  }
  if (!props.editarTo) {
    emit('editar');
  }
}

function onStatus(): void {
  if (!props.podeAlterarStatus || props.loadingStatus) {
    return;
  }
  if (props.ativo) {
    emit('desabilitar');
    return;
  }
  emit('ativar');
}

function onExcluir(): void {
  if (!props.podeExcluir || props.loadingExcluir) {
    return;
  }
  emit('excluir');
}
</script>

<style scoped>
.agro-acoes-menu__trigger {
  background: var(--color-neutral-100);
  border-radius: 999px;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  min-height: 32px;
  padding: 0 var(--spacing-3);
}

.agro-acoes-menu__trigger :deep(.q-btn__content) {
  gap: var(--spacing-1);
}
</style>

<style>
.agro-acoes-menu__dropdown {
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  box-shadow: none;
  overflow: hidden;
}

.agro-acoes-menu__list {
  min-width: 168px;
  padding: var(--spacing-1) 0;
}

.agro-acoes-menu__item {
  min-height: 40px;
  padding: var(--spacing-2) var(--spacing-3);
}

.agro-acoes-menu__icon {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.agro-acoes-menu__icon--view,
.agro-acoes-menu__icon--edit {
  background: var(--color-success-50);
  color: var(--color-success-700);
}

.agro-acoes-menu__icon--danger {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

.agro-acoes-menu__icon--success {
  background: var(--color-warning-50);
  color: var(--color-success-700);
}
</style>
