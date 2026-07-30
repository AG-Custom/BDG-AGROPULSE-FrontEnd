<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Formas de pagamento"
      subtitulo="Configure taxas e repasse por forma de pagamento da unidade."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova configuração"
        descricao="Cadastrar forma de pagamento"
        :to="{ name: 'forma-pagamento-config-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && configs.length === 0" :colunas="4" />

        <empty-state
          v-else-if="!carregando && configs.length === 0"
          titulo="Nenhuma configuração"
          descricao="Cadastre formas de pagamento para aplicar taxas no faturamento."
          icon="payments"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova configuração"
            descricao="Cadastrar forma de pagamento"
            :to="{ name: 'forma-pagamento-config-nova' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="configs"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-formaPagamento="props">
            <q-td :props="props">
              {{ rotuloForma(props.row.formaPagamento) }}
            </q-td>
          </template>

          <template #body-cell-repassarTaxaCliente="props">
            <q-td :props="props">
              {{ props.row.repassarTaxaCliente ? 'Sim' : 'Não' }}
            </q-td>
          </template>

          <template #body-cell-taxas="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.taxas.length }}
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
            <q-td :props="props" class="formas-pagamento-list__acoes">
              <agro-acoes-menu
                :ativo="props.row.ativo"
                :editar-to="{
                  name: 'forma-pagamento-config-editar',
                  params: { id: props.row.id },
                }"
                :visualizar-to="{
                  name: 'forma-pagamento-config-visualizar',
                  params: { id: props.row.id },
                }"
                :loading-status="salvando"
                @desabilitar="solicitarInativacao(props.row)"
                @ativar="solicitarAtivacao(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useFormasPagamentoConfig } from 'composables/useFormasPagamentoConfig';
import { FormaPagamentoOpcoes, type FormaPagamentoValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { ConfigFormaPagamentoDto } from 'types/dtos/financeiro.dto';
import { onMounted } from 'vue';



const { configs, carregando, salvando, carregar, solicitarInativacao, solicitarAtivacao } =
  useFormasPagamentoConfig();

const colunas: QTableColumn<ConfigFormaPagamentoDto>[] = [
  {
    name: 'formaPagamento',
    label: 'Forma',
    field: 'formaPagamento',
    align: 'left',
    sortable: true,
  },
  {
    name: 'repassarTaxaCliente',
    label: 'Repassa taxa',
    field: 'repassarTaxaCliente',
    align: 'left',
    sortable: true,
  },
  { name: 'taxas', label: 'Taxas', field: 'id', align: 'right' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloForma(forma: FormaPagamentoValor): string {
  return FormaPagamentoOpcoes.find((item) => item.value === forma)?.label ?? forma;
}

onMounted(() => {
  void carregar();
});

</script>

<style scoped>
.formas-pagamento-list__acoes {
  white-space: nowrap;
}
</style>
