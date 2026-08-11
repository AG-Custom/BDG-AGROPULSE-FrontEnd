<template>
  <component :is="embutido ? 'div' : AgroCard" class="totais">
    <h3 v-if="!embutido" class="titulo">Totalizadores</h3>

    <div v-if="readonly" class="totais-grid">
      <div v-for="item in linhasLeitura" :key="item.label" class="totais-item">
        <div class="text-caption">{{ item.label }}</div>
        <div class="text-metric">{{ item.valor }}</div>
      </div>
    </div>

    <div v-else class="totais-grid totais-grid--form">
      <AgroMoneyInput
        v-for="campo in camposMoeda"
        :key="campo.key"
        :model-value="valorMoeda(campo.key)"
        :label="campo.label"
        dense
        @update:model-value="atualizarMoeda(campo.key, $event)"
      />
      <q-input
        v-model="tipoFrete"
        outlined
        dense
        label="Tipo frete"
      />
    </div>
  </component>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import type { PreviewRecebimentoXmlTotaisDto } from 'types/dtos/compras.dto';
import { formatarMoeda, formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import { computed } from 'vue';

type CampoMoedaKey = Exclude<keyof PreviewRecebimentoXmlTotaisDto, 'tipoFrete'>;

withDefaults(
  defineProps<{
    readonly?: boolean;
    embutido?: boolean;
  }>(),
  {
    readonly: false,
    embutido: false,
  },
);

const totais = defineModel<PreviewRecebimentoXmlTotaisDto>('totais', { required: true });

const camposMoeda: Array<{ key: CampoMoedaKey; label: string }> = [
  { key: 'totalProdutos', label: 'Total produtos' },
  { key: 'totalDesconto', label: 'Total desconto' },
  { key: 'totalNota', label: 'Total nota' },
  { key: 'totalFrete', label: 'Total frete' },
  { key: 'totalSeguro', label: 'Total seguro' },
  { key: 'totalOutras', label: 'Total outras' },
  { key: 'totalBaseIcms', label: 'Base ICMS' },
  { key: 'totalValorIcms', label: 'Valor ICMS' },
  { key: 'totalIcmsDesonerado', label: 'ICMS desonerado' },
  { key: 'totalBaseIcmsSt', label: 'Base ICMS ST' },
  { key: 'totalValorIcmsSt', label: 'Valor ICMS ST' },
  { key: 'totalIpi', label: 'Total IPI' },
  { key: 'totalBaseDifal', label: 'Base DIFAL' },
  { key: 'totalValorDifal', label: 'Valor DIFAL' },
];

const linhasLeitura = computed(() => {
  const t = totais.value;
  const moeda = (v: number | null | undefined) => (v == null ? '—' : formatarMoeda(v));
  return [
    ...camposMoeda.map((campo) => ({
      label: campo.label,
      valor: moeda(t[campo.key]),
    })),
    { label: 'Tipo frete', valor: t.tipoFrete ?? '—' },
  ];
});

const tipoFrete = computed({
  get: () => totais.value.tipoFrete ?? '',
  set: (valor: string) => {
    totais.value = { ...totais.value, tipoFrete: valor.trim() || null };
  },
});

function valorMoeda(key: CampoMoedaKey): string {
  return formatarMoedaParaInput(totais.value[key]);
}

function atualizarMoeda(key: CampoMoedaKey, valor: string): void {
  totais.value = {
    ...totais.value,
    [key]: parseMascaraMoeda(valor),
  };
}
</script>

<style scoped>
.titulo {
  margin: 0 0 var(--spacing-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.totais-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--spacing-3);
}
.totais-grid--form {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}
.totais-item {
  display: grid;
  gap: var(--spacing-1);
  padding: var(--spacing-3);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-neutral-50);
}
</style>
