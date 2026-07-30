<template>
  <q-page class="agro-page">
    <app-page-header titulo="Frota" subtitulo="Veículos, motoristas e documentos da frota.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo veículo"
        descricao="Cadastrar veículo"
        :to="{ name: 'logistica-veiculo-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card v-if="alertasDocs.length > 0" class="q-mb-md">
        <div class="text-caption">Alertas de documentos (≤ 60 dias)</div>
        <div class="text-metric">{{ alertasDocs.length }} veículo(s)</div>
      </agro-card>

      <agro-card>
        <div class="agro-filter-bar">
          <q-input v-model="busca" outlined dense label="Buscar" clearable class="filtro-busca">
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
            :options="StatusVeiculoLogisticaOpcoes"
            class="filtro-status"
          />
        </div>

        <agro-table-skeleton v-if="carregando && veiculos.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && filtrados.length === 0"
          titulo="Nenhum veículo"
          descricao="Cadastre o primeiro veículo ou ajuste os filtros."
          icon="local_shipping"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo veículo"
            descricao="Cadastrar"
            :to="{ name: 'logistica-veiculo-novo' }"
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
          <template #body-cell-kmAtual="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.kmAtual != null ? formatarDecimal(props.row.kmAtual) : '—' }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <logistica-status-badge :valor="props.row.status" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-status="false"
                :editar-to="{ name: 'logistica-veiculo-editar', params: { id: props.row.id } }"
                :visualizar-to="{ name: 'logistica-veiculo-visualizar', params: { id: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import LogisticaStatusBadge from 'components/logistica/LogisticaStatusBadge.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useLogistica } from 'composables/useLogistica';
import { StatusVeiculoLogisticaOpcoes, TipoVeiculoLogisticaOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { VeiculoLogisticaDto } from 'types/dtos/logistica.dto';
import { formatarDecimal } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';


const { veiculos, alertasDocs, carregando, carregarVeiculos, carregarAlertasDocs } = useLogistica();
const busca = ref('');
const filtroStatus = ref<string | null>(null);

function labelTipo(tipo: string): string {
  return TipoVeiculoLogisticaOpcoes.find((o) => o.value === tipo)?.label ?? tipo;
}

const filtrados = computed(() => {
  const termo = busca.value.trim().toLowerCase();
  return veiculos.value.filter((v) => {
    if (filtroStatus.value && v.status !== filtroStatus.value) return false;
    if (!termo) return true;
    return [v.placa, v.marca, v.modelo, v.motoristaNome, labelTipo(v.tipo)]
      .filter(Boolean)
      .some((x) => String(x).toLowerCase().includes(termo));
  });
});

const colunas: QTableColumn<VeiculoLogisticaDto>[] = [
  { name: 'placa', label: 'Placa', field: 'placa', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: (r) => labelTipo(r.tipo), align: 'left' },
  { name: 'modelo', label: 'Modelo', field: 'modelo', align: 'left' },
  { name: 'motoristaNome', label: 'Motorista', field: 'motoristaNome', align: 'left' },
  { name: 'kmAtual', label: 'Km', field: 'kmAtual', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

onMounted(() => {
  void carregarVeiculos();
  void carregarAlertasDocs();
});

</script>

<style scoped>
.filtro-busca {
  min-width: 220px;
  flex: 1;
}
.filtro-status {
  min-width: 180px;
}
</style>
