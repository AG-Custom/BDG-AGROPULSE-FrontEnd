<template>
  <div class="recebimento-itens">
    <div class="recebimento-itens__toolbar">
      <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="abrirDialogNovo" />
    </div>

    <div v-if="itensSemProduto.length > 0" class="banner-faltantes" role="status">
      <div class="banner-faltantes__titulo">Produtos do XML não cadastrados nesta unidade</div>
      <p class="banner-faltantes__texto">
        A NF-e tem itens que não bateram 100% com o cadastro. Cadastre-os aqui para continuar.
      </p>
      <ul class="banner-faltantes__lista">
        <li v-for="item in itensSemProduto" :key="item.chave">
          <span class="banner-faltantes__item" :title="rotuloItemXml(item)">
            {{ rotuloItemXmlCurto(item) }}
          </span>
          <agro-btn
            unelevated
            dense
            color="warning"
            icon="add"
            label="Cadastrar produto"
            descricao="Cadastrar produto do XML"
            @click="emit('cadastrar', item)"
          />
        </li>
      </ul>
    </div>

    <empty-state
      v-if="itens.length === 0"
      titulo="Nenhum item"
      descricao="Importe um XML ou adicione itens manualmente."
      icon="inventory_2"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="chave"
      hide-pagination
      class="recebimento-itens__tabela"
      :rows="itens"
      :columns="colunas"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-indice="props">
        <q-td :props="props" class="text-metric">
          {{ String(props.rowIndex + 1).padStart(2, '0') }}
        </q-td>
      </template>

      <template #body-cell-produtoXml="props">
        <q-td :props="props">
          <div class="recebimento-itens__produto-xml">
            <span class="recebimento-itens__produto-nome">{{ tituloXml(props.row) }}</span>
            <span v-if="props.row.codigoProdutoXml" class="recebimento-itens__produto-cod text-metric">
              {{ props.row.codigoProdutoXml }}
            </span>
          </div>
        </q-td>
      </template>

      <template #body-cell-produtoSistema="props">
        <q-td :props="props">
          {{ rotuloProdutoSistema(props.row.produtoId) }}
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <agro-badge
            :label="props.row.produtoId ? 'Vinculado' : 'Sem cadastro'"
            :variant="props.row.produtoId ? 'success' : 'warning'"
          />
        </q-td>
      </template>

      <template #body-cell-quantidadeNota="props">
        <q-td :props="props" class="text-metric">
          {{ props.row.quantidadeNota || '—' }}
        </q-td>
      </template>

      <template #body-cell-quantidadeRecebida="props">
        <q-td :props="props" class="text-metric">
          {{ props.row.quantidadeRecebida || '—' }}
        </q-td>
      </template>

      <template #body-cell-custoUnitario="props">
        <q-td :props="props" class="text-metric">
          {{ formatarCusto(props.row.custoUnitario) }}
        </q-td>
      </template>

      <template #body-cell-totalLinha="props">
        <q-td :props="props" class="text-metric">
          {{ totalLinha(props.row) }}
        </q-td>
      </template>

      <template #body-cell-acoes="props">
        <q-td :props="props" class="recebimento-itens__acoes">
          <agro-acoes-menu
            :mostrar-visualizar="false"
            :mostrar-status="false"
            :mostrar-excluir="itens.length > 1"
            editar-label="Editar item"
            excluir-label="Remover item"
            @editar="abrirDialogEditar(props.row)"
            @excluir="removerItem(props.row.chave)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="recebimento-itens__dialog">
        <q-card-section>
          <h4 class="recebimento-itens__dialog-titulo">
            {{ tituloDialog }}
          </h4>
        </q-card-section>

        <q-card-section class="recebimento-itens__dialog-corpo">
          <q-form ref="formRef" greedy>
            <RecebimentoNfeItemCard
              v-model:item="itemForm"
              embutido
              :indice="indiceDialog"
              modo="form"
              :produto-opcoes="produtoOpcoes"
              :pode-remover="false"
              @cadastrar="emit('cadastrar', itemForm)"
              @atualizar-produtos="emit('atualizarProdutos')"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <agro-btn flat label="Cancelar" descricao="Fechar sem salvar" @click="fecharDialog" />
          <agro-btn
            color="primary"
            unelevated
            :label="indiceEdicao === null ? 'Adicionar' : 'Salvar'"
            descricao="Confirmar item do recebimento"
            @click="salvarItem"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import RecebimentoNfeItemCard, {
  type RecebimentoNfeItemFormModel,
} from 'components/compras/RecebimentoNfeItemCard.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import type { QForm, QTableColumn } from 'quasar';
import { formatarMoeda, formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import { computed, ref } from 'vue';

export interface RecebimentoItemForm extends RecebimentoNfeItemFormModel {
  chave: string;
}

const props = defineProps<{
  produtoOpcoes: Array<{ label: string; value: string }>;
}>();

const itens = defineModel<RecebimentoItemForm[]>('itens', { required: true });

const emit = defineEmits<{
  cadastrar: [item: RecebimentoItemForm];
  atualizarProdutos: [];
}>();

const dialogAberto = ref(false);
const indiceEdicao = ref<number | null>(null);
const itemForm = ref<RecebimentoItemForm>(criarItemVazio());
const formRef = ref<QForm | null>(null);

const itensSemProduto = computed(() =>
  itens.value.filter((item) => !item.produtoId && (!!item.codigoProdutoXml || !!item.descricaoProdutoXml)),
);

const mapaProdutos = computed(() => {
  const mapa = new Map<string, string>();
  for (const opcao of props.produtoOpcoes) {
    mapa.set(opcao.value, opcao.label);
  }
  return mapa;
});

const indiceDialog = computed(() =>
  indiceEdicao.value === null ? itens.value.length + 1 : indiceEdicao.value + 1,
);

const tituloDialog = computed(() => {
  const prefixo = indiceEdicao.value === null ? 'Novo item' : `Item ${String(indiceDialog.value).padStart(2, '0')}`;
  const descricao = itemForm.value.descricaoProdutoXml?.trim();
  if (descricao) return `${prefixo} · ${descricao}`;
  return prefixo;
});

const colunas: QTableColumn<RecebimentoItemForm>[] = [
  { name: 'indice', label: '#', field: 'chave', align: 'left' },
  { name: 'produtoXml', label: 'Produto XML', field: 'descricaoProdutoXml', align: 'left' },
  { name: 'produtoSistema', label: 'Produto sistema', field: 'produtoId', align: 'left' },
  { name: 'status', label: 'Status', field: 'produtoId', align: 'left' },
  { name: 'quantidadeNota', label: 'Qtd. NF', field: 'quantidadeNota', align: 'right' },
  { name: 'quantidadeRecebida', label: 'Qtd. recebida', field: 'quantidadeRecebida', align: 'right' },
  { name: 'custoUnitario', label: 'Custo', field: 'custoUnitario', align: 'right' },
  { name: 'totalLinha', label: 'Total', field: 'chave', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'chave', align: 'right' },
];

function criarItemVazio(): RecebimentoItemForm {
  return {
    chave: crypto.randomUUID(),
    produtoId: '',
    codigoProdutoXml: '',
    descricaoProdutoXml: '',
    ncm: '',
    cfop: '',
    unidade: '',
    ean: '',
    origem: '',
    cstIcms: '',
    csosn: '',
    baseIcms: null,
    aliquotaIcms: null,
    valorIcms: null,
    valorIcmsDesonerado: null,
    cstIpi: '',
    valorIpi: null,
    cstPis: '',
    cstCofins: '',
    baseDifal: null,
    valorDifal: null,
    valorTotal: null,
    informacaoAdicional: '',
    quantidadeNota: '1',
    quantidadeRecebida: '1',
    custoUnitario: formatarMoedaParaInput(0),
    numeroLote: '',
    dataValidade: '',
    tipoCusto: null,
    margemLucro: '',
    precoVenda: '',
  };
}

function tituloXml(item: RecebimentoItemForm): string {
  return item.descricaoProdutoXml?.trim() || item.codigoProdutoXml?.trim() || 'Item sem identificação';
}

function rotuloItemXml(item: RecebimentoItemForm): string {
  const codigo = item.codigoProdutoXml?.trim();
  const descricao = item.descricaoProdutoXml?.trim();
  if (codigo && descricao) return `${codigo} — ${descricao}`;
  return descricao || codigo || 'Item sem identificação';
}

function rotuloItemXmlCurto(item: RecebimentoItemForm): string {
  const completo = rotuloItemXml(item);
  if (completo.length <= 80) return completo;
  return `${completo.slice(0, 77)}...`;
}

function rotuloProdutoSistema(produtoId: string): string {
  if (!produtoId) return '—';
  return mapaProdutos.value.get(produtoId) ?? produtoId;
}

function formatarCusto(valor: string): string {
  const numero = parseMascaraMoeda(valor);
  return numero == null ? '—' : formatarMoeda(numero);
}

function totalLinha(item: RecebimentoItemForm): string {
  if (item.valorTotal != null) {
    return formatarMoeda(item.valorTotal);
  }
  const qtd = Number(item.quantidadeNota);
  const custo = parseMascaraMoeda(item.custoUnitario) ?? 0;
  if (!Number.isFinite(qtd) || qtd <= 0) {
    return '—';
  }
  return formatarMoeda(qtd * custo);
}

function abrirDialogNovo(): void {
  indiceEdicao.value = null;
  itemForm.value = criarItemVazio();
  dialogAberto.value = true;
}

function abrirDialogEditar(item: RecebimentoItemForm): void {
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
  if (!valido) return;

  const itemSalvo: RecebimentoItemForm = {
    ...itemForm.value,
    chave: itemForm.value.chave || crypto.randomUUID(),
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
</script>

<style scoped>
.recebimento-itens__toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-3);
}

.recebimento-itens__tabela {
  background: var(--color-surface-default);
}

.recebimento-itens__produto-xml {
  display: grid;
  gap: var(--spacing-1);
  min-width: 0;
}

.recebimento-itens__produto-nome {
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recebimento-itens__produto-cod {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.recebimento-itens__acoes {
  white-space: nowrap;
}

.recebimento-itens__dialog {
  max-width: 900px;
  min-width: min(720px, 92vw);
  width: 100%;
}

.recebimento-itens__dialog-titulo {
  color: var(--color-text-primary);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.recebimento-itens__dialog-corpo {
  max-height: min(70vh, 720px);
  overflow: auto;
}

.banner-faltantes {
  margin: 0 0 var(--spacing-4);
  padding: var(--spacing-4);
  border: var(--border-width-thin) solid var(--color-warning-500);
  border-left: var(--border-width-accent) solid var(--color-warning-500);
  border-radius: var(--radius-md);
  background: var(--color-warning-50);
}

.banner-faltantes__titulo {
  margin: 0 0 var(--spacing-2);
  font-family: var(--font-family-display);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-warning-700);
}

.banner-faltantes__texto {
  margin: 0 0 var(--spacing-3);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.banner-faltantes__lista {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--spacing-2);
}

.banner-faltantes__lista li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
}

.banner-faltantes__item {
  flex: 1;
  min-width: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
