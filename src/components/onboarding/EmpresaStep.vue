<template>
  <q-form ref="formRef" class="empresa-step" greedy>
    <div class="text-h6 q-mb-md">Dados da empresa</div>

    <q-input
      v-model="empresa.razaoSocial"
      outlined
      label="Razão social"
      class="field-required"
      aria-required="true"
      :rules="[obrigatorio]"
    />

    <q-input
      v-model="empresa.nomeFantasia"
      outlined
      label="Nome fantasia"
      class="field-required"
      aria-required="true"
      :rules="[obrigatorio]"
    />

    <q-input
      v-model="empresa.cnpj"
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

    <q-select
      v-model="empresa.tipoOperacao"
      outlined
      label="Tipo de operação"
      class="field-required"
      emit-value
      map-options
      aria-required="true"
      :options="TipoOperacaoEmpresaOpcoes"
      :rules="[obrigatorio]"
      hint="Indústria libera o módulo de produção"
    />
  </q-form>
</template>

<script setup lang="ts">
import { MASCARAS, TAMANHO_FORMATADO } from 'constants/masks';
import { TipoOperacaoEmpresaOpcoes } from 'constants/enums';
import type { QForm } from 'quasar';
import type { EmpresaFormModel } from 'types/dtos/onboarding.dto';
import { cnpj, obrigatorio } from 'utils/validators';
import { ref } from 'vue';

const empresa = defineModel<EmpresaFormModel>('empresa', { required: true });

const formRef = ref<QForm | null>(null);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>
.empresa-step {
  display: grid;
  gap: var(--spacing-4);
}
</style>
