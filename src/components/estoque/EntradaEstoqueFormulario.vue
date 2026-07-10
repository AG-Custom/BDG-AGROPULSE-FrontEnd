<template>
  <q-form ref="formRef" class="entrada-estoque-formulario" greedy>
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

    <q-input
      v-if="exigeLote"
      v-model="formulario.numeroLote"
      outlined
      label="Número do lote"
      class="field-required"
      maxlength="50"
      aria-required="true"
      :rules="[obrigatorio]"
    />

    <q-input
      v-if="exigeValidade"
      v-model="formulario.dataValidade"
      outlined
      label="Data de validade"
      class="field-required"
      type="date"
      aria-required="true"
      :rules="[obrigatorio]"
    />

    <q-input
      v-model="formulario.dataFabricacao"
      outlined
      label="Data de fabricação"
      type="date"
      hint="Opcional"
    />

    <q-input
      v-model="formulario.custoUnitario"
      outlined
      label="Custo unitário"
      type="number"
      min="0"
      step="0.01"
      hint="Opcional"
    />
  </q-form>
</template>

<script setup lang="ts">
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import type { QForm } from 'quasar';
import type { EntradaEstoqueFormModel } from 'types/dtos/estoque.dto';
import { obrigatorio, quantidadePositiva } from 'utils/validators';
import { computed, ref, watch } from 'vue';

const formulario = defineModel<EntradaEstoqueFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const quantidadePositivaValidator = quantidadePositiva;

const {
  produtoOpcoes,
  carregando: carregandoProdutos,
  carregarDetalhe,
  detalhes,
} = useProdutoOpcoesEstoque();

const produtoDetalhe = computed(() =>
  formulario.value.produtoId ? detalhes.value[formulario.value.produtoId] : undefined,
);

const exigeLote = computed(() => produtoDetalhe.value?.exigeLote === true);
const exigeValidade = computed(() => produtoDetalhe.value?.exigeValidade === true);

async function onProdutoAlterado(produtoId: string | null): Promise<void> {
  if (!produtoId) {
    return;
  }

  await carregarDetalhe(produtoId);
}

watch(
  () => formulario.value.produtoId,
  (produtoId) => {
    if (produtoId) {
      void carregarDetalhe(produtoId);
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
.entrada-estoque-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
