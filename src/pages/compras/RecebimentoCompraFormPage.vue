<template>
  <q-page class="agro-page agro-page--form-xl">
    <app-page-header
      titulo="Novo recebimento"
      subtitulo="Importe o XML da NF-e ou registre manualmente."
    />

    <section class="agro-section form-grid">
      <RecebimentoSecaoExpansivel
        v-model="secoes.xml"
        titulo="XML da NF-e"
        subtitulo="Importe o arquivo para preencher dados, produtos e pagamentos"
      >
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
      </RecebimentoSecaoExpansivel>

      <q-form greedy class="agro-formulario form-grid" @submit.prevent="salvar">
        <RecebimentoSecaoExpansivel
          v-model="secoes.gerais"
          titulo="Dados gerais"
          :subtitulo="subtituloGerais"
        >
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6 col-lg-4">
              <agro-select-cadastro
                v-model="fornecedorId"
                entidade="fornecedor"
                label="Fornecedor"
                :options="fornecedorOpcoes"
                :rules="[obrigatorio]"
                @atualizar="carregarFornecedores({ ativo: true })"
              />
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <q-input
                v-model="pedidoCompraId"
                outlined
                label="Pedido de compra (opcional)"
                readonly
                hint="Preenchido quando originado de um pedido"
              />
            </div>
            <div class="col-12 col-md-6 col-lg-4">
              <q-input v-model="chaveAcesso" outlined label="Chave de acesso" />
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-2">
              <q-input v-model="numeroNota" outlined label="Número da nota" />
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-2">
              <q-input v-model="serie" outlined label="Série" />
            </div>
            <div v-if="naturezaOperacao" class="col-12 col-md-6 col-lg-4">
              <q-input :model-value="naturezaOperacao" outlined readonly label="Natureza da operação" />
            </div>
            <div v-if="dataEmissao" class="col-12 col-md-6 col-lg-4">
              <q-input :model-value="dataEmissao" outlined readonly label="Data de emissão" />
            </div>
          </div>

          <div v-if="fornecedorNaoCadastrado" class="banner-faltantes" role="status">
            <div class="banner-faltantes__titulo">Fornecedor do XML não cadastrado nesta unidade</div>
            <p class="banner-faltantes__texto">
              {{ rotuloEmitente }} — cadastre para continuar o recebimento.
            </p>
            <agro-btn
              flat
              dense
              color="warning"
              label="Cadastrar fornecedor"
              descricao="Cadastrar fornecedor do XML"
              @click="dialogFornecedorAberto = true"
            />
          </div>
        </RecebimentoSecaoExpansivel>

        <RecebimentoSecaoExpansivel
          v-model="secoes.produtos"
          titulo="Produtos"
          :subtitulo="subtituloProdutos"
        >
          <div class="itens-toolbar">
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionarItem" />
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
                  @click="abrirCadastroRapido(item)"
                />
              </li>
            </ul>
          </div>

          <div class="itens-lista">
            <RecebimentoNfeItemCard
              v-for="(item, index) in itens"
              :key="item.chave"
              v-model:item="itens[index]"
              :indice="index + 1"
              modo="form"
              :produto-opcoes="produtoOpcoes"
              :pode-remover="itens.length > 1"
              @cadastrar="abrirCadastroRapido(item)"
              @remover="itens.splice(index, 1)"
              @atualizar-produtos="carregarProdutos({ ativo: true })"
            />
          </div>
        </RecebimentoSecaoExpansivel>

        <RecebimentoSecaoExpansivel
          v-if="parcelas.length > 0 || fatura"
          v-model="secoes.pagamentos"
          titulo="Pagamentos"
          :subtitulo="subtituloPagamentos"
        >
          <RecebimentoNfePagamentosCard
            embutido
            v-model:parcelas="parcelas"
            :fatura="fatura"
            :centro-custo-opcoes="centroCustoOpcoes"
            v-model:centro-custo-id="centroCustoId"
            v-model:plano-contas="planoContas"
          />
        </RecebimentoSecaoExpansivel>

        <RecebimentoSecaoExpansivel
          v-if="totais"
          v-model="secoes.totais"
          titulo="Totalizadores"
          subtitulo="Totais e tributos da NF-e"
        >
          <RecebimentoNfeTotaisCard embutido :totais="totais" />
        </RecebimentoSecaoExpansivel>

        <RecebimentoSecaoExpansivel
          v-if="mostrarComplementar"
          v-model="secoes.complementar"
          titulo="Informações complementares"
          subtitulo="Observações da NF e da entrada"
        >
          <q-input
            v-if="informacoesComplementares"
            :model-value="informacoesComplementares"
            outlined
            readonly
            type="textarea"
            autogrow
            label="Inf. complementar da NF"
            class="q-mb-md"
          />
          <q-input
            v-if="informacoesFisco"
            :model-value="informacoesFisco"
            outlined
            readonly
            type="textarea"
            autogrow
            label="Inf. ao fisco"
            class="q-mb-md"
          />
          <q-input
            v-model="informacaoComplementarEntrada"
            outlined
            type="textarea"
            autogrow
            label="Informação complementar da entrada"
          />
        </RecebimentoSecaoExpansivel>

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
    </section>

    <ProdutoRapidoDialog
      v-model="dialogProdutoAberto"
      :descricao-produto-xml="itemCadastroRapido?.descricaoProdutoXml"
      :codigo-produto-xml="itemCadastroRapido?.codigoProdutoXml"
      :preco-sugerido="precoSugeridoCadastro"
      :ncm-xml="itemCadastroRapido?.ncm"
      :cfop-xml="itemCadastroRapido?.cfop"
      :ean-xml="itemCadastroRapido?.ean"
      :unidade-xml="itemCadastroRapido?.unidade"
      @criado="onProdutoCriado"
    />

    <FornecedorRapidoDialog
      v-model="dialogFornecedorAberto"
      :emitente="emitente"
      @criado="onFornecedorCriado"
    />
  </q-page>
