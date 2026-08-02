<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Relatórios"
      subtitulo="Análises gerenciais, margem, DRE, rentabilidade e exportações."
    />

    <section class="agro-section">
      <agro-card>
        <q-tabs
          v-model="aba"
          dense
          outside-arrows
          mobile-arrows
          class="text-primary relatorios-tabs"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab v-for="item in abasVisiveis" :key="item.name" :name="item.name" :label="item.label" />
        </q-tabs>
        <q-separator />

        <curva-abc-tab v-if="aba === 'abc'" />
        <comissoes-tab v-else-if="aba === 'comissoes'" />
        <giro-estoque-tab v-else-if="aba === 'giro'" />
        <margem-por-lote-tab v-else-if="aba === 'margem'" />
        <dre-tab v-else-if="aba === 'dre'" />
        <ranking-unidades-tab v-else-if="aba === 'ranking'" />
        <rentabilidade-tab v-else-if="aba === 'rentabilidade'" />
        <inadimplencia-tab v-else-if="aba === 'inadimplencia'" />
        <desempenho-equipe-tab v-else-if="aba === 'desempenho'" />
        <alertas-tab v-else-if="aba === 'alertas'" />
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AlertasTab from 'components/relatorios/AlertasTab.vue';
import ComissoesTab from 'components/relatorios/ComissoesTab.vue';
import CurvaAbcTab from 'components/relatorios/CurvaAbcTab.vue';
import DesempenhoEquipeTab from 'components/relatorios/DesempenhoEquipeTab.vue';
import DreTab from 'components/relatorios/DreTab.vue';
import GiroEstoqueTab from 'components/relatorios/GiroEstoqueTab.vue';
import InadimplenciaTab from 'components/relatorios/InadimplenciaTab.vue';
import MargemPorLoteTab from 'components/relatorios/MargemPorLoteTab.vue';
import RankingUnidadesTab from 'components/relatorios/RankingUnidadesTab.vue';
import RentabilidadeTab from 'components/relatorios/RentabilidadeTab.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import { useVerCustos } from 'composables/useVerCustos';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

type AbaRelatorio =
  | 'abc'
  | 'comissoes'
  | 'giro'
  | 'margem'
  | 'dre'
  | 'ranking'
  | 'rentabilidade'
  | 'inadimplencia'
  | 'desempenho'
  | 'alertas';

const ABAS_VALIDAS: AbaRelatorio[] = [
  'abc',
  'comissoes',
  'giro',
  'margem',
  'dre',
  'ranking',
  'rentabilidade',
  'inadimplencia',
  'desempenho',
  'alertas',
];

const route = useRoute();
const { verCustos } = useVerCustos();

const abasVisiveis = computed(() => {
  const todas: { name: AbaRelatorio; label: string; sensivel?: boolean }[] = [
    { name: 'abc', label: 'Curva ABC' },
    { name: 'comissoes', label: 'Comissões' },
    { name: 'giro', label: 'Giro' },
    { name: 'margem', label: 'Margem por lote', sensivel: true },
    { name: 'dre', label: 'DRE', sensivel: true },
    { name: 'ranking', label: 'Ranking' },
    { name: 'rentabilidade', label: 'Rentabilidade', sensivel: true },
    { name: 'inadimplencia', label: 'Inadimplência', sensivel: true },
    { name: 'desempenho', label: 'Desempenho', sensivel: true },
    { name: 'alertas', label: 'Alertas' },
  ];

  return todas.filter((abaItem) => !(abaItem.sensivel && !verCustos.value));
});

function abaInicial(): AbaRelatorio {
  const query = route.query.aba;
  if (typeof query === 'string' && ABAS_VALIDAS.includes(query as AbaRelatorio)) {
    return query as AbaRelatorio;
  }
  return 'abc';
}

const aba = ref<AbaRelatorio>(abaInicial());

watch(
  abasVisiveis,
  (lista) => {
    if (!lista.some((item) => item.name === aba.value)) {
      aba.value = lista[0]?.name ?? 'abc';
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.relatorios-tabs {
  overflow-x: auto;
}
</style>
