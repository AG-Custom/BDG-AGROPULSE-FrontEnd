<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Transferências financeiras"
      subtitulo="Movimentações entre contas e caixas."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova transferência"
        descricao="Criar transferência"
        @click="dialog = true"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && transferencias.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && transferencias.length === 0"
          titulo="Nenhuma transferência"
          descricao="Registre transferências entre contas ou caixas."
          icon="swap_horiz"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="transferencias"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-data="props">
            <q-td :props="props">{{ formatarData(props.row.data) }}</q-td>
          </template>
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge :label="props.row.status" :variant="variante(props.row.status)" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-btn
                v-if="props.row.status === StatusTransferencia.Pendente"
                flat
                round
                dense
                icon="done"
                color="positive"
                descricao="Confirmar"
                :loading="salvando"
                @click="confirmar(props.row)"
              />
              <agro-btn
                v-if="props.row.status === StatusTransferencia.Pendente"
                flat
                round
                dense
                icon="cancel"
                color="negative"
                descricao="Cancelar"
                :loading="salvando"
                @click="cancelar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Nova transferência</h4></q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.origemContaBancariaId"
                  outlined
                  clearable
                  emit-value
                  map-options
                  label="Conta origem"
                  :options="contaOpcoes"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.origemCaixaId"
                  outlined
                  clearable
                  emit-value
                  map-options
                  label="Caixa origem"
                  :options="caixaOpcoes"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.destinoContaBancariaId"
                  outlined
                  clearable
                  emit-value
                  map-options
                  label="Conta destino"
                  :options="contaOpcoes"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.destinoCaixaId"
                  outlined
                  clearable
                  emit-value
                  map-options
                  label="Caixa destino"
                  :options="caixaOpcoes"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.valor"
                  outlined
                  label="Valor"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.data"
                  outlined
                  type="date"
                  label="Data"
                  class="field-required"
                  :rules="[obrigatorio]"
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
import { useCaixas } from 'composables/useCaixas';
import { useContasBancarias } from 'composables/useContasBancarias';
import { useTransferenciasFinanceiras } from 'composables/useTransferenciasFinanceiras';
import { StatusTransferencia, type StatusTransferenciaValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  TransferenciaFinanceiraDto,
  TransferenciaFormModel,
} from 'types/dtos/financeiro-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref } from 'vue';

const { transferencias, carregando, salvando, carregar, criar, confirmar, cancelar } =
  useTransferenciasFinanceiras();
const { contaOpcoes, carregar: carregarContas } = useContasBancarias();
const { caixaOpcoes, carregar: carregarCaixas } = useCaixas();

const dialog = ref(false);
const formulario = ref<TransferenciaFormModel>({
  origemContaBancariaId: '',
  origemCaixaId: '',
  destinoContaBancariaId: '',
  destinoCaixaId: '',
  valor: '',
  data: new Date().toISOString().slice(0, 10),
  observacao: '',
});

const colunas: QTableColumn<TransferenciaFinanceiraDto>[] = [
  { name: 'data', label: 'Data', field: 'data', align: 'left', sortable: true },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'observacao', label: 'Observação', field: 'observacao', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function variante(status: StatusTransferenciaValor): 'success' | 'warning' | 'error' | 'default' {
  if (status === StatusTransferencia.Confirmada) return 'success';
  if (status === StatusTransferencia.Pendente) return 'warning';
  if (status === StatusTransferencia.Cancelada) return 'error';
  return 'default';
}

async function salvar(): Promise<void> {
  const ok = await criar(formulario.value);
  if (ok) dialog.value = false;
}

onMounted(() => {
  void carregar();
  void carregarContas();
  void carregarCaixas();
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
