<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Condições de pagamento"
      subtitulo="Parcelas e intervalos usados em pedidos e orçamentos."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova condição"
        descricao="Cadastrar condição"
        :to="{ name: 'condicao-pagamento-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && condicoes.length === 0" :colunas="4" />
        <empty-state
          v-else-if="!carregando && condicoes.length === 0"
          titulo="Nenhuma condição"
          descricao="Cadastre condições de pagamento para gerar parcelas."
          icon="event_repeat"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova condição"
            descricao="Cadastrar condição"
            :to="{ name: 'condicao-pagamento-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="condicoes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-ativo="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.ativo ? 'Ativo' : 'Inativo'"
                :variant="props.row.ativo ? 'success' : 'default'"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :ativo="props.row.ativo"
                :editar-to="{ name: 'condicao-pagamento-editar', params: { id: props.row.id } }"
                :loading-status="salvando"
                @desabilitar="solicitarInativacao(props.row)"
                @ativar="solicitarAtivacao(props.row)"
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
import { useCondicoesPagamento } from 'composables/useCondicoesPagamento';
import type { QTableColumn } from 'quasar';
import type { CondicaoPagamentoDto } from 'types/dtos/financeiro.dto';
import { onMounted, computed, ref } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Condições de pagamento');

const { condicoes, carregando, salvando, carregar, solicitarInativacao, solicitarAtivacao } =
  useCondicoesPagamento();

const colunas: QTableColumn<CondicaoPagamentoDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'numeroParcelas', label: 'Parcelas', field: 'numeroParcelas', align: 'right' },
  { name: 'intervaloDias', label: 'Intervalo (dias)', field: 'intervaloDias', align: 'right' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

onMounted(() => {
  void carregar();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

</script>

<style scoped>
.acoes {
  white-space: nowrap;
}
</style>
