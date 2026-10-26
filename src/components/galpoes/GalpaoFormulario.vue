<template>
  <q-form ref="formRef" class="galpao-formulario agro-formulario" greedy :class="{ 'agro-formulario--bloqueado': somenteLeitura }">
    <fieldset class="agro-formulario__fieldset">
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
    </fieldset>
  </q-form>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import type { GalpaoFormModel } from 'types/dtos/galpao.dto';
import { obrigatorio } from 'utils/validators';
import { ref } from 'vue';

defineProps<{
  somenteLeitura?: boolean;
}>();

const formulario = defineModel<GalpaoFormModel>('formulario', { required: true });

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

.galpao-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
