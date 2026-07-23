<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Baixar conta a pagar</h4>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="confirmar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <AgroMoneyInput
                v-model="form.valor"
                label="Valor"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.dataPagamento" outlined label="Data pagamento" type="date" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.formaPagamento"
                outlined
                emit-value
                map-options
                label="Forma de pagamento"
                :options="FormaPagamentoOpcoes"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.contaBancariaId"
                outlined
                emit-value
                map-options
                clearable
                label="Conta bancária"
                :options="contaOpcoes"
              />
            </div>
            <div class="col-6">
              <AgroMoneyInput v-model="form.juros" label="Juros" />
            </div>
            <div class="col-6">
              <AgroMoneyInput v-model="form.multa" label="Multa" />
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
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import { FormaPagamentoOpcoes, type FormaPagamentoValor } from 'constants/enums';
import type { BaixaContaPagarFormModel, BaixarContaPagarPayload } from 'types/dtos/financeiro.dto';
import { formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
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
  confirmar: [payload: BaixarContaPagarPayload];
}>();

const form = reactive<BaixaContaPagarFormModel>({
  valor: '',
  formaPagamento: '',
  contaBancariaId: '',
  dataPagamento: '',
  juros: '',
  multa: '',
  observacao: '',
});

watch(
  () => props.modelValue,
  (aberto) => {
    if (aberto) {
      form.valor = formatarMoedaParaInput(props.valorSugerido ?? null);
      form.formaPagamento = '';
      form.contaBancariaId = '';
      form.dataPagamento = new Date().toISOString().slice(0, 10);
      form.juros = '';
      form.multa = '';
      form.observacao = '';
    }
  },
);

function confirmar(): void {
  emit('confirmar', {
    valor: parseMascaraMoeda(form.valor) ?? undefined,
    formaPagamento: (form.formaPagamento || null) as FormaPagamentoValor | null,
    contaBancariaId: form.contaBancariaId || null,
    dataPagamento: form.dataPagamento || null,
    juros: parseMascaraMoeda(form.juros),
    multa: parseMascaraMoeda(form.multa),
    observacao: form.observacao.trim() || null,
  });
}
</script>

<style scoped>
.dialog {
  min-width: min(560px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
