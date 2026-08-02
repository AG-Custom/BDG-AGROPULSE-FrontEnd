<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Painel"
      subtitulo="Indicadores gerenciais da sua operação."
    >
      <div class="dashboard-header-acoes">
        <q-input
          v-model="dias"
          outlined
          dense
          label="Dias"
          type="number"
          class="filtro-dias"
        />
        <agro-btn
          color="primary"
          unelevated
          icon="refresh"
          label="Atualizar"
          descricao="Atualizar painel"
          :loading="carregando"
          @click="atualizar"
        />
      </div>
    </app-page-header>

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && !kpis" :campos="6" />

      <template v-else-if="kpis">
        <div class="row q-col-gutter-md q-mb-md">
          <div v-for="tile in tiles" :key="tile.label" class="col-6 col-md-4 col-lg-2">
            <metric-tile
              :label="tile.label"
              :value="tile.value"
              :icon="tile.icon"
              :accent="tile.accent"
            />
          </div>
        </div>

        <div
          v-if="podeVerAprovacoes"
          class="row q-col-gutter-md q-mb-md"
        >
          <div class="col-12 col-md-6 col-lg-4">
            <agro-card>
              <div class="secao-header">
                <div class="text-subtitle1">Fila de aprovações</div>
                <agro-btn
                  flat
                  dense
                  color="primary"
                  label="Ver fila"
                  descricao="Ir para fila de aprovações"
                  :to="{ name: 'aprovacoes' }"
                />
              </div>
              <metric-tile
                label="Pedidos aguardando"
                :value="String(filaAprovacoes.length)"
                icon="rule"
                :accent="filaAprovacoes.length > 0"
              />
            </agro-card>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <agro-card>
              <div class="secao-header">
                <div class="text-subtitle1">Alertas recentes</div>
                <agro-btn
                  flat
                  dense
                  color="primary"
                  label="Ver todos"
                  descricao="Ir para alertas"
                  :to="{ name: 'relatorios', query: { aba: 'alertas' } }"
                />
              </div>
              <empty-state
                v-if="alertasResumo.length === 0"
                titulo="Sem alertas"
                descricao="Nenhum alerta gerencial no momento."
                icon="notifications_none"
              />
              <q-list v-else separator>
                <q-item
                  v-for="(alerta, idx) in alertasResumo"
                  :key="`${alerta.tipo}-${idx}`"
                >
                  <q-item-section avatar>
                    <agro-badge
                      :label="alerta.severidade"
                      :variant="variantSeveridade(alerta.severidade)"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ alerta.titulo }}</q-item-label>
                    <q-item-label caption>{{ alerta.descricao }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </agro-card>
          </div>

          <div class="col-12 col-md-6">
            <agro-card>
              <div class="secao-header">
                <div class="text-subtitle1">Ranking de unidades</div>
                <relatorio-export-buttons :loading="exportandoRanking" @exportar="exportarRanking" />
              </div>
              <empty-state
                v-if="ranking.length === 0"
                titulo="Sem ranking"
                descricao="Não há dados de unidades no período."
                icon="emoji_events"
              />
              <q-table
                v-else
                flat
                bordered
                dense
                row-key="unidadeId"
                :rows="rankingComPosicao"
                :columns="colunasRanking"
                hide-pagination
                :rows-per-page-options="[0]"
              >
                <template #body-cell-posicao="props">
                  <q-td :props="props" class="text-metric">{{ props.row.posicao }}</q-td>
                </template>
                <template #body-cell-faturamento="props">
                  <q-td :props="props" class="text-metric">
                    {{ formatarMoeda(props.row.faturamento) }}
                  </q-td>
                </template>
                <template #body-cell-margemPercentual="props">
                  <q-td :props="props" class="text-metric">
                    {{
                      verCustos && props.row.margemPercentual != null
                        ? `${formatarDecimal(props.row.margemPercentual)}%`
                        : '—'
                    }}
                  </q-td>
                </template>
                <template #body-cell-metaAtingimentoPercentual="props">
                  <q-td :props="props" class="text-metric">
                    {{
                      props.row.metaAtingimentoPercentual != null
                        ? `${formatarDecimal(props.row.metaAtingimentoPercentual)}%`
                        : '—'
                    }}
                  </q-td>
                </template>
                <template #body-cell-inadimplenciaValor="props">
                  <q-td :props="props" class="text-metric">
                    {{ formatarMoeda(props.row.inadimplenciaValor) }}
                  </q-td>
                </template>
              </q-table>
            </agro-card>
          </div>
        </div>
      </template>

      <empty-state
        v-else
        titulo="Painel indisponível"
        descricao="Não foi possível carregar os indicadores. Tente novamente."
        icon="dashboard"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import RelatorioExportButtons from 'components/relatorios/RelatorioExportButtons.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import MetricTile from 'components/ui/MetricTile.vue';
import { useAprovacoes } from 'composables/useAprovacoes';
import { useAuth } from 'composables/useAuth';
import { useDashboard } from 'composables/useDashboard';
import { useRelatorios } from 'composables/useRelatorios';
import { useVerCustos } from 'composables/useVerCustos';
import type { ExportacaoFormatoValor } from 'constants/enums';
import { Permissoes } from 'constants/permissoes';
import type { QTableColumn } from 'quasar';
import { filtrarAlertasGerenciaisPorPolitica } from 'utils/alerta-politica';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { usuario, possuiPermissao } = useAuth();
const { kpis, ranking, alertas, carregando, carregar } = useDashboard();
const { exportando: exportandoRanking, exportarRankingUnidades } = useRelatorios();
const { fila: filaAprovacoes, carregar: carregarAprovacoes } = useAprovacoes();
const { verCustos } = useVerCustos();
const dias = ref('30');

const podeVerAprovacoes = computed(() =>
  possuiPermissao(Permissoes.Aprovacoes.Visualizar),
);

const alertasResumo = computed(() =>
  filtrarAlertasGerenciaisPorPolitica(
    alertas.value,
    usuario.value?.perfil ?? null,
  ).slice(0, 5),
);

const rankingComPosicao = computed(() =>
  ranking.value.map((item, index) => ({ ...item, posicao: index + 1 })),
);

const tiles = computed(() => {
  const d = kpis.value;
  if (!d) return [];

  const base = [
    {
      label: 'Faturamento',
      value: formatarMoeda(d.faturamento),
      icon: 'payments',
      accent: false,
    },
    {
      label: 'Inadimplência',
      value: `${formatarDecimal(d.inadimplenciaPercentual)}%`,
      icon: 'money_off',
      accent: true,
    },
    {
      label: 'A receber',
      value: formatarMoeda(d.totalAReceber),
      icon: 'account_balance_wallet',
      accent: false,
    },
    {
      label: 'Alertas estoque',
      value: String(d.estoqueItensAbaixoMinimo),
      icon: 'inventory_2',
      accent: false,
    },
    {
      label: 'Meta',
      value:
        d.metaAtingimentoPercentual != null
          ? `${formatarDecimal(d.metaAtingimentoPercentual)}%`
          : '—',
      icon: 'flag',
      accent: false,
    },
  ];

  if (verCustos.value && d.margemPercentual != null) {
    base.splice(1, 0, {
      label: 'Margem',
      value: `${formatarDecimal(d.margemPercentual)}%`,
      icon: 'trending_up',
      accent: false,
    });
  }

  return base;
});

const colunasRanking: QTableColumn[] = [
  { name: 'posicao', label: '#', field: 'posicao', align: 'left' },
  { name: 'unidadeNome', label: 'Unidade', field: 'unidadeNome', align: 'left' },
  { name: 'faturamento', label: 'Faturamento', field: 'faturamento', align: 'right' },
  { name: 'margemPercentual', label: 'Margem %', field: 'margemPercentual', align: 'right' },
  {
    name: 'metaAtingimentoPercentual',
    label: 'Meta %',
    field: 'metaAtingimentoPercentual',
    align: 'right',
  },
  {
    name: 'inadimplenciaValor',
    label: 'Inadimplência',
    field: 'inadimplenciaValor',
    align: 'right',
  },
];

function variantSeveridade(severidade: string): 'error' | 'warning' | 'default' | 'success' {
  const s = severidade.toLowerCase();
  if (s.includes('crit')) return 'error';
  if (s.includes('alerta')) return 'warning';
  return 'default';
}

async function atualizar(): Promise<void> {
  await carregar({ dias: Number(dias.value) || 30 });
  if (podeVerAprovacoes.value) {
    void carregarAprovacoes();
  }
}

async function exportarRanking(formato: ExportacaoFormatoValor): Promise<void> {
  await exportarRankingUnidades(formato, { dias: Number(dias.value) || undefined });
}

onMounted(() => {
  void atualizar();
});
</script>

<style scoped>
.dashboard-header-acoes {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}
.filtro-dias {
  min-width: 100px;
  max-width: 120px;
}
.secao-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}
</style>
