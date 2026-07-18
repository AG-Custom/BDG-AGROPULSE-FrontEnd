<template>
  <q-form ref="formRef" class="saida-estoque-formulario" greedy>
    <q-input
      v-model="formulario.codigoBarras"
      outlined
      label="Código de barras"
      hint="Leia o código ou digite e pressione Enter"
      @keyup.enter.prevent="buscarPorCodigo"
    >
      <template #append>
        <q-btn
          flat
          dense
          round
          icon="qr_code_scanner"
          aria-label="Buscar produto por código"
          :loading="buscandoCodigo"
          @click="buscarPorCodigo"
        />
      </template>
    </q-input>

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
      min="0"
      step="any"
      aria-required="true"
      :rules="[quantidadePositivaValidator]"
    >
      <template #append>
        <q-btn
          flat
          dense
          round
          icon="scale"
          aria-label="Ler peso da balança"
          :loading="lendoPeso"
          @click="lerPeso"
        />
      </template>
    </q-input>

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
import { useEstoqueDispositivos } from 'composables/useEstoqueDispositivos';
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
const { buscandoCodigo, lendoPeso, buscarProdutoPorCodigo, lerPesoBalanca } =
  useEstoqueDispositivos();

const { produtoOpcoes, carregando: carregandoProdutos } = useProdutoOpcoesEstoque();
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

async function onProdutoAlterado(produtoId: string | null): Promise<void> {
  formulario.value.loteId = '';

  if (!produtoId) {
    return;
  }

  await carregarLotes({ produtoId, apenasComSaldo: true });
}

async function buscarPorCodigo(): Promise<void> {
  const produto = await buscarProdutoPorCodigo(formulario.value.codigoBarras);
  if (!produto) {
    return;
  }

  formulario.value.produtoId = produto.id;
  await onProdutoAlterado(produto.id);
}

async function lerPeso(): Promise<void> {
  const leitura = await lerPesoBalanca();
  if (leitura) {
    formulario.value.quantidade = String(leitura.peso);
  }
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
