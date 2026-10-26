<template>
  <article
    class="item-card"
    :class="{
      'item-card--alerta': !produtoVinculado && modo === 'form' && !embutido,
      'item-card--revisao': produtoVinculado && divergencias.length > 0 && !embutido,
      'item-card--embutido': embutido,
    }"
  >
    <div v-if="embutido" class="item-card__status">
      <agro-badge
        :label="produtoVinculado ? 'Vinculado' : 'Sem cadastro'"
        :variant="produtoVinculado ? 'success' : 'warning'"
      />
      <agro-badge
        v-if="divergencias.length > 0"
        label="Revisar fiscal"
        variant="warning"
      />
      <agro-btn
        v-if="modo === 'form' && !produtoVinculado"
        flat
        dense
        color="warning"
        label="Cadastrar"
        descricao="Cadastrar produto do XML"
        @click="emit('cadastrar')"
      />
    </div>

    <q-tabs
      v-if="embutido"
      v-model="aba"
      dense
      align="left"
      no-caps
      active-color="primary"
      indicator-color="primary"
      class="item-card__abas"
    >
      <q-tab name="fiscal" label="Fiscal" :alert="divergencias.length > 0 ? 'warning' : false" />
      <q-tab name="item" label="Item" />
      <q-tab name="nota" label="Dados da nota" />
    </q-tabs>

    <div v-show="embutido ? aba === 'fiscal' : divergencias.length > 0" class="item-card__painel">
    <section v-if="divergencias.length > 0" class="revisao-fiscal" role="status">
      <p class="revisao-fiscal__titulo">Dados fiscais da nota diferem do cadastro</p>
      <div v-if="podeEditarFiscal" class="revisao-fiscal__campos">
        <q-input
          v-for="diferenca in divergencias"
          :key="diferenca.campo"
          outlined
          :label="diferenca.rotulo"
          :model-value="valorCampoNota(diferenca.campo)"
          :hint="`Cadastro: ${diferenca.valorCadastro || 'não cadastrado'}`"
          class="campo-divergente"
          @update:model-value="definirCampoNota(diferenca.campo, $event)"
        />
      </div>
      <ul v-else class="revisao-fiscal__lista">
        <li v-for="diferenca in divergencias" :key="diferenca.campo">
          <span class="revisao-fiscal__rotulo">{{ diferenca.rotulo }}</span>
          nota <span class="text-metric">{{ diferenca.valorNota }}</span>
          · cadastro <span class="text-metric">{{ diferenca.valorCadastro || 'não cadastrado' }}</span>
        </li>
      </ul>
      <div v-if="podeEditarFiscal && produtoVinculado" class="revisao-fiscal__acoes">
        <agro-btn
          color="primary"
          unelevated
          label="Atualizar cadastro"
          descricao="Gravar os dados fiscais da nota no produto"
          :loading="atualizandoFiscal"
          @click="emit('atualizarFiscal')"
        />
      </div>
    </section>

    <section v-if="embutido && camposTributacaoPainel.length > 0" class="item-card__secao">
      <h4 class="item-card__secao-titulo">
        {{ divergencias.length > 0 ? 'Demais tributos da nota' : 'Tributação da nota' }}
      </h4>
      <div class="trib-grid">
        <div
          v-for="campo in camposTributacaoPainel"
          :key="campo.label"
          class="trib-item"
          :class="{ 'trib-item--divergente': campo.divergente }"
        >
          <span class="trib-item__label">{{ campo.label }}</span>
          <span class="trib-item__valor text-metric">{{ campo.valor }}</span>
          <span v-if="campo.cadastro" class="trib-item__cadastro">Cadastro: {{ campo.cadastro }}</span>
        </div>
      </div>
    </section>
    <p v-else-if="embutido && divergencias.length === 0" class="item-card__vazio">
      Nenhum dado fiscal neste item.
    </p>
    </div>

    <header v-if="!embutido" class="item-card__header">
      <div class="item-card__ident">
        <span class="item-card__indice text-metric">{{ String(indice).padStart(2, '0') }}</span>
        <div class="item-card__titulo">
          <p class="item-card__nome">{{ tituloPrincipal }}</p>
          <p v-if="subtituloXml" class="item-card__sub">{{ subtituloXml }}</p>
        </div>
      </div>
      <div class="item-card__acoes">
        <agro-badge
          :label="produtoVinculado ? 'Vinculado' : 'Sem cadastro'"
          :variant="produtoVinculado ? 'success' : 'warning'"
        />
        <agro-badge
          v-if="divergencias.length > 0"
          label="Revisar fiscal"
          variant="warning"
        />
        <agro-btn
          v-if="modo === 'form' && !produtoVinculado"
          flat
          dense
          color="warning"
          label="Cadastrar"
          descricao="Cadastrar produto do XML"
          @click="emit('cadastrar')"
        />
        <agro-btn
          v-if="modo === 'form' && podeRemover && !embutido"
          flat
          round
          dense
          icon="delete"
          color="negative"
          descricao="Remover item"
          @click="emit('remover')"
        />
      </div>
    </header>

    <div v-show="!embutido || aba === 'nota'" class="item-card__painel">
    <div v-if="modo === 'form'" class="item-card__meta item-card__meta--form">
      <q-input v-model="item.codigoProdutoXml" outlined dense label="Cód. XML" />
      <q-input v-model="item.descricaoProdutoXml" outlined dense label="Descrição XML" />
      <q-input v-model="item.ncm" outlined dense label="NCM" />
      <q-input v-model="item.cfop" outlined dense label="CFOP" />
      <q-input v-model="item.unidade" outlined dense label="UN" />
      <q-input v-model="item.ean" outlined dense label="EAN" />
    </div>
    <div v-else class="item-card__meta">
      <div
        v-for="chip in chipsMeta"
        :key="chip.label"
        class="meta-chip"
        :class="{ 'meta-chip--divergente': chip.divergente }"
      >
        <span class="meta-chip__label">{{ chip.label }}</span>
        <span class="meta-chip__valor text-metric">{{ chip.valor }}</span>
        <span v-if="chip.cadastro" class="meta-chip__cadastro">Cadastro: {{ chip.cadastro }}</span>
      </div>
    </div>
    </div>

    <div v-show="!embutido || aba === 'item'" class="item-card__painel">
    <section v-if="modo === 'form'" class="item-card__secao">
      <h4 class="item-card__secao-titulo">Produto no sistema</h4>
      <agro-select-cadastro
        v-model="item.produtoId"
        entidade="produto"
        label="Produto"
        :options="produtoOpcoes"
        :hint="hintProduto"
        :rules="[obrigatorio]"
        @atualizar="emit('atualizarProdutos')"
      />
    </section>
    <section v-else class="item-card__secao">
      <h4 class="item-card__secao-titulo">Produto no sistema</h4>
      <p class="item-card__produto-nome">{{ produtoLabel || '—' }}</p>
    </section>

    <section class="item-card__secao">
      <h4 class="item-card__secao-titulo">Quantidade e custo</h4>
      <div class="item-card__grid item-card__grid--4">
        <q-input
          v-model="item.quantidadeNota"
          outlined
          label="Qtd. NF"
          type="number"
          :readonly="modo === 'detalhe'"
        />
        <q-input
          v-model="item.quantidadeRecebida"
          outlined
          label="Qtd. recebida"
          type="number"
          hint="Unidade da nota"
          :readonly="readonly"
        />
        <AgroMoneyInput v-model="item.custoUnitario" label="Custo unitário" :readonly="readonly" />
        <div class="metric-box">
          <span class="metric-box__label">Total linha</span>
          <span class="metric-box__valor text-metric">{{ totalLinha }}</span>
        </div>
      </div>
      <div class="item-card__grid item-card__grid--4">
        <q-input
          outlined
          readonly
          label="Fator divisão"
          class="text-metric"
          hint="Quantidade da nota × fator"
          :model-value="fatorDivisaoExibido"
        />
        <q-input
          outlined
          readonly
          label="Qtd. estoque"
          class="text-metric"
          :model-value="quantidadeEstoqueExibida"
        />
        <q-input
          outlined
          readonly
          label="Custo estoque"
          class="text-metric"
          :model-value="custoEstoqueExibido"
        />
        <q-input
          outlined
          readonly
          label="Marca no XML"
          :model-value="item.marcaXml || '—'"
        />
      </div>
    </section>

    <section class="item-card__secao">
      <h4 class="item-card__secao-titulo">Lote e validade</h4>
      <div class="item-card__grid item-card__grid--3">
        <q-input v-model="item.numeroLote" outlined label="Lote" :readonly="readonly" />
        <q-input
          v-model="item.dataValidade"
          outlined
          type="date"
          label="Validade / fabricação"
          :readonly="readonly"
        />
        <q-input
          v-if="modo === 'form' || item.informacaoAdicional"
          v-model="item.informacaoAdicional"
          outlined
          label="Info. adicional do item"
          :readonly="readonly || modo === 'detalhe'"
        />
      </div>
    </section>

    <section v-if="mostrarPrecificacao" class="item-card__secao item-card__secao--destaque">
      <h4 class="item-card__secao-titulo">Alterar preço de venda</h4>
      <div class="item-card__grid item-card__grid--3">
        <q-select
          v-model="item.tipoCusto"
          outlined
          emit-value
          map-options
          clearable
          label="Tipo de custo"
          :options="MetodoCusteioOpcoes"
          :readonly="readonly"
        />
        <q-input
          v-model="item.margemLucro"
          outlined
          label="Margem de lucro (%)"
          type="number"
          :readonly="readonly"
          @update:model-value="emit('margemChange')"
        />
        <AgroMoneyInput
          v-model="item.precoVenda"
          label="Preço de venda"
          :readonly="readonly"
          @update:model-value="emit('precoChange')"
        />
      </div>
    </section>

    <section v-if="!embutido && camposTributacaoPainel.length > 0" class="item-card__secao">
      <h4 class="item-card__secao-titulo">
        {{ divergencias.length > 0 ? 'Demais tributos da nota' : 'Tributação da nota' }}
      </h4>
      <div class="trib-grid">
        <div v-for="campo in camposTributacaoPainel" :key="campo.label" class="trib-item">
          <span class="trib-item__label">{{ campo.label }}</span>
          <span class="trib-item__valor text-metric">{{ campo.valor }}</span>
        </div>
      </div>
    </section>
    </div>
  </article>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { MetodoCusteioOpcoes } from 'constants/enums';
