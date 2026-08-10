<template>
  <agro-card class="pedido-venda-itens">
    <template #header>
      <div class="pedido-venda-itens__header">
        <h3 class="pedido-venda-itens__titulo">Itens do pedido</h3>
        <agro-btn
          v-if="!somenteLeitura"
          color="primary"
          unelevated
          icon="add"
          label="Adicionar item"
          descricao="Adicionar produto ao pedido"
          @click="abrirDialog"
        />
      </div>
    </template>

    <empty-state
      v-if="itens.length === 0"
      titulo="Nenhum item no pedido"
      descricao="Adicione ao menos um produto com quantidade e preço."
      icon="shopping_cart"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="chave"
      hide-pagination
      class="pedido-venda-itens__tabela"
      :rows="itens"
      :columns="colunas"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-produtoId="props">
        <q-td :props="props">
          {{ rotuloProduto(props.row.produtoId) }}
        </q-td>
      </template>

      <template #body-cell-quantidade="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(Number(props.row.quantidade.replace(',', '.')) || 0) }}
        </q-td>
      </template>

      <template #body-cell-precoUnitario="props">
        <q-td :props="props" class="text-metric">
          {{ formatarMoeda(parseMascaraMoeda(props.row.precoUnitario) ?? 0) }}
        </q-td>
      </template>

      <template #body-cell-descontoPercentual="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(Number(props.row.descontoPercentual.replace(',', '.')) || 0) }}%
        </q-td>
      </template>

      <template #body-cell-subtotal="props">
        <q-td :props="props" class="text-metric">
          {{ formatarMoeda(subtotalItem(props.row)) }}
        </q-td>
      </template>

      <template v-if="!somenteLeitura" #body-cell-acoes="props">
        <q-td :props="props" class="pedido-venda-itens__acoes">
          <agro-acoes-menu
            :mostrar-visualizar="false"
            :mostrar-status="false"
            mostrar-excluir
            editar-label="Editar item"
            excluir-label="Remover item"
            @editar="abrirDialogEditar(props.row)"
            @excluir="removerItem(props.row.chave)"
          />
        </q-td>
      </template>
    </q-table>

    <div v-if="itens.length > 0" class="pedido-venda-itens__total">
      <span>Total</span>
      <span class="text-metric">{{ formatarMoeda(totalPreview) }}</span>
    </div>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="pedido-venda-itens__dialog">
        <q-card-section>
          <h4 class="pedido-venda-itens__dialog-titulo">
            {{ indiceEdicao === null ? 'Novo item' : 'Editar item' }}
          </h4>
        </q-card-section>

        <q-card-section>
          <q-form ref="formRef" greedy>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <agro-select-cadastro
                  v-model="itemForm.produtoId"
                  entidade="produto"
                  label="Produto"
                  class="field-required"
                  aria-required="true"
                  :options="produtoOpcoes"
                  :loading="carregandoProdutos || carregandoItensTabela"
                  :rules="[obrigatorio]"
                  @atualizar="carregarProdutos({ ativo: true })"
                  @update:model-value="onProdutoSelecionado"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="itemForm.quantidade"
                  outlined
                  label="Quantidade"
                  class="field-required"
                  type="number"
                  min="0.01"
                  step="0.01"
                  aria-required="true"
                  :rules="[quantidadePositiva]"
                />
              </div>
              <div class="col-12 col-md-6">
                <AgroMoneyInput
                  v-model="itemForm.precoUnitario"
                  label="Preço unitário"
                  hint="Preço da tabela — sem fallback para preço de venda do produto"
                  :loading="resolvendoPreco"
                  :rules="[quantidadePositiva]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="itemForm.descontoPercentual"
                  outlined
                  label="Desconto %"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  hint="Opcional — 0 a 100"
                  :rules="[percentualZeroACem]"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn flat label="Cancelar" descricao="Fechar sem salvar" @click="fecharDialog" />
          <agro-btn
            color="primary"
            unelevated
            :label="indiceEdicao === null ? 'Adicionar' : 'Salvar'"
            descricao="Confirmar item do pedido"
            @click="salvarItem"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </agro-card>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { usePrecificacao } from 'composables/usePrecificacao';
