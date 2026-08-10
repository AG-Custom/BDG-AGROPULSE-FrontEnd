<template>
  <q-page class="agro-page agro-page--form-xl">
    <app-page-header titulo="Recebimento de compra" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="podeEditar"
          color="primary"
          unelevated
          label="Salvar conferência"
          descricao="Atualizar quantidades conferidas"
          :loading="salvando"
          @click="salvarItens"
        />
        <agro-btn
          v-if="podeEditar"
          unelevated
          label="Divergência"
          descricao="Registrar divergência"
          @click="dialogDivergencia = true"
        />
        <agro-btn
          v-if="podeEditar"
          color="positive"
          unelevated
          label="Confirmar"
          descricao="Confirmar recebimento"
          :loading="salvando"
          @click="confirmarRecebimento"
        />
      </div>
    </app-page-header>

    <section class="agro-section detalhe">
      <agro-form-skeleton v-if="carregando && !recebimento" :campos="6" />
      <template v-else-if="recebimento">
        <RecebimentoSecaoExpansivel
          v-model="secoes.gerais"
          titulo="Dados gerais"
          :subtitulo="subtituloGerais"
        >
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-3 col-lg-2">
              <div class="text-caption">Status</div>
              <agro-badge :label="rotuloStatus(recebimento.status)" variant="default" />
            </div>
            <div class="col-6 col-md-3 col-lg-3">
              <div class="text-caption">Fornecedor</div>
              <div>{{ rotuloFornecedor(recebimento.fornecedorId) }}</div>
            </div>
            <div class="col-6 col-md-2 col-lg-2">
              <div class="text-caption">Origem</div>
              <div>{{ recebimento.origem }}</div>
            </div>
            <div class="col-6 col-md-2 col-lg-1">
              <div class="text-caption">NF-e</div>
              <div class="text-metric">{{ recebimento.numeroNota || '—' }}</div>
            </div>
            <div class="col-6 col-md-2 col-lg-1">
              <div class="text-caption">Série</div>
              <div class="text-metric">{{ recebimento.serie || '—' }}</div>
            </div>
            <div class="col-12 col-lg-3">
              <div class="text-caption">Chave de acesso</div>
              <div class="text-metric chave">{{ recebimento.chaveAcesso || '—' }}</div>
            </div>
          </div>
        </RecebimentoSecaoExpansivel>

        <RecebimentoSecaoExpansivel
          v-model="secoes.produtos"
          titulo="Produtos"
          :subtitulo="`${itensForm.length} item(ns) na conferência`"
        >
          <div class="itens-lista">
            <RecebimentoNfeItemCard
              v-for="(item, index) in itensForm"
              :key="item.itemId"
              v-model:item="itensForm[index]"
              :indice="index + 1"
              modo="detalhe"
              :produto-label="rotuloProduto(item.produtoId)"
              :readonly="!podeEditar"
              :mostrar-precificacao="podeEditar"
              @margem-change="onMargemChange(item)"
              @preco-change="onPrecoChange(item)"
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
            :readonly="!podeEditar"
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
            :readonly="!podeEditar"
          />
        </RecebimentoSecaoExpansivel>

        <RecebimentoSecaoExpansivel
          v-model="secoes.divergencias"
          titulo="Divergências"
          :subtitulo="subtituloDivergencias"
        >
          <empty-state
            v-if="recebimento.divergencias.length === 0"
            titulo="Sem divergências"
            descricao="Nenhuma divergência registrada neste recebimento."
            icon="check_circle"
          />
          <q-table
            v-else
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="recebimento.divergencias"
            :columns="colunasDivergencias"
            :pagination="{ rowsPerPage: 0 }"
          />
        </RecebimentoSecaoExpansivel>
      </template>

      <div class="agro-form-actions">
        <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'recebimentos-compra' }" />
      </div>
    </section>

    <q-dialog v-model="dialogDivergencia" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Registrar divergência</h4></q-card-section>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12">
            <q-input v-model="divergencia.tipo" outlined label="Tipo" />
          </div>
          <div class="col-12">
            <q-input v-model="divergencia.descricao" outlined label="Descrição" type="textarea" autogrow />
          </div>
          <div class="col-6">
            <q-input v-model="divergencia.quantidadeEsperada" outlined label="Qtd esperada" type="number" />
          </div>
          <div class="col-6">
            <q-input v-model="divergencia.quantidadeInformada" outlined label="Qtd informada" type="number" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogDivergencia = false" />
          <agro-btn
            color="primary"
            unelevated
            label="Registrar"
            descricao="Registrar divergência"
            :loading="salvando"
            @click="salvarDivergencia"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import RecebimentoNfeItemCard, {
  type RecebimentoNfeItemFormModel,
} from 'components/compras/RecebimentoNfeItemCard.vue';
import RecebimentoNfePagamentosCard, {
  type ParcelaRecebimentoForm,
} from 'components/compras/RecebimentoNfePagamentosCard.vue';
import RecebimentoNfeTotaisCard from 'components/compras/RecebimentoNfeTotaisCard.vue';
import RecebimentoSecaoExpansivel from 'components/compras/RecebimentoSecaoExpansivel.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCentrosCusto } from 'composables/useCentrosCusto';
import { useFornecedores } from 'composables/useFornecedores';
import { useProdutos } from 'composables/useProdutos';
import { useRecebimentosCompra } from 'composables/useRecebimentosCompra';
import { FormaPagamento, RecebimentoCompraStatusOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  PreviewRecebimentoXmlFaturaDto,
  PreviewRecebimentoXmlTotaisDto,
  RecebimentoCompraDivergenciaDto,
} from 'types/dtos/compras.dto';
import { formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface ItemForm extends RecebimentoNfeItemFormModel {
  itemId: string;
}

const route = useRoute();
const router = useRouter();
const {
  recebimento,
  carregando,
  salvando,
  obter,
  atualizarItens,
  registrarDivergencia,
  confirmar,
} = useRecebimentosCompra();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { centroOpcoes: centroCustoOpcoes, carregar: carregarCentros } = useCentrosCusto();

const dialogDivergencia = ref(false);
const itensForm = ref<ItemForm[]>([]);
const parcelas = ref<ParcelaRecebimentoForm[]>([]);
const fatura = ref<PreviewRecebimentoXmlFaturaDto | null>(null);
const totais = ref<PreviewRecebimentoXmlTotaisDto | null>(null);
const informacoesComplementares = ref('');
const informacoesFisco = ref('');
const informacaoComplementarEntrada = ref('');
const centroCustoId = ref<string | null>(null);
const planoContas = ref('');
const divergencia = reactive({
  tipo: 'Quantidade',
  descricao: '',
  quantidadeEsperada: '',
  quantidadeInformada: '',
});
const secoes = reactive({
  gerais: true,
  produtos: true,
  pagamentos: true,
  totais: false,
  complementar: false,
  divergencias: false,
});

const id = computed(() => route.params.id as string);
const podeEditar = computed(() => recebimento.value?.status === 'EmConferencia');
const subtitulo = computed(() =>
  recebimento.value ? `Status: ${rotuloStatus(recebimento.value.status)}` : 'Carregando...',
);
const subtituloGerais = computed(() => {
  const r = recebimento.value;
  if (!r) return '';
  const partes: string[] = [];
  if (r.numeroNota) partes.push(`NF ${r.numeroNota}`);
  if (r.serie) partes.push(`série ${r.serie}`);
  return partes.join(' · ') || 'Identificação do recebimento';
});
const subtituloPagamentos = computed(() => {
  if (parcelas.value.length === 0) return 'Fatura e condições de pagamento';
  return `${parcelas.value.length} parcela(s)`;
});
const subtituloDivergencias = computed(() => {
  const total = recebimento.value?.divergencias.length ?? 0;
  return total === 0 ? 'Nenhuma registrada' : `${total} registrada(s)`;
});
const mostrarComplementar = computed(
  () =>
    Boolean(informacoesComplementares.value)
    || Boolean(informacoesFisco.value)
    || Boolean(podeEditar.value)
    || informacaoComplementarEntrada.value !== '',
);

const mapaFornecedores = computed(() => {
  const m = new Map<string, string>();
  for (const f of fornecedores.value) m.set(f.id, f.razaoSocial);
  return m;
});
const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const colunasDivergencias: QTableColumn<RecebimentoCompraDivergenciaDto>[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'quantidadeEsperada', label: 'Esperada', field: 'quantidadeEsperada', align: 'right' },
  { name: 'quantidadeInformada', label: 'Informada', field: 'quantidadeInformada', align: 'right' },
];

