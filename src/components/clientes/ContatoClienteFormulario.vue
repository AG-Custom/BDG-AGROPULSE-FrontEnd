<template>
  <q-form ref="formRef" class="contato-cliente-formulario" greedy>
    <q-input
      v-model="formulario.nome"
      outlined
      label="Nome"
      class="field-required"
      maxlength="200"
      aria-required="true"
      :rules="[obrigatorio]"
    />

    <q-input
      v-model="formulario.email"
      outlined
      label="E-mail"
      type="email"
      class="field-required"
      maxlength="150"
      aria-required="true"
      :rules="[obrigatorio, emailValidator]"
    />

    <q-input
      v-model="formulario.telefone"
      outlined
      label="Telefone"
      class="field-required"
      hint="10 ou 11 dígitos"
      aria-required="true"
      :mask="mascaraTelefoneAtual"
      inputmode="numeric"
      :rules="[obrigatorio, telefoneValidator]"
    />

    <q-input
      v-model="formulario.cargo"
      outlined
      label="Cargo"
      maxlength="100"
    />

    <q-toggle v-model="formulario.principal" label="Contato principal" />
  </q-form>
</template>

<script setup lang="ts">
import { mascaraTelefone } from 'constants/masks';
import type { QForm } from 'quasar';
import type { ClienteContatoFormModel } from 'types/dtos/cliente.dto';
import { email, obrigatorio, telefone } from 'utils/validators';
import { computed, ref } from 'vue';

const formulario = defineModel<ClienteContatoFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);

const emailValidator = email;
const telefoneValidator = telefone;

const mascaraTelefoneAtual = computed(() => mascaraTelefone(formulario.value.telefone));

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>
.contato-cliente-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
