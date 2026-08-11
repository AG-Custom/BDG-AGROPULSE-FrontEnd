<template>
  <relatorio-page-shell
    titulo="Controle de Operações de Barter"
    subtitulo="Insumos fornecidos versus grãos a receber, com ajustes e exposição."
  >
    <div class="painel">
      <div class="agro-filter-bar">
        <agro-btn
          color="primary"
          unelevated
          label="Atualizar"
          descricao="Carregar operações de barter"
          :loading="carregando"
          @click="atualizar"
        />
      </div>

      <agro-form-skeleton v-if="carregando && !barter" :campos="4" />
      <empty-state
        v-else-if="!carregando && (!barter || barter.contratos.length === 0)"
        titulo="Sem operações de barter"
        descricao="Não há contratos de barter ativos nesta unidade."
        icon="swap_horiz"
      />
      <template v-else-if="barter">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6 col-md-3">
            <metric-tile
              label="Valor insumos"
              :value="formatarMoeda(barter.valorInsumosTotal)"
              icon="agriculture"
            />
          </div>
          <div class="col-6 col-md-3">
            <metric-tile
              label="Saldo grãos"
              :value="formatarDecimal(barter.saldoGraoTotal)"
              icon="grain"
            />
          </div>
          <div class="col-6 col-md-3">
            <metric-tile
              label="Ajuste financeiro"
              :value="formatarMoeda(barter.ajusteFinanceiroTotal)"
              icon="balance"
            />
          </div>
          <div class="col-6 col-md-3">
            <metric-tile
              label="Contratos"
              :value="String(barter.quantidadeContratos)"
              icon="description"
            />
          </div>
        </div>

        <q-table
          flat
          bordered
          row-key="contratoId"
          :rows="barter.contratos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-valorInsumos="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorInsumos) }}
            </q-td>
          </template>
          <template #body-cell-quantidadeGrao="props">
            <q-td :props="props" class="text-metric">
              {{ formatarDecimal(props.row.quantidadeGrao) }}
            </q-td>
          </template>
          <template #body-cell-saldoGrao="props">
            <q-td :props="props" class="text-metric">
              {{ formatarDecimal(props.row.saldoGrao) }}
            </q-td>
          </template>
          <template #body-cell-ajusteFinanceiro="props">
            <q-td :props="props" class="text-metric">
              {{
                props.row.ajusteFinanceiro != null
                  ? formatarMoeda(props.row.ajusteFinanceiro)
                  : '—'
              }}
            </q-td>
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
import MetricTile from 'components/ui/MetricTile.vue';
import { useRelatorios } from 'composables/useRelatorios';
import type { QTableColumn } from 'quasar';
import type { RelatorioBarterItemDto } from 'types/dtos/relatorio.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { onMounted } from 'vue';

const { barter, carregando, carregarBarter } = useRelatorios();

const colunas: QTableColumn<RelatorioBarterItemDto>[] = [
  { name: 'clienteNome', label: 'Cliente', field: 'clienteNome', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'valorInsumos', label: 'Insumos', field: 'valorInsumos', align: 'right' },
  { name: 'quantidadeGrao', label: 'Grãos', field: 'quantidadeGrao', align: 'right' },
  { name: 'saldoGrao', label: 'Saldo', field: 'saldoGrao', align: 'right' },
  { name: 'ajusteFinanceiro', label: 'Ajuste', field: 'ajusteFinanceiro', align: 'right' },
];

async function atualizar(): Promise<void> {
  await carregarBarter();
}

onMounted(() => {
  void atualizar();
});
</script>

<style scoped>
.painel {
  padding-top: var(--spacing-4);
}
</style>
