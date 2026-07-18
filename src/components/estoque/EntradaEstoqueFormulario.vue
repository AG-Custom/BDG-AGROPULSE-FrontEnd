<template>
  <q-form ref="formRef" class="entrada-estoque-formulario" greedy>
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

    <div class="entrada-estoque-formulario__localizacao">
      <q-input v-model="formulario.deposito" outlined label="Depósito" maxlength="50" />
      <q-input v-model="formulario.galpao" outlined label="Galpão" maxlength="50" />
      <q-input v-model="formulario.corredor" outlined label="Corredor" maxlength="50" />
      <q-input v-model="formulario.prateleira" outlined label="Prateleira" maxlength="50" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { useEstoqueDispositivos } from 'composables/useEstoqueDispositivos';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import type { QForm } from 'quasar';
import type { EntradaEstoqueFormModel } from 'types/dtos/estoque.dto';
import { obrigatorio, quantidadePositiva } from 'utils/validators';
import { computed, ref, watch } from 'vue';

const formulario = defineModel<EntradaEstoqueFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const quantidadePositivaValidator = quantidadePositiva;
const { buscandoCodigo, lendoPeso, buscarProdutoPorCodigo, lerPesoBalanca } =
  useEstoqueDispositivos();

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

async function buscarPorCodigo(): Promise<void> {
  const produto = await buscarProdutoPorCodigo(formulario.value.codigoBarras);
  if (!produto) {
    return;
  }

  formulario.value.produtoId = produto.id;
  await carregarDetalhe(produto.id);
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

.entrada-estoque-formulario__localizacao {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 600px) {
  .entrada-estoque-formulario__localizacao {
    grid-template-columns: 1fr;
  }
}
</style>