function rotuloFornecedor(fid: string): string {
  return mapaFornecedores.value.get(fid) ?? fid;
}
function rotuloProduto(pid: string): string {
  return mapaProdutos.value.get(pid) ?? pid;
}
function rotuloStatus(status: string): string {
  return RecebimentoCompraStatusOpcoes.find((o) => o.value === status)?.label ?? status;
}

function mapearFormaPagamento(tPag: string | null | undefined): string | null {
  if (!tPag) return null;
  if (['Boleto', 'Pix', 'Dinheiro', 'Cartao', 'Transferencia', 'Cheque', 'Outros'].includes(tPag)) {
    return tPag;
  }
  switch (tPag) {
    case '01':
      return FormaPagamento.Dinheiro;
    case '15':
    case '16':
      return FormaPagamento.Boleto;
    case '17':
      return FormaPagamento.Pix;
    default:
      return FormaPagamento.Outros;
  }
}

function sincronizarDadosNfe(): void {
  const nfe = recebimento.value?.dadosNfe;
  fatura.value = nfe?.fatura ?? null;
  totais.value = nfe?.totais ?? null;
  informacoesComplementares.value = nfe?.informacoesComplementares ?? '';
  informacoesFisco.value = nfe?.informacoesFisco ?? '';
  if (!informacaoComplementarEntrada.value) {
    informacaoComplementarEntrada.value = nfe?.informacoesComplementares ?? '';
  }

  const formaPadrao = mapearFormaPagamento(
    nfe?.duplicatas?.[0]?.formaPagamento ?? nfe?.pagamentos?.[0]?.formaPagamento,
  );

  parcelas.value = (nfe?.duplicatas ?? []).map((d) => ({
    chave: crypto.randomUUID(),
    numero: d.numero ?? '',
    vencimento: d.vencimento,
    valor: formatarMoedaParaInput(d.valor),
    formaPagamento: mapearFormaPagamento(d.formaPagamento) ?? formaPadrao,
    centroCustoId: d.centroCustoId ?? null,
    planoContas: d.planoContas ?? '',
  }));
}

