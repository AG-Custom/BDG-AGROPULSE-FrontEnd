<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Fichas técnicas de processo"
      subtitulo="Temperatura, umidade, tempos e tolerâncias."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova ficha"
        descricao="Criar ficha técnica"
        :to="{ name: 'ficha-tecnica-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && fichas.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && fichas.length === 0"
          titulo="Nenhuma ficha"
          descricao="Cadastre parâmetros de processo."
          icon="description"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="fichas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-produtoId="props">
            <q-td :props="props">
              {{ props.row.produtoId ? rotuloProduto(props.row.produtoId) : '—' }}
            </q-td>
          </template>
          <template #body-cell-temperatura="props">
            <q-td :props="props" class="text-metric">
              {{ faixa(props.row.temperaturaMin, props.row.temperaturaMax) }}
            </q-td>
          </template>
          <template #body-cell-umidade="props">
            <q-td :props="props" class="text-metric">
              {{ faixa(props.row.umidadeMin, props.row.umidadeMax) }}
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <div class="acoes">
                <agro-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="primary"
                  descricao="Editar"
                  :to="{ name: 'ficha-tecnica-editar', params: { id: props.row.id } }"
                />
                <agro-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  descricao="Remover"
                  :loading="salvando"
                  @click="onRemover(props.row.id)"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useFichasTecnicas } from 'composables/useFichasTecnicas';
import { useProdutos } from 'composables/useProdutos';
import type { QTableColumn } from 'quasar';
import type { FichaTecnicaProcessoDto } from 'types/dtos/producao.dto';
import { computed, onMounted } from 'vue';

const { fichas, carregando, salvando, carregar, remover } = useFichasTecnicas();
const { produtos, carregar: carregarProdutos } = useProdutos();

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const colunas: QTableColumn<FichaTecnicaProcessoDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'temperatura', label: 'Temperatura', field: 'temperaturaMin', align: 'right' },
  { name: 'umidade', label: 'Umidade', field: 'umidadeMin', align: 'right' },
  { name: 'tempoMinutos', label: 'Tempo (min)', field: 'tempoMinutos', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloProduto(id: string): string {
  return mapa.value.get(id) ?? id;
}

function faixa(min: number | null, max: number | null): string {
  if (min == null && max == null) return '—';
  return `${min ?? '—'} / ${max ?? '—'}`;
}

async function onRemover(id: string): Promise<void> {
  if (await remover(id)) await carregar();
}

onMounted(() => {
  void carregarProdutos();
  void carregar();
});
</script>

<style scoped>
.acoes {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-1);
}
</style>
