<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Cancelar nota fiscal</h4>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="confirmar">
          <q-input
            v-model="form.motivo"
            outlined
            type="textarea"
            autogrow
            label="Motivo (mín. 15 caracteres)"
            class="field-required"
            :rules="[obrigatorio, minMotivo]"
          />
          <div class="agro-form-actions">
            <agro-btn flat label="Fechar" descricao="Fechar" @click="emit('update:modelValue', false)" />
            <agro-btn
              color="negative"
              unelevated
              label="Cancelar nota"
              type="submit"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { CancelarNotaFormModel } from 'types/dtos/fiscal-gestao.dto';
import { obrigatorio } from 'utils/validators';
import { reactive, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [form: CancelarNotaFormModel];
}>();

const form = reactive<CancelarNotaFormModel>({ motivo: '' });

watch(
  () => props.modelValue,
  (open) => {
    if (open) form.motivo = '';
  },
);

function minMotivo(val: string): true | string {
  return val.trim().length >= 15 || 'Informe ao menos 15 caracteres';
}

function confirmar(): void {
  emit('confirm', { motivo: form.motivo });
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
