<template>
  <div
    v-if="unidades.length > 1"
    class="unidade-switcher"
    :class="{ 'unidade-switcher--compact': compact }"
  >
    <div v-if="!compact" class="unidade-switcher__label text-overline">Unidade ativa</div>
    <q-select
      v-model="unidadeAtivaId"
      outlined
      dense
      emit-value
      map-options
      :options="opcoes"
      :loading="carregandoLista"
      :disable="carregando"
      aria-label="Selecionar unidade operacional"
      popup-content-class="unidade-switcher-menu"
      @update:model-value="onTrocar"
    >
      <template #prepend>
        <q-icon name="storefront" size="18px" />
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from 'composables/useAuth';
import { useContextoUnidade } from 'composables/useContextoUnidade';
import type { UnidadeDisponivelDto } from 'types/dtos/auth.dto';
import { computed, onMounted, ref, watch } from 'vue';

withDefaults(
  defineProps<{
    compact?: boolean;
  }>(),
  { compact: false },
);

const { unidadeId } = useAuth();
const { carregando, listarUnidades, trocarUnidade } = useContextoUnidade();

const unidades = ref<UnidadeDisponivelDto[]>([]);
const carregandoLista = ref(false);
const unidadeAtivaId = ref<string | null>(null);

const opcoes = computed(() =>
  unidades.value.map((unidade) => ({
    label: unidade.matriz ? `${unidade.nome} (Matriz)` : unidade.nome,
    value: unidade.id,
  })),
);

watch(
  unidadeId,
  (id) => {
    unidadeAtivaId.value = id;
  },
  { immediate: true },
);

onMounted(async () => {
  carregandoLista.value = true;

  try {
    unidades.value = await listarUnidades();
  } finally {
    carregandoLista.value = false;
  }
});

async function onTrocar(novoId: string | null): Promise<void> {
  if (!novoId || novoId === unidadeId.value) {
    return;
  }

  const unidadeDestino = unidades.value.find((u) => u.id === novoId);
  const nomeDestino = unidadeDestino?.nome ?? 'esta unidade';

  const sucesso = await trocarUnidade(novoId, nomeDestino);

  if (!sucesso) {
    unidadeAtivaId.value = unidadeId.value;
  }
}
</script>

<style scoped>
.unidade-switcher {
  display: grid;
  gap: var(--spacing-1);
  margin-top: var(--spacing-2);
}

.unidade-switcher--compact {
  margin-top: 0;
}

.unidade-switcher__label {
  color: var(--color-sidebar-text-muted);
}

/* Adaptação do q-select ao fundo verde-floresta da sidebar */
.unidade-switcher :deep(.q-field--outlined .q-field__control) {
  background: var(--color-sidebar-item-hover);
}

.unidade-switcher :deep(.q-field--outlined .q-field__control:before) {
  border-color: var(--color-sidebar-border);
}

.unidade-switcher :deep(.q-field--outlined .q-field__control:hover:before) {
  border-color: var(--color-sidebar-text-muted);
}

.unidade-switcher :deep(.q-field--outlined.q-field--focused .q-field__control:before) {
  border-color: var(--color-primary-300);
}

.unidade-switcher :deep(.q-field__native),
.unidade-switcher :deep(.q-field__prepend .q-icon),
.unidade-switcher :deep(.q-field__append .q-icon) {
  color: var(--color-sidebar-text);
}

.unidade-switcher :deep(.q-field__prepend .q-icon) {
  color: var(--color-sidebar-text-secondary);
}
</style>
