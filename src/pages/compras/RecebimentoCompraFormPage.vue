<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header
      titulo="Novo recebimento"
      subtitulo="Importe o XML da NF-e ou registre manualmente."
    />

    <section class="agro-section form-grid">
      <agro-card>
        <h3 class="titulo">XML da NF-e</h3>
        <div class="row q-col-gutter-md items-end q-mb-md">
          <div class="col-12 col-md-8">
            <q-file
              v-model="arquivoXml"
              outlined
              label="Arquivo XML"
              accept=".xml,text/xml,application/xml"
              clearable
              :disable="salvando"
              @update:model-value="onArquivoXmlSelecionado"
            >
              <template #prepend>
                <q-icon name="upload_file" />
              </template>
            </q-file>
          </div>
          <div class="col-12 col-md-4">
            <agro-btn
              flat
              class="full-width"
              label="Consultar SEFAZ"
              descricao="Consultar documentos destinados Focus/SEFAZ"
              :loading="consultandoSefaz"
              @click="consultarSefaz"
            />
          </div>
        </div>
        <p v-if="mensagemSefaz" class="texto-sefaz">{{ mensagemSefaz }}</p>
        <q-list v-if="documentosSefaz?.documentos?.length" bordered class="q-mt-md lista-sefaz">
          <q-item
            v-for="doc in documentosSefaz.documentos"
            :key="doc.chaveAcesso"
            clickable
            @click="selecionarDocumentoSefaz(doc)"
          >
            <q-item-section>
              <q-item-label>{{ doc.nomeEmitente || doc.cnpjEmitente || doc.tipo }}</q-item-label>
              <q-item-label caption>{{ doc.chaveAcesso }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{ doc.dataEmissao }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </agro-card>

      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="fornecedorId"
                entidade="fornecedor"
                label="Fornecedor"
                :options="fornecedorOpcoes"
                :rules="[obrigatorio]"
                @atualizar="carregarFornecedores({ ativo: true })"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="pedidoCompraId"
                outlined
                label="Pedido de compra (opcional)"
                readonly
                hint="Preenchido quando originado de um pedido"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="chaveAcesso" outlined label="Chave de acesso" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="numeroNota" outlined label="Número da nota" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="serie" outlined label="Série" />
            </div>
          </div>

          <div class="itens-header">
            <h3 class="titulo">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionarItem" />
          </div>

          <div v-if="itensSemProduto.length > 0" class="banner-faltantes" role="status">
            <div class="banner-faltantes__titulo">Produtos do XML não cadastrados nesta unidade</div>
            <p class="banner-faltantes__texto">
              A NF-e tem itens que não bateram 100% com o cadastro (código/EAN/nome). Cadastre-os aqui
              para continuar o recebimento com agilidade.
            </p>
            <ul class="banner-faltantes__lista">
              <li v-for="item in itensSemProduto" :key="item.chave">
                <span class="text-metric">{{ rotuloItemXml(item) }}</span>
                <agro-btn
                  flat
                  dense
                  color="warning"
                  label="Cadastrar produto"
                  descricao="Cadastrar produto do XML"
                  @click="abrirCadastroRapido(item)"
                />
              </li>
            </ul>
          </div>

          <div v-for="(item, index) in itens" :key="item.chave" class="item-row">
            <div class="row q-col-gutter-sm items-start">
              <div class="col-12 col-md-4">
                <agro-select-cadastro
                  v-model="item.produtoId"
                  entidade="produto"
                  dense
                  label="Produto"
                  :options="produtoOpcoes"
                  :hint="hintProdutoXml(item)"
                  :rules="[obrigatorio]"
                  @atualizar="carregarProdutos({ ativo: true })"
                />
              </div>
              <div class="col-6 col-md-2">
                <q-input v-model="item.quantidadeNota" outlined dense label="Qtd NF" type="number" />
              </div>
              <div class="col-6 col-md-2">
                <q-input v-model="item.quantidadeRecebida" outlined dense label="Qtd recebida" type="number" />
              </div>
              <div class="col-6 col-md-2">
                <AgroMoneyInput v-model="item.custoUnitario" dense label="Custo" />
              </div>
              <div class="col-5 col-md-1">
                <q-input v-model="item.numeroLote" outlined dense label="Lote" />
              </div>
              <div class="col-5 col-md-1">
                <q-input v-model="item.dataValidade" outlined dense label="Validade" type="date" />
              </div>
              <div class="col-2 col-md-auto">
                <agro-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  descricao="Remover item"
                  :disable="itens.length <= 1"
                  @click="itens.splice(index, 1)"
                />
              </div>
            </div>
            <div v-if="itemSemProduto(item)" class="item-row__cta">
              <agro-btn
                flat
                dense
                no-caps
                color="warning"
                label="Cadastrar produto"
                descricao="Cadastrar produto do XML"
                @click="abrirCadastroRapido(item)"
              />
            </div>
          </div>

          <div v-if="duplicatasPreview.length > 0" class="q-mt-md">
            <h3 class="titulo">Duplicatas do XML</h3>
            <q-table
              flat
              bordered
              row-key="chave"
              hide-pagination
              :rows="duplicatasPreview"
              :columns="colunasDuplicatas"
              :pagination="{ rowsPerPage: 0 }"
            >
              <template #body-cell-valor="props">
                <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
              </template>
            </q-table>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'recebimentos-compra' }" />
            <agro-btn
              color="primary"
              unelevated
              label="Criar recebimento"
              descricao="Criar recebimento"
              type="submit"
              :loading="salvando"
            />
          </div>
        </q-form>
      </agro-card>
    </section>

    <ProdutoRapidoDialog
      v-model="dialogProdutoAberto"
      :descricao-produto-xml="itemCadastroRapido?.descricaoProdutoXml"
      :codigo-produto-xml="itemCadastroRapido?.codigoProdutoXml"
      :preco-sugerido="precoSugeridoCadastro"
      @criado="onProdutoCriado"
    />
  </q-page>
