<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo acordo"
        descricao="Criar acordo judicial"
        @click="dialogAcordo = true"
      />
      <agro-btn
        flat
        icon="gavel"
        label="Encaminhamento"
        descricao="Novo encaminhamento"
        @click="dialogEnc = true"
      />
      <agro-btn
        flat
        icon="refresh"
        label="Atualizar"
        descricao="Atualizar jurídico"
        :loading="carregando"
        @click="carregarJuridico"
      />
    </div>

    <h3 class="secao-titulo">Encaminhamentos jurídicos</h3>
    <agro-table-skeleton v-if="carregando && encaminhamentos.length === 0" :colunas="4" />
    <empty-state
      v-else-if="!carregando && encaminhamentos.length === 0"
      titulo="Sem encaminhamentos"
      descricao="Nenhum processo jurídico registrado."
      icon="balance"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="id"
      class="q-mb-lg"
      :rows="encaminhamentos"
      :columns="colunasEnc"
      :loading="carregando"
      :rows-per-page-options="[5, 10, 25]"
    >
      <template #body-cell-clienteId="props">
        <q-td :props="props">
          {{ mapaClientes.get(props.row.clienteId) ?? props.row.clienteId }}
        </q-td>
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <agro-badge :label="String(props.row.status)" variant="info" />
        </q-td>
      </template>
      <template #body-cell-acoes="props">
        <q-td :props="props">
          <agro-btn
            v-if="props.row.status === StatusEncaminhamentoJuridico.Pendente"
            flat
            dense
            color="primary"
            label="Encaminhar"
            descricao="Encaminhar ao jurídico"
            @click="encaminharJuridico(props.row.id)"
          />
          <agro-btn
            v-if="props.row.pacoteDocsUrl"
            flat
            dense
            icon="download"
            color="primary"
            label="Pacote"
            descricao="Baixar pacote jurídico"
            :loading="salvando"
            @click="baixarPacoteJuridico(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <h3 class="secao-titulo">Acordos judiciais</h3>
    <agro-table-skeleton v-if="carregando && acordos.length === 0" :colunas="5" />
    <empty-state
      v-else-if="!carregando && acordos.length === 0"
      titulo="Sem acordos"
      descricao="Acordos judiciais e parcelamentos aparecerão aqui."
      icon="handshake"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="id"
      :rows="acordos"
      :columns="colunasAcordos"
      :loading="carregando"
      :rows-per-page-options="[5, 10, 25]"
    >
      <template #body-cell-clienteId="props">
        <q-td :props="props">
          {{ mapaClientes.get(props.row.clienteId) ?? props.row.clienteId }}
        </q-td>
      </template>
      <template #body-cell-valorAcordado="props">
        <q-td :props="props" class="text-metric">
          {{ formatarMoeda(props.row.valorAcordado) }}
        </q-td>
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <agro-badge :label="rotuloAcordo(props.row.status)" :variant="varianteAcordo(props.row.status)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogAcordo" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Novo acordo judicial</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy @submit.prevent="salvarAcordo">
            <q-select
              v-model="formAcordo.clienteId"
              outlined
              label="Cliente"
              emit-value
              map-options
              class="field-required q-mb-md"
              :options="clienteOpcoes"
              :loading="carregandoClientes"
              :rules="[obrigatorio]"
            />
            <q-input
              v-model="formAcordo.valorOriginal"
              outlined
              label="Valor original (R$)"
              type="number"
              class="q-mb-md"
            />
            <q-input
              v-model="formAcordo.valorAcordado"
              outlined
              label="Valor acordado (R$)"
              type="number"
              class="field-required q-mb-md"
              :rules="[obrigatorio]"
            />
            <q-input
              v-model="formAcordo.parcelas"
              outlined
              label="Parcelas"
              type="number"
              class="q-mb-md"
            />
            <q-input v-model="formAcordo.inicio" outlined label="Início" type="date" class="q-mb-md" />
            <q-input
              v-model="formAcordo.observacoes"
              outlined
              label="Observações"
              type="textarea"
              autogrow
            />
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogAcordo = false" />
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

    <q-dialog v-model="dialogEnc" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Novo encaminhamento</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy @submit.prevent="salvarEnc">
            <q-select
              v-model="encClienteId"
              outlined
              label="Cliente"
              emit-value
              map-options
              class="field-required q-mb-md"
              :options="clienteOpcoes"
              :loading="carregandoClientes"
              :rules="[obrigatorio]"
            />
            <q-select
              v-model="encContas"
              outlined
              label="Contas a receber"
              multiple
              use-chips
              emit-value
              map-options
              class="q-mb-md"
              :options="contaOpcoes"
              :loading="carregandoContas"
            />
            <q-input v-model="encObs" outlined label="Observações" type="textarea" autogrow />
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogEnc = false" />
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
  </div>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import { acordoVazio, useCobrancaCredito } from 'composables/useCobrancaCredito';
