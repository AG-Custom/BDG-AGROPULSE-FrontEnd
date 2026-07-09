<template>
  <q-form ref="formRef" class="endereco-cliente-formulario" greedy>
    <q-select
      v-model="formulario.tipo"
      outlined
      label="Tipo de endereço"
      class="field-required"
      emit-value
      map-options
      aria-required="true"
      :options="TipoEnderecoClienteOpcoes"
      :rules="[obrigatorio]"
    />

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.cep"
          outlined
          label="CEP"
          class="field-required"
          hint="8 dígitos — preenchimento automático do endereço"
          aria-required="true"
          :mask="MASCARAS.CEP"
          :maxlength="TAMANHO_FORMATADO.CEP"
          inputmode="numeric"
          :loading="buscandoCep"
          :rules="[obrigatorio, cepValidator]"
          @blur="buscarSeCepValido"
        />
      </div>
      <div class="col-12 col-md-8">
        <q-input
          v-model="formulario.logradouro"
          outlined
          label="Endereço"
          class="field-required"
          aria-required="true"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="formulario.numero"
          outlined
          label="Número"
          class="field-required"
          aria-required="true"
          :mask="MASCARAS.NUMERO_ENDERECO"
          :maxlength="TAMANHO_FORMATADO.NUMERO_ENDERECO"
          inputmode="numeric"
          :rules="[obrigatorio, numeroEnderecoValidator]"
        />
      </div>
      <div class="col-12 col-md-5">
        <q-input
          v-model="formulario.bairro"
          outlined
          label="Bairro"
          class="field-required"
          aria-required="true"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.complemento"
          outlined
          label="Complemento"
        />
      </div>
      <div class="col-12 col-md-8">
        <q-input
          v-model="formulario.cidade"
          outlined
          label="Cidade"
          class="field-required"
          aria-required="true"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.estado"
          outlined
          label="UF"
          class="field-required"
          maxlength="2"
          aria-required="true"
          :rules="[obrigatorio, ufValidator]"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.latitude"
          outlined
          label="Latitude"
          type="number"
          step="any"
          hint="Opcional — coordenada GPS"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.longitude"
          outlined
          label="Longitude"
          type="number"
          step="any"
          hint="Opcional — coordenada GPS"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { TipoEnderecoClienteOpcoes } from 'constants/enums';
import { MASCARAS, TAMANHO_FORMATADO } from 'constants/masks';
import { useBuscaCep } from 'composables/useBuscaCep';
import type { QForm } from 'quasar';
import type { ClienteEnderecoFormModel } from 'types/dtos/cliente.dto';
import { cep, numeroEndereco, obrigatorio, uf } from 'utils/validators';
import { ref } from 'vue';

const formulario = defineModel<ClienteEnderecoFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);

const { buscandoCep, buscarSeCepValido } = useBuscaCep(formulario);

const cepValidator = cep;
const ufValidator = uf;
const numeroEnderecoValidator = numeroEndereco;

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>
.endereco-cliente-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
