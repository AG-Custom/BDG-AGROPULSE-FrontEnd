<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Custos de manutenção"
      subtitulo="Relatório por OS, período e tipo."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar q-mb-md">
          <q-select
            v-model="filtro.ativoId"
            outlined
            dense
            label="Ativo"
            emit-value
            map-options
            clearable
            :options="ativoOpcoes"
            class="filtro"
          />
          <q-input v-model="filtro.de" outlined dense label="De" type="date" class="filtro-data" />
          <q-input v-model="filtro.ate" outlined dense label="Até" type="date" class="filtro-data" />
          <q-select
            v-model="filtro.tipo"
            outlined
            dense
            label="Tipo"
            emit-value
            map-options
            clearable
            :options="TipoOrdemServicoManutencaoOpcoes"
            class="filtro"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Filtrar"
            descricao="Aplicar filtros"
            :loading="carregando"
            @click="aplicar"
          />
        </div>

        <div v-if="custos" class="resumo q-mb-md row q-col-gutter-md">
          <div class="col-4">
            <div class="text-caption">Mão de obra</div>
            <div class="text-metric">{{ formatarMoeda(custos.totalMaoObra) }}</div>
          </div>
          <div class="col-4">
            <div class="text-caption">Peças</div>
            <div class="text-metric">{{ formatarMoeda(custos.totalPecas) }}</div>
          </div>
          <div class="col-4">
            <div class="text-caption">Total geral</div>
            <div class="text-metric total">{{ formatarMoeda(custos.totalGeral) }}</div>
          </div>
        </div>

        <agro-table-skeleton v-if="carregando && !custos" :colunas="6" />
        <empty-state
          v-else-if="!carregando && (!custos || custos.itens.length === 0)"
          titulo="Sem custos"
          descricao="Não há custos no período selecionado."
          icon="payments"
        />
        <q-table
          v-else-if="custos"
          flat
          bordered
          row-key="ordemId"
          :rows="custos.itens"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-dataAbertura="props">
            <q-td :props="props">{{ formatarData(props.row.dataAbertura) }}</q-td>
          </template>
          <template #body-cell-dataConclusao="props">
            <q-td :props="props">{{ formatarData(props.row.dataConclusao) || '—' }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <manutencao-status-badge :valor="props.row.status" tipo="os" />
            </q-td>
          </template>
          <template #body-cell-custoMaoObra="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.custoMaoObra) }}</q-td>
          </template>
          <template #body-cell-custoPecas="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.custoPecas) }}</q-td>
          </template>
          <template #body-cell-custoTotal="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.custoTotal) }}</q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import ManutencaoStatusBadge from 'components/manutencao/ManutencaoStatusBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useManutencao } from 'composables/useManutencao';
import { TipoOrdemServicoManutencaoOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  CustoManutencaoItemDto,
  ListarCustosManutencaoParams,
} from 'types/dtos/manutencao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { custos, carregando, carregarCustos, ativos, carregarAtivos } = useManutencao();

const filtro = ref<ListarCustosManutencaoParams>({
  ativoId: undefined,
  de: '',
  ate: '',
  tipo: '',
});

const ativoOpcoes = computed(() =>
  ativos.value.map((a) => ({ label: a.nome, value: a.id })),
);

function nomeAtivo(ativoId: string): string {
  return ativos.value.find((a) => a.id === ativoId)?.nome ?? ativoId;
}

const colunas: QTableColumn<CustoManutencaoItemDto>[] = [
  { name: 'numero', label: 'OS', field: 'numero', align: 'left' },
  { name: 'ativoId', label: 'Ativo', field: (r) => nomeAtivo(r.ativoId), align: 'left' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'dataAbertura', label: 'Abertura', field: 'dataAbertura', align: 'left' },
  { name: 'dataConclusao', label: 'Conclusão', field: 'dataConclusao', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'custoMaoObra', label: 'Mão de obra', field: 'custoMaoObra', align: 'right' },
  { name: 'custoPecas', label: 'Peças', field: 'custoPecas', align: 'right' },
  { name: 'custoTotal', label: 'Total', field: 'custoTotal', align: 'right' },
];

function aplicar(): void {
  void carregarCustos({
    ativoId: filtro.value.ativoId || undefined,
    de: filtro.value.de || undefined,
    ate: filtro.value.ate || undefined,
    tipo: filtro.value.tipo || undefined,
  });
}

onMounted(async () => {
  await carregarAtivos();
  aplicar();
});
</script>

<style scoped>
.filtro {
  min-width: 180px;
}
.filtro-data {
  min-width: 140px;
}
.total {
  font-size: var(--font-size-xl);
  margin-top: var(--spacing-1);
}
</style>