</template>

<script setup lang="ts">
import ProdutoRapidoDialog from 'components/compras/ProdutoRapidoDialog.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useCompras } from 'composables/useCompras';
import { useFiscal } from 'composables/useFiscal';
import { useFornecedores } from 'composables/useFornecedores';
import { useNotificacao } from 'composables/useNotificacao';
import { useProdutos } from 'composables/useProdutos';
import { useRecebimentosCompra } from 'composables/useRecebimentosCompra';
import type { QTableColumn } from 'quasar';
import type { ProdutoDto } from 'types/dtos/produto.dto';
import { formatarMoeda, formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface ItemForm {
  chave: string;
  produtoId: string;
  codigoProdutoXml: string;
  descricaoProdutoXml: string;
  quantidadeNota: string;
  quantidadeRecebida: string;
  custoUnitario: string;
  numeroLote: string;
  dataValidade: string;
}

interface DuplicataPreviewRow {
  chave: string;
  numero: string;
  vencimento: string;
  valor: number;
}

const route = useRoute();
const router = useRouter();
const { salvando, previewXmlConteudo, criar, limparPreview } = useRecebimentosCompra();
const { receberPedido } = useCompras();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();
const { produtos, carregar: carregarProdutos } = useProdutos();
const {
  consultandoSefaz,
  documentosSefaz,
  listarDocumentosSefaz,
} = useFiscal();
const { erro } = useNotificacao();

const arquivoXml = ref<File | null>(null);
const xmlConteudo = ref('');
const fornecedorId = ref('');
const pedidoCompraId = ref('');
const chaveAcesso = ref('');
const numeroNota = ref('');
const serie = ref('');
const mensagemSefaz = ref('');
const duplicatasPreview = ref<DuplicataPreviewRow[]>([]);
const itens = ref<ItemForm[]>([criarItemVazio()]);
const dialogProdutoAberto = ref(false);
const itemCadastroRapido = ref<ItemForm | null>(null);

const fornecedorOpcoes = computed(() =>
  fornecedores.value.map((f) => ({ label: f.razaoSocial, value: f.id })),
);
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({
    label: p.codigo ? `${p.descricao} (${p.codigo})` : p.descricao,
    value: p.id,
  })),
);

const itensSemProduto = computed(() =>
  itens.value.filter(
    (item) =>
      itemSemProduto(item) && (!!item.codigoProdutoXml || !!item.descricaoProdutoXml),
  ),
);

const precoSugeridoCadastro = computed(() => {
  const item = itemCadastroRapido.value;
  if (!item) {
    return 0;
  }
  return parseMascaraMoeda(item.custoUnitario) ?? 0;
});

const colunasDuplicatas: QTableColumn<DuplicataPreviewRow>[] = [
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'vencimento', label: 'Vencimento', field: 'vencimento', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
];

function criarItemVazio(): ItemForm {
  return {
    chave: crypto.randomUUID(),
    produtoId: '',
    codigoProdutoXml: '',
    descricaoProdutoXml: '',
    quantidadeNota: '1',
    quantidadeRecebida: '1',
    custoUnitario: formatarMoedaParaInput(0),
    numeroLote: '',
    dataValidade: '',
  };
}

function itemSemProduto(item: ItemForm): boolean {
  return !item.produtoId;
}

function rotuloItemXml(item: ItemForm): string {
  const codigo = item.codigoProdutoXml?.trim();
  const descricao = item.descricaoProdutoXml?.trim();
  if (codigo && descricao) {
    return `${codigo} — ${descricao}`;
  }
  return descricao || codigo || 'Item sem identificação';
}

function hintProdutoXml(item: ItemForm): string | undefined {
  if (!item.codigoProdutoXml && !item.descricaoProdutoXml) {
    return undefined;
  }

  const partes = [
    item.codigoProdutoXml ? `XML: ${item.codigoProdutoXml}` : null,
    item.descricaoProdutoXml || null,
  ].filter(Boolean);

  if (!item.produtoId) {
    return `${partes.join(' — ')} (não encontrado — cadastre ou selecione)`;
  }

  return partes.join(' — ');
}

function adicionarItem(): void {
  itens.value.push(criarItemVazio());
}

