<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Ordens de serviço"
      subtitulo="Manutenção preventiva e corretiva de ativos."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Abrir OS"
        descricao="Nova ordem de serviço"
        :to="{ name: 'manutencao-ordem-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroStatus"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            clearable
            :options="StatusOrdemServicoManutencaoOpcoes"
            class="filtro"
          />
          <q-select
            v-model="filtroTipo"
            outlined
            dense
            label="Tipo"
            emit-value
            map-options
            clearable
            :options="TipoOrdemServicoManutencaoOpcoes"
            class="filtro"
          />
          <q-select
            v-model="filtroPrioridade"
            outlined
            dense
            label="Prioridade"
            emit-value
            map-options
            clearable
            :options="PrioridadeOrdemServicoManutencaoOpcoes"
            class="filtro"
          />
        </div>

        <agro-table-skeleton v-if="carregando && ordens.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && filtradas.length === 0"
          titulo="Nenhuma OS"
          descricao="Abra uma ordem de serviço ou ajuste os filtros."
          icon="handyman"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Abrir OS"
            descricao="Nova OS"
            :to="{ name: 'manutencao-ordem-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="filtradas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-prioridade="props">
            <q-td :props="props">
              <manutencao-status-badge :valor="props.row.prioridade" tipo="prioridade" />
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <manutencao-status-badge :valor="props.row.status" tipo="os" />
            </q-td>
          </template>
          <template #body-cell-dataAbertura="props">
            <q-td :props="props">{{ formatarData(props.row.dataAbertura) }}</q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
               @visualizar="abrirDialogVisualizar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <agro-entity-details-dialog
      v-model="dialogVisualizar"
      :titulo="tituloDetalhe"
      :registro="registroSelecionado"
    />
  </q-page>
</template>

<script setup lang="ts">
import ManutencaoStatusBadge from 'components/manutencao/ManutencaoStatusBadge.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroEntityDetailsDialog from 'components/ui/AgroEntityDetailsDialog.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useManutencao } from 'composables/useManutencao';
import {
  PrioridadeOrdemServicoManutencaoOpcoes,
  StatusOrdemServicoManutencaoOpcoes,
  TipoOrdemServicoManutencaoOpcoes,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { OrdemServicoManutencaoDto } from 'types/dtos/manutencao.dto';
import { formatarData } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Ordens de serviço');

const { ordens, ativos, carregando, carregarOrdens, carregarAtivos } = useManutencao();
const filtroStatus = ref<string | null>(null);
const filtroTipo = ref<string | null>(null);
const filtroPrioridade = ref<string | null>(null);

const filtradas = computed(() =>
  ordens.value.filter((o) => {
    if (filtroStatus.value && o.status !== filtroStatus.value) return false;
    if (filtroTipo.value && o.tipo !== filtroTipo.value) return false;
    if (filtroPrioridade.value && o.prioridade !== filtroPrioridade.value) return false;
    return true;
  }),
);

function nomeAtivo(ativoId: string): string {
  return ativos.value.find((a) => a.id === ativoId)?.nome ?? ativoId;
}

const colunas: QTableColumn<OrdemServicoManutencaoDto>[] = [
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'ativoId', label: 'Ativo', field: (r) => nomeAtivo(r.ativoId), align: 'left' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'prioridade', label: 'Prioridade', field: 'prioridade', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'dataAbertura', label: 'Abertura', field: 'dataAbertura', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

onMounted(() => {
  void carregarAtivos();
  void carregarOrdens();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

</script>

<style scoped>
.filtro {
  min-width: 160px;
}
</style>