import type { DivergenciaFiscalEntradaDto } from 'types/dtos/compras.dto';
import { formatarDecimal, formatarMoeda, parseMascaraMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, ref, watch } from 'vue';

export interface RecebimentoNfeItemFormModel {
  produtoId: string;
  codigoProdutoXml: string;
  descricaoProdutoXml: string;
  ncm: string;
  cest: string;
  cfop: string;
  unidade: string;
  unidadeMedidaId: string;
  ean: string;
  origem: string;
  cstIcms: string;
  csosn: string;
  baseIcms: number | null;
  aliquotaIcms: number | null;
  valorIcms: number | null;
  valorIcmsDesonerado: number | null;
  cstIpi: string;
  valorIpi: number | null;
  cstPis: string;
  cstCofins: string;
  baseDifal: number | null;
  valorDifal: number | null;
  valorTotal: number | null;
  informacaoAdicional: string;
  quantidadeNota: string;
  quantidadeRecebida: string;
  custoUnitario: string;
  fatorDivisaoNfe: number;
  quantidadeEstoque: number | null;
  custoUnitarioEstoque: number | null;
  marcaXml: string;
  divergenciasFiscais: DivergenciaFiscalEntradaDto[];
  numeroLote: string;
  dataValidade: string;
  tipoCusto: string | null;
  margemLucro: string;
  precoVenda: string;
}

