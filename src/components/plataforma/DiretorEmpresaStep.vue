<template>
  <q-form ref="formRef" class="diretor-step" greedy>
    <p class="text-body-md text-secondary">
      Informe o e-mail do Diretor. Ele receberá um convite para definir a senha no primeiro acesso.
    </p>
    <q-input v-model="admin.nome" outlined label="Nome" class="field-required" :rules="[obrigatorio]" />
    <q-input v-model="admin.sobrenome" outlined label="Sobrenome" class="field-required" :rules="[obrigatorio]" />
    <q-input
      v-model="admin.email"
      outlined
      label="E-mail"
      type="email"
      class="field-required"
      :rules="[obrigatorio, emailValidator]"
    />
  </q-form>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import type { AdminEmpresaFormModel } from 'types/dtos/plataforma.dto';
import { email as emailValidator, obrigatorio } from 'utils/validators';
import { ref } from 'vue';

const admin = defineModel<AdminEmpresaFormModel>('admin', { required: true });
const formRef = ref<QForm | null>(null);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>
.diretor-step {
  display: grid;
  gap: var(--spacing-4);
  max-width: 480px;
}
</style>
