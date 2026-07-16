<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Carta de correção (CC-e)</h4>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="confirmar">
          <q-input
            v-model="form.textoCorrecao"
            outlined
            type="textarea"
            autogrow
            label="Texto da correção"
            class="field-required"
            :rules="[obrigatorio]"
          />
          <div class="agro-form-actions">
            <agro-btn flat label="Fechar" descricao="Fechar" @click="emit('update:modelValue', false)" />
            <agro-btn color="primary" unelevated label="Registrar CC-e" type="submit" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { CceFormModel } from 'types/dtos/fiscal-gestao.dto';
import { obrigatorio } from 'utils/validators';
import { reactive, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [form: CceFormModel];
}>();

const form = reactive<CceFormModel>({ textoCorrecao: '' });

watch(
  () => props.modelValue,
  (open) => {
    if (open) form.textoCorrecao = '';
  },
);

function confirmar(): void {
  emit('confirm', { textoCorrecao: form.textoCorrecao });
}
</script>

<style scoped>
.dialog {
  min-width: min(480px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
