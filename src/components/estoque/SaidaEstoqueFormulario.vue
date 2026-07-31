<template>
  <q-form ref="formRef" class="saida-estoque-formulario" greedy>
    <agro-select-cadastro
      v-model="formulario.produtoId"
      entidade="produto"
      label="Produto"
      class="field-required"
      aria-required="true"
      :options="produtoOpcoes"
      :loading="carregandoProdutos"
      :rules="[obrigatorio]"
      @atualizar="carregarProdutos()"
      @update:model-value="onProdutoAlterado"
    />

    <q-select
      v-model="formulario.motivo"
      outlined
      label="Motivo da saída"
      class="field-required"
      emit-value
      map-options
      aria-required="true"
      :options="MotivoSaidaEstoqueOpcoes"
      :rules="[obrigatorio]"
    />

    <q-toggle
      v-model="formulario.usarFefo"
      label="Usar FEFO (primeiro a vencer)"
    />

    <agro-select-cadastro
      v-if="!formulario.usarFefo"
      v-model="formulario.loteId"
      entidade="lote"
      label="Lote"
      class="field-required"
      aria-required="true"
      :options="loteOpcoes"
      :loading="carregandoLotes"
      :rules="[obrigatorio]"
      :desabilitar-cadastro="!formulario.produtoId"
      @atualizar="atualizarLotes()"
    />

    <q-input
      v-model="formulario.quantidade"
      outlined
      label="Quantidade"
      class="field-required"
      type="number"
      min="0"
      step="any"
      aria-required="true"
      :rules="[quantidadePositivaValidator]"
    />

    <q-input
      v-if="exigeJustificativa"
      v-model="formulario.justificativa"
      outlined
      label="Justificativa"
      class="field-required"
      type="textarea"
      autogrow
      aria-required="true"
      :rules="[obrigatorio, justificativaMinima]"
    />
  </q-form>
</template>

<script setup lang="ts">
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useEstoqueLotes } from 'composables/useEstoqueLotes';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import { MotivoSaidaEstoqueOpcoes, OrigemMovimentacaoEstoque } from 'constants/enums';
import type { QForm } from 'quasar';
import type { SaidaEstoqueFormModel } from 'types/dtos/estoque.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import { obrigatorio, quantidadePositiva } from 'utils/validators';
import { computed, ref, watch } from 'vue';

const formulario = defineModel<SaidaEstoqueFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const quantidadePositivaValidator = quantidadePositiva;

const {
  produtoOpcoes,
  carregando: carregandoProdutos,
  carregar: carregarProdutos,
} = useProdutoOpcoesEstoque();
const { lotes, carregando: carregandoLotes, carregar: carregarLotes } = useEstoqueLotes();

const exigeJustificativa = computed(
  () => formulario.value.motivo === OrigemMovimentacaoEstoque.Descarte,
);

const loteOpcoes = computed(() =>
  lotes.value.map((lote) => ({
    label: `${lote.numeroLote} — saldo ${formatarDecimal(lote.quantidade)}${
      lote.dataValidade ? ` — val. ${formatarData(lote.dataValidade)}` : ''
    }`,
    value: lote.id,
  })),
);

function justificativaMinima(valor: string): true | string {
  return valor.trim().length >= 10 || 'Informe ao menos 10 caracteres.';
}

async function onProdutoAlterado(produtoId: unknown): Promise<void> {
  const id = typeof produtoId === 'string' ? produtoId : '';
  formulario.value.loteId = '';

  if (!id) {
    return;
  }

  await carregarLotes({ produtoId: id, apenasComSaldo: true });
}

async function atualizarLotes(): Promise<void> {
  if (!formulario.value.produtoId) {
    return;
  }
  await carregarLotes({ produtoId: formulario.value.produtoId, apenasComSaldo: true });
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