import { useProdutos } from 'composables/useProdutos';
import {
  mapearItensTabelaParaLinhas,
  useProdutosPorTabelaPreco,
} from 'composables/useProdutosPorTabelaPreco';
import type { QForm, QTableColumn } from 'quasar';
import type { PedidoVendaItemFormModel } from 'types/dtos/pedido-venda.dto';
import { formatarDecimal, formatarMoeda, formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import {
  criarChaveItem,
  criarItemFormVazio,
  subtotalItem,
  totalPedidoPreview,
} from 'utils/mappers/pedido-venda.mapper';
import { obrigatorio, percentualZeroACem, quantidadePositiva } from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  somenteLeitura?: boolean;
  clienteId?: string;
  tabelaPrecoId?: string;
}>();

const itens = defineModel<PedidoVendaItemFormModel[]>('itens', { required: true });

const {
  produtos,
  carregando: carregandoProdutos,
  carregar: carregarProdutos,
} = useProdutos();

const { resolvendoPreco, resolverPreco } = usePrecificacao();

const {
  itensTabela,
  produtoOpcoes,
  carregandoItensTabela,
  produtoIdsPermitidos,
} = useProdutosPorTabelaPreco(
  () => props.tabelaPrecoId,
  () => produtos.value,
);

const reResolverPrecosPendente = ref(false);
const substituirItensPendente = ref(false);
const tabelaPrecoAnteriorSync = ref<string | undefined>(undefined);
const dialogAberto = ref(false);
const indiceEdicao = ref<number | null>(null);
const itemForm = ref<PedidoVendaItemFormModel>(criarItemFormVazio());
const formRef = ref<QForm | null>(null);

const mapaProdutos = computed(() => {
  const mapa = new Map<string, string>();

  for (const produto of produtos.value) {
    mapa.set(produto.id, `${produto.descricao}`);
  }

  return mapa;
});

const totalPreview = computed(() => totalPedidoPreview(itens.value));

