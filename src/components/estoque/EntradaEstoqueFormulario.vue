<template>
  <q-form ref="formRef" class="entrada-estoque-formulario" greedy>
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

    <AgroMoneyInput
      v-if="verCustos"
      v-model="formulario.custoUnitario"
      label="Custo unitário"
      hint="Opcional"
    />

    <div class="entrada-estoque-formulario__localizacao">
      <p class="entrada-estoque-formulario__localizacao-titulo">Localização</p>
      <LocalEstoqueSelectCascade v-model="formulario.localEstoqueId" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import LocalEstoqueSelectCascade from 'components/estoque/LocalEstoqueSelectCascade.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import { useVerCustos } from 'composables/useVerCustos';
import type { QForm } from 'quasar';
import type { EntradaEstoqueFormModel } from 'types/dtos/estoque.dto';
import { obrigatorio, quantidadePositiva } from 'utils/validators';
import { computed, ref, watch } from 'vue';

const formulario = defineModel<EntradaEstoqueFormModel>('formulario', { required: true });
const { verCustos } = useVerCustos();

const formRef = ref<QForm | null>(null);
const quantidadePositivaValidator = quantidadePositiva;

const {
  produtoOpcoes,
  carregando: carregandoProdutos,
  carregarDetalhe,
  carregar: carregarProdutos,
  detalhes,
} = useProdutoOpcoesEstoque();

const produtoDetalhe = computed(() =>
  formulario.value.produtoId ? detalhes.value[formulario.value.produtoId] : undefined,
);

const exigeLote = computed(() => produtoDetalhe.value?.exigeLote === true);
const exigeValidade = computed(() => produtoDetalhe.value?.exigeValidade === true);

async function onProdutoAlterado(produtoId: unknown): Promise<void> {
  const id = typeof produtoId === 'string' ? produtoId : '';
  if (!id) {
    return;
  }

  await carregarDetalhe(id);
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
  gap: var(--spacing-3);
}

.entrada-estoque-formulario__localizacao-titulo {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0;
}
</style>
