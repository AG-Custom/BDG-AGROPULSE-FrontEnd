<template>
  <agro-card class="cliente-tabelas-preco">
    <template #header>
      <div class="cliente-tabelas-preco__header">
        <h3 class="cliente-tabelas-preco__titulo">Tabelas de preço</h3>
        <agro-btn
          v-if="!somenteLeitura"
          color="primary"
          unelevated
          icon="add"
          label="Vincular tabela"
          descricao="Vincular tabela de preço existente a este cliente"
          @click="abrirDialogVincular"
        />
      </div>
    </template>

    <agro-table-skeleton v-if="carregando && tabelasVinculadas.length === 0" :colunas="4" />

    <empty-state
      v-else-if="!carregando && tabelasVinculadas.length === 0"
      titulo="Nenhuma tabela vinculada"
      descricao="Vincule uma tabela de preço existente a este cliente."
      icon="sell"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      class="cliente-tabelas-preco__tabela"
      :rows="tabelasVinculadas"
      :columns="colunasVinculadas"
      :loading="carregando"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-vigencia="props">
        <q-td :props="props">
          {{ formatarVigencia(props.row) }}
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
        <q-td :props="props" class="cliente-tabelas-preco__acoes">
          <agro-acoes-menu
            :mostrar-editar="!somenteLeitura && props.row.ativo"
            :mostrar-status="false"
            :visualizar-to="{ name: 'tabela-preco-visualizar', params: { id: props.row.id } }"
            :editar-to="{ name: 'tabela-preco-editar', params: { id: props.row.id } }"
            visualizar-label="Visualizar tabela de preço"
            editar-label="Editar tabela de preço"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="cliente-tabelas-preco__dialog">
        <q-card-section>
          <h4 class="cliente-tabelas-preco__dialog-titulo">Vincular tabela de preço</h4>
          <p class="cliente-tabelas-preco__dialog-subtitulo">
            Selecione uma tabela de preço existente para vincular a este cliente.
          </p>
        </q-card-section>

        <q-card-section class="cliente-tabelas-preco__dialog-corpo">
          <div class="agro-filter-bar">
            <q-input
              v-model="buscaTabela"
              outlined
              dense
              clearable
              label="Buscar tabela"
              :disable="salvando"
              @update:model-value="agendarBuscaDisponiveis"
            />
          </div>

          <agro-table-skeleton
            v-if="carregandoDisponiveis && tabelasParaSelecao.length === 0"
            :colunas="4"
          />

          <empty-state
            v-else-if="!carregandoDisponiveis && tabelasParaSelecao.length === 0"
            titulo="Nenhuma tabela disponível"
            descricao="Não há tabelas ativas para vincular ou ajuste a busca."
            icon="sell"
          />

          <q-table
            v-else
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="tabelasParaSelecao"
            :columns="colunasSelecao"
            :loading="carregandoDisponiveis"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-selecao="props">
              <q-td :props="props">
                <q-radio
                  v-model="tabelaSelecionadaId"
                  :val="props.row.id"
                  color="primary"
                  :disable="salvando"
                  :aria-label="`Selecionar ${props.row.nome}`"
                />
              </q-td>
            </template>

            <template #body-cell-vigencia="props">
              <q-td :props="props">
                {{ formatarVigencia(props.row) }}
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
              <q-td :props="props">
                <agro-acoes-menu
                  :mostrar-editar="false"
                  :mostrar-status="false"
                  :visualizar-to="{ name: 'tabela-preco-visualizar', params: { id: props.row.id } }"
                  visualizar-label="Visualizar tabela de preço"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn
            flat
            label="Cancelar"
            descricao="Fechar sem vincular a tabela"
            :disable="salvando"
            @click="fecharDialog"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Vincular"
            descricao="Vincular tabela de preço selecionada ao cliente"
            :loading="salvando"
            :disable="!tabelaSelecionadaId"
            @click="salvarVinculo"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </agro-card>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useNotificacao } from 'composables/useNotificacao';
import { useTabelasPreco } from 'composables/useTabelasPreco';
import type { TabelaPrecoResumoDto } from 'types/dtos/tabela-preco.dto';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  clienteId: string;
  somenteLeitura?: boolean;
}>();

const {
  tabelas: tabelasVinculadas,
  carregando,
  carregar: carregarVinculadas,
} = useTabelasPreco();

const {
  tabelas: tabelasDisponiveis,
  carregando: carregandoDisponiveis,
  salvando,
  carregar: carregarDisponiveis,
  vincularCliente,
} = useTabelasPreco();

const { erro } = useNotificacao();

const dialogAberto = ref(false);
const tabelaSelecionadaId = ref<string | null>(null);
const buscaTabela = ref('');
let buscaTimer: ReturnType<typeof setTimeout> | null = null;

const idsVinculados = computed(() => new Set(tabelasVinculadas.value.map((tabela) => tabela.id)));

const tabelasParaSelecao = computed(() =>
  tabelasDisponiveis.value.filter((tabela) => !idsVinculados.value.has(tabela.id)),
);

const colunasVinculadas: QTableColumn<TabelaPrecoResumoDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'vigencia', label: 'Vigência', field: 'vigenciaInicio', align: 'left' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const colunasSelecao: QTableColumn<TabelaPrecoResumoDto>[] = [
  { name: 'selecao', label: '', field: 'id', align: 'left' },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'vigencia', label: 'Vigência', field: 'vigenciaInicio', align: 'left' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function formatarVigencia(tabela: TabelaPrecoResumoDto): string {
  if (tabela.vigenciaFim) {
    return `${tabela.vigenciaInicio} — ${tabela.vigenciaFim}`;
  }

  return `${tabela.vigenciaInicio} — em aberto`;
}

async function carregarListaVinculadas(): Promise<void> {
  await carregarVinculadas({ clienteId: props.clienteId });
}

async function carregarListaDisponiveis(): Promise<void> {
  await carregarDisponiveis({
    ativo: true,
    busca: buscaTabela.value.trim() || undefined,
  });
}

function agendarBuscaDisponiveis(): void {
  if (buscaTimer) {
    clearTimeout(buscaTimer);
  }

  buscaTimer = setTimeout(() => {
    void carregarListaDisponiveis();
  }, 400);
}

async function abrirDialogVincular(): Promise<void> {
  tabelaSelecionadaId.value = null;
  buscaTabela.value = '';
  dialogAberto.value = true;
  await carregarListaDisponiveis();
}

function fecharDialog(): void {
  dialogAberto.value = false;
  tabelaSelecionadaId.value = null;
}

async function salvarVinculo(): Promise<void> {
  if (!tabelaSelecionadaId.value) {
    erro('Selecione uma tabela de preço para vincular ao cliente.');
    return;
  }

  const sucesso = await vincularCliente(tabelaSelecionadaId.value, props.clienteId);

  if (sucesso) {
    fecharDialog();
    await carregarListaVinculadas();
  }
}

onMounted(() => {
  void carregarListaVinculadas();
});
</script>

<style scoped>
.cliente-tabelas-preco__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.cliente-tabelas-preco__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.cliente-tabelas-preco__acoes {
  white-space: nowrap;
}

.cliente-tabelas-preco__dialog {
  min-width: min(720px, 94vw);
  width: 100%;
}

.cliente-tabelas-preco__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.cliente-tabelas-preco__dialog-subtitulo {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--spacing-2) 0 0;
}

.cliente-tabelas-preco__dialog-corpo {
  display: grid;
  gap: var(--spacing-4);
}
</style>
