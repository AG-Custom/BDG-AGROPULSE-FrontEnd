<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="emitir-dialog">
      <q-card-section>
        <h3 class="emitir-dialog__titulo">Emitir boleto</h3>
        <p class="emitir-dialog__texto">Escolha a conta a receber que será cobrada por boleto.</p>
        <q-select
          v-model="contaReceberId"
          outlined
          emit-value
          map-options
          label="Conta a receber em aberto"
          :options="opcoes"
          :loading="carregando"
        />
      </q-card-section>
      <q-card-actions align="right">
        <agro-btn flat label="Cancelar" descricao="Cancelar emissão" @click="fechar" />
        <agro-btn
          color="primary"
          unelevated
          label="Emitir"
          descricao="Emitir boleto"
          :loading="salvando"
          :disable="!contaReceberId"
          @click="confirmar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useContasReceber } from 'composables/useContasReceber';
import { ContaReceberStatus } from 'constants/enums';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { computed, ref, watch } from 'vue';

const props = defineProps<{ modelValue: boolean; salvando: boolean }>();
const emit = defineEmits<{
  'update:modelValue': [valor: boolean];
  emitir: [contaReceberId: string];
}>();

const { contas, carregando, carregar } = useContasReceber();
const contaReceberId = ref('');

const opcoes = computed(() =>
  contas.value.map((c) => ({
    value: c.id,
    label: `Parcela ${c.parcela} — ${formatarMoeda(c.valor)} — venc. ${formatarData(c.vencimento)}`,
  })),
);

function fechar(): void {
  emit('update:modelValue', false);
}

function confirmar(): void {
  if (contaReceberId.value) emit('emitir', contaReceberId.value);
}

watch(
  () => props.modelValue,
  (aberto) => {
    if (!aberto) return;
    contaReceberId.value = '';
    void carregar({ status: ContaReceberStatus.Aberta });
  },
);
</script>

<style scoped>
.emitir-dialog {
  width: 100%;
  max-width: 520px;
}
.emitir-dialog__titulo {
  margin: 0 0 var(--spacing-2);
  font-family: var(--font-family-display);
  font-size: var(--font-size-md);
}
.emitir-dialog__texto {
  margin: 0 0 var(--spacing-4);
  color: var(--color-text-secondary);
}
</style>
