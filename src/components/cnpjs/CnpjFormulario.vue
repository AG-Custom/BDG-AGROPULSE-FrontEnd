<template>
  <q-form ref="formRef" class="cnpj-formulario" greedy>
    <q-input
      v-model="formulario.numero"
      outlined
      label="CNPJ"
      class="field-required"
      hint="14 dígitos"
      aria-required="true"
      :mask="MASCARAS.CNPJ"
      :maxlength="TAMANHO_FORMATADO.CNPJ"
      inputmode="numeric"
      :rules="[obrigatorio, cnpj]"
    />

    <q-input
      v-model="formulario.razaoSocial"
      outlined
      label="Razão social"
      class="field-required"
      maxlength="200"
      aria-required="true"
      :rules="[obrigatorio]"
    />

    <q-input
      v-model="formulario.nomeFantasia"
      outlined
      label="Nome fantasia"
      class="field-required"
      maxlength="200"
      aria-required="true"
      :rules="[obrigatorio]"
    />

    <q-toggle
      v-model="formulario.principal"
      label="CNPJ principal"
      :disable="desabilitarPrincipal"
    />
    <p v-if="desabilitarPrincipal" class="cnpj-formulario__hint text-caption text-secondary">
      A empresa já possui um CNPJ principal cadastrado.
    </p>
  </q-form>
</template>

<script setup lang="ts">
import { MASCARAS, TAMANHO_FORMATADO } from 'constants/masks';
import type { QForm } from 'quasar';
import type { CnpjFormModel } from 'types/dtos/cnpj.dto';
import { cnpj, obrigatorio } from 'utils/validators';
import { ref } from 'vue';

const props = defineProps<{
  desabilitarPrincipal?: boolean;
}>();

const formulario = defineModel<CnpjFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>
.cnpj-formulario {
  display: grid;
  gap: var(--spacing-4);
}

.cnpj-formulario__hint {
  margin: calc(-1 * var(--spacing-2)) 0 0;
}
</style>