import { useContasReceber } from 'composables/useContasReceber';
import {
  StatusAcordoJudicial,
  StatusAcordoJudicialOpcoes,
  StatusEncaminhamentoJuridico,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { AcordoJudicialDto, EncaminhamentoJuridicoDto } from 'types/dtos/cobranca-credito.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, reactive, ref } from 'vue';

const {
  encaminhamentos,
  acordos,
  carregando,
  salvando,
  carregarJuridico,
  criarAcordo,
  criarEncaminhamento,
  encaminharJuridico,
  baixarPacoteJuridico,
} = useCobrancaCredito();
const {
  clientes,
  carregando: carregandoClientes,
  carregar: carregarClientes,
} = useClientes();
const {
  contas,
  carregando: carregandoContas,
  carregar: carregarContas,
} = useContasReceber();

const dialogAcordo = ref(false);
const dialogEnc = ref(false);
const formAcordo = reactive(acordoVazio());
const encClienteId = ref('');
const encContas = ref<string[]>([]);
const encObs = ref('');
const mapaAcordo = new Map(StatusAcordoJudicialOpcoes.map((o) => [o.value, o.label]));

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

const contaOpcoes = computed(() =>
  contas.value.map((c) => ({
    label: `Parc. ${c.parcela} · ${formatarMoeda(c.valor)} · ${formatarData(c.vencimento)}`,
    value: c.id,
  })),
);

const colunasEnc: QTableColumn<EncaminhamentoJuridicoDto>[] = [
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'observacoes', label: 'Observações', field: 'observacoes', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const colunasAcordos: QTableColumn<AcordoJudicialDto>[] = [
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'valorAcordado', label: 'Valor', field: 'valorAcordado', align: 'right' },
  { name: 'parcelas', label: 'Parcelas', field: 'parcelas', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
];

function rotuloAcordo(status: string): string {
  return mapaAcordo.get(status as never) ?? status;
}

function varianteAcordo(status: string): 'success' | 'error' | 'info' | 'default' {
  if (status === StatusAcordoJudicial.Cumprido) return 'success';
  if (status === StatusAcordoJudicial.Inadimplido) return 'error';
  if (status === StatusAcordoJudicial.Ativo) return 'info';
  return 'default';
}

async function salvarAcordo(): Promise<void> {
  if (await criarAcordo(formAcordo)) {
    dialogAcordo.value = false;
    Object.assign(formAcordo, acordoVazio());
  }
}

async function salvarEnc(): Promise<void> {
  if (
    await criarEncaminhamento({
      clienteId: encClienteId.value.trim(),
      contaReceberIds: encContas.value,
      observacoes: encObs.value.trim() || null,
    })
  ) {
    dialogEnc.value = false;
    encClienteId.value = '';
    encContas.value = [];
    encObs.value = '';
  }
}

onMounted(() => {
  void carregarJuridico();
  void carregarClientes();
  void carregarContas();
});
</script>

<style scoped>
.painel {
  padding: var(--spacing-4);
}

.secao-titulo {
  margin: 0 0 var(--spacing-2);
}

.dialog {
  min-width: min(480px, 92vw);
}

.titulo {
  margin: 0;
}
</style>
