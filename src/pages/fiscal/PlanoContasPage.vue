<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Plano de contas"
      subtitulo="Contas contábeis usadas na escrituração e nos lançamentos de compra."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova conta"
        descricao="Cadastrar conta contábil"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && contas.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && contas.length === 0"
          titulo="Nenhuma conta contábil"
          descricao="Cadastre as contas sintéticas e analíticas do plano de contas."
          icon="account_tree"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="contas"
          :columns="colunas"
          :loading="carregando"
          :pagination="{ rowsPerPage: 50 }"
          :rows-per-page-options="[25, 50, 100]"
        >
          <template #body-cell-nome="props">
            <q-td :props="props">
              <span class="conta-nome" :style="{ paddingLeft: `calc(var(--spacing-4) * ${props.row.nivel - 1})` }">
                {{ props.row.nome }}
              </span>
            </q-td>
          </template>
          <template #body-cell-codigo="props">
            <q-td :props="props" class="text-metric">{{ props.row.codigo }}</q-td>
          </template>
          <template #body-cell-analitica="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.analitica ? 'Analítica' : 'Sintética'"
                :variant="props.row.analitica ? 'info' : 'default'"
              />
            </q-td>
          </template>
          <template #body-cell-ativo="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.ativo ? 'Ativa' : 'Inativa'"
                :variant="props.row.ativo ? 'success' : 'default'"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-visualizar="false"
                :mostrar-editar="props.row.ativo"
                :ativo="props.row.ativo"
                @editar="abrirDialog(props.row)"
                @desabilitar="inativar(props.row.id)"
                @ativar="ativar(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <conta-contabil-dialog
      v-model="dialog"
      :conta="editando"
      :salvando="salvando"
      :pai-opcoes="contasSinteticasOpcoes"
      @submit="salvar"
    />
  </q-page>
</template>

<script setup lang="ts">
import ContaContabilDialog from 'components/fiscal/ContaContabilDialog.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { usePlanoContas } from 'composables/usePlanoContas';
import type { QTableColumn } from 'quasar';
import type { ContaContabilDto, ContaContabilFormModel } from 'types/dtos/plano-contas.dto';
import { onMounted, ref } from 'vue';

const {
  contas,
  contasSinteticasOpcoes,
  carregando,
  salvando,
  carregar,
  criar,
  editar,
  inativar,
  ativar,
} = usePlanoContas();

const dialog = ref(false);
const editando = ref<ContaContabilDto | null>(null);

const colunas: QTableColumn<ContaContabilDto>[] = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'natureza', label: 'Natureza', field: 'natureza', align: 'left' },
  { name: 'analitica', label: 'Tipo', field: 'analitica', align: 'left' },
  { name: 'ativo', label: 'Situação', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirDialog(conta?: ContaContabilDto): void {
  editando.value = conta ?? null;
  dialog.value = true;
}

async function salvar(form: ContaContabilFormModel): Promise<void> {
  const ok = editando.value ? await editar(editando.value.id, form) : await criar(form);
  if (ok) dialog.value = false;
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.conta-nome {
  display: inline-block;
}
</style>
