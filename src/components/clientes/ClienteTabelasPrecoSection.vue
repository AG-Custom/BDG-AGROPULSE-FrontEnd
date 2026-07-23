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
          label="Adicionar tabela"
          descricao="Cadastrar tabela de preço para este cliente"
          @click="abrirDialogCriar"
        />
      </div>
    </template>

    <agro-table-skeleton v-if="carregando && tabelasCliente.length === 0" :colunas="4" />

    <empty-state
      v-else-if="!carregando && tabelasCliente.length === 0"
      titulo="Nenhuma tabela vinculada"
      descricao="Cadastre uma tabela de preço específica para este cliente."
      icon="sell"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      class="cliente-tabelas-preco__tabela"
      :rows="tabelasCliente"
      :columns="colunas"
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
          <agro-btn
            flat
            round
            dense
            icon="visibility"
            color="primary"
            descricao="Visualizar tabela de preço"
            :to="{ name: 'tabela-preco-visualizar', params: { id: props.row.id } }"
          />
          <agro-btn
            v-if="!somenteLeitura && props.row.ativo"
            flat
            round
            dense
            icon="edit"
            color="primary"
            descricao="Editar tabela de preço"
            :to="{ name: 'tabela-preco-editar', params: { id: props.row.id } }"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="cliente-tabelas-preco__dialog">
        <q-card-section>
          <h4 class="cliente-tabelas-preco__dialog-titulo">Nova tabela de preço</h4>
          <p class="cliente-tabelas-preco__dialog-subtitulo">
            Cadastre uma nova tabela de preço comercial para este cliente.
          </p>
        </q-card-section>

        <q-card-section>
          <tabela-preco-formulario
            ref="formularioRef"
            v-model:formulario="formTabela"
            :cliente-id-fixo="clienteId"
          />
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn
            flat
            label="Cancelar"
            descricao="Fechar sem salvar a tabela"
            :disable="salvando"
            @click="fecharDialog"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Cadastrar"
            descricao="Cadastrar tabela de preço para este cliente"
            :loading="salvando"
            @click="salvarTabela"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </agro-card>
</template>

<script setup lang="ts">
import TabelaPrecoFormulario from 'components/tabelas-preco/TabelaPrecoFormulario.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useTabelasPreco } from 'composables/useTabelasPreco';
import type { TabelaPrecoResumoDto } from 'types/dtos/tabela-preco.dto';
import { criarTabelaPrecoFormVazia } from 'utils/mappers/tabela-preco.mapper';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  clienteId: string;
  somenteLeitura?: boolean;
}>();

const { tabelas, carregando, salvando, carregar, criar } = useTabelasPreco();

const dialogAberto = ref(false);
const formTabela = ref(criarTabelaPrecoFormVazia(props.clienteId));
const formularioRef = ref<InstanceType<typeof TabelaPrecoFormulario> | null>(null);

const tabelasCliente = computed(() =>
  tabelas.value.filter((tabela) => tabela.clienteId === props.clienteId),
);

const colunas: QTableColumn<TabelaPrecoResumoDto>[] = [
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

function abrirDialogCriar(): void {
  formTabela.value = criarTabelaPrecoFormVazia(props.clienteId);
  dialogAberto.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
}

async function salvarTabela(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  formTabela.value.clienteId = props.clienteId;

  const sucesso = await criar(formTabela.value);

  if (sucesso) {
    fecharDialog();
  }
}

onMounted(() => {
  void carregar();
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
</style>
