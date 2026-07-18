<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Cobrança e Crédito Rural"
      subtitulo="Carteira, fichas rurais, cobrança ativa, disputas e configuração de crédito."
    />

    <section class="agro-section">
      <div class="atalhos agro-filter-bar q-mb-md">
        <span class="text-caption text-secondary">Atalhos:</span>
        <agro-btn
          flat
          dense
          label="Contas a receber"
          descricao="Ir para contas a receber"
          :to="{ name: 'contas-receber' }"
        />
        <agro-btn
          flat
          dense
          label="Régua"
          descricao="Ir para régua de cobrança"
          :to="{ name: 'regua-cobranca' }"
        />
        <agro-btn
          flat
          dense
          label="Renegociações"
          descricao="Ir para renegociações"
          :to="{ name: 'renegociacoes' }"
        />
        <agro-btn
          flat
          dense
          label="CRM Crédito"
          descricao="Ir para análises CRM"
          :to="{ name: 'crm-credito' }"
        />
      </div>

      <agro-card>
        <q-tabs
          v-model="aba"
          dense
          outside-arrows
          mobile-arrows
          class="text-primary cobranca-tabs"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab v-for="item in ABAS" :key="item.name" :name="item.name" :label="item.label" />
        </q-tabs>
        <q-separator />

        <carteira-painel-tab v-if="aba === 'carteira'" />
        <fichas-credito-tab v-else-if="aba === 'fichas'" />
        <lista-diaria-tab v-else-if="aba === 'lista'" />
        <disputas-tab v-else-if="aba === 'disputas'" />
        <juridico-acordos-tab v-else-if="aba === 'juridico'" />
        <credito-config-tab v-else-if="aba === 'config'" />
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import CarteiraPainelTab from 'components/cobranca-credito/CarteiraPainelTab.vue';
import CreditoConfigTab from 'components/cobranca-credito/CreditoConfigTab.vue';
import DisputasTab from 'components/cobranca-credito/DisputasTab.vue';
import FichasCreditoTab from 'components/cobranca-credito/FichasCreditoTab.vue';
import JuridicoAcordosTab from 'components/cobranca-credito/JuridicoAcordosTab.vue';
import ListaDiariaTab from 'components/cobranca-credito/ListaDiariaTab.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

type AbaCobranca = 'carteira' | 'fichas' | 'lista' | 'disputas' | 'juridico' | 'config';

const ABAS: { name: AbaCobranca; label: string }[] = [
  { name: 'carteira', label: 'Carteira' },
  { name: 'fichas', label: 'Fichas rurais' },
  { name: 'lista', label: 'Lista diária' },
  { name: 'disputas', label: 'Disputas' },
  { name: 'juridico', label: 'Jurídico / Acordos' },
  { name: 'config', label: 'Configuração' },
];

const ABAS_VALIDAS = ABAS.map((a) => a.name);

const route = useRoute();
const router = useRouter();

function abaInicial(): AbaCobranca {
  const query = route.query.aba;
  if (typeof query === 'string' && ABAS_VALIDAS.includes(query as AbaCobranca)) {
    return query as AbaCobranca;
  }
  return 'carteira';
}

const aba = ref<AbaCobranca>(abaInicial());

watch(aba, (valor) => {
  if (route.query.aba === valor) return;
  void router.replace({ query: { ...route.query, aba: valor } });
});
</script>

<style scoped>
.cobranca-tabs {
  overflow-x: auto;
}

.atalhos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-1);
}
</style>