const colunas = computed(() => {
  const base: QTableColumn<PedidoVendaItemFormModel>[] = [
    { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
    { name: 'quantidade', label: 'Qtd.', field: 'quantidade', align: 'right' },
    { name: 'precoUnitario', label: 'Preço unit.', field: 'precoUnitario', align: 'right' },
    {
      name: 'descontoPercentual',
      label: 'Desc. %',
      field: 'descontoPercentual',
      align: 'right',
    },
    { name: 'subtotal', label: 'Subtotal', field: 'chave', align: 'right' },
    { name: 'acoes', label: 'Ações', field: 'chave', align: 'right' },
  ];

  if (props.somenteLeitura) {
    return base.filter((coluna) => coluna.name !== 'acoes');
  }

  return base;
});

function rotuloProduto(produtoId: string): string {
  return mapaProdutos.value.get(produtoId) ?? produtoId;
}

async function onProdutoSelecionado(valor: unknown): Promise<void> {
  const produtoId = typeof valor === 'string' ? valor : '';

  if (!produtoId) {
    return;
  }

  itemForm.value.precoUnitario = '';

  const resolvido = await resolverPreco({
    produtoId,
    clienteId: props.clienteId || null,
    tabelaPrecoId: props.tabelaPrecoId || null,
  });

  if (resolvido) {
    itemForm.value.precoUnitario = formatarMoedaParaInput(resolvido.preco);
  }
}

async function sincronizarItensComTabela(): Promise<void> {
  if (carregandoItensTabela.value || props.somenteLeitura) {
    return;
  }

  if (substituirItensPendente.value) {
    substituirItensPendente.value = false;
    reResolverPrecosPendente.value = false;

    const linhas = mapearItensTabelaParaLinhas(itensTabela.value);
    itens.value = linhas.map((linha) => ({
      chave: criarChaveItem(),
      produtoId: linha.produtoId,
      quantidade: linha.quantidade,
      precoUnitario: linha.precoUnitario,
      descontoPercentual: '0',
    }));
    return;
  }

  const deveReResolver = reResolverPrecosPendente.value;
  reResolverPrecosPendente.value = false;

  const ids = produtoIdsPermitidos.value;
  const atualizados: PedidoVendaItemFormModel[] = [];
  const tarefas: Promise<void>[] = [];

  for (const item of itens.value) {
    if (!item.produtoId) {
      atualizados.push(item);
      continue;
    }

    if (ids && !ids.has(item.produtoId)) {
      continue;
    }

    atualizados.push(item);

    if (deveReResolver) {
      tarefas.push(
        (async () => {
          const resolvido = await resolverPreco({
            produtoId: item.produtoId,
            clienteId: props.clienteId || null,
            tabelaPrecoId: props.tabelaPrecoId || null,
          });

          if (resolvido) {
            item.precoUnitario = formatarMoedaParaInput(resolvido.preco);
          }
        })(),
      );
    }
  }

  itens.value = atualizados;

  if (dialogAberto.value && itemForm.value.produtoId) {
    if (ids && !ids.has(itemForm.value.produtoId)) {
      itemForm.value.produtoId = '';
      itemForm.value.precoUnitario = '';
    } else if (deveReResolver) {
      await onProdutoSelecionado(itemForm.value.produtoId);
    }
  }

  await Promise.all(tarefas);
}

function abrirDialog(): void {
  indiceEdicao.value = null;
  itemForm.value = criarItemFormVazio();
  dialogAberto.value = true;
}

function abrirDialogEditar(item: PedidoVendaItemFormModel): void {
  const indice = itens.value.findIndex((atual) => atual.chave === item.chave);
  indiceEdicao.value = indice >= 0 ? indice : null;
  itemForm.value = { ...item };
  dialogAberto.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
  indiceEdicao.value = null;
}

function removerItem(chave: string): void {
  itens.value = itens.value.filter((item) => item.chave !== chave);
}

async function salvarItem(): Promise<void> {
  const valido = (await formRef.value?.validate()) ?? false;

  if (!valido) {
    return;
  }

  const itemSalvo: PedidoVendaItemFormModel = {
    ...itemForm.value,
    chave: itemForm.value.chave || criarChaveItem(),
  };

  if (indiceEdicao.value === null) {
    itens.value = [...itens.value, itemSalvo];
  } else {
    const atualizados = [...itens.value];
    atualizados[indiceEdicao.value] = itemSalvo;
    itens.value = atualizados;
  }

  fecharDialog();
}

watch(
  [() => props.tabelaPrecoId, produtoIdsPermitidos, carregandoItensTabela],
  () => {
    const tabelaAtual = props.tabelaPrecoId?.trim() ?? '';
    const tabelaAnterior = tabelaPrecoAnteriorSync.value;

    if (tabelaAnterior !== undefined && tabelaAtual !== tabelaAnterior) {
      if (tabelaAtual) {
        substituirItensPendente.value = true;
      } else {
        substituirItensPendente.value = false;
        reResolverPrecosPendente.value = false;
      }
    } else if (tabelaAnterior === undefined && tabelaAtual) {
      const soVazios = itens.value.every((item) => !item.produtoId);
      if (soVazios) {
        substituirItensPendente.value = true;
      }
    }

    tabelaPrecoAnteriorSync.value = tabelaAtual;
    void sincronizarItensComTabela();
  },
);

onMounted(() => {
  void carregarProdutos({ ativo: true });
});
</script>

<style scoped>
.pedido-venda-itens__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-3);
}

.pedido-venda-itens__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.pedido-venda-itens__acoes {
  white-space: nowrap;
}

.pedido-venda-itens__total {
  align-items: center;
  border-top: 1px solid var(--color-border-default);
  color: var(--color-text-primary);
  display: flex;
  font-weight: var(--font-weight-semibold);
  justify-content: space-between;
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
}

.pedido-venda-itens__dialog {
  min-width: min(480px, 90vw);
  width: 100%;
}

.pedido-venda-itens__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
