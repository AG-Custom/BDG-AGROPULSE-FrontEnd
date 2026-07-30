<template>
  <q-page class="agro-page">
    <app-page-header titulo="Ordens de produção" subtitulo="Planeje e acompanhe a produção.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova ordem"
        descricao="Criar ordem de produção"
        :to="{ name: 'ordem-producao-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && ordens.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && ordens.length === 0"
          titulo="Nenhuma ordem"
          descricao="Crie a primeira ordem de produção."
          icon="precision_manufacturing"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova ordem"
            descricao="Criar ordem"
            :to="{ name: 'ordem-producao-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="ordens"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-produtoSaidaId="props">
            <q-td :props="props">{{ rotuloProduto(props.row.produtoSaidaId) }}</q-td>
          </template>
          <template #body-cell-quantidadePlanejada="props">
            <q-td :props="props" class="text-metric">
              {{ formatarDecimal(props.row.quantidadePlanejada) }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props"><agro-badge :label="props.row.status" variant="default" /></q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :ativo="true"
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
import { useProducao } from 'composables/useProducao';
import { useProdutos } from 'composables/useProdutos';
import type { QTableColumn } from 'quasar';
import type { OrdemProducaoDto } from 'types/dtos/producao.dto';
import { formatarDecimal } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Ordens de produção');

const { ordens, carregando, carregarOrdens } = useProducao();
const { produtos, carregar: carregarProdutos } = useProdutos();

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const colunas: QTableColumn<OrdemProducaoDto>[] = [
  { name: 'produtoSaidaId', label: 'Produto saída', field: 'produtoSaidaId', align: 'left' },
  { name: 'quantidadePlanejada', label: 'Planejada', field: 'quantidadePlanejada', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloProduto(id: string): string {
  return mapa.value.get(id) ?? id;
}

onMounted(() => {
  void carregarProdutos();
  void carregarOrdens();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

</script>
