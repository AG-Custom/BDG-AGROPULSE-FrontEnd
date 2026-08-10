<template>
  <component :is="embutido ? 'div' : AgroCard" class="totais">
    <h3 v-if="!embutido" class="titulo">Totalizadores</h3>
    <div class="totais-grid">
      <div v-for="item in linhas" :key="item.label" class="totais-item">
        <div class="text-caption">{{ item.label }}</div>
        <div class="text-metric">{{ item.valor }}</div>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import type { PreviewRecebimentoXmlTotaisDto } from 'types/dtos/compras.dto';
import { formatarMoeda } from 'utils/formatters';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    totais: PreviewRecebimentoXmlTotaisDto;
    embutido?: boolean;
  }>(),
  {
    embutido: false,
  },
);

const linhas = computed(() => {
  const t = props.totais;
  const moeda = (v: number | null | undefined) => (v == null ? '—' : formatarMoeda(v));
  return [
    { label: 'Total produtos', valor: moeda(t.totalProdutos) },
    { label: 'Total desconto', valor: moeda(t.totalDesconto) },
    { label: 'Total nota', valor: moeda(t.totalNota) },
    { label: 'Total frete', valor: moeda(t.totalFrete) },
    { label: 'Total seguro', valor: moeda(t.totalSeguro) },
    { label: 'Total outras', valor: moeda(t.totalOutras) },
    { label: 'Base ICMS', valor: moeda(t.totalBaseIcms) },
    { label: 'Valor ICMS', valor: moeda(t.totalValorIcms) },
    { label: 'ICMS desonerado', valor: moeda(t.totalIcmsDesonerado) },
    { label: 'Base ICMS ST', valor: moeda(t.totalBaseIcmsSt) },
    { label: 'Valor ICMS ST', valor: moeda(t.totalValorIcmsSt) },
    { label: 'Total IPI', valor: moeda(t.totalIpi) },
    { label: 'Base DIFAL', valor: moeda(t.totalBaseDifal) },
    { label: 'Valor DIFAL', valor: moeda(t.totalValorDifal) },
    { label: 'Tipo frete', valor: t.tipoFrete ?? '—' },
  ];
});
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
.totais-item {
  display: grid;
  gap: var(--spacing-1);
  padding: var(--spacing-3);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-neutral-50);
}
</style>
