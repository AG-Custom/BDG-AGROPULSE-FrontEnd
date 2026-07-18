<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Registrar entrega parcial</h4>
        <p v-if="saldoPendente != null" class="text-caption text-secondary">
          Pendente:
          <span class="text-metric">{{ formatarDecimal(saldoPendente) }}</span>
        </p>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="confirmar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.quantidade"
                outlined
                label="Quantidade"
                class="field-required"
                type="number"
                step="0.001"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.dataEntrega" outlined label="Data da entrega" type="date" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.notaFiscal"
                outlined
                label="Nota fiscal (stub)"
                placeholder="Número da NF-e"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.precoEntrega"
                outlined
                label="Preço na entrega"
                type="number"
                step="0.0001"
              />
            </div>
            <div class="col-12">
              <q-input v-model="form.observacao" outlined label="Observação" type="textarea" autogrow />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="$emit('update:modelValue', false)" />
            <agro-btn
              color="primary"
              unelevated
              label="Registrar"
              descricao="Registrar entrega"
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
import type { EntregaFormModel, EntregaPayload } from 'types/dtos/contrato.dto';
import { formatarDecimal } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { reactive, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  saldoPendente?: number | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirmar: [payload: EntregaPayload];
}>();

const form = reactive<EntregaFormModel>({
  quantidade: '',
  dataEntrega: '',
  notaFiscal: '',
  observacao: '',
  precoEntrega: '',
});

function reset(): void {
  form.quantidade = '';
  form.dataEntrega = new Date().toISOString().slice(0, 10);
  form.notaFiscal = '';
  form.observacao = '';
  form.precoEntrega = '';
}

watch(
  () => props.modelValue,
  (aberto) => {
    if (aberto) reset();
  },
);

function confirmar(): void {
  const payload: EntregaPayload = {
    quantidade: Number(form.quantidade),
    dataEntrega: form.dataEntrega || new Date().toISOString().slice(0, 10),
    numeroNfe: form.notaFiscal.trim() || null,
    observacao: form.observacao.trim() || null,
    precoEntrega: form.precoEntrega.trim() ? Number(form.precoEntrega) : null,
    stubNfe: true,
  };
  emit('confirmar', payload);
}
</script>

<style scoped>
.dialog {
  max-width: 520px;
  width: 100%;
}

.titulo {
  margin: 0;
}
</style>
