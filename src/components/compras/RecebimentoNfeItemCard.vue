<template>
  <article
    class="item-card"
    :class="{
      'item-card--alerta': !produtoVinculado && modo === 'form' && !embutido,
      'item-card--embutido': embutido,
    }"
  >
    <header class="item-card__header">
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

    <div class="item-card__meta">
      <div v-for="chip in chipsMeta" :key="chip.label" class="meta-chip">
        <span class="meta-chip__label">{{ chip.label }}</span>
        <span class="meta-chip__valor text-metric">{{ chip.valor }}</span>
      </div>
    </div>

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
          :readonly="readonly"
        />
        <AgroMoneyInput v-model="item.custoUnitario" label="Custo unitário" :readonly="readonly" />
        <div class="metric-box">
          <span class="metric-box__label">Total linha</span>
          <span class="metric-box__valor text-metric">{{ totalLinha }}</span>
        </div>
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
          v-if="item.informacaoAdicional"
          :model-value="item.informacaoAdicional"
          outlined
          readonly
          label="Info. adicional do item"
        />
      </div>
    </section>

    <section v-if="temTributacao" class="item-card__secao">
      <h4 class="item-card__secao-titulo">Tributação do item</h4>
      <div class="trib-grid">
        <div v-for="campo in camposTributacao" :key="campo.label" class="trib-item">
          <span class="trib-item__label">{{ campo.label }}</span>
          <span class="trib-item__valor text-metric">{{ campo.valor }}</span>
        </div>
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
  </article>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { MetodoCusteioOpcoes } from 'constants/enums';
import { formatarMoeda, parseMascaraMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed } from 'vue';

export interface RecebimentoNfeItemFormModel {
  produtoId: string;
  codigoProdutoXml: string;
  descricaoProdutoXml: string;
  ncm: string;
  cfop: string;
  unidade: string;
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
  }>(),
  {
    produtoOpcoes: () => [],
    produtoLabel: '',
    readonly: false,
    podeRemover: true,
    mostrarPrecificacao: false,
    embutido: false,
  },
);

const item = defineModel<RecebimentoNfeItemFormModel>('item', { required: true });

const emit = defineEmits<{
  cadastrar: [];
  remover: [];
  atualizarProdutos: [];
  margemChange: [];
  precoChange: [];
}>();

const produtoVinculado = computed(() => Boolean(item.value.produtoId));

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

const chipsMeta = computed(() =>
  [
    { label: 'NCM', valor: item.value.ncm || '—' },
    { label: 'CFOP', valor: item.value.cfop || '—' },
    { label: 'UN', valor: item.value.unidade || '—' },
    { label: 'EAN', valor: item.value.ean || '—' },
  ].filter((chip) => chip.valor !== '—' || ['NCM', 'UN'].includes(chip.label)),
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
      item.value.cstIcms
      || item.value.csosn
      || item.value.valorIcms != null
      || item.value.valorIcmsDesonerado != null
      || item.value.cstIpi
      || item.value.cstPis
      || item.value.valorDifal != null,
    ),
);

function moeda(valor: number | null | undefined): string {
  return valor == null ? '—' : formatarMoeda(valor);
}

function percentual(valor: number | null | undefined): string {
  return valor == null ? '—' : `${valor}%`;
}

const camposTributacao = computed(() => [
  { label: 'Origem', valor: item.value.origem || '—' },
  { label: 'CST/CSOSN', valor: item.value.cstIcms || item.value.csosn || '—' },
  { label: 'Base ICMS', valor: moeda(item.value.baseIcms) },
  { label: 'Alíq. ICMS', valor: percentual(item.value.aliquotaIcms) },
  { label: 'Valor ICMS', valor: moeda(item.value.valorIcms) },
  { label: 'ICMS desonerado', valor: moeda(item.value.valorIcmsDesonerado) },
  { label: 'CST IPI', valor: item.value.cstIpi || '—' },
  { label: 'Valor IPI', valor: moeda(item.value.valorIpi) },
  { label: 'CST PIS', valor: item.value.cstPis || '—' },
  { label: 'CST COFINS', valor: item.value.cstCofins || '—' },
  { label: 'Base DIFAL', valor: moeda(item.value.baseDifal) },
  { label: 'Valor DIFAL', valor: moeda(item.value.valorDifal) },
]);
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

.item-card--alerta {
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

@media (max-width: 900px) {
  .item-card__grid--3,
  .item-card__grid--4 {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .item-card__grid--3,
  .item-card__grid--4 {
    grid-template-columns: 1fr;
  }
}
</style>
