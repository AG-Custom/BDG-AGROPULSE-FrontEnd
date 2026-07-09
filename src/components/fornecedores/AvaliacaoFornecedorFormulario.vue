<template>
  <q-form ref="formRef" class="avaliacao-fornecedor-formulario" greedy>
    <div class="avaliacao-fornecedor-formulario__notas">
      <div class="avaliacao-fornecedor-formulario__campo">
        <span class="avaliacao-fornecedor-formulario__label field-required">
          Preço
        </span>
        <q-rating
          v-model="formulario.notaPreco"
          :max="5"
          size="md"
          color="primary"
          icon="star_border"
          icon-selected="star"
          aria-label="Nota de preço"
          aria-required="true"
        />
        <q-field
          borderless
          dense
          :model-value="formulario.notaPreco"
          :rules="[notaAvaliacaoValidator]"
        >
          <template #control />
        </q-field>
      </div>

      <div class="avaliacao-fornecedor-formulario__campo">
        <span class="avaliacao-fornecedor-formulario__label field-required">
          Prazo
        </span>
        <q-rating
          v-model="formulario.notaPrazo"
          :max="5"
          size="md"
          color="primary"
          icon="star_border"
          icon-selected="star"
          aria-label="Nota de prazo"
          aria-required="true"
        />
        <q-field
          borderless
          dense
          :model-value="formulario.notaPrazo"
          :rules="[notaAvaliacaoValidator]"
        >
          <template #control />
        </q-field>
      </div>

      <div class="avaliacao-fornecedor-formulario__campo">
        <span class="avaliacao-fornecedor-formulario__label field-required">
          Qualidade
        </span>
        <q-rating
          v-model="formulario.notaQualidade"
          :max="5"
          size="md"
          color="primary"
          icon="star_border"
          icon-selected="star"
          aria-label="Nota de qualidade"
          aria-required="true"
        />
        <q-field
          borderless
          dense
          :model-value="formulario.notaQualidade"
          :rules="[notaAvaliacaoValidator]"
        >
          <template #control />
        </q-field>
      </div>
    </div>

    <q-input
      v-model="formulario.observacao"
      outlined
      label="Observação"
      type="textarea"
      autogrow
      maxlength="1000"
      counter
    />
  </q-form>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import type { AvaliacaoFornecedorFormModel } from 'types/dtos/fornecedor.dto';
import { notaAvaliacao } from 'utils/validators';
import { ref } from 'vue';

const formulario = defineModel<AvaliacaoFornecedorFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const notaAvaliacaoValidator = notaAvaliacao;

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

defineExpose({ validar });
</script>

<style scoped>
.avaliacao-fornecedor-formulario {
  display: grid;
  gap: var(--spacing-4);
}

.avaliacao-fornecedor-formulario__notas {
  display: grid;
  gap: var(--spacing-4);
}

.avaliacao-fornecedor-formulario__campo {
  display: grid;
  gap: var(--spacing-2);
}

.avaliacao-fornecedor-formulario__label {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
</style>