const props = withDefaults(
  defineProps<{
    indice: number;
    modo: 'form' | 'detalhe';
    produtoOpcoes?: Array<{ label: string; value: string }>;
    produtoLabel?: string;
    readonly?: boolean;
    podeRemover?: boolean;
    mostrarPrecificacao?: boolean;
    embutido?: boolean;
    atualizandoFiscal?: boolean;
  }>(),
  {
    produtoOpcoes: () => [],
    produtoLabel: '',
    readonly: false,
    podeRemover: true,
    mostrarPrecificacao: false,
    embutido: false,
    atualizandoFiscal: false,
  },
);

const item = defineModel<RecebimentoNfeItemFormModel>('item', { required: true });
const aba = ref<'fiscal' | 'item' | 'nota'>('item');

watch(
  () => `${props.indice}|${item.value.codigoProdutoXml}|${item.value.descricaoProdutoXml}`,
  () => {
    aba.value = item.value.divergenciasFiscais.length > 0 ? 'fiscal' : 'item';
  },
  { immediate: true },
);

const emit = defineEmits<{
  cadastrar: [];
  remover: [];
  atualizarProdutos: [];
  margemChange: [];
  precoChange: [];
  atualizarFiscal: [];
}>();

const produtoVinculado = computed(() => Boolean(item.value.produtoId));
const podeEditarFiscal = computed(() => props.modo === 'form' || !props.readonly);

