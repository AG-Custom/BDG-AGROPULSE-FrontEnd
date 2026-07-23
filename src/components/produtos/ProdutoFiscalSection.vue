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
import { useNotificacao } from 'composables/useNotificacao';
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
const { erro } = useNotificacao();

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
    erro('Verifique os campos fiscais obrigatórios (NCM com 8 dígitos e origem da mercadoria).');
    return;
  }

  const ok = await salvarFiscal(formulario.value);

  if (ok && props.produtoId) {
    // Mantém o formulário alinhado ao que foi persistido (normalização de dígitos).
    formulario.value = {
      ...formulario.value,
      ncm: formulario.value.ncm.replace(/\D/g, ''),
      cest: formulario.value.cest.replace(/\D/g, ''),
      cfopPadraoInterno: formulario.value.cfopPadraoInterno.replace(/\D/g, ''),
      cfopPadraoExterno: formulario.value.cfopPadraoExterno.replace(/\D/g, ''),
    };
  }
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
