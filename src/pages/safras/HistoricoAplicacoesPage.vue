<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Histórico de aplicações"
      subtitulo="Linha do tempo de aplicações por propriedade."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="filtros.clienteId"
            outlined
            dense
            clearable
            label="Cliente ID"
            class="filtro"
          />
          <q-select
            v-model="filtros.fazendaId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Fazenda"
            class="filtro"
            :options="fazendaOpcoes"
          />
          <q-select
            v-model="filtros.talhaoId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Talhão"
            class="filtro"
            :options="talhaoOpcoes"
          />
          <q-select
            v-model="filtros.safraId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Safra"
            class="filtro"
            :options="safraOpcoes"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Filtrar"
            descricao="Aplicar filtros"
            :loading="carregando"
            @click="aplicarFiltros"
          />
        </div>

        <agro-table-skeleton
          v-if="carregando && historicoAplicacoes.length === 0"
          :colunas="6"
        />
        <empty-state
          v-else-if="!carregando && historicoAplicacoes.length === 0"
          titulo="Sem histórico"
          descricao="Nenhuma aplicação encontrada para os filtros."
          icon="timeline"
        />
        <div v-else class="timeline">
          <div
            v-for="item in historicoAplicacoes"
            :key="item.id"
            class="timeline-item"
          >
            <div class="timeline-data text-metric">{{ formatarData(item.dataAplicacao) }}</div>
            <div class="timeline-conteudo">
              <div class="timeline-titulo">
                {{ item.produtoNome ?? item.produtoId }}
                <span v-if="item.numeroLote" class="lote">Lote {{ item.numeroLote }}</span>
              </div>
              <div class="text-caption">
                {{ item.fazendaNome ?? '—' }} · {{ item.talhaoNome ?? item.talhaoId }}
                <template v-if="item.safraNome"> · {{ item.safraNome }}</template>
              </div>
              <div class="text-metric q-mt-xs">
                {{ formatarDecimal(item.quantidade) }} {{ item.unidadeMedida }}
                <template v-if="item.doseHa != null">
                  · {{ formatarDecimal(item.doseHa) }} /ha
                </template>
              </div>
            </div>
          </div>
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useFazendas } from 'composables/useFazendas';
import { useHistoricoSafras } from 'composables/useHistoricoSafras';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import { useSafras } from 'composables/useSafras';
import { formatarData, formatarDecimal } from 'utils/formatters';
import { computed, onMounted, reactive } from 'vue';

const { historicoAplicacoes, carregando, carregarHistoricoAplicacoes } = useHistoricoSafras();
const { fazendaOpcoes, carregar: carregarFazendas } = useFazendas();
const { talhoes, carregarTalhoes } = useRastreabilidade();
const { safraOpcoes, carregar: carregarSafras } = useSafras();

const filtros = reactive({
  clienteId: '',
  fazendaId: '' as string | null,
  talhaoId: '' as string | null,
  safraId: '' as string | null,
});

const talhaoOpcoes = computed(() =>
  talhoes.value.map((t) => ({ label: t.nome, value: t.id })),
);

function aplicarFiltros(): void {
  void carregarHistoricoAplicacoes({
    clienteId: filtros.clienteId || undefined,
    fazendaId: filtros.fazendaId || undefined,
    talhaoId: filtros.talhaoId || undefined,
    safraId: filtros.safraId || undefined,
  });
}

onMounted(() => {
  void carregarFazendas();
  void carregarTalhoes();
  void carregarSafras();
  void carregarHistoricoAplicacoes();
});
</script>

<style scoped>
.filtro {
  min-width: 160px;
  max-width: 220px;
}
.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-top: var(--spacing-4);
}
.timeline-item {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-4);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  border-left: var(--border-width-accent) solid var(--color-primary-500);
}
.timeline-data {
  color: var(--color-text-secondary);
}
.timeline-titulo {
  font-weight: 600;
}
.lote {
  margin-left: var(--spacing-2);
  color: var(--color-text-secondary);
  font-weight: 400;
  font-size: var(--font-size-sm);
}
</style>
