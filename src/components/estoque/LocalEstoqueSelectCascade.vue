<template>
  <div class="local-estoque-select-cascade">
    <q-select
      v-for="nivel in niveisVisiveis"
      :key="nivel"
      :model-value="selecoes[nivel]"
      outlined
      dense
      emit-value
      map-options
      clearable
      :label="NivelLocalEstoqueLabels[nivel]"
      :options="opcoesPorNivel(nivel)"
      :loading="carregando"
      :disable="nivelDesabilitado(nivel)"
      @update:model-value="(valor) => onSelecionar(nivel, valor)"
    />
  </div>
</template>

<script setup lang="ts">
import { useLocaisEstoque } from 'composables/useLocaisEstoque';
import {
  NivelLocalEstoque,
  NivelLocalEstoqueLabels,
  NivelLocalEstoqueOrdem,
  type NivelLocalEstoqueValor,
} from 'constants/enums';
import type { LocalEstoqueDto } from 'types/dtos/estoque.dto';
import { computed, onMounted, reactive, watch } from 'vue';

const model = defineModel<string | null>({ default: null });

const props = withDefaults(
  defineProps<{
    apenasAtivos?: boolean;
  }>(),
  {
    apenasAtivos: true,
  },
);

const { locais, carregando, carregar } = useLocaisEstoque();

const selecoes = reactive<Record<NivelLocalEstoqueValor, string | null>>({
  [NivelLocalEstoque.Galpao]: null,
  [NivelLocalEstoque.Deposito]: null,
  [NivelLocalEstoque.Corredor]: null,
  [NivelLocalEstoque.Prateleira]: null,
});

const niveisVisiveis = NivelLocalEstoqueOrdem;

const locaisAtivos = computed(() =>
  props.apenasAtivos ? locais.value.filter((local) => local.ativo) : locais.value,
);

function opcoesPorNivel(nivel: NivelLocalEstoqueValor) {
  const indice = NivelLocalEstoqueOrdem.indexOf(nivel);
  const nivelPai = indice > 0 ? NivelLocalEstoqueOrdem[indice - 1] : null;
  const parentId = nivelPai ? selecoes[nivelPai] : null;

  return locaisAtivos.value
    .filter((local) => {
      if (local.nivel !== nivel) {
        return false;
      }

      if (!nivelPai) {
        return local.parentId === null;
      }

      return local.parentId === parentId;
    })
    .map((local) => ({
      label: `${local.codigo} — ${local.nome}`,
      value: local.id,
    }));
}

function nivelDesabilitado(nivel: NivelLocalEstoqueValor): boolean {
  const indice = NivelLocalEstoqueOrdem.indexOf(nivel);
  if (indice === 0) {
    return false;
  }

  const nivelPai = NivelLocalEstoqueOrdem[indice - 1];
  return !selecoes[nivelPai];
}

function limparAPartir(nivel: NivelLocalEstoqueValor): void {
  const indice = NivelLocalEstoqueOrdem.indexOf(nivel);
  for (let i = indice; i < NivelLocalEstoqueOrdem.length; i++) {
    selecoes[NivelLocalEstoqueOrdem[i]] = null;
  }
}

function onSelecionar(nivel: NivelLocalEstoqueValor, valor: unknown): void {
  const id = typeof valor === 'string' ? valor : null;
  limparAPartir(nivel);
  selecoes[nivel] = id;
  sincronizarModel();
}

function sincronizarModel(): void {
  for (let i = NivelLocalEstoqueOrdem.length - 1; i >= 0; i--) {
    const id = selecoes[NivelLocalEstoqueOrdem[i]];
    if (id) {
      model.value = id;
      return;
    }
  }

  model.value = null;
}

function aplicarModel(localId: string | null): void {
  limparAPartir(NivelLocalEstoque.Galpao);

  if (!localId) {
    return;
  }

  const cadeia: LocalEstoqueDto[] = [];
  let atual = locais.value.find((local) => local.id === localId) ?? null;

  while (atual) {
    cadeia.unshift(atual);
    atual = atual.parentId
      ? (locais.value.find((local) => local.id === atual!.parentId) ?? null)
      : null;
  }

  for (const no of cadeia) {
    selecoes[no.nivel] = no.id;
  }
}

watch(
  () => model.value,
  (valor) => {
    if (valor !== selecoes[NivelLocalEstoque.Prateleira]
      && valor !== selecoes[NivelLocalEstoque.Corredor]
      && valor !== selecoes[NivelLocalEstoque.Deposito]
      && valor !== selecoes[NivelLocalEstoque.Galpao]) {
      aplicarModel(valor);
    }
  },
);

onMounted(async () => {
  await carregar(props.apenasAtivos ? { ativo: true } : undefined);
  aplicarModel(model.value);
});
</script>

<style scoped>
.local-estoque-select-cascade {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 600px) {
  .local-estoque-select-cascade {
    grid-template-columns: 1fr;
  }
}
</style>