function sincronizarItens(): void {
  const nfeItens = recebimento.value?.dadosNfe?.itens ?? [];
  itensForm.value = (recebimento.value?.itens ?? []).map((item, index) => {
    const nfe = nfeItens.find((candidato) => candidato.codigoProdutoXml === item.codigoProdutoXml)
      ?? nfeItens[index];
    const produto = produtos.value.find((p) => p.id === item.produtoId);
    const custo = item.custoUnitario;
    const margem = produto?.margemMinimaPercentual ?? null;
    const preco =
      produto?.precoVenda
      ?? (margem != null ? custo * (1 + margem / 100) : custo);

    return {
      itemId: item.id,
      produtoId: item.produtoId,
      codigoProdutoXml: item.codigoProdutoXml ?? nfe?.codigoProdutoXml ?? '',
      descricaoProdutoXml: nfe?.descricaoProdutoXml ?? '',
      ncm: nfe?.ncm ?? '',
      cfop: nfe?.cfop ?? '',
      unidade: nfe?.unidade ?? '',
      ean: nfe?.ean ?? '',
      origem: nfe?.tributacao?.origem ?? '',
      cstIcms: nfe?.tributacao?.cstIcms ?? '',
      csosn: nfe?.tributacao?.csosn ?? '',
      baseIcms: nfe?.tributacao?.baseIcms ?? null,
      aliquotaIcms: nfe?.tributacao?.aliquotaIcms ?? null,
      valorIcms: nfe?.tributacao?.valorIcms ?? null,
      valorIcmsDesonerado: nfe?.tributacao?.valorIcmsDesonerado ?? null,
      cstIpi: nfe?.tributacao?.cstIpi ?? '',
      valorIpi: nfe?.tributacao?.valorIpi ?? null,
      cstPis: nfe?.tributacao?.cstPis ?? '',
      cstCofins: nfe?.tributacao?.cstCofins ?? '',
      baseDifal: nfe?.tributacao?.baseDifal ?? null,
      valorDifal: nfe?.tributacao?.valorDifal ?? null,
      valorTotal: nfe?.valorTotal ?? null,
      informacaoAdicional: nfe?.informacaoAdicional ?? '',
      quantidadeNota: String(item.quantidadeNota),
      quantidadeRecebida: String(item.quantidadeRecebida),
      custoUnitario: formatarMoedaParaInput(item.custoUnitario),
      numeroLote: item.numeroLote ?? '',
      dataValidade: item.dataValidade ?? '',
      tipoCusto: null,
      margemLucro: margem != null ? String(margem) : '',
      precoVenda: formatarMoedaParaInput(preco),
    };
  });
}

