<template>
  <component :is="embutido ? 'div' : AgroCard" class="pagamentos">
    <h3 v-if="!embutido" class="titulo">Pagamentos</h3>

    <div v-if="fatura" class="fatura row q-col-gutter-md q-mb-md">
      <div class="col-6 col-md-3">
        <div class="text-caption">Número fatura</div>
        <div class="text-metric">{{ fatura.numero || '—' }}</div>
      </div>
      <div class="col-6 col-md-3">
        <div class="text-caption">Valor original</div>
        <div class="text-metric">{{ formatarMoedaOp(fatura.valorOriginal) }}</div>
      </div>
      <div class="col-6 col-md-3">
        <div class="text-caption">Desconto fatura</div>
        <div class="text-metric">{{ formatarMoedaOp(fatura.valorDesconto) }}</div>
      </div>
      <div class="col-6 col-md-3">
        <div class="text-caption">Valor líquido</div>
        <div class="text-metric">{{ formatarMoedaOp(fatura.valorLiquido) }}</div>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-select
          v-model="centroCustoId"
          outlined
          emit-value
          map-options
          clearable
          label="Centro de custo"
          :options="centroCustoOpcoes"
          :readonly="readonly"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="planoContas"
          outlined
          label="Plano de contas"
          :readonly="readonly"
        />
      </div>
    </div>

    <empty-state
      v-if="parcelas.length === 0"
      titulo="Sem parcelas"
      descricao="Nenhuma duplicata encontrada no XML."
      icon="payments"
    />

    <div v-for="(parcela, index) in parcelas" :key="parcela.chave" class="parcela-row row q-col-gutter-sm">
      <div class="col-6 col-md-2">
        <q-input
          v-model="parcela.numero"
          outlined
          dense
          label="Nº parcela"
          :readonly="readonly"
        />
      </div>
      <div class="col-6 col-md-2">
        <q-input
          v-model="parcela.vencimento"
          outlined
          dense
          type="date"
          label="Vencimento"
          :readonly="readonly"
        />
      </div>
      <div class="col-6 col-md-2">
        <AgroMoneyInput v-model="parcela.valor" dense label="Valor parcela" :readonly="readonly" />
      </div>
      <div class="col-6 col-md-3">
        <q-select
          v-model="parcela.formaPagamento"
          outlined
          dense
          emit-value
          map-options
          clearable
          label="Forma de pagamento"
          :options="FormaPagamentoOpcoes"
          :readonly="readonly"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="parcela.planoContas"
          outlined
          dense
          label="Plano de contas (parcela)"
          :readonly="readonly"
        />
      </div>
      <div v-if="!readonly" class="col-12">
        <agro-btn
          flat
          dense
          color="negative"
          icon="delete"
          label="Remover parcela"
          descricao="Remover parcela"
          @click="removerParcela(index)"
        />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { FormaPagamentoOpcoes } from 'constants/enums';
import type { PreviewRecebimentoXmlFaturaDto } from 'types/dtos/compras.dto';
import { formatarMoeda } from 'utils/formatters';

export interface ParcelaRecebimentoForm {
  chave: string;
  numero: string;
  vencimento: string;
  valor: string;
  formaPagamento: string | null;
  centroCustoId: string | null;
  planoContas: string;
}

withDefaults(
  defineProps<{
    fatura?: PreviewRecebimentoXmlFaturaDto | null;
    centroCustoOpcoes: Array<{ label: string; value: string }>;
    readonly?: boolean;
    embutido?: boolean;
  }>(),
  {
    embutido: false,
  },
);

const parcelas = defineModel<ParcelaRecebimentoForm[]>('parcelas', { required: true });
const centroCustoId = defineModel<string | null>('centroCustoId', { default: null });
const planoContas = defineModel<string>('planoContas', { default: '' });

function formatarMoedaOp(valor: number | null | undefined): string {
  return valor == null ? '—' : formatarMoeda(valor);
}

function removerParcela(index: number): void {
  parcelas.value.splice(index, 1);
}
</script>

<style scoped>
.titulo {
  margin: 0 0 var(--spacing-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.parcela-row {
  margin-bottom: var(--spacing-3);
  padding-bottom: var(--spacing-3);
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
}
</style>
