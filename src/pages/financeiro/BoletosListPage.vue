<template>
  <q-page class="agro-page">
    <app-page-header titulo="Boletos" subtitulo="Emissão e acompanhamento de boletos com Pix.">
      <agro-btn
        v-if="podeEditar"
        color="primary"
        unelevated
        icon="receipt"
        label="Emitir boleto"
        descricao="Emitir boleto de uma conta a receber"
        @click="dialogAberto = true"
      />
    </app-page-header>

    <section class="agro-section">
      <q-banner v-if="temSimulado" rounded class="q-mb-md stub-banner">
        Há boletos simulados (sem banco). Configure a integração Sicoob para emitir boletos reais.
      </q-banner>

      <agro-card>
        <agro-table-skeleton v-if="carregando && boletos.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && boletos.length === 0"
          titulo="Nenhum boleto"
          descricao="Emita boletos a partir das contas a receber."
          icon="receipt"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="boletos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
          </template>
          <template #body-cell-vencimento="props">
            <q-td :props="props">{{ formatarData(props.row.vencimento) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge :label="props.row.status" :variant="varianteStatus(props.row.status)" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="text-right">
              <boleto-acoes
                :boleto="props.row"
                :salvando="salvando"
                :pode-editar="podeEditar"
                @sincronizar="sincronizar(props.row)"
                @baixar="baixar(props.row)"
                @copiar="copiar"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <emitir-boleto-dialog v-model="dialogAberto" :salvando="salvando" @emitir="onEmitir" />
  </q-page>
</template>

<script setup lang="ts">
import BoletoAcoes from 'components/financeiro/BoletoAcoes.vue';
import EmitirBoletoDialog from 'components/financeiro/EmitirBoletoDialog.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useBoletos } from 'composables/useBoletos';
import { usePermissao } from 'composables/usePermissao';
import { AreaAcesso } from 'constants/areas-acesso';
import { NivelAcesso } from 'constants/niveis-acesso';
import { StatusBoleto, type StatusBoletoValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { BoletoDto } from 'types/dtos/financeiro-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { boletos, carregando, salvando, carregar, emitir, sincronizar, baixar, copiar } = useBoletos();

const { pode } = usePermissao();
const podeEditar = computed(() => pode(AreaAcesso.Financeiro, NivelAcesso.Editar));
const dialogAberto = ref(false);
const temSimulado = computed(() => boletos.value.some((b) => b.provedor === 'Stub'));

const colunas: QTableColumn<BoletoDto>[] = [
  { name: 'nossoNumero', label: 'Nosso número', field: 'nossoNumero', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'vencimento', label: 'Vencimento', field: 'vencimento', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'provedor', label: 'Banco', field: 'provedor', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function varianteStatus(status: StatusBoletoValor): 'success' | 'warning' | 'error' | 'default' {
  if (status === StatusBoleto.Pago) return 'success';
  if (status === StatusBoleto.Registrado) return 'warning';
  if (status === StatusBoleto.Cancelado) return 'error';
  return 'default';
}

async function onEmitir(contaReceberId: string): Promise<void> {
  if (await emitir(contaReceberId)) dialogAberto.value = false;
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.stub-banner {
  background: var(--color-surface-sunken);
  border: var(--border-width-thin) solid var(--color-border-default);
}
</style>
