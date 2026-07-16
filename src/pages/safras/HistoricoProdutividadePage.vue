<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Histórico de produtividade"
      subtitulo="Evolução de produtividade por fazenda ou talhão."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtros.fazendaId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Fazenda"
            class="filtro"
            :options="fazendaOpcoes"
          />
          <q-select
            v-model="filtros.talhaoId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Talhão"
            class="filtro"
            :options="talhaoOpcoes"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Filtrar"
            descricao="Aplicar filtros"
            :loading="carregando"
            @click="aplicarFiltros"
          />
        </div>

        <agro-table-skeleton
          v-if="carregando && historicoProdutividade.length === 0"
          :colunas="5"
        />
        <empty-state
          v-else-if="!carregando && historicoProdutividade.length === 0"
          titulo="Sem histórico"
          descricao="Nenhum registro de produtividade encontrado."
          icon="insights"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="historicoProdutividade"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-produtividade="props">
            <q-td :props="props" class="text-metric">
              {{
                props.row.produtividade != null
                  ? formatarDecimal(props.row.produtividade)
                  : '—'
              }}
            </q-td>
          </template>
          <template #body-cell-areaHa="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.areaHa != null ? formatarDecimal(props.row.areaHa) : '—' }}
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useFazendas } from 'composables/useFazendas';
import { useHistoricoSafras } from 'composables/useHistoricoSafras';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import type { QTableColumn } from 'quasar';
import type { HistoricoProdutividadeDto } from 'types/dtos/safras.dto';
import { formatarDecimal } from 'utils/formatters';
import { computed, onMounted, reactive } from 'vue';

const { historicoProdutividade, carregando, carregarHistoricoProdutividade } =
  useHistoricoSafras();
const { fazendaOpcoes, carregar: carregarFazendas } = useFazendas();
const { talhoes, carregarTalhoes } = useRastreabilidade();

const filtros = reactive({
  fazendaId: '' as string | null,
  talhaoId: '' as string | null,
});

const talhaoOpcoes = computed(() =>
  talhoes.value.map((t) => ({ label: t.nome, value: t.id })),
);

const colunas: QTableColumn<HistoricoProdutividadeDto>[] = [
  { name: 'ano', label: 'Ano', field: 'ano', align: 'left', sortable: true },
  { name: 'safraNome', label: 'Safra', field: 'safraNome', align: 'left' },
  { name: 'cultura', label: 'Cultura', field: 'cultura', align: 'left' },
  { name: 'produtividade', label: 'Produtividade', field: 'produtividade', align: 'right' },
  { name: 'areaHa', label: 'Área (ha)', field: 'areaHa', align: 'right' },
];

function aplicarFiltros(): void {
  void carregarHistoricoProdutividade({
    fazendaId: filtros.fazendaId || undefined,
    talhaoId: filtros.talhaoId || undefined,
  });
}

onMounted(() => {
  void carregarFazendas();
  void carregarTalhoes();
  void carregarHistoricoProdutividade();
});
</script>

<style scoped>
.filtro {
  min-width: 180px;
  max-width: 260px;
}
</style>