const tituloPrincipal = computed(() => {
  if (props.modo === 'detalhe' && props.produtoLabel) {
    return props.produtoLabel;
  }
  return (
    item.value.descricaoProdutoXml?.trim()
    || item.value.codigoProdutoXml?.trim()
    || `Item ${props.indice}`
  );
});

const subtituloXml = computed(() => {
  const partes = [
    item.value.codigoProdutoXml ? `Cód. XML ${item.value.codigoProdutoXml}` : null,
    item.value.ean ? `EAN ${item.value.ean}` : null,
  ].filter(Boolean);
  if (props.modo === 'detalhe' && item.value.descricaoProdutoXml) {
    partes.unshift(item.value.descricaoProdutoXml);
  }
  return partes.join(' · ');
});

const hintProduto = computed(() => {
  if (!item.value.codigoProdutoXml && !item.value.descricaoProdutoXml) {
    return undefined;
  }
  if (!item.value.produtoId) {
    return 'Produto do XML não encontrado — cadastre ou selecione';
  }
  return undefined;
});

const fatorDivisaoExibido = computed(() => formatarDecimal(item.value.fatorDivisaoNfe || 1, 4));

const quantidadeEstoqueExibida = computed(() =>
  item.value.quantidadeEstoque == null ? '—' : formatarDecimal(item.value.quantidadeEstoque, 4),
);

const custoEstoqueExibido = computed(() =>
  item.value.custoUnitarioEstoque == null ? '—' : formatarMoeda(item.value.custoUnitarioEstoque),
);

const totalLinha = computed(() => {
  if (item.value.valorTotal != null) {
    return formatarMoeda(item.value.valorTotal);
  }
  const qtd = Number(item.value.quantidadeNota);
  const custo = parseMascaraMoeda(item.value.custoUnitario) ?? 0;
  if (!Number.isFinite(qtd) || qtd <= 0) {
    return '—';
  }
  return formatarMoeda(qtd * custo);
});

const temTributacao = computed(
  () =>
    Boolean(
      item.value.origem
      || item.value.cest
      || item.value.cstIcms
      || item.value.csosn
      || item.value.aliquotaIcms != null
      || item.value.valorIcms != null
      || item.value.valorIcmsDesonerado != null
      || item.value.cstIpi
      || item.value.cstPis
      || item.value.valorDifal != null
      || (item.value.divergenciasFiscais?.length ?? 0) > 0,
    ),
);

function moeda(valor: number | null | undefined): string {
  return valor == null ? '—' : formatarMoeda(valor);
}

function percentual(valor: number | null | undefined): string {
  return valor == null ? '—' : `${valor}%`;
}

const divergencias = computed(() => item.value.divergenciasFiscais ?? []);

function divergenciaDe(campo: string): DivergenciaFiscalEntradaDto | undefined {
  return divergencias.value.find((diferenca) => diferenca.campo === campo);
}