function onMargemChange(item: ItemForm): void {
  const custo = parseMascaraMoeda(item.custoUnitario) ?? 0;
  const margem = Number(item.margemLucro);
  if (!Number.isFinite(margem) || custo <= 0) return;
  item.precoVenda = formatarMoedaParaInput(custo * (1 + margem / 100));
}

function onPrecoChange(item: ItemForm): void {
  const custo = parseMascaraMoeda(item.custoUnitario) ?? 0;
  const preco = parseMascaraMoeda(item.precoVenda) ?? 0;
  if (custo <= 0 || preco <= 0) return;
  item.margemLucro = String((((preco / custo) - 1) * 100).toFixed(2));
}

watch(recebimento, () => {
  sincronizarItens();
  sincronizarDadosNfe();
}, { immediate: true });

watch(produtos, sincronizarItens);

async function salvarItens(): Promise<void> {
  await atualizarItens(id.value, {
    itens: itensForm.value.map((item) => ({
      itemId: item.itemId,
      quantidadeRecebida: Number(item.quantidadeRecebida),
      numeroLote: item.numeroLote.trim() || null,
      dataValidade: item.dataValidade || null,
      custoUnitario: parseMascaraMoeda(item.custoUnitario) ?? 0,
    })),
  });
}

async function salvarDivergencia(): Promise<void> {
  const ok = await registrarDivergencia(id.value, {
    tipo: divergencia.tipo.trim() || 'Quantidade',
    descricao: divergencia.descricao.trim(),
    quantidadeEsperada: divergencia.quantidadeEsperada
      ? Number(divergencia.quantidadeEsperada)
      : null,
    quantidadeInformada: divergencia.quantidadeInformada
      ? Number(divergencia.quantidadeInformada)
      : null,
  });
  if (ok) dialogDivergencia.value = false;
}

async function confirmarRecebimento(): Promise<void> {
  await salvarItens();
  await confirmar(id.value, {
    duplicatas: parcelas.value.map((p) => ({
      numero: p.numero.trim() || null,
      vencimento: p.vencimento,
      valor: parseMascaraMoeda(p.valor) ?? 0,
      formaPagamento: p.formaPagamento,
      centroCustoId: p.centroCustoId ?? centroCustoId.value,
      planoContas: p.planoContas.trim() || planoContas.value,
    })),
    precificacoes: itensForm.value
      .filter((i) => i.precoVenda || i.margemLucro || i.tipoCusto)
      .map((i) => ({
        produtoId: i.produtoId,
        tipoCusto: i.tipoCusto,
        custoUnitario: parseMascaraMoeda(i.custoUnitario),
        margemLucroPercentual: i.margemLucro ? Number(i.margemLucro) : null,
        precoVenda: parseMascaraMoeda(i.precoVenda),
      })),
    informacaoComplementarEntrada: informacaoComplementarEntrada.value.trim() || null,
    centroCustoId: centroCustoId.value,
    planoContas: planoContas.value.trim() || null,
  });
}

onMounted(async () => {
  void carregarFornecedores();
  void carregarProdutos();
  void carregarCentros();
  const ok = await obter(id.value);
  if (!ok) await router.replace({ name: 'recebimentos-compra' });
});
</script>

<style scoped>
.detalhe {
  display: grid;
  gap: var(--spacing-4);
}
.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
.itens-lista {
  display: grid;
  gap: var(--spacing-4);
}
.chave {
  word-break: break-all;
}
.titulo {
  margin: 0 0 var(--spacing-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.dialog {
  min-width: min(440px, 90vw);
}
</style>
