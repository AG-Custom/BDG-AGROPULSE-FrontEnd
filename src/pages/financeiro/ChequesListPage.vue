<template>
  <q-page class="agro-page">
    <app-page-header titulo="Cheques" subtitulo="Carteira de cheques recebidos e emitidos.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo cheque"
        descricao="Registrar cheque"
        @click="dialog = true"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar q-mb-md row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-select
              v-model="filtroTipo"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Tipo"
              :options="TipoChequeOpcoes"
              @update:model-value="aplicarFiltro"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filtroStatus"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Status"
              :options="StatusChequeOpcoes"
              @update:model-value="aplicarFiltro"
            />
          </div>
        </div>

        <agro-table-skeleton v-if="carregando && cheques.length === 0" :colunas="7" />
        <empty-state
          v-else-if="!carregando && cheques.length === 0"
          titulo="Nenhum cheque"
          descricao="Registre cheques para acompanhar depósito e compensação."
          icon="money"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="cheques"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
          </template>
          <template #body-cell-bomPara="props">
            <q-td :props="props">{{ formatarData(props.row.bomPara) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge :label="props.row.status" variant="default" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-btn
                v-if="props.row.status === StatusCheque.EmCarteira"
                flat
                round
                dense
                icon="account_balance"
                color="primary"
                descricao="Depositar"
                :loading="salvando"
                @click="depositar(props.row.id)"
              />
              <agro-btn
                v-if="props.row.status === StatusCheque.Depositado"
                flat
                round
                dense
                icon="done_all"
                color="positive"
                descricao="Compensar"
                :loading="salvando"
                @click="compensar(props.row.id)"
              />
              <agro-btn
                v-if="
                  props.row.status === StatusCheque.EmCarteira ||
                  props.row.status === StatusCheque.Depositado
                "
                flat
                round
                dense
                icon="undo"
                color="negative"
                descricao="Devolver"
                :loading="salvando"
                @click="devolver(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Novo cheque</h4></q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="formulario.tipo"
                  outlined
                  emit-value
                  map-options
                  label="Tipo"
                  class="field-required"
                  :options="TipoChequeOpcoes"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.numero"
                  outlined
                  label="Número"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.valor"
                  outlined
                  label="Valor"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="formulario.banco" outlined label="Banco" class="field-required" :rules="[obrigatorio]" />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="formulario.agencia" outlined label="Agência" />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.bomPara"
                  outlined
                  type="date"
                  label="Bom para"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="formulario.emitente" outlined label="Emitente" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.contaBancariaId"
                  outlined
                  clearable
                  emit-value
                  map-options
                  label="Conta bancária"
                  :options="contaOpcoes"
                />
              </div>
              <div class="col-12">
                <q-input v-model="formulario.observacao" outlined label="Observação" />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
              <agro-btn color="primary" unelevated label="Salvar" type="submit" :loading="salvando" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCheques } from 'composables/useCheques';
import { useContasBancarias } from 'composables/useContasBancarias';
import {
  StatusCheque,
  StatusChequeOpcoes,
  TipoChequeOpcoes,
  type StatusChequeValor,
  type TipoChequeValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { ChequeDto, ChequeFormModel } from 'types/dtos/financeiro-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref } from 'vue';

const { cheques, carregando, salvando, carregar, criar, depositar, compensar, devolver } =
  useCheques();
const { contaOpcoes, carregar: carregarContas } = useContasBancarias();

const dialog = ref(false);
const filtroTipo = ref<TipoChequeValor | null>(null);
const filtroStatus = ref<StatusChequeValor | null>(null);
const formulario = ref<ChequeFormModel>({
  tipo: '',
  numero: '',
  banco: '',
  agencia: '',
  valor: '',
  bomPara: '',
  emitente: '',
  contaBancariaId: '',
  observacao: '',
});

const colunas: QTableColumn<ChequeDto>[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'banco', label: 'Banco', field: 'banco', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'bomPara', label: 'Bom para', field: 'bomPara', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

async function aplicarFiltro(): Promise<void> {
  await carregar({
    tipo: filtroTipo.value ?? undefined,
    status: filtroStatus.value ?? undefined,
  });
}

async function salvar(): Promise<void> {
  const ok = await criar(formulario.value);
  if (ok) {
    dialog.value = false;
    await aplicarFiltro();
  }
}

onMounted(() => {
  void carregarContas();
  void carregar();
});
</script>

<style scoped>
.dialog {
  min-width: min(560px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.acoes {
  white-space: nowrap;
}
</style>
