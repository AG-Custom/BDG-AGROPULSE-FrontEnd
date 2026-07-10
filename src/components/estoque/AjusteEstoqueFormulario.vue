<template>
  <q-form ref="formRef" class="ajuste-estoque-formulario" greedy>
    <q-select
      v-model="formulario.loteId"
      outlined
      label="Lote"
      class="field-required"
      emit-value
      map-options
      aria-required="true"
      :options="loteOpcoes"
      :loading="carregandoLotes"
      :disable="loteFixo"
      :rules="[obrigatorio]"
    />

    <q-input
      v-model="formulario.quantidadeNova"
      outlined
      label="Nova quantidade"
      class="field-required"
      type="number"
      min="0"
      step="0.01"
      aria-required="true"
      :rules="[quantidadeNaoNegativaValidator]"
    />

    <q-input
      v-model="formulario.justificativa"
      outlined
      label="Justificativa"
      class="field-required"
      type="textarea"
      autogrow
      maxlength="1000"
      counter
      hint="Mínimo de 10 caracteres"
      aria-required="true"
      :rules="[justificativaAjusteValidator]"
    />
  </q-form>
</template>

<script setup lang="ts">
import { useEstoqueLotes } from 'composables/useEstoqueLotes';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import type { QForm } from 'quasar';
import type { AjusteEstoqueFormModel } from 'types/dtos/estoque.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import {
  justificativaAjuste,
  obrigatorio,
  quantidadeNaoNegativa,
} from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  loteFixo?: boolean;
}>();

const formulario = defineModel<AjusteEstoqueFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const quantidadeNaoNegativaValidator = quantidadeNaoNegativa;
const justificativaAjusteValidator = justificativaAjuste;

const { rotuloProduto } = useProdutoOpcoesEstoque();
const { lotes, carregando: carregandoLotes, carregar: carregarLotes } = useEstoqueLotes();

const loteOpcoes = computed(() =>
  lotes.value.map((lote) => ({
    label: `${rotuloProduto(lote.produtoId)} — ${lote.numeroLote} (${formatarDecimal(lote.quantidade)}${
      lote.dataValidade ? `, val. ${formatarData(lote.dataValidade)}` : ''
    })`,
    value: lote.id,
  })),
);

onMounted(() => {
  void carregarLotes({ apenasComSaldo: false });
});

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>
.ajuste-estoque-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
