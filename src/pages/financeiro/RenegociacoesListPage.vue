<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Renegociações"
      subtitulo="Parcelamento de títulos vencidos com mora, multa e aprovação."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova renegociação"
        descricao="Criar renegociação"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && renegociacoes.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && renegociacoes.length === 0"
          titulo="Nenhuma renegociação"
          descricao="Crie renegociações a partir de títulos em aberto."
          icon="handshake"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="renegociacoes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-valorTotal="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorTotal) }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge :label="props.row.status" :variant="variante(props.row.status)" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu :mostrar-editar="false" :mostrar-status="false" @visualizar="abrirDialogVisualizar(props.row)">
                <q-item v-if="props.row.status === StatusRenegociacao.Pendente" v-close-popup clickable dense class="agro-acoes-menu__item" :disable="salvando" @click="aprovar(props.row)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--success"><q-icon name="done" size="16px" /></span></q-item-section>
                  <q-item-section>Aprovar</q-item-section>
                  <q-item-section v-if="salvando" side><q-spinner size="16px" color="primary" /></q-item-section>
                </q-item>
                <q-item v-if="props.row.status === StatusRenegociacao.Pendente" v-close-popup clickable dense class="agro-acoes-menu__item" :disable="salvando" @click="rejeitar(props.row)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--danger"><q-icon name="close" size="16px" /></span></q-item-section>
                  <q-item-section>Rejeitar</q-item-section>
                  <q-item-section v-if="salvando" side><q-spinner size="16px" color="primary" /></q-item-section>
                </q-item>
              </agro-acoes-menu>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">{{ somenteLeitura ? 'Visualizar renegociação' : 'Nova renegociação' }}</h4></q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-select
                  v-model="formulario.clienteId"
                  outlined
                  emit-value
                  map-options
                  label="Cliente"
                  class="field-required"
                  :options="clienteOpcoes"
                  :rules="[obrigatorio]"
                  @update:model-value="onCliente" :readonly="somenteLeitura" />
              </div>
              <div class="col-12">
                <q-select
                  v-model="formulario.contasReceberIds"
                  outlined
                  multiple
                  emit-value
                  map-options
                  label="Títulos"
                  class="field-required"
                  :options="tituloOpcoes"
                  :readonly="somenteLeitura"
                  :rules="[(v: string[]) => (v?.length > 0) || 'Selecione ao menos um título']"
                />
              </div>
              <div class="col-4">
                <AgroMoneyInput v-model="formulario.valorMora" label="Mora" :readonly="somenteLeitura" />
              </div>
              <div class="col-4">
                <AgroMoneyInput v-model="formulario.valorMulta" label="Multa" :readonly="somenteLeitura" />
              </div>
              <div class="col-4">
                <q-input
                  v-model="formulario.numeroParcelas"
                  outlined
                  label="Parcelas"
                  class="field-required"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-12">
                <q-input v-model="formulario.observacao" outlined label="Observação" :readonly="somenteLeitura" />
              </div>
            </div>
            <div class="agro-form-actions">
              <template v-if="somenteLeitura">
                <agro-btn flat label="Fechar" descricao="Fechar" @click="dialog = false" />
              </template>
              <template v-else>
                <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
                <agro-btn color="primary" unelevated label="Salvar" type="submit" :loading="salvando" />
              </template>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import { useContasReceber } from 'composables/useContasReceber';
import { useRenegociacoes } from 'composables/useRenegociacoes';
import {
  ContaReceberStatus,
  StatusRenegociacao,
  type StatusRenegociacaoValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { RenegociacaoDto, RenegociacaoFormModel } from 'types/dtos/financeiro-gestao.dto';
import { formatarMoeda, formatarMoedaParaInput } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';


const { renegociacoes, carregando, salvando, carregar, criar, aprovar, rejeitar } =
  useRenegociacoes();
const { clientes, carregar: carregarClientes } = useClientes();
const { contas, carregar: carregarCr } = useContasReceber();

const dialog = ref(false);
const somenteLeitura = ref(false);
const formulario = ref<RenegociacaoFormModel>(formVazio());

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({ label: c.nomeFantasia || c.nomeRazao, value: c.id })),
);
const tituloOpcoes = computed(() =>
  contas.value
    .filter((c) => c.clienteId === formulario.value.clienteId)
    .map((c) => ({
      label: `Parcela ${c.parcela} — ${formatarMoeda(c.valor)}`,
      value: c.id,
    })),
);

const colunas: QTableColumn<RenegociacaoDto>[] = [
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'valorTotal', label: 'Valor total', field: 'valorTotal', align: 'right' },
  { name: 'numeroParcelas', label: 'Parcelas', field: 'numeroParcelas', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'observacao', label: 'Observação', field: 'observacao', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function variante(status: StatusRenegociacaoValor): 'success' | 'warning' | 'error' | 'default' {
  if (status === StatusRenegociacao.Aprovada) return 'success';
  if (status === StatusRenegociacao.Pendente) return 'warning';
  if (status === StatusRenegociacao.Rejeitada) return 'error';
  return 'default';
}

async function onCliente(clienteId: string): Promise<void> {
  formulario.value.contasReceberIds = [];
  if (clienteId) {
    await carregarCr({ clienteId, status: ContaReceberStatus.Aberta });
  }
}

async function salvar(): Promise<void> {
  const ok = await criar(formulario.value);
  if (ok) dialog.value = false;
}

function formVazio(): RenegociacaoFormModel {
  return {
    clienteId: '',
    contasReceberIds: [],
    valorMora: '',
    valorMulta: '',
    numeroParcelas: '2',
    observacao: '',
  };
}

function abrirDialog(): void {
  somenteLeitura.value = false;
  formulario.value = formVazio();
  dialog.value = true;
}

function abrirDialogVisualizar(item: RenegociacaoDto): void {
  somenteLeitura.value = true;
  formulario.value = {
    clienteId: item.clienteId,
    contasReceberIds: [...item.contasReceberIds],
    valorMora: formatarMoedaParaInput(item.valorMora),
    valorMulta: formatarMoedaParaInput(item.valorMulta),
    numeroParcelas: String(item.numeroParcelas),
    observacao: item.observacao ?? '',
  };
  dialog.value = true;
  void carregarCr({ clienteId: item.clienteId });
}

onMounted(() => {
  void carregar();
  void carregarClientes();
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
