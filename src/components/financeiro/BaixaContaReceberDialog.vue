<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Baixar conta a receber</h4>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="confirmar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.valor"
                outlined
                label="Valor total"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.dataPagamento" outlined label="Data pagamento" type="date" />
            </div>
            <div class="col-6">
              <q-input v-model="form.juros" outlined label="Juros" />
            </div>
            <div class="col-6">
              <q-input v-model="form.multa" outlined label="Multa" />
            </div>
            <div class="col-12">
              <q-input v-model="form.observacao" outlined label="Observação" type="textarea" autogrow />
            </div>
          </div>

          <div class="formas-header">
            <h5 class="subtitulo">Formas de pagamento</h5>
            <agro-btn flat dense icon="add" label="Adicionar" descricao="Adicionar forma" @click="adicionarForma" />
          </div>

          <div v-for="(linha, index) in form.formas" :key="index" class="forma-linha row q-col-gutter-sm q-mb-sm">
            <div class="col-12 col-md-4">
              <q-select
                v-model="linha.formaPagamento"
                outlined
                dense
                emit-value
                map-options
                label="Forma"
                :options="FormaPagamentoOpcoes"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="linha.valor" outlined dense label="Valor" />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="linha.contaBancariaId"
                outlined
                dense
                emit-value
                map-options
                clearable
                label="Conta"
                :options="contaOpcoes"
              />
            </div>
            <div class="col-12 col-md-1 flex flex-center">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover forma"
                :disable="form.formas.length <= 1"
                @click="removerForma(index)"
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="$emit('update:modelValue', false)" />
            <agro-btn
              color="primary"
              unelevated
              label="Baixar"
              descricao="Confirmar baixa"
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
import { FormaPagamentoOpcoes, type FormaPagamentoValor } from 'constants/enums';
import type {
  BaixaContaReceberFormModel,
  BaixarContaReceberPayload,
  FormaBaixaReceberFormModel,
} from 'types/dtos/financeiro.dto';
import { obrigatorio } from 'utils/validators';
import { reactive, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  valorSugerido?: number;
  contaOpcoes: Array<{ label: string; value: string }>;
  loading?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirmar: [payload: BaixarContaReceberPayload];
}>();

function formaVazia(): FormaBaixaReceberFormModel {
  return { formaPagamento: '', valor: '', contaBancariaId: '' };
}

const form = reactive<BaixaContaReceberFormModel>({
  valor: '',
  dataPagamento: '',
  juros: '',
  multa: '',
  observacao: '',
  formas: [formaVazia()],
});

watch(
  () => props.modelValue,
  (aberto) => {
    if (aberto) {
      form.valor = props.valorSugerido != null ? String(props.valorSugerido) : '';
      form.dataPagamento = new Date().toISOString().slice(0, 10);
      form.juros = '';
      form.multa = '';
      form.observacao = '';
      form.formas = [
        {
          formaPagamento: '',
          valor: form.valor,
          contaBancariaId: '',
        },
      ];
    }
  },
);

function adicionarForma(): void {
  form.formas.push(formaVazia());
}

function removerForma(index: number): void {
  if (form.formas.length > 1) {
    form.formas.splice(index, 1);
  }
}

function confirmar(): void {
  emit('confirmar', {
    valor: form.valor ? Number(form.valor.replace(',', '.')) : undefined,
    dataPagamento: form.dataPagamento || null,
    juros: form.juros ? Number(form.juros.replace(',', '.')) : null,
    multa: form.multa ? Number(form.multa.replace(',', '.')) : null,
    observacao: form.observacao.trim() || null,
    formas: form.formas
      .filter((f) => f.formaPagamento && f.valor)
      .map((f) => ({
        formaPagamento: f.formaPagamento as FormaPagamentoValor,
        valor: Number(f.valor.replace(',', '.')),
        contaBancariaId: f.contaBancariaId || null,
      })),
  });
}
</script>

<style scoped>
.dialog {
  min-width: min(640px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.subtitulo {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
.formas-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: var(--spacing-4) 0 var(--spacing-2);
}
</style>
