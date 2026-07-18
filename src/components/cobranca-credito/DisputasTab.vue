<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova disputa"
        descricao="Registrar disputa"
        @click="dialogNova = true"
      />
      <agro-btn
        flat
        icon="refresh"
        label="Atualizar"
        descricao="Atualizar disputas"
        :loading="carregando"
        @click="carregarDisputas"
      />
    </div>

    <agro-table-skeleton v-if="carregando && disputas.length === 0" :colunas="5" />
    <empty-state
      v-else-if="!carregando && disputas.length === 0"
      titulo="Nenhuma disputa"
      descricao="Títulos contestados aparecerão aqui."
      icon="gavel"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="id"
      :rows="disputas"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-contaReceberId="props">
        <q-td :props="props">
          {{ mapaContas.get(props.row.contaReceberId) ?? props.row.contaReceberId }}
        </q-td>
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <agro-badge :label="rotuloStatus(props.row.status)" :variant="varianteStatus(props.row.status)" />
        </q-td>
      </template>
      <template #body-cell-abertoEm="props">
        <q-td :props="props">{{ formatarData(props.row.abertoEm) }}</q-td>
      </template>
      <template #body-cell-acoes="props">
        <q-td :props="props">
          <agro-btn
            v-if="props.row.status === StatusDisputaTitulo.Aberta"
            flat
            dense
            color="primary"
            label="Resolver"
            descricao="Resolver disputa"
            @click="abrirResolver(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogNova" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Nova disputa</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy @submit.prevent="salvar">
            <q-select
              v-model="contaReceberId"
              outlined
              label="Conta a receber"
              emit-value
              map-options
              class="field-required q-mb-md"
              :options="contaOpcoes"
              :loading="carregandoContas"
              :rules="[obrigatorio]"
            />
            <q-input
              v-model="motivo"
              outlined
              label="Motivo"
              type="textarea"
              autogrow
              class="field-required"
              :rules="[obrigatorio]"
            />
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogNova = false" />
              <agro-btn
                color="primary"
                unelevated
                label="Registrar"
                type="submit"
                :loading="salvando"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogResolver" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Resolver disputa</h4>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="resolucao"
            outlined
            label="Resolução"
            type="textarea"
            autogrow
            class="q-mb-md"
          />
          <q-toggle v-model="encerrar" label="Encerrar disputa" />
          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogResolver = false" />
            <agro-btn
              color="primary"
              unelevated
              label="Confirmar"
              :loading="salvando"
              @click="confirmarResolver"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCobrancaCredito } from 'composables/useCobrancaCredito';
import { useContasReceber } from 'composables/useContasReceber';
import { StatusDisputaTitulo, StatusDisputaTituloOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { DisputaTituloDto } from 'types/dtos/cobranca-credito.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const { disputas, carregando, salvando, carregarDisputas, criarDisputa, resolverDisputa } =
  useCobrancaCredito();
const {
  contas,
  carregando: carregandoContas,
  carregar: carregarContas,
} = useContasReceber();

const dialogNova = ref(false);
const dialogResolver = ref(false);
const contaReceberId = ref('');
const motivo = ref('');
const resolucao = ref('');
const encerrar = ref(true);
const disputaAlvo = ref<DisputaTituloDto | null>(null);
const mapaStatus = new Map(StatusDisputaTituloOpcoes.map((o) => [o.value, o.label]));

const contaOpcoes = computed(() =>
  contas.value.map((c) => ({
    label: `Parc. ${c.parcela} · ${formatarMoeda(c.valor)} · ${formatarData(c.vencimento)}`,
    value: c.id,
  })),
);

const mapaContas = computed(() => {
  const m = new Map<string, string>();
  for (const c of contas.value) {
    m.set(c.id, `Parc. ${c.parcela} · ${formatarMoeda(c.valor)}`);
  }
  return m;
});

const colunas: QTableColumn<DisputaTituloDto>[] = [
  { name: 'contaReceberId', label: 'Conta a receber', field: 'contaReceberId', align: 'left' },
  { name: 'motivo', label: 'Motivo', field: 'motivo', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'abertoEm', label: 'Aberto em', field: 'abertoEm', align: 'left' },
  { name: 'resolucao', label: 'Resolução', field: 'resolucao', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloStatus(status: string): string {
  return mapaStatus.get(status as never) ?? status;
}

function varianteStatus(status: string): 'success' | 'warning' | 'default' {
  if (status === StatusDisputaTitulo.Resolvida) return 'success';
  if (status === StatusDisputaTitulo.Aberta) return 'warning';
  return 'default';
}

function abrirResolver(disputa: DisputaTituloDto): void {
  disputaAlvo.value = disputa;
  resolucao.value = '';
  encerrar.value = true;
  dialogResolver.value = true;
}

async function salvar(): Promise<void> {
  if (
    await criarDisputa({
      contaReceberId: contaReceberId.value.trim(),
      motivo: motivo.value.trim(),
    })
  ) {
    dialogNova.value = false;
    contaReceberId.value = '';
    motivo.value = '';
  }
}

async function confirmarResolver(): Promise<void> {
  if (!disputaAlvo.value) return;
  if (await resolverDisputa(disputaAlvo.value.id, resolucao.value, encerrar.value)) {
    dialogResolver.value = false;
  }
}

onMounted(() => {
  void carregarDisputas();
  void carregarContas();
});
</script>

<style scoped>
.painel {
  padding: var(--spacing-4);
}

.dialog {
  min-width: min(480px, 92vw);
}

.titulo {
  margin: 0;
}
</style>
