<template>
  <q-page class="agro-page">
    <app-page-header titulo="Ativos" subtitulo="Cadastro de máquinas, veículos e equipamentos.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo ativo"
        descricao="Cadastrar ativo"
        :to="{ name: 'manutencao-ativo-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <div v-if="ativos.length > 0" class="row q-col-gutter-md q-mb-md">
        <div v-for="kpi in kpis" :key="kpi.label" class="col-6 col-md-3">
          <agro-card>
            <div class="text-caption">{{ kpi.label }}</div>
            <div class="text-metric kpi">{{ kpi.valor }}</div>
          </agro-card>
        </div>
      </div>

      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="busca"
            outlined
            dense
            label="Buscar"
            clearable
            class="filtro-busca"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-select
            v-model="filtroStatus"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            clearable
            :options="StatusAtivoManutencaoOpcoes"
            class="filtro-status"
          />
        </div>

        <agro-table-skeleton v-if="carregando && ativos.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && filtrados.length === 0"
          titulo="Nenhum ativo"
          descricao="Cadastre o primeiro ativo ou ajuste os filtros."
          icon="agriculture"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo ativo"
            descricao="Cadastrar"
            :to="{ name: 'manutencao-ativo-novo' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="filtrados"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-horimetroAtual="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.horimetroAtual != null ? formatarDecimal(props.row.horimetroAtual) : '—' }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <manutencao-status-badge :valor="props.row.status" tipo="ativo" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
                :visualizar-to="{ name: 'manutencao-ativo-detalhe', params: { id: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import ManutencaoStatusBadge from 'components/manutencao/ManutencaoStatusBadge.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useManutencao } from 'composables/useManutencao';
import { StatusAtivoManutencao, StatusAtivoManutencaoOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { AtivoManutencaoDto } from 'types/dtos/manutencao.dto';
import { formatarDecimal } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { ativos, carregando, carregarAtivos } = useManutencao();
const busca = ref('');
const filtroStatus = ref<string | null>(null);

const kpis = computed(() => {
  const lista = ativos.value;
  return [
    { label: 'Total', valor: String(lista.length) },
    {
      label: 'Operacionais',
      valor: String(lista.filter((a) => a.status === StatusAtivoManutencao.Operacional).length),
    },
    {
      label: 'Em manutenção',
      valor: String(lista.filter((a) => a.status === StatusAtivoManutencao.Manutencao).length),
    },
    {
      label: 'Parados',
      valor: String(lista.filter((a) => a.status === StatusAtivoManutencao.Parado).length),
    },
  ];
});

const filtrados = computed(() => {
  const termo = busca.value.trim().toLowerCase();
  return ativos.value.filter((a) => {
    if (filtroStatus.value && a.status !== filtroStatus.value) return false;
    if (!termo) return true;
    return [a.nome, a.tipo, a.fabricante, a.modelo, a.numeroSerie]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(termo));
  });
});

const colunas: QTableColumn<AtivoManutencaoDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'modelo', label: 'Modelo', field: 'modelo', align: 'left' },
  { name: 'horimetroAtual', label: 'Horímetro', field: 'horimetroAtual', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

onMounted(() => {
  void carregarAtivos();
});
</script>

<style scoped>
.kpi {
  font-size: var(--font-size-xl);
  margin-top: var(--spacing-1);
}
.filtro-busca {
  min-width: 220px;
  flex: 1;
}
.filtro-status {
  min-width: 180px;
}
</style>
