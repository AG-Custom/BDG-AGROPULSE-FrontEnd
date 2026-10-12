<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Operação não realizada</h4>
      </q-card-section>
      <q-card-section>
        <p v-if="quantidade > 1" class="quantidade">
          A justificativa será registrada nas {{ quantidade }} notas selecionadas.
        </p>
        <q-form greedy class="agro-formulario" @submit.prevent="confirmar">
          <q-input
            v-model="justificativa"
            outlined
            type="textarea"
            autogrow
            label="Justificativa"
            class="field-required"
            :rules="[tamanhoJustificativa]"
          />
          <div class="agro-form-actions">
            <agro-btn flat label="Fechar" descricao="Fechar" @click="emit('update:modelValue', false)" />
            <agro-btn
              color="primary"
              unelevated
              label="Registrar"
              descricao="Registrar operação não realizada"
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
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
  quantidade?: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [justificativa: string];
}>();

const justificativa = ref('');

watch(
  () => props.modelValue,
  (aberto) => {
    if (aberto) justificativa.value = '';
  },
);

function tamanhoJustificativa(valor: string): true | string {
  const texto = valor.trim();
  if (texto.length < 15 || texto.length > 255) return 'Informe entre 15 e 255 caracteres.';
  return true;
}

function confirmar(): void {
  emit('confirm', justificativa.value.trim());
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

.quantidade {
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-4);
}
</style>