function abrirCadastroRapido(item: ItemForm): void {
  itemCadastroRapido.value = item;
  dialogProdutoAberto.value = true;
}

async function onProdutoCriado(produto: ProdutoDto): Promise<void> {
  const item = itemCadastroRapido.value;
  await carregarProdutos({ ativo: true });
  if (item) {
    item.produtoId = produto.id;
  }
  itemCadastroRapido.value = null;
}

async function onArquivoXmlSelecionado(file: File | FileList | null): Promise<void> {
  const selecionado = file instanceof FileList ? file.item(0) : file;

  if (!selecionado) {
    xmlConteudo.value = '';
    return;
  }

  if (!selecionado.name.toLowerCase().endsWith('.xml')) {
    erro('Selecione um arquivo XML válido.');
    arquivoXml.value = null;
    xmlConteudo.value = '';
    return;
  }

  try {
    const conteudo = (await selecionado.text()).trim();
    if (!conteudo) {
      erro('O arquivo XML está vazio.');
      arquivoXml.value = null;
      xmlConteudo.value = '';
      return;
    }

    xmlConteudo.value = conteudo;
    await analisarXml();
  } catch {
    erro('Não foi possível ler o arquivo XML.');
    arquivoXml.value = null;
    xmlConteudo.value = '';
  }
}

async function analisarXml(): Promise<void> {
  const preview = await previewXmlConteudo({ xmlConteudo: xmlConteudo.value });
  if (!preview) return;

  if (preview.fornecedorId) fornecedorId.value = preview.fornecedorId;
  chaveAcesso.value = preview.chaveAcesso ?? '';
  numeroNota.value = preview.numeroNota ?? '';
  serie.value = preview.serie ?? '';

  itens.value = preview.itens.map((item) => ({
    chave: crypto.randomUUID(),
    produtoId: item.produtoId ?? '',
    codigoProdutoXml: item.codigoProdutoXml,
    descricaoProdutoXml: item.descricaoProdutoXml ?? '',
    quantidadeNota: String(item.quantidade),
    quantidadeRecebida: String(item.quantidade),
    custoUnitario: formatarMoedaParaInput(item.custoUnitario),
    numeroLote: item.numeroLote ?? '',
    dataValidade: item.dataValidade ?? '',
  }));

  if (itens.value.length === 0) {
    itens.value = [criarItemVazio()];
  }

  duplicatasPreview.value = preview.duplicatas.map((d) => ({
    chave: crypto.randomUUID(),
    numero: d.numero ?? '—',
    vencimento: d.vencimento,
    valor: d.valor,
  }));
}

async function consultarSefaz(): Promise<void> {
  const resp = await listarDocumentosSefaz();
  mensagemSefaz.value = resp?.mensagem ?? documentosSefaz.value?.mensagem ?? '';
}

function selecionarDocumentoSefaz(doc: {
  chaveAcesso: string;
  nomeEmitente?: string | null;
}): void {
  chaveAcesso.value = doc.chaveAcesso;
  mensagemSefaz.value = `Documento selecionado: ${doc.nomeEmitente ?? doc.chaveAcesso}`;
}

async function salvar(): Promise<void> {
  const criado = await criar({
    fornecedorId: fornecedorId.value,
    pedidoCompraId: pedidoCompraId.value || null,
    xmlConteudo: xmlConteudo.value.trim() || null,
    chaveAcesso: chaveAcesso.value.trim() || null,
    numeroNota: numeroNota.value.trim() || null,
    serie: serie.value.trim() || null,
    itens: itens.value.map((i) => ({
      produtoId: i.produtoId,
      codigoProdutoXml: i.codigoProdutoXml || null,
      quantidadeNota: Number(i.quantidadeNota),
      quantidadeRecebida: Number(i.quantidadeRecebida),
      custoUnitario: parseMascaraMoeda(i.custoUnitario) ?? 0,
      numeroLote: i.numeroLote.trim() || null,
      dataValidade: i.dataValidade || null,
    })),
  });

  if (criado) {
    limparPreview();
    await router.push({ name: 'recebimento-compra-detalhe', params: { id: criado.id } });
  }
}

onMounted(async () => {
  void carregarFornecedores({ ativo: true });
  void carregarProdutos({ ativo: true });
  const pedidoId = route.query.pedidoCompraId;
  if (typeof pedidoId === 'string' && pedidoId) {
    pedidoCompraId.value = pedidoId;
    const recebimento = await receberPedido(pedidoId);
    if (recebimento) {
      await router.replace({
        name: 'recebimento-compra-detalhe',
        params: { id: recebimento.id },
      });
      return;
    }
  }
});
</script>

<style scoped>
.form-grid {
  display: grid;
  gap: var(--spacing-6);
}
.titulo {
  margin: 0 0 var(--spacing-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.texto-sefaz {
  margin: var(--spacing-3) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.itens-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-4) 0 var(--spacing-3);
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
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}
.item-row {
  margin-bottom: var(--spacing-4);
}
.item-row__cta {
  display: flex;
  justify-content: flex-start;
  margin-top: var(--spacing-1);
  padding-left: 0;
}
</style>
