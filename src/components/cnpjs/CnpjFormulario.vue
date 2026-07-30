<template>
  <q-form
    ref="formRef"
    class="cnpj-formulario agro-formulario"
    greedy
    :class="{ 'agro-formulario--bloqueado': somenteLeitura }"
  >
    <q-input
      v-model="numeroExibicao"
      outlined
      label="CNPJ"
      class="field-required"
      hint="O número do CNPJ não pode ser alterado"
      aria-required="true"
      :mask="modo === 'criar' ? MASCARAS.CNPJ : undefined"
      :maxlength="modo === 'criar' ? TAMANHO_FORMATADO.CNPJ : undefined"
      inputmode="numeric"
      :disable="modo === 'editar' || modo === 'visualizar'"
      :readonly="somenteLeitura"
      :rules="modo === 'criar' ? [obrigatorio, cnpj] : undefined"
    />

    <q-input
      v-model="formulario.razaoSocial"
      outlined
      label="Razão social"
      class="field-required"
      maxlength="200"
      aria-required="true"
      :readonly="somenteLeitura"
      :rules="[obrigatorio]"
    />

    <q-input
      v-model="formulario.nomeFantasia"
      outlined
      label="Nome fantasia"
      class="field-required"
      maxlength="200"
      aria-required="true"
      :readonly="somenteLeitura"
      :rules="[obrigatorio]"
    />

    <q-toggle
      v-model="formulario.principal"
      label="CNPJ principal"
      :disable="desabilitarPrincipal || somenteLeitura"
    />
    <p v-if="desabilitarPrincipal && !somenteLeitura" class="cnpj-formulario__hint text-caption text-secondary">
      A empresa já possui um CNPJ principal cadastrado.
    </p>

    <q-toggle
      v-if="modo === 'editar' || modo === 'visualizar'"
      v-model="formulario.ativo"
      label="CNPJ ativo"
      :disable="somenteLeitura"
    />
    <p
      v-if="modo === 'editar' && formulario.principal && !formulario.ativo"
      class="cnpj-formulario__hint text-caption text-secondary"
    >
      O CNPJ principal não pode ser inativado.
    </p>
  </q-form>
</template>

<script setup lang="ts">
import { MASCARAS, TAMANHO_FORMATADO } from 'constants/masks';
import type { QForm } from 'quasar';
import type { CnpjFormModel } from 'types/dtos/cnpj.dto';
import { formatarCnpj } from 'utils/formatters';
import { cnpj, obrigatorio } from 'utils/validators';
import { computed, ref } from 'vue';

const props = defineProps<{
  modo: 'criar' | 'editar' | 'visualizar';
  desabilitarPrincipal?: boolean;
  somenteLeitura?: boolean;
}>();

const formulario = defineModel<CnpjFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);

const numeroExibicao = computed({
  get() {
    if (props.modo === 'editar' || props.modo === 'visualizar') {
      return formatarCnpj(formulario.value.numero);
    }

    return formulario.value.numero;
  },
  set(valor: string) {
    if (props.modo === 'criar') {
      formulario.value.numero = valor;
    }
  },
});

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
