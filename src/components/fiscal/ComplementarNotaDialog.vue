<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Nota complementar</h4>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="confirmar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="form.valorAdicional"
                outlined
                label="Valor adicional"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-8">
              <q-input
                v-model="form.motivo"
                outlined
                label="Motivo"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat label="Fechar" descricao="Fechar" @click="emit('update:modelValue', false)" />
            <agro-btn color="primary" unelevated label="Emitir" type="submit" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { ComplementarFormModel } from 'types/dtos/fiscal-gestao.dto';
import { obrigatorio } from 'utils/validators';
import { reactive, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [form: ComplementarFormModel];
}>();

const form = reactive<ComplementarFormModel>({ valorAdicional: '', motivo: '' });

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      form.valorAdicional = '';
      form.motivo = '';
    }
  },
);

function confirmar(): void {
  emit('confirm', { ...form });
}
</script>

<style scoped>
.dialog {
  min-width: min(520px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
