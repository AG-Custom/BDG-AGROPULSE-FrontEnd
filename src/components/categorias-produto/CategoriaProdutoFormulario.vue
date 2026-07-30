<template>
  <q-form ref="formRef" class="categoria-produto-formulario agro-formulario" greedy :class="{ 'agro-formulario--bloqueado': somenteLeitura }">
    <fieldset class="agro-formulario__fieldset">
<div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-input
          v-model="formulario.nome"
          outlined
          label="Nome"
          class="field-required"
          maxlength="200"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div v-if="verCustos" class="col-12 col-md-4">
        <q-input
          v-model="formulario.margemMinimaPercentual"
          outlined
          label="Margem mínima (%)"
          type="number"
          min="0"
          step="0.01"
          :readonly="somenteLeitura"
        />
      </div>
    </div>
  </fieldset>
</q-form>
</template>

<script setup lang="ts">
import { useVerCustos } from 'composables/useVerCustos';
import type { QForm } from 'quasar';
import type { CategoriaProdutoFormModel } from 'types/dtos/categoria-produto.dto';
import { obrigatorio } from 'utils/validators';
import { ref } from 'vue';

defineProps<{
  somenteLeitura?: boolean;
}>();

const formulario = defineModel<CategoriaProdutoFormModel>('formulario', { required: true });
const { verCustos } = useVerCustos();

const formRef = ref<QForm | null>(null);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>

.agro-formulario__fieldset {
  border: 0;
  margin: 0;
  min-width: 0;
  padding: 0;
}

.agro-formulario__fieldset:disabled {
  opacity: 1;
}

.categoria-produto-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
