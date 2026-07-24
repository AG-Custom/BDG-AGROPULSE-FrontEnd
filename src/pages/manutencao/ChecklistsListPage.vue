<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Checklists de inspeção"
      subtitulo="Inspeção diária de ativos."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo checklist"
        descricao="Registrar inspeção"
        :to="{ name: 'manutencao-checklist-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && checklists.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && checklists.length === 0"
          titulo="Nenhum checklist"
          descricao="Registre a primeira inspeção diária."
          icon="checklist"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo checklist"
            descricao="Criar"
            :to="{ name: 'manutencao-checklist-novo' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="checklists"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-data="props">
            <q-td :props="props">{{ formatarData(props.row.data) }}</q-td>
          </template>
          <template #body-cell-horimetro="props">
            <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.horimetro) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <manutencao-status-badge :valor="props.row.status" tipo="checklist" />
            </q-td>
          </template>
          <template #body-cell-itens="props">
            <q-td :props="props" class="text-metric">{{ props.row.itens.length }}</q-td>
          </template>
          <template #body-cell-sincronizado="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.sincronizado ? 'Sincronizado' : 'Pendente'"
                :variant="props.row.sincronizado ? 'success' : 'warning'"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
               @visualizar="abrirDialogVisualizar(props.row)">
                <q-item
                  v-if="!props.row.sincronizado"
                  v-close-popup
                  clickable
                  dense
                  class="agro-acoes-menu__item"
                  :disable="salvando"
                  @click="sincronizarChecklist(props.row.id)"
                >
                  <q-item-section avatar>
                    <span class="agro-acoes-menu__icon agro-acoes-menu__icon--success">
                      <q-icon name="sync" size="16px" />
                    </span>
                  </q-item-section>
                  <q-item-section>Sincronizar</q-item-section>
                  <q-item-section v-if="salvando" side><q-spinner size="16px" color="primary" /></q-item-section>
                </q-item>
              </agro-acoes-menu>
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
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useManutencao } from 'composables/useManutencao';
import type { QTableColumn } from 'quasar';
import type { ChecklistManutencaoDto } from 'types/dtos/manutencao.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import { onMounted, computed, ref } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Checklists de inspeção');

const {
  checklists,
  ativos,
  carregando,
  salvando,
  carregarChecklists,
  carregarAtivos,
  sincronizarChecklist,
} = useManutencao();

function nomeAtivo(ativoId: string): string {
  return ativos.value.find((a) => a.id === ativoId)?.nome ?? ativoId;
}

const colunas: QTableColumn<ChecklistManutencaoDto>[] = [
  { name: 'ativoId', label: 'Ativo', field: (r) => nomeAtivo(r.ativoId), align: 'left' },
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'operadorNome', label: 'Operador', field: 'operadorNome', align: 'left' },
  { name: 'horimetro', label: 'Horímetro', field: 'horimetro', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'itens', label: 'Itens', field: 'itens', align: 'right' },
  { name: 'sincronizado', label: 'Sync', field: 'sincronizado', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

onMounted(() => {
  void carregarAtivos();
  void carregarChecklists();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

</script>
