<template>
  <div v-if="unidades.length > 1" class="unidade-switcher">
    <q-select
      v-model="unidadeAtivaId"
      outlined
      dense
      emit-value
      map-options
      label="Unidade"
      :options="opcoes"
      :loading="carregandoLista"
      :disable="carregando"
      aria-label="Selecionar unidade operacional"
      @update:model-value="onTrocar"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from 'composables/useAuth';
import { useContextoUnidade } from 'composables/useContextoUnidade';
import type { UnidadeDisponivelDto } from 'types/dtos/auth.dto';
import { computed, onMounted, ref, watch } from 'vue';

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
  margin-top: var(--spacing-3);
}
</style>
