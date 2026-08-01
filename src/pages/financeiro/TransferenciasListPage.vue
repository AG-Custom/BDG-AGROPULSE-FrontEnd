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
        @click="abrirDialog()"
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
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
               @visualizar="abrirDialogVisualizar(props.row)">
                <q-item
                v-if="props.row.status === StatusTransferencia.Pendente"
                dense
                  v-close-popup
                  clickable
                  class="agro-acoes-menu__item"
                  :disable="salvando"
                @click="confirmar(props.row)"
                >
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--success"><q-icon name="done" size="16px" /></span></q-item-section>
                  <q-item-section>Confirmar</q-item-section>
                  <q-item-section v-if="salvando" side><q-spinner size="16px" color="primary" /></q-item-section>
                </q-item>
                <q-item
                v-if="props.row.status === StatusTransferencia.Pendente"
                dense
                  v-close-popup
                  clickable
                  class="agro-acoes-menu__item"
                  :disable="salvando"
                @click="cancelar(props.row)"
                >
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--danger"><q-icon name="cancel" size="16px" /></span></q-item-section>
                  <q-item-section>Cancelar</q-item-section>
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
        <q-card-section><h4 class="titulo">{{ somenteLeitura ? 'Visualizar transferência' : 'Nova transferência' }}</h4></q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <agro-select-cadastro
                  v-model="formulario.origemContaBancariaId"
                  entidade="contaBancaria"
                  clearable
                  label="Conta origem"
                  :options="contaOpcoes"
                  :readonly="somenteLeitura"
                  @atualizar="carregarContas()"
                />
              </div>
              <div class="col-12 col-md-6">
                <agro-select-cadastro
                  v-model="formulario.origemCaixaId"
                  entidade="caixa"
                  clearable
                  label="Caixa origem"
                  :options="caixaOpcoes"
                  :readonly="somenteLeitura"
                  @atualizar="carregarCaixas()"
                />
              </div>
              <div class="col-12 col-md-6">
                <agro-select-cadastro
                  v-model="formulario.destinoContaBancariaId"
                  entidade="contaBancaria"
                  clearable
                  label="Conta destino"
                  :options="contaOpcoes"
                  :readonly="somenteLeitura"
                  @atualizar="carregarContas()"
                />
              </div>
              <div class="col-12 col-md-6">
                <agro-select-cadastro
                  v-model="formulario.destinoCaixaId"
                  entidade="caixa"
                  clearable
                  label="Caixa destino"
                  :options="caixaOpcoes"
                  :readonly="somenteLeitura"
                  @atualizar="carregarCaixas()"
                />
              </div>
              <div class="col-12 col-md-6">
                <AgroMoneyInput
                  v-model="formulario.valor"
                  label="Valor"
                  class="field-required"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.data"
                  outlined
                  type="date"
                  label="Data"
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
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
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
import { formatarData, formatarMoeda, formatarMoedaParaInput } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref } from 'vue';


const { transferencias, carregando, salvando, carregar, criar, confirmar, cancelar } =
  useTransferenciasFinanceiras();
const { contaOpcoes, carregar: carregarContas } = useContasBancarias();
const { caixaOpcoes, carregar: carregarCaixas } = useCaixas();

const dialog = ref(false);
const somenteLeitura = ref(false);
const formulario = ref<TransferenciaFormModel>(formVazio());

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

function formVazio(): TransferenciaFormModel {
  return {
    origemContaBancariaId: '',
    origemCaixaId: '',
    destinoContaBancariaId: '',
    destinoCaixaId: '',
    valor: '',
    data: new Date().toISOString().slice(0, 10),
    observacao: '',
  };
}

function abrirDialog(): void {
  somenteLeitura.value = false;
  formulario.value = formVazio();
  dialog.value = true;
}

function abrirDialogVisualizar(item: TransferenciaFinanceiraDto): void {
  somenteLeitura.value = true;
  formulario.value = {
    origemContaBancariaId: item.origemContaBancariaId ?? '',
    origemCaixaId: item.origemCaixaId ?? '',
    destinoContaBancariaId: item.destinoContaBancariaId ?? '',
    destinoCaixaId: item.destinoCaixaId ?? '',
    valor: formatarMoedaParaInput(item.valor),
    data: item.data.slice(0, 10),
    observacao: item.observacao ?? '',
  };
  dialog.value = true;
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
