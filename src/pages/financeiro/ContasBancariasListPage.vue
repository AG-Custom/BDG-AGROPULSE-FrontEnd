<template>
  <q-page class="agro-page">
    <app-page-header titulo="Contas bancárias" subtitulo="Contas por CNPJ com saldo e alerta mínimo.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova conta"
        descricao="Cadastrar conta"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && contas.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && contas.length === 0"
          titulo="Nenhuma conta bancária"
          descricao="Cadastre contas para baixa, tesouraria e conciliação."
          icon="account_balance"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="contas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-saldoAtual="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.saldoAtual) }}</q-td>
          </template>
          <template #body-cell-saldoMinimo="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.saldoMinimo != null ? formatarMoeda(props.row.saldoMinimo) : '—' }}
            </q-td>
          </template>
          <template #body-cell-ativo="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.ativo ? 'Ativo' : 'Inativo'"
                :variant="props.row.ativo ? 'success' : 'default'"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :ativo="props.row.ativo"
                :mostrar-visualizar="false"
                :loading-status="salvando || ativando"
                @editar="abrirDialog(props.row)"
                @desabilitar="solicitarInativacao(props.row)"
                @ativar="solicitarAtivacao(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ editandoId ? 'Editar conta' : 'Nova conta bancária' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.cnpjId"
                  outlined
                  label="CNPJ"
                  emit-value
                  map-options
                  class="field-required"
                  :options="cnpjOpcoes"
                  :loading="carregandoCnpjs"
                  :rules="[obrigatorio]"
                  :readonly="!!editandoId"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.unidadeId"
                  outlined
                  label="Unidade"
                  clearable
                  emit-value
                  map-options
                  :options="unidadeOpcoes"
                  :loading="carregandoUnidades"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.banco"
                  outlined
                  label="Banco"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.agencia"
                  outlined
                  label="Agência"
                  class="field-required"
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
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.tipo"
                  outlined
                  emit-value
                  map-options
                  label="Tipo"
                  class="field-required"
                  :options="TipoContaBancariaOpcoes"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="formulario.saldoMinimo" outlined label="Saldo mínimo" />
              </div>
              <div class="col-12">
                <q-input v-model="formulario.descricao" outlined label="Descrição" />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
              <agro-btn
                color="primary"
                unelevated
                label="Salvar"
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
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCnpjs } from 'composables/useCnpjs';
import { useContasBancarias } from 'composables/useContasBancarias';
import { useUnidades } from 'composables/useUnidades';
import { TipoContaBancariaOpcoes, UnidadeStatus } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { ContaBancariaDto, ContaBancariaFormModel } from 'types/dtos/financeiro-gestao.dto';
import { formatarCnpj, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const {
  contas,
  carregando,
  salvando,
  ativando,
  carregar,
  criar,
  editar,
  solicitarInativacao,
  solicitarAtivacao,
} =
  useContasBancarias();
const { cnpjs, carregando: carregandoCnpjs, carregar: carregarCnpjs } = useCnpjs();
const {
  unidades,
  carregando: carregandoUnidades,
  carregar: carregarUnidades,
} = useUnidades();

const dialog = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<ContaBancariaFormModel>(formVazio());

const cnpjOpcoes = computed(() =>
  cnpjs.value.map((c) => ({
    label: `${formatarCnpj(c.numero)} — ${c.razaoSocial}`,
    value: c.id,
  })),
);

const unidadeOpcoes = computed(() =>
  unidades.value
    .filter((u) => u.status === UnidadeStatus.Ativa || u.id === formulario.value.unidadeId)
    .map((u) => ({ label: u.nome, value: u.id })),
);

const colunas: QTableColumn<ContaBancariaDto>[] = [
  { name: 'banco', label: 'Banco', field: 'banco', align: 'left' },
  { name: 'agencia', label: 'Agência', field: 'agencia', align: 'left' },
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'saldoAtual', label: 'Saldo', field: 'saldoAtual', align: 'right' },
  { name: 'saldoMinimo', label: 'Mínimo', field: 'saldoMinimo', align: 'right' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function formVazio(): ContaBancariaFormModel {
  return {
    cnpjId: '',
    unidadeId: '',
    banco: '',
    agencia: '',
    numero: '',
    tipo: '',
    saldoMinimo: '',
    descricao: '',
  };
}

function abrirDialog(item?: ContaBancariaDto): void {
  editandoId.value = item?.id ?? null;
  formulario.value = item
    ? {
        cnpjId: item.cnpjId,
        unidadeId: item.unidadeId ?? '',
        banco: item.banco,
        agencia: item.agencia,
        numero: item.numero,
        tipo: item.tipo,
        saldoMinimo: item.saldoMinimo != null ? String(item.saldoMinimo) : '',
        descricao: item.descricao ?? '',
      }
    : formVazio();
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await editar(editandoId.value, formulario.value)
    : await criar(formulario.value);
  if (ok) dialog.value = false;
}

onMounted(() => {
  void carregar();
  void carregarCnpjs();
  void carregarUnidades();
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