</template>

<script setup lang="ts">
import FornecedorRapidoDialog from 'components/compras/FornecedorRapidoDialog.vue';
import ProdutoRapidoDialog from 'components/compras/ProdutoRapidoDialog.vue';
import RecebimentoNfeItemCard, {
  type RecebimentoNfeItemFormModel,
} from 'components/compras/RecebimentoNfeItemCard.vue';
import RecebimentoNfePagamentosCard, {
  type ParcelaRecebimentoForm,
} from 'components/compras/RecebimentoNfePagamentosCard.vue';
import RecebimentoNfeTotaisCard from 'components/compras/RecebimentoNfeTotaisCard.vue';
import RecebimentoSecaoExpansivel from 'components/compras/RecebimentoSecaoExpansivel.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useCentrosCusto } from 'composables/useCentrosCusto';
import { useCompras } from 'composables/useCompras';
import { useFornecedores } from 'composables/useFornecedores';
import { useNotificacao } from 'composables/useNotificacao';
import { useProdutos } from 'composables/useProdutos';
import { useRecebimentosCompra } from 'composables/useRecebimentosCompra';
import { FormaPagamento } from 'constants/enums';
import type {
  PreviewRecebimentoXmlEmitenteDto,
  PreviewRecebimentoXmlFaturaDto,
  PreviewRecebimentoXmlTotaisDto,
} from 'types/dtos/compras.dto';
import type { FornecedorDto } from 'types/dtos/fornecedor.dto';
import type { ProdutoDto } from 'types/dtos/produto.dto';
import { formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface ItemForm extends RecebimentoNfeItemFormModel {
  chave: string;
}

const route = useRoute();
const router = useRouter();
const { salvando, previewXmlConteudo, criar, limparPreview } = useRecebimentosCompra();
const { receberPedido } = useCompras();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { centroOpcoes: centroCustoOpcoes, carregar: carregarCentros } = useCentrosCusto();
const { erro } = useNotificacao();

const arquivoXml = ref<File | null>(null);
const xmlConteudo = ref('');
const fornecedorId = ref('');
const pedidoCompraId = ref('');
const chaveAcesso = ref('');
const numeroNota = ref('');
const serie = ref('');
const naturezaOperacao = ref('');
const dataEmissao = ref('');
const emitente = ref<PreviewRecebimentoXmlEmitenteDto | null>(null);
const fatura = ref<PreviewRecebimentoXmlFaturaDto | null>(null);
const totais = ref<PreviewRecebimentoXmlTotaisDto | null>(null);
const informacoesComplementares = ref('');
const informacoesFisco = ref('');
const informacaoComplementarEntrada = ref('');
const centroCustoId = ref<string | null>(null);
const planoContas = ref('');
const parcelas = ref<ParcelaRecebimentoForm[]>([]);
const itens = ref<ItemForm[]>([criarItemVazio()]);
const dialogProdutoAberto = ref(false);
const dialogFornecedorAberto = ref(false);
const itemCadastroRapido = ref<ItemForm | null>(null);

const secoes = reactive({
  xml: true,
  gerais: true,
  produtos: true,
  pagamentos: true,
  totais: true,
  complementar: false,
});

const fornecedorOpcoes = computed(() =>
  fornecedores.value.map((f) => ({ label: f.razaoSocial, value: f.id })),
);
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({
    label: p.codigo ? `${p.descricao} (${p.codigo})` : p.descricao,
    value: p.id,
  })),
);
const fornecedorNaoCadastrado = computed(
  () => !fornecedorId.value && Boolean(emitente.value?.documento || emitente.value?.razaoSocial),
);
const rotuloEmitente = computed(() => {
  const e = emitente.value;
  if (!e) return '';
  return [e.razaoSocial, e.documento].filter(Boolean).join(' — ');
});
const itensSemProduto = computed(() =>
  itens.value.filter((item) => !item.produtoId && (!!item.codigoProdutoXml || !!item.descricaoProdutoXml)),
);
const precoSugeridoCadastro = computed(() => {
  const item = itemCadastroRapido.value;
  if (!item) return 0;
  return parseMascaraMoeda(item.custoUnitario) ?? 0;
});
const mostrarComplementar = computed(
  () =>
    Boolean(informacoesComplementares.value)
    || Boolean(informacoesFisco.value)
    || informacaoComplementarEntrada.value !== '',
);
const subtituloGerais = computed(() => {
  const partes: string[] = [];
  if (numeroNota.value) partes.push(`NF ${numeroNota.value}`);
  if (serie.value) partes.push(`série ${serie.value}`);
  return partes.join(' · ') || 'Fornecedor, chave e identificação da nota';
});
const subtituloProdutos = computed(() => {
  const base = `${itens.value.length} item(ns)`;
  if (itensSemProduto.value.length === 0) return base;
  return `${base} · ${itensSemProduto.value.length} sem cadastro`;
});
const subtituloPagamentos = computed(() => {
  if (parcelas.value.length === 0) return 'Fatura e condições de pagamento';
  return `${parcelas.value.length} parcela(s)`;
});

