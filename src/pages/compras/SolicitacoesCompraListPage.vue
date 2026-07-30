<template>
  <q-page class="agro-page">
    <app-page-header titulo="Solicitações de compra" subtitulo="Solicite itens para cotação e pedidos.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova solicitação"
        descricao="Criar solicitação de compra"
        :to="{ name: 'solicitacao-compra-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && solicitacoes.length === 0" :colunas="4" />
        <empty-state
          v-else-if="!carregando && solicitacoes.length === 0"
          titulo="Nenhuma solicitação"
          descricao="Crie a primeira solicitação de compra."
          icon="assignment"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova solicitação"
            descricao="Criar solicitação"
            :to="{ name: 'solicitacao-compra-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="solicitacoes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-createdAt="props">
            <q-td :props="props">{{ formatarDataHora(props.row.createdAt) }}</q-td>
          </template>
          <template #body-cell-itens="props">
            <q-td :props="props" class="text-metric">{{ props.row.itens.length }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props"><agro-badge :label="props.row.status" variant="default" /></q-td>
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
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroEntityDetailsDialog from 'components/ui/AgroEntityDetailsDialog.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCompras } from 'composables/useCompras';
import type { QTableColumn } from 'quasar';
import type { SolicitacaoCompraDto } from 'types/dtos/compras.dto';
import { formatarDataHora } from 'utils/formatters';
import { onMounted, computed, ref } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Solicitações de compra');

const { solicitacoes, carregando, carregarSolicitacoes } = useCompras();

const colunas: QTableColumn<SolicitacaoCompraDto>[] = [
  { name: 'createdAt', label: 'Criada em', field: 'createdAt', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'itens', label: 'Itens', field: 'id', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

onMounted(() => {
  void carregarSolicitacoes();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

</script>
