<template>
  <q-form ref="formRef" class="saida-estoque-formulario" greedy>
    <q-select
      v-model="formulario.produtoId"
      outlined
      label="Produto"
      class="field-required"
      emit-value
      map-options
      aria-required="true"
      :options="produtoOpcoes"
      :loading="carregandoProdutos"
      :rules="[obrigatorio]"
      @update:model-value="onProdutoAlterado"
    />

    <q-toggle
      v-model="formulario.usarFefo"
      label="Usar FEFO (primeiro a vencer)"
    />

    <q-select
      v-if="!formulario.usarFefo"
      v-model="formulario.loteId"
      outlined
      label="Lote"
      class="field-required"
      emit-value
      map-options
      aria-required="true"
      :options="loteOpcoes"
      :loading="carregandoLotes"
      :rules="[obrigatorio]"
    />

    <q-input
      v-model="formulario.quantidade"
      outlined
      label="Quantidade"
      class="field-required"
      type="number"
      min="0.0001"
      step="0.01"
      aria-required="true"
      :rules="[quantidadePositivaValidator]"
    />
  </q-form>
</template>

<script setup lang="ts">
import { useEstoqueLotes } from 'composables/useEstoqueLotes';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import type { QForm } from 'quasar';
import type { SaidaEstoqueFormModel } from 'types/dtos/estoque.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import { obrigatorio, quantidadePositiva } from 'utils/validators';
import { computed, ref, watch } from 'vue';

const formulario = defineModel<SaidaEstoqueFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const quantidadePositivaValidator = quantidadePositiva;

const { produtoOpcoes, carregando: carregandoProdutos } = useProdutoOpcoesEstoque();
const { lotes, carregando: carregandoLotes, carregar: carregarLotes } = useEstoqueLotes();

const loteOpcoes = computed(() =>
  lotes.value.map((lote) => ({
    label: `${lote.numeroLote} — saldo ${formatarDecimal(lote.quantidade)}${
      lote.dataValidade ? ` — val. ${formatarData(lote.dataValidade)}` : ''
    }`,
    value: lote.id,
  })),
);

async function onProdutoAlterado(produtoId: string | null): Promise<void> {
  formulario.value.loteId = '';

  if (!produtoId) {
    return;
  }

  await carregarLotes({ produtoId, apenasComSaldo: true });
}

watch(
  () => formulario.value.produtoId,
  (produtoId) => {
    if (produtoId) {
      void carregarLotes({ produtoId, apenasComSaldo: true });
    }
  },
  { immediate: true },
);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>
.saida-estoque-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