function valorCampoNota(campo: string): string {
  if (campo === 'ncm') return item.value.ncm;
  if (campo === 'cest') return item.value.cest;
  if (campo === 'origem') return item.value.origem;
  if (campo === 'cstIcms') return item.value.cstIcms;
  if (campo === 'csosn') return item.value.csosn;
  if (campo === 'aliquotaIcms') {
    return item.value.aliquotaIcms == null ? '' : String(item.value.aliquotaIcms);
  }
  return '';
}

function definirCampoNota(campo: string, valor: string | number | null): void {
  const texto = valor == null ? '' : String(valor);
  if (campo === 'ncm') item.value.ncm = texto;
  else if (campo === 'cest') item.value.cest = texto;
  else if (campo === 'origem') item.value.origem = texto;
  else if (campo === 'cstIcms') item.value.cstIcms = texto;
  else if (campo === 'csosn') item.value.csosn = texto;
  else if (campo === 'aliquotaIcms') {
    const numero = Number(texto.replace(',', '.'));
    item.value.aliquotaIcms = texto.trim() === '' || !Number.isFinite(numero) ? null : numero;
  }
}

function hintCadastro(campo: string): string | undefined {
  const diferenca = divergenciaDe(campo);
  if (!diferenca) return undefined;
  return `Cadastro: ${diferenca.valorCadastro || 'não cadastrado'}`;
}

const chipsMeta = computed(() =>
  [
    {
      label: 'NCM',
      valor: item.value.ncm || '—',
      divergente: Boolean(divergenciaDe('ncm')),
      cadastro: divergenciaDe('ncm')?.valorCadastro || (divergenciaDe('ncm') ? 'não cadastrado' : undefined),
    },
    { label: 'CFOP', valor: item.value.cfop || '—', divergente: false, cadastro: undefined },
    { label: 'UN', valor: item.value.unidade || '—', divergente: false, cadastro: undefined },
    { label: 'EAN', valor: item.value.ean || '—', divergente: false, cadastro: undefined },
  ].filter((chip) => chip.valor !== '—' || chip.divergente || ['NCM', 'UN'].includes(chip.label)),
);

function cadastroTributo(...campos: string[]): string | undefined {
  const textos = campos
    .map((campo) => divergenciaDe(campo))
    .filter((diferenca): diferenca is DivergenciaFiscalEntradaDto => Boolean(diferenca))
    .map((diferenca) => `${diferenca.rotulo} ${diferenca.valorCadastro || 'não cadastrado'}`);
  return textos.length > 0 ? textos.join(' · ') : undefined;
}

const camposTributacao = computed(() =>
  [
    {
      label: 'Origem',
      valor: item.value.origem || '—',
      divergente: Boolean(divergenciaDe('origem')),
      cadastro: cadastroTributo('origem'),
    },
    {
      label: 'CST/CSOSN',
      valor: item.value.cstIcms || item.value.csosn || '—',
      divergente: Boolean(divergenciaDe('cstIcms') || divergenciaDe('csosn')),
      cadastro: cadastroTributo('cstIcms', 'csosn'),
    },
    { label: 'Base ICMS', valor: moeda(item.value.baseIcms), divergente: false, cadastro: undefined },
    {
      label: 'Alíq. ICMS',
      valor: percentual(item.value.aliquotaIcms),
      divergente: Boolean(divergenciaDe('aliquotaIcms')),
      cadastro: cadastroTributo('aliquotaIcms'),
    },
    { label: 'Valor ICMS', valor: moeda(item.value.valorIcms), divergente: false, cadastro: undefined },
    {
      label: 'ICMS desonerado',
      valor: moeda(item.value.valorIcmsDesonerado),
      divergente: false,
      cadastro: undefined,
    },
    { label: 'CST IPI', valor: item.value.cstIpi || '—', divergente: false, cadastro: undefined },
    { label: 'Valor IPI', valor: moeda(item.value.valorIpi), divergente: false, cadastro: undefined },
    { label: 'CST PIS', valor: item.value.cstPis || '—', divergente: false, cadastro: undefined },
    { label: 'CST COFINS', valor: item.value.cstCofins || '—', divergente: false, cadastro: undefined },
    { label: 'Base DIFAL', valor: moeda(item.value.baseDifal), divergente: false, cadastro: undefined },
    { label: 'Valor DIFAL', valor: moeda(item.value.valorDifal), divergente: false, cadastro: undefined },
    {
      label: 'CEST',
      valor: item.value.cest || '—',
      divergente: Boolean(divergenciaDe('cest')),
      cadastro: cadastroTributo('cest'),
    },
  ].filter((campo) => campo.valor !== '—' || campo.divergente),
);

