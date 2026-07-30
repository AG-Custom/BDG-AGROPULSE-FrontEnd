<template>
  <q-page class="agro-page">
    <app-page-header titulo="Recebimentos de compra" subtitulo="Conferência de NF-e e entrada de estoque.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo recebimento"
        descricao="Criar recebimento"
        :to="{ name: 'recebimento-compra-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar q-mb-md">
          <q-select
            v-model="filtroStatus"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Status"
            :options="RecebimentoCompraStatusOpcoes"
            class="filtro-status"
            @update:model-value="aplicarFiltro"
          />
        </div>

        <agro-table-skeleton v-if="carregando && recebimentos.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && recebimentos.length === 0"
          titulo="Nenhum recebimento"
          descricao="Importe um XML ou crie um recebimento manual."
          icon="inventory_2"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo recebimento"
            descricao="Criar recebimento"
            :to="{ name: 'recebimento-compra-novo' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="recebimentos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-createdAt="props">
            <q-td :props="props">{{ formatarDataHora(props.row.createdAt) }}</q-td>
          </template>
          <template #body-cell-fornecedorId="props">
            <q-td :props="props">{{ rotuloFornecedor(props.row.fornecedorId) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge :label="rotuloStatus(props.row.status)" variant="default" />
            </q-td>
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
import { useFornecedores } from 'composables/useFornecedores';
import { useRecebimentosCompra } from 'composables/useRecebimentosCompra';
import {
  RecebimentoCompraStatusOpcoes,
  type RecebimentoCompraStatusValorEnum,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { RecebimentoCompraDto } from 'types/dtos/compras.dto';
import { formatarDataHora } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Recebimentos de compra');

const { recebimentos, carregando, carregar } = useRecebimentosCompra();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();

const filtroStatus = ref<RecebimentoCompraStatusValorEnum | null>(null);

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const f of fornecedores.value) m.set(f.id, f.razaoSocial);
  return m;
});

const colunas: QTableColumn<RecebimentoCompraDto>[] = [
  { name: 'createdAt', label: 'Criado em', field: 'createdAt', align: 'left', sortable: true },
  { name: 'numeroNota', label: 'NF-e', field: 'numeroNota', align: 'left' },
  { name: 'fornecedorId', label: 'Fornecedor', field: 'fornecedorId', align: 'left' },
  { name: 'origem', label: 'Origem', field: 'origem', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloFornecedor(id: string): string {
  return mapa.value.get(id) ?? id;
}

function rotuloStatus(status: string): string {
  return RecebimentoCompraStatusOpcoes.find((o) => o.value === status)?.label ?? status;
}

async function aplicarFiltro(): Promise<void> {
  await carregar({
    status: filtroStatus.value ?? undefined,
  });
}

onMounted(() => {
  void carregarFornecedores();
  void carregar();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

</script>

<style scoped>
.filtro-status {
  max-width: 240px;
}
</style>
