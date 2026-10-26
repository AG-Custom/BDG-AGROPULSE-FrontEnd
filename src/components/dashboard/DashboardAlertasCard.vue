<template>
  <agro-card>
    <div class="secao-header">
      <div class="text-subtitle1">Alertas recentes</div>
      <agro-btn
        flat
        dense
        color="primary"
        label="Ver todos"
        descricao="Ir para alertas"
        :to="{ name: 'relatorios' }"
      />
    </div>
    <empty-state
      v-if="alertas.length === 0"
      titulo="Sem alertas"
      descricao="Nenhum alerta gerencial no momento."
      icon="notifications_none"
    />
    <q-list v-else separator>
      <q-item
        v-for="(item, idx) in itens"
        :key="`${item.alerta.tipo}-${idx}`"
        class="alerta-item"
      >
        <q-item-section avatar top>
          <agro-badge
            :label="item.alerta.severidade"
            :variant="variantSeveridade(item.alerta.severidade)"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.alerta.titulo }}</q-item-label>
          <q-item-label caption>{{ item.alerta.descricao }}</q-item-label>
          <div v-if="item.significado" class="alerta-significado">
            <q-icon name="info" size="18px" class="alerta-significado__icone" aria-hidden="true" />
            <div>
              <div class="alerta-significado__titulo">O que significa</div>
              <div class="alerta-significado__texto">{{ item.significado }}</div>
            </div>
          </div>
        </q-item-section>
        <q-item-section v-if="item.acao" side class="alerta-acao">
          <agro-btn
            outline
            dense
            no-wrap
            color="primary"
            :label="item.acao.label"
            :descricao="`${item.acao.label}: ${item.alerta.titulo}`"
            :to="{ name: item.acao.routeName }"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </agro-card>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useAlertaGerencialAcao } from 'composables/useAlertaGerencialAcao';
import type { AlertaGerencialDto } from 'types/dtos/relatorio.dto';
import { computed } from 'vue';

const props = defineProps<{
  alertas: AlertaGerencialDto[];
}>();

const { detalhar } = useAlertaGerencialAcao();

const itens = computed(() =>
  props.alertas.map((alerta) => ({ alerta, ...detalhar(alerta.tipo) })),
);

function variantSeveridade(severidade: string): 'error' | 'warning' | 'default' | 'success' {
  const s = severidade.toLowerCase();
  if (s.includes('crit')) return 'error';
  if (s.includes('alerta')) return 'warning';
  return 'default';
}
</script>

<style scoped>
.secao-header {
  align-items: center;
  display: flex;
  gap: var(--spacing-2);
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}

.alerta-item {
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.alerta-significado {
  background: var(--color-primary-50);
  border-left: var(--border-width-accent) solid var(--color-primary-500);
  border-radius: var(--radius-md);
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
}

.alerta-significado__icone {
  color: var(--color-primary-600);
  flex-shrink: 0;
  margin-top: var(--spacing-1);
}

.alerta-significado__titulo {
  color: var(--color-primary-700);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}

.alerta-significado__texto {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.alerta-acao {
  padding-left: var(--spacing-2);
}
</style>
