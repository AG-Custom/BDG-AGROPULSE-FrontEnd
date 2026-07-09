<template>
  <q-form ref="formRef" class="codigo-produto-formulario" greedy>
    <q-select
      v-model="formulario.tipo"
      outlined
      label="Tipo"
      class="field-required"
      emit-value
      map-options
      aria-required="true"
      :options="TipoCodigoProdutoOpcoes"
      :rules="[obrigatorio]"
    />

    <q-input
      v-model="formulario.valor"
      outlined
      label="Valor"
      class="field-required"
      maxlength="100"
      aria-required="true"
      :rules="[obrigatorio]"
    />

    <q-toggle v-model="formulario.principal" label="Principal do tipo" />
  </q-form>
</template>

<script setup lang="ts">
import { TipoCodigoProdutoOpcoes } from 'constants/enums';
import type { QForm } from 'quasar';
import type { ProdutoCodigoFormModel } from 'types/dtos/produto.dto';
import { obrigatorio } from 'utils/validators';
import { ref } from 'vue';

const formulario = defineModel<ProdutoCodigoFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>
.codigo-produto-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