function criarItemVazio(): ItemForm {
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

function mapearFormaPagamento(tPag: string | null | undefined): string | null {
  if (!tPag) return null;
  if (tPag === 'Boleto' || tPag === 'Pix' || tPag === 'Dinheiro') return tPag;
  switch (tPag) {
    case '01':
      return FormaPagamento.Dinheiro;
    case '15':
    case '16':
      return FormaPagamento.Boleto;
    case '17':
      return FormaPagamento.Pix;
    case '18':
      return FormaPagamento.Transferencia;
    case '03':
    case '04':
      return FormaPagamento.Cartao;
    case '02':
      return FormaPagamento.Cheque;
    default:
      return FormaPagamento.Outros;
  }
}

function rotuloItemXml(item: ItemForm): string {
  const codigo = item.codigoProdutoXml?.trim();
  const descricao = item.descricaoProdutoXml?.trim();
  if (codigo && descricao) return `${codigo} — ${descricao}`;
  return descricao || codigo || 'Item sem identificação';
}

function rotuloItemXmlCurto(item: ItemForm): string {
  const completo = rotuloItemXml(item);
  if (completo.length <= 80) return completo;
  return `${completo.slice(0, 77)}...`;
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
  if (item) item.produtoId = produto.id;
  itemCadastroRapido.value = null;
}

async function onFornecedorCriado(fornecedor: FornecedorDto): Promise<void> {
  await carregarFornecedores({ ativo: true });
  fornecedorId.value = fornecedor.id;
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

  fornecedorId.value = preview.fornecedorId ?? '';
  emitente.value = preview.emitente;
  chaveAcesso.value = preview.chaveAcesso ?? '';
  numeroNota.value = preview.numeroNota ?? '';
  serie.value = preview.serie ?? '';
  naturezaOperacao.value = preview.naturezaOperacao ?? '';
  dataEmissao.value = preview.dataEmissao ?? '';
  fatura.value = preview.fatura;
  totais.value = preview.totais;
  informacoesComplementares.value = preview.informacoesComplementares ?? '';
  informacoesFisco.value = preview.informacoesFisco ?? '';
  informacaoComplementarEntrada.value = preview.informacoesComplementares ?? '';

  const formaPadrao = mapearFormaPagamento(
    preview.duplicatas[0]?.formaPagamento ?? preview.pagamentos[0]?.formaPagamento,
  );

  itens.value = preview.itens.map((item) => ({
    chave: crypto.randomUUID(),
    produtoId: item.produtoId ?? '',
    codigoProdutoXml: item.codigoProdutoXml,
    descricaoProdutoXml: item.descricaoProdutoXml ?? '',
    ncm: item.ncm ?? '',
    cfop: item.cfop ?? '',
    unidade: item.unidade ?? '',
    ean: item.ean ?? '',
    origem: item.tributacao?.origem ?? '',
    cstIcms: item.tributacao?.cstIcms ?? '',
    csosn: item.tributacao?.csosn ?? '',
    baseIcms: item.tributacao?.baseIcms ?? null,
    aliquotaIcms: item.tributacao?.aliquotaIcms ?? null,
    valorIcms: item.tributacao?.valorIcms ?? null,
    valorIcmsDesonerado: item.tributacao?.valorIcmsDesonerado ?? null,
    cstIpi: item.tributacao?.cstIpi ?? '',
    valorIpi: item.tributacao?.valorIpi ?? null,
    cstPis: item.tributacao?.cstPis ?? '',
    cstCofins: item.tributacao?.cstCofins ?? '',
    baseDifal: item.tributacao?.baseDifal ?? null,
    valorDifal: item.tributacao?.valorDifal ?? null,
    valorTotal: item.valorTotal ?? null,
    informacaoAdicional: item.informacaoAdicional ?? '',
    quantidadeNota: String(item.quantidade),
    quantidadeRecebida: String(item.quantidade),
    custoUnitario: formatarMoedaParaInput(item.custoUnitario),
    numeroLote: item.numeroLote ?? '',
    dataValidade: item.dataValidade ?? '',
    tipoCusto: null,
    margemLucro: '',
    precoVenda: '',
  }));

  if (itens.value.length === 0) itens.value = [criarItemVazio()];

  parcelas.value = preview.duplicatas.map((d) => ({
    chave: crypto.randomUUID(),
    numero: d.numero ?? '',
    vencimento: d.vencimento,
    valor: formatarMoedaParaInput(d.valor),
    formaPagamento: mapearFormaPagamento(d.formaPagamento) ?? formaPadrao,
    centroCustoId: d.centroCustoId ?? null,
    planoContas: d.planoContas ?? '',
  }));

  secoes.gerais = true;
  secoes.produtos = true;
  secoes.pagamentos = true;
  secoes.totais = true;
}

async function salvar(): Promise<void> {
  if (fornecedorNaoCadastrado.value) {
    erro('Cadastre o fornecedor do XML antes de criar o recebimento.');
    return;
  }

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
  void carregarCentros();
  const pedidoId = route.query.pedidoCompraId;
  if (typeof pedidoId === 'string' && pedidoId) {
    pedidoCompraId.value = pedidoId;
    const recebimento = await receberPedido(pedidoId);
    if (recebimento) {
      await router.replace({
        name: 'recebimento-compra-detalhe',
        params: { id: recebimento.id },
      });
    }
  }
});
</script>

<style scoped>
.form-grid {
  display: grid;
  gap: var(--spacing-4);
}
.itens-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-3);
}
.itens-lista {
  display: grid;
  gap: var(--spacing-4);
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
