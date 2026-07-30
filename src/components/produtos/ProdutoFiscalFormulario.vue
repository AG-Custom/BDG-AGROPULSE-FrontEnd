<template>
  <q-form ref="formRef" class="produto-fiscal-formulario agro-formulario" greedy :class="{ 'agro-formulario--bloqueado': somenteLeitura }">
    <fieldset class="agro-formulario__fieldset">
<div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.ncm"
          outlined
          label="NCM"
          class="field-required"
          maxlength="8"
          hint="8 dígitos"
          inputmode="numeric"
          aria-required="true"
          :rules="somenteLeitura ? undefined : [obrigatorio, ncmValidator]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.cest"
          outlined
          label="CEST"
          maxlength="7"
          hint="7 dígitos (opcional)"
          inputmode="numeric"
          :rules="somenteLeitura ? undefined : [cestValidator]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="formulario.origemMercadoria"
          outlined
          label="Origem da mercadoria"
          class="field-required"
          emit-value
          map-options
          aria-required="true"
          :options="OrigemMercadoriaOpcoes"
          :readonly="somenteLeitura"
          :rules="somenteLeitura ? undefined : [obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.csosn"
          outlined
          label="CSOSN"
          maxlength="10"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.cstIcms"
          outlined
          label="CST ICMS"
          maxlength="10"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          :model-value="formulario.aliquotaIcms"
          outlined
          label="Alíquota ICMS (%)"
          inputmode="decimal"
          :readonly="somenteLeitura"
          @update:model-value="onNumero('aliquotaIcms', $event)"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          :model-value="formulario.mva"
          outlined
          label="MVA (%)"
          inputmode="decimal"
          :readonly="somenteLeitura"
          @update:model-value="onNumero('mva', $event)"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.cfopPadraoInterno"
          outlined
          label="CFOP padrão interno"
          maxlength="4"
          hint="4 dígitos"
          inputmode="numeric"
          :rules="somenteLeitura ? undefined : [cfopValidator]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.cfopPadraoExterno"
          outlined
          label="CFOP padrão externo"
          maxlength="4"
          hint="4 dígitos"
          inputmode="numeric"
          :rules="somenteLeitura ? undefined : [cfopValidator]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12">
        <q-input
          v-model="formulario.observacoesFiscais"
          outlined
          label="Observações fiscais"
          type="textarea"
          maxlength="1000"
          autogrow
          :readonly="somenteLeitura"
        />
      </div>
    </div>
  </fieldset>
</q-form>
</template>

<script setup lang="ts">
import { OrigemMercadoriaOpcoes } from 'constants/enums';
import type { QForm } from 'quasar';
import type { ProdutoFiscalFormModel } from 'types/dtos/produto.dto';
import { cest, cfop, ncm, obrigatorio } from 'utils/validators';
import { ref } from 'vue';

defineProps<{
  somenteLeitura?: boolean;
}>();

const formulario = defineModel<ProdutoFiscalFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);

const ncmValidator = ncm;
const cestValidator = cest;
const cfopValidator = cfop;

function onNumero(campo: 'aliquotaIcms' | 'mva', valor: string | number | null): void {
  formulario.value[campo] = valor === null || valor === undefined ? '' : String(valor);
}

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

.produto-fiscal-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
