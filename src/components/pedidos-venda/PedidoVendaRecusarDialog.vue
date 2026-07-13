<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="pedido-venda-recusar-dialog">
      <q-card-section>
        <h4 class="pedido-venda-recusar-dialog__titulo">Recusar pedido</h4>
        <p class="pedido-venda-recusar-dialog__descricao">
          Informe o motivo da recusa (opcional). A reserva de estoque será devolvida.
        </p>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="motivo"
          outlined
          label="Motivo"
          type="textarea"
          maxlength="500"
          counter
          autogrow
        />
      </q-card-section>

      <q-card-actions align="right">
        <agro-btn
          flat
          label="Cancelar"
          descricao="Fechar sem recusar"
          :disable="loading"
          @click="cancelar"
        />
        <agro-btn
          color="negative"
          unelevated
          label="Recusar"
          descricao="Confirmar recusa do pedido"
          :loading="loading"
          @click="confirmar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirmar: [motivo: string];
}>();

const motivo = ref('');

watch(
  () => props.modelValue,
  (aberto) => {
    if (aberto) {
      motivo.value = '';
    }
  },
);

function cancelar(): void {
  emit('update:modelValue', false);
}

function confirmar(): void {
  emit('confirmar', motivo.value);
}
</script>

<style scoped>
.pedido-venda-recusar-dialog {
  min-width: min(420px, 90vw);
  width: 100%;
}

.pedido-venda-recusar-dialog__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.pedido-venda-recusar-dialog__descricao {
  color: var(--color-text-secondary);
  margin: var(--spacing-2) 0 0;
}
</style>
