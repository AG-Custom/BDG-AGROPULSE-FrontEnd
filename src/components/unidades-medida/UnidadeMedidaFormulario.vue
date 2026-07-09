<template>
  <q-form ref="formRef" class="unidade-medida-formulario agro-formulario" greedy :class="{ 'agro-formulario--bloqueado': somenteLeitura }">
    <fieldset class="agro-formulario__fieldset">
<div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.codigo"
          outlined
          label="Código"
          class="field-required"
          maxlength="20"
          hint="Ex.: KG, UN, L"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-8">
        <q-input
          v-model="formulario.descricao"
          outlined
          label="Descrição"
          class="field-required"
          maxlength="100"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
    </div>
  </fieldset>
</q-form>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import type { UnidadeMedidaFormModel } from 'types/dtos/unidade-medida.dto';
import { obrigatorio } from 'utils/validators';
import { ref } from 'vue';

defineProps<{
  somenteLeitura?: boolean;
}>();

const formulario = defineModel<UnidadeMedidaFormModel>('formulario', { required: true });

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

.unidade-medida-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
