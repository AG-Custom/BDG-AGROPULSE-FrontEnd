<template>
  <q-page class="agro-page">
    <app-page-header titulo="Talhões" subtitulo="Cadastro de áreas para rastreabilidade.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo talhão"
        descricao="Cadastrar talhão"
        :to="{ name: 'talhao-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && talhoes.length === 0" :colunas="4" />
        <empty-state
          v-else-if="!carregando && talhoes.length === 0"
          titulo="Nenhum talhão"
          descricao="Cadastre o primeiro talhão."
          icon="grass"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo talhão"
            descricao="Cadastrar"
            :to="{ name: 'talhao-novo' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="talhoes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-areaHectares="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.areaHectares != null ? formatarDecimal(props.row.areaHectares) : '—' }}
            </q-td>
          </template>
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
                :mostrar-status="props.row.ativo"
                :editar-to="{ name: 'talhao-editar', params: { id: props.row.id } }"
                :loading-status="salvando"
                @desabilitar="onInativar(props.row.id)"
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
import { useRastreabilidade } from 'composables/useRastreabilidade';
import type { QTableColumn } from 'quasar';
import type { TalhaoDto } from 'types/dtos/rastreabilidade.dto';
import { formatarDecimal } from 'utils/formatters';
import { onMounted, computed, ref } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Talhões');

const { talhoes, carregando, salvando, carregarTalhoes, inativarTalhao } = useRastreabilidade();

const colunas: QTableColumn<TalhaoDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'culturaAtual', label: 'Cultura', field: 'culturaAtual', align: 'left' },
  { name: 'areaHectares', label: 'Área (ha)', field: 'areaHectares', align: 'right' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

async function onInativar(id: string): Promise<void> {
  const ok = await inativarTalhao(id);
  if (ok) await carregarTalhoes();
}

onMounted(() => {
  void carregarTalhoes();
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
