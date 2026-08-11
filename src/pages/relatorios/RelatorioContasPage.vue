<template>
  <relatorio-page-shell
    titulo="Contas a Pagar e a Receber"
    subtitulo="Títulos em aberto, baixados e renegociados com totais e saldos."
  >
    <div class="painel">
      <div class="agro-filter-bar">
        <agro-btn
          color="primary"
          unelevated
          label="Atualizar"
          descricao="Carregar contas financeiras"
          :loading="carregando"
          @click="atualizar"
        />
      </div>

      <agro-form-skeleton v-if="carregando && !contasFinanceiras" :campos="4" />
      <empty-state
        v-else-if="!carregando && !contasFinanceiras"
        titulo="Sem dados"
        descricao="Não foi possível carregar o resumo de contas."
        icon="receipt_long"
      />
      <template v-else-if="contasFinanceiras">
        <h3 class="secao-titulo">Contas a receber</h3>
        <q-table
          flat
          bordered
          row-key="faixa"
          class="q-mb-md"
          :rows="linhasReceber"
          :columns="colunas"
          hide-pagination
          :rows-per-page-options="[0]"
        >
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
          </template>
          <template #body-cell-saldo="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.saldo) }}</q-td>
          </template>
        </q-table>

        <h3 class="secao-titulo">Contas a pagar</h3>
        <q-table
          flat
          bordered
          row-key="faixa"
          :rows="linhasPagar"
          :columns="colunas"
          hide-pagination
          :rows-per-page-options="[0]"
        >
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
          </template>
          <template #body-cell-saldo="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.saldo) }}</q-td>
          </template>
        </q-table>
      </template>
    </div>
  </relatorio-page-shell>
</template>

<script setup lang="ts">
import RelatorioPageShell from 'components/relatorios/RelatorioPageShell.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useRelatorios } from 'composables/useRelatorios';
import type { QTableColumn } from 'quasar';
import type { ContasFinanceirasFaixaDto } from 'types/dtos/relatorio.dto';
import { formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';

const { contasFinanceiras, carregando, carregarContasFinanceiras } = useRelatorios();

interface LinhaFaixa extends ContasFinanceirasFaixaDto {
  faixa: string;
}

const colunas: QTableColumn<LinhaFaixa>[] = [
  { name: 'faixa', label: 'Situação', field: 'faixa', align: 'left' },
  { name: 'quantidade', label: 'Qtd.', field: 'quantidade', align: 'right' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'saldo', label: 'Saldo', field: 'saldo', align: 'right' },
];

function mapBloco(
  bloco: { aberto: ContasFinanceirasFaixaDto; baixado: ContasFinanceirasFaixaDto; renegociado: ContasFinanceirasFaixaDto },
): LinhaFaixa[] {
  return [
    { faixa: 'Em aberto', ...bloco.aberto },
    { faixa: 'Baixado', ...bloco.baixado },
    { faixa: 'Renegociado', ...bloco.renegociado },
  ];
}

const linhasReceber = computed(() =>
  contasFinanceiras.value ? mapBloco(contasFinanceiras.value.receber) : [],
);

const linhasPagar = computed(() =>
  contasFinanceiras.value ? mapBloco(contasFinanceiras.value.pagar) : [],
);

async function atualizar(): Promise<void> {
  await carregarContasFinanceiras();
}

onMounted(() => {
  void atualizar();
});
</script>

<style scoped>
.painel {
  padding-top: var(--spacing-4);
}
.secao-titulo {
  font-family: var(--font-display);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-4) 0 var(--spacing-3);
  color: var(--color-text-primary);
}
</style>
