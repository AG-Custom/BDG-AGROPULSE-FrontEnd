<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Relatórios"
      subtitulo="Catálogo de análises gerenciais, comerciais e financeiras."
    />

    <section class="agro-section">
      <div class="agro-filter-bar relatorios-hub__filtro">
        <q-btn-toggle
          v-model="categoria"
          unelevated
          toggle-color="primary"
          :options="toggleOpcoes"
        />
      </div>

      <div class="relatorios-hub__grid">
        <button
          v-for="item in itensVisiveis"
          :key="item.id"
          type="button"
          class="relatorios-hub__card"
          @click="abrir(item.routeName)"
        >
          <div class="relatorios-hub__card-topo">
            <q-icon :name="item.icon" size="28px" class="relatorios-hub__icon" />
            <q-badge
              v-if="item.exigeVerCustos"
              outline
              color="primary"
              label="Custos"
            />
          </div>
          <h3 class="relatorios-hub__titulo">{{ item.titulo }}</h3>
          <p class="relatorios-hub__descricao">{{ item.descricao }}</p>
          <span class="relatorios-hub__acao">Abrir relatório</span>
        </button>
      </div>

      <empty-state
        v-if="itensVisiveis.length === 0"
        titulo="Nenhum relatório disponível"
        descricao="Não há relatórios nesta categoria para o seu perfil."
        icon="assessment"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import EmptyState from 'components/ui/EmptyState.vue';
import { useVerCustos } from 'composables/useVerCustos';
import {
  REDIRECT_ABA_RELATORIO,
  RELATORIOS_CATALOGO,
  RelatorioCategoria,
  RelatorioCategoriaOpcoes,
  type RelatorioCategoriaValor,
} from 'constants/relatorios-catalogo';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { verCustos } = useVerCustos();

const categoria = ref<RelatorioCategoriaValor>(
  RelatorioCategoria.GerenciaisComerciais,
);

const toggleOpcoes = RelatorioCategoriaOpcoes.map((op) => ({
  label: op.label,
  value: op.value,
}));

const itensVisiveis = computed(() =>
  RELATORIOS_CATALOGO.filter(
    (item) =>
      item.categoria === categoria.value &&
      !(item.exigeVerCustos && !verCustos.value),
  ),
);

function abrir(routeName: string): void {
  void router.push({ name: routeName });
}

onMounted(() => {
  const aba = route.query.aba;
  if (typeof aba !== 'string' || !aba) {
    return;
  }

  const destino = REDIRECT_ABA_RELATORIO[aba] ?? 'relatorios';
  if (destino === 'relatorios') {
    void router.replace({ name: 'relatorios' });
    return;
  }

  void router.replace({ name: destino });
});
</script>

<style scoped lang="scss">
.relatorios-hub__filtro {
  margin-bottom: var(--spacing-6);
}

.relatorios-hub__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-4);
}

.relatorios-hub__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-2);
  padding: var(--spacing-5);
  text-align: left;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-surface-default);
  cursor: pointer;
  transition:
    border-color var(--duration-fast) ease,
    box-shadow var(--duration-fast) ease;
}

.relatorios-hub__card:hover {
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-card-hover);
}

.relatorios-hub__card-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: var(--spacing-1);
}

.relatorios-hub__icon {
  color: var(--color-primary-500);
}

.relatorios-hub__titulo {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}

.relatorios-hub__descricao {
  margin: 0;
  flex: 1;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.45;
}

.relatorios-hub__acao {
  margin-top: var(--spacing-2);
  color: var(--color-primary-600, var(--color-primary-500));
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
</style>