const camposTributacaoPainel = computed(() =>
  camposTributacao.value.filter((campo) => !campo.divergente || divergencias.value.length === 0),
);
</script>

<style scoped>
.item-card {
  display: grid;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-surface-default);
}

.item-card--embutido {
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
}

.item-card__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.item-card__abas {
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
}

.item-card__painel {
  display: grid;
  gap: var(--spacing-4);
}

.item-card--embutido .item-card__painel {
  padding-top: var(--spacing-4);
}

.item-card__painel .item-card__secao:first-child {
  border-top: none;
  padding-top: 0;
}

.item-card__vazio {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.item-card--alerta,
.item-card--revisao {
  border-color: var(--color-warning-500);
  border-left: var(--border-width-accent) solid var(--color-warning-500);
  background: var(--color-warning-50);
}

.item-card__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-3);
}

.item-card__ident {
  display: flex;
  gap: var(--spacing-3);
  min-width: 0;
  flex: 1;
}

.item-card__indice {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.item-card__titulo {
  min-width: 0;
}

.item-card__nome {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: 1.35;
}

.item-card__sub {
  margin: var(--spacing-1) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.item-card__acoes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-2);
}

.item-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.item-card__meta--form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-3);
}

.meta-chip {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  min-width: 88px;
  padding: var(--spacing-2) var(--spacing-3);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted, var(--color-neutral-50));
}

.meta-chip__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.meta-chip__valor {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.meta-chip--divergente {
  background: var(--color-warning-50);
  border-color: var(--color-warning-500);
}

.meta-chip__cadastro {
  font-size: var(--font-size-xs);
  color: var(--color-warning-700);
}

.item-card__secao {
  display: grid;
  gap: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: var(--border-width-thin) solid var(--color-border-default);
}

.item-card__secao--destaque {
  border-top-color: var(--color-primary-200);
  background: var(--color-primary-50);
  margin: 0 calc(var(--spacing-4) * -1) calc(var(--spacing-4) * -1);
  padding: var(--spacing-4);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.item-card__secao-titulo {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.item-card__produto-nome {
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}

.item-card__grid {
  display: grid;
  gap: var(--spacing-3);
}

.item-card__grid--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.item-card__grid--4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-1);
  padding: var(--spacing-3);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-surface-default);
}

.metric-box__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.metric-box__valor {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.trib-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-2);
}

.trib-item {
  display: grid;
  gap: 2px;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  background: var(--color-neutral-50);
}

.trib-item__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.trib-item__valor {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.trib-item--divergente {
  background: var(--color-warning-50);
  box-shadow: inset 0 0 0 var(--border-width-thin) var(--color-warning-500);
}

.trib-item__cadastro {
  font-size: var(--font-size-xs);
  color: var(--color-warning-700, var(--color-text-secondary));
}

.campo-divergente :deep(.q-field__control) {
  background: var(--color-warning-50);
}

.revisao-fiscal {
  display: grid;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  border: var(--border-width-thin) solid var(--color-warning-500);
  border-left: var(--border-width-accent) solid var(--color-warning-500);
  border-radius: var(--radius-md);
  background: var(--color-surface-default);
}

.revisao-fiscal__titulo {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.revisao-fiscal__campos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-3);
}

.revisao-fiscal__acoes {
  display: flex;
  justify-content: flex-end;
}

.revisao-fiscal__lista {
  margin: 0;
  padding-left: var(--spacing-4);
  display: grid;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.revisao-fiscal__rotulo {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

@media (max-width: 900px) {
  .item-card__grid--3,
  .item-card__grid--4,
  .item-card__meta--form {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .item-card__grid--3,
  .item-card__grid--4,
  .item-card__meta--form {
    grid-template-columns: 1fr;
  }
}
</style>
