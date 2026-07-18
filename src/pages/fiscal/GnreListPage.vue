<template>
  <q-page class="agro-page">
    <app-page-header titulo="GNRE" subtitulo="Guias nacionais de recolhimento de tributos estaduais.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Gerar GNRE"
        descricao="Gerar guia GNRE"
        @click="dialog = true"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && guias.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && guias.length === 0"
          titulo="Nenhuma GNRE"
          descricao="Gere guias a partir de notas fiscais."
          icon="account_balance"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="guias"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-notaFiscalId="props">
            <q-td :props="props">
              {{ mapaNotas.get(props.row.notaFiscalId) ?? props.row.notaFiscalId }}
            </q-td>
          </template>
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
          </template>
          <template #body-cell-createdAt="props">
            <q-td :props="props">{{ formatarData(props.row.createdAt) }}</q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Gerar GNRE</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <q-select
              v-model="notaFiscalId"
              outlined
              label="Nota fiscal"
              emit-value
              map-options
              class="field-required"
              :options="notaOpcoes"
              :loading="carregandoNotas"
              :rules="[obrigatorio]"
            />
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" @click="dialog = false" />
              <agro-btn color="primary" unelevated label="Gerar" type="submit" :loading="salvando" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useGnre } from 'composables/useGnre';
import { useNotasFiscais } from 'composables/useNotasFiscais';
import type { QTableColumn } from 'quasar';
import type { GuiaGnreDto } from 'types/dtos/fiscal-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const { guias, carregando, salvando, carregar, gerar } = useGnre();
const {
  notas,
  carregando: carregandoNotas,
  carregar: carregarNotas,
} = useNotasFiscais();
const dialog = ref(false);
const notaFiscalId = ref('');

const notaOpcoes = computed(() =>
  notas.value.map((n) => ({
    label: `${n.numero ?? n.id.slice(0, 8)} · ${n.tipo} · ${formatarMoeda(n.valorTotal)}`,
    value: n.id,
  })),
);

const mapaNotas = computed(() => {
  const m = new Map<string, string>();
  for (const n of notas.value) {
    m.set(n.id, `${n.numero ?? n.id.slice(0, 8)} · ${n.tipo}`);
  }
  return m;
});

const colunas: QTableColumn<GuiaGnreDto>[] = [
  { name: 'notaFiscalId', label: 'Nota', field: 'notaFiscalId', align: 'left' },
  { name: 'ufDestino', label: 'UF', field: 'ufDestino', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'protocolo', label: 'Protocolo', field: 'protocolo', align: 'left' },
  { name: 'createdAt', label: 'Criado em', field: 'createdAt', align: 'left' },
];

async function salvar(): Promise<void> {
  const ok = await gerar(notaFiscalId.value);
  if (ok) {
    dialog.value = false;
    notaFiscalId.value = '';
  }
}

onMounted(() => {
  void carregar();
  void carregarNotas();
});
</script>

<style scoped>
.dialog {
  min-width: min(440px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
