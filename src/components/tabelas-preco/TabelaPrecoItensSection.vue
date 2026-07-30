<template>
  <agro-card class="tabela-preco-itens">
    <template #header>
      <div class="tabela-preco-itens__header">
        <h3 class="tabela-preco-itens__titulo">Itens da tabela</h3>
        <agro-btn
          v-if="!somenteLeitura"
          color="primary"
          unelevated
          icon="add"
          label="Adicionar item"
          descricao="Adicionar produto à tabela de preço"
          @click="abrirDialogCriar"
        />
      </div>
    </template>

    <empty-state
      v-if="itens.length === 0"
      titulo="Nenhum item cadastrado"
      descricao="Adicione produtos com preços a esta tabela."
      icon="sell"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      class="tabela-preco-itens__tabela"
      :rows="itens"
      :columns="colunas"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-produtoId="props">
        <q-td :props="props">
          {{ rotuloProduto(props.row.produtoId) }}
        </q-td>
      </template>

      <template #body-cell-preco="props">
        <q-td :props="props" class="text-metric">
          {{ formatarPreco(props.row.preco) }}
        </q-td>
      </template>

      <template #body-cell-margemMinimaPercentual="props">
        <q-td :props="props">
          {{ props.row.margemMinimaPercentual !== null ? `${props.row.margemMinimaPercentual}%` : '—' }}
        </q-td>
      </template>

      <template v-if="!somenteLeitura" #body-cell-acoes="props">
        <q-td :props="props" class="tabela-preco-itens__acoes">
          <agro-acoes-menu
            :mostrar-visualizar="false"
            :mostrar-status="false"
            mostrar-excluir
            :loading-excluir="removendo"
            editar-label="Editar item"
            excluir-label="Remover item"
            @editar="abrirDialogEditar(props.row)"
            @excluir="solicitarRemocao(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="tabela-preco-itens__dialog">
        <q-card-section>
          <h4 class="tabela-preco-itens__dialog-titulo">
            {{ modoDialog === 'criar' ? 'Novo item' : 'Editar item' }}
          </h4>
        </q-card-section>

        <q-card-section>
          <item-tabela-preco-formulario
            v-if="modoDialog === 'criar'"
            ref="formularioRef"
            modo="criar"
            v-model:formulario-criar="formCriar"
          />
          <item-tabela-preco-formulario
            v-else
            ref="formularioRef"
            modo="editar"
            v-model:formulario-editar="formEditar"
          />
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn flat label="Cancelar" descricao="Fechar sem salvar" :disable="salvando" @click="fecharDialog" />
          <agro-btn
            color="primary"
            unelevated
            :label="modoDialog === 'criar' ? 'Adicionar' : 'Salvar'"
            :loading="salvando"
            @click="salvarItem"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </agro-card>
</template>

<script setup lang="ts">
import ItemTabelaPrecoFormulario from 'components/tabelas-preco/ItemTabelaPrecoFormulario.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useProdutos } from 'composables/useProdutos';
import { useTabelaPrecoItens } from 'composables/useTabelaPrecoItens';
import type {
  TabelaPrecoItemDto,
  TabelaPrecoItemEdicaoFormModel,
  TabelaPrecoItemFormModel,
} from 'types/dtos/tabela-preco.dto';
import {
  criarItemFormVazio,
  itemDtoParaEdicaoForm,
  itemDtoParaForm,
} from 'utils/mappers/tabela-preco.mapper';
import { formatarNumero } from 'utils/formatters';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref, toRef, watch } from 'vue';

const props = defineProps<{
  tabelaPrecoId: string;
  itensIniciais: TabelaPrecoItemDto[];
  somenteLeitura?: boolean;
}>();

const {
  itens,
  salvando,
  removendo,
  definirItens,
  adicionar,
  editar,
  solicitarRemocao,
} = useTabelaPrecoItens(() => props.tabelaPrecoId);

const { produtos, carregar: carregarProdutos } = useProdutos();

const dialogAberto = ref(false);
const modoDialog = ref<'criar' | 'editar'>('criar');
const itemEmEdicaoId = ref<string | null>(null);
const formCriar = ref(criarItemFormVazio());
const formEditar = ref<TabelaPrecoItemEdicaoFormModel>({ preco: '', margemMinimaPercentual: '' });
const formularioRef = ref<InstanceType<typeof ItemTabelaPrecoFormulario> | null>(null);

const colunas = computed(() => {
  const base: QTableColumn<TabelaPrecoItemDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left', sortable: true },
  { name: 'preco', label: 'Preço', field: 'preco', align: 'left', sortable: true },
  { name: 'margemMinimaPercentual', label: 'Margem mín.', field: 'margemMinimaPercentual', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];
  if (props.somenteLeitura) {
    return base.filter((coluna) => coluna.name !== 'acoes');
  }
  return base;
});

watch(
  toRef(props, 'itensIniciais'),
  (lista) => {
    definirItens(lista);
  },
  { immediate: true },
);

function rotuloProduto(produtoId: string): string {
  const produto = produtos.value.find((item) => item.id === produtoId);
  return produto ? `${produto.descricao}` : produtoId;
}

function formatarPreco(valor: number): string {
  return `R$ ${formatarNumero(valor)}`;
}

function abrirDialogCriar(): void {
  modoDialog.value = 'criar';
  itemEmEdicaoId.value = null;
  formCriar.value = criarItemFormVazio();
  dialogAberto.value = true;
}

function abrirDialogEditar(item: TabelaPrecoItemDto): void {
  modoDialog.value = 'editar';
  itemEmEdicaoId.value = item.id;
  formEditar.value = itemDtoParaEdicaoForm(item);
  dialogAberto.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
}

async function salvarItem(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modoDialog.value === 'criar'
      ? await adicionar(formCriar.value)
      : await editar(itemEmEdicaoId.value!, formEditar.value);

  if (sucesso) {
    fecharDialog();
  }
}

onMounted(() => {
  void carregarProdutos({ ativo: true });
});
</script>

<style scoped>
.tabela-preco-itens__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.tabela-preco-itens__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.tabela-preco-itens__acoes {
  white-space: nowrap;
}

.tabela-preco-itens__dialog {
  min-width: min(480px, 90vw);
  width: 100%;
}

.tabela-preco-itens__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
