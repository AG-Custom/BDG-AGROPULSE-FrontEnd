<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Análises de crédito"
      subtitulo="Score, limite sugerido e adimplência dos produtores."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova análise"
        descricao="Criar análise"
        @click="abrirDialog"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && analises.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && analises.length === 0"
          titulo="Nenhuma análise"
          descricao="Crie a primeira análise de crédito."
          icon="account_balance"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova análise"
            descricao="Criar"
            @click="abrirDialog"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="analises"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-clienteId="props">
            <q-td :props="props">
              {{ mapaClientes.get(props.row.clienteId) ?? props.row.clienteId }}
            </q-td>
          </template>
          <template #body-cell-score="props">
            <q-td :props="props" class="text-metric">{{ props.row.score }}</q-td>
          </template>
          <template #body-cell-limiteSugerido="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.limiteSugerido) }}
            </q-td>
          </template>
          <template #body-cell-limiteAprovado="props">
            <q-td :props="props" class="text-metric">
              {{
                props.row.limiteAprovado != null
                  ? formatarMoeda(props.row.limiteAprovado)
                  : '—'
              }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">{{ rotuloStatus(props.row.status) }}</q-td>
          </template>
          <template #body-cell-analisadoEm="props">
            <q-td :props="props">
              {{ formatarDataHora(props.row.analisadoEm) || '—' }}
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :ativo="true"
                :mostrar-editar="false"
                :mostrar-status="false"
                :visualizar-to="{ name: 'crm-credito-detalhe', params: { id: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Nova análise de crédito</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy @submit.prevent="salvar">
            <q-select
              v-model="clienteId"
              outlined
              label="Cliente"
              emit-value
              map-options
              class="field-required"
              :options="clienteOpcoes"
              :loading="carregandoClientes"
              :rules="[obrigatorio]"
            />
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
              <agro-btn
                color="primary"
                unelevated
                label="Criar"
                type="submit"
                :loading="salvando"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import { useCrm } from 'composables/useCrm';
import { StatusAnaliseCreditoOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { AnaliseCreditoDto } from 'types/dtos/crm.dto';
import { formatarDataHora, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { analises, carregando, salvando, carregarAnalises, criarAnalise } = useCrm();
const {
  clientes,
  carregando: carregandoClientes,
  carregar: carregarClientes,
} = useClientes();

const dialog = ref(false);
const clienteId = ref('');

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({
    label: c.nomeFantasia || c.nomeRazao,
    value: c.id,
  })),
);

const mapaClientes = computed(() => {
  const m = new Map<string, string>();
  for (const c of clientes.value) m.set(c.id, c.nomeFantasia || c.nomeRazao);
  return m;
});

const mapaStatus = computed(() => {
  const m = new Map<string, string>();
  for (const o of StatusAnaliseCreditoOpcoes) m.set(o.value, o.label);
  return m;
});

const colunas: QTableColumn<AnaliseCreditoDto>[] = [
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left', sortable: true },
  { name: 'score', label: 'Score', field: 'score', align: 'right' },
  { name: 'classificacao', label: 'Classe', field: 'classificacao', align: 'left' },
  { name: 'limiteSugerido', label: 'Limite sugerido', field: 'limiteSugerido', align: 'right' },
  { name: 'limiteAprovado', label: 'Limite aprovado', field: 'limiteAprovado', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'analisadoEm', label: 'Analisado em', field: 'analisadoEm', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloStatus(status: string): string {
  return mapaStatus.value.get(status) ?? status;
}

function abrirDialog(): void {
  clienteId.value = '';
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const criado = await criarAnalise(clienteId.value.trim());
  if (criado) {
    dialog.value = false;
    await carregarAnalises();
    await router.push({ name: 'crm-credito-detalhe', params: { id: criado.id } });
  }
}

onMounted(() => {
  void carregarAnalises();
  void carregarClientes();
});
</script>

<style scoped>
.dialog {
  min-width: min(420px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
