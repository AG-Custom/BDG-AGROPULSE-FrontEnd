<template>
  <agro-card class="produto-fiscal">
    <template #header>
      <div class="produto-fiscal__header">
        <h3 class="produto-fiscal__titulo">Configuração fiscal</h3>
      </div>
    </template>

    <produto-fiscal-formulario
      ref="formularioRef"
      v-model:formulario="formulario"
      :somente-leitura="somenteLeitura"
    />

    <div v-if="produtoId && !somenteLeitura" class="produto-fiscal__acoes">
      <agro-btn
        color="primary"
        unelevated
        label="Salvar fiscal"
        descricao="Salvar configuração fiscal do produto"
        :loading="salvando"
        @click="salvar"
      />
    </div>
  </agro-card>
</template>

<script setup lang="ts">
import ProdutoFiscalFormulario from 'components/produtos/ProdutoFiscalFormulario.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import { useProdutoFiscal } from 'composables/useProdutoFiscal';
import type { ProdutoFiscalDto, ProdutoFiscalFormModel } from 'types/dtos/produto.dto';
import { fiscalDtoParaForm } from 'utils/mappers/produto.mapper';
import { ref, toRef, watch } from 'vue';

const props = defineProps<{
  produtoId?: string;
  fiscalInicial?: ProdutoFiscalDto | null;
  somenteLeitura?: boolean;
}>();

const formulario = defineModel<ProdutoFiscalFormModel>('formulario', { required: true });

const { salvando, salvar: salvarFiscal } = useProdutoFiscal(() => props.produtoId);

const formularioRef = ref<InstanceType<typeof ProdutoFiscalFormulario> | null>(null);

watch(
  toRef(props, 'fiscalInicial'),
  (fiscal) => {
    if (!props.produtoId || !fiscal) {
      return;
    }

    formulario.value = fiscalDtoParaForm(fiscal);
  },
  { immediate: true },
);

async function validar(): Promise<boolean> {
  return (await formularioRef.value?.validar()) ?? false;
}

async function salvar(): Promise<void> {
  const valido = await validar();

  if (!valido) {
    return;
  }

  await salvarFiscal(formulario.value);
}

defineExpose({ validar });
</script>

<style scoped>
.produto-fiscal__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.produto-fiscal__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.produto-fiscal__acoes {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-4);
}
</style>
