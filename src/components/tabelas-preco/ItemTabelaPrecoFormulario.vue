<template>
  <q-form ref="formRef" class="item-tabela-preco-formulario" greedy>
    <q-select
      v-if="modo === 'criar'"
      v-model="produtoId"
      outlined
      label="Produto"
      class="field-required"
      emit-value
      map-options
      aria-required="true"
      :options="produtoOpcoes"
      :loading="carregandoProdutos"
      :rules="[obrigatorio]"
    />

    <AgroMoneyInput
      v-model="preco"
      label="Preço"
      class="field-required"
      aria-required="true"
      :rules="[obrigatorio]"
    />

    <q-input
      v-model="margemMinimaPercentual"
      outlined
      label="Margem mínima (%)"
      type="number"
      min="0"
      step="0.01"
      hint="Opcional"
    />
  </q-form>
</template>

<script setup lang="ts">
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import { useProdutos } from 'composables/useProdutos';
import type { QForm } from 'quasar';
import type {
  TabelaPrecoItemEdicaoFormModel,
  TabelaPrecoItemFormModel,
} from 'types/dtos/tabela-preco.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  modo: 'criar' | 'editar';
}>();

const formularioCriar = defineModel<TabelaPrecoItemFormModel>('formularioCriar', {
  required: false,
});

const formularioEditar = defineModel<TabelaPrecoItemEdicaoFormModel>('formularioEditar', {
  required: false,
});

const formRef = ref<QForm | null>(null);

const { produtos, carregando: carregandoProdutos, carregar: carregarProdutos } = useProdutos();

const produtoOpcoes = computed(() =>
  produtos.value.map((produto) => ({
    label: `${produto.descricao}`,
    value: produto.id,
  })),
);

const produtoId = computed({
  get() {
    return formularioCriar.value?.produtoId ?? '';
  },
  set(valor: string) {
    if (formularioCriar.value) {
      formularioCriar.value.produtoId = valor;
    }
  },
});

const preco = computed({
  get() {
    return props.modo === 'criar'
      ? formularioCriar.value?.preco ?? ''
      : formularioEditar.value?.preco ?? '';
  },
  set(valor: string) {
    if (props.modo === 'criar' && formularioCriar.value) {
      formularioCriar.value.preco = valor;
    } else if (formularioEditar.value) {
      formularioEditar.value.preco = valor;
    }
  },
});

const margemMinimaPercentual = computed({
  get() {
    return props.modo === 'criar'
      ? formularioCriar.value?.margemMinimaPercentual ?? ''
      : formularioEditar.value?.margemMinimaPercentual ?? '';
  },
  set(valor: string) {
    if (props.modo === 'criar' && formularioCriar.value) {
      formularioCriar.value.margemMinimaPercentual = valor;
    } else if (formularioEditar.value) {
      formularioEditar.value.margemMinimaPercentual = valor;
    }
  },
});

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

onMounted(() => {
  void carregarProdutos({ ativo: true });
});

defineExpose({ validar });
</script>

<style scoped>
.item-tabela-preco-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
