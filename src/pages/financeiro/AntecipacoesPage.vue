<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Antecipações"
      subtitulo="Carteira elegível, simulação de deságio e cessão."
    />

    <section class="agro-section">
      <agro-card class="q-mb-md">
        <template #header>
          <div class="header-acoes">
            <h3 class="secao-titulo">Carteira</h3>
            <agro-btn
              flat
              icon="refresh"
              label="Atualizar"
              descricao="Recarregar carteira"
              :loading="carregando"
              @click="carregarCarteira"
            />
          </div>
        </template>

        <agro-table-skeleton v-if="carregando && !carteira" :colunas="4" />
        <empty-state
          v-else-if="!carteira || carteira.itens.length === 0"
          titulo="Carteira vazia"
          descricao="Não há títulos elegíveis para antecipação."
          icon="account_balance_wallet"
        />
        <template v-else>
          <p class="text-metric q-mb-md">Total elegível: {{ formatarMoeda(carteira.valorTotal) }}</p>
          <q-table
            v-model:selected="selecionados"
            flat
            bordered
            row-key="contaReceberId"
            selection="multiple"
            :rows="carteira.itens.filter((i) => i.elegivel)"
            :columns="colunasCarteira"
            :rows-per-page-options="[10, 25]"
          >
            <template #body-cell-valor="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
            </template>
            <template #body-cell-vencimento="props">
              <q-td :props="props">{{ formatarData(props.row.vencimento) }}</q-td>
            </template>
          </q-table>

          <div class="simular row q-col-gutter-md q-mt-md items-end">
            <div class="col-12 col-md-3">
              <q-input v-model="desagio" outlined dense label="Deságio %" />
            </div>
            <div class="col-12 col-md-3">
              <agro-btn
                color="primary"
                unelevated
                label="Simular"
                descricao="Simular antecipação"
                :disable="selecionados.length === 0"
                :loading="salvando"
                @click="onSimular"
              />
            </div>
          </div>

          <div v-if="simulacao" class="resultado q-mt-md">
            <p class="text-metric">Bruto: {{ formatarMoeda(simulacao.valorBruto) }}</p>
            <p class="text-metric">Líquido: {{ formatarMoeda(simulacao.valorLiquido) }}</p>
          </div>
        </template>
      </agro-card>

      <agro-card>
        <template #header>
          <h3 class="secao-titulo">Antecipações</h3>
        </template>
        <agro-table-skeleton v-if="carregando && antecipacoes.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && antecipacoes.length === 0"
          titulo="Nenhuma antecipação"
          descricao="Simule e ceda títulos da carteira."
          icon="payments"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="antecipacoes"
          :columns="colunasAnt"
          :loading="carregando"
          :rows-per-page-options="[10, 25]"
        >
          <template #body-cell-valorBruto="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorBruto) }}
            </q-td>
          </template>
          <template #body-cell-valorLiquido="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorLiquido) }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge :label="props.row.status" variant="default" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-btn
                v-if="props.row.status === StatusAntecipacao.Simulada"
                flat
                dense
                label="Ceder"
                descricao="Ceder antecipação"
                :loading="salvando"
                @click="ceder(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useAntecipacoes } from 'composables/useAntecipacoes';
import { StatusAntecipacao } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  AntecipacaoCarteiraItemDto,
  AntecipacaoDto,
} from 'types/dtos/financeiro-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { onMounted, ref } from 'vue';

const {
  antecipacoes,
  carteira,
  simulacao,
  carregando,
  salvando,
  carregar,
  carregarCarteira,
  simular,
  ceder,
} = useAntecipacoes();

const selecionados = ref<AntecipacaoCarteiraItemDto[]>([]);
const desagio = ref('2.5');

const colunasCarteira: QTableColumn<AntecipacaoCarteiraItemDto>[] = [
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'vencimento', label: 'Vencimento', field: 'vencimento', align: 'left' },
];
const colunasAnt: QTableColumn<AntecipacaoDto>[] = [
  { name: 'valorBruto', label: 'Bruto', field: 'valorBruto', align: 'right' },
  { name: 'desagioPercentual', label: 'Deságio %', field: 'desagioPercentual', align: 'right' },
  { name: 'valorLiquido', label: 'Líquido', field: 'valorLiquido', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

async function onSimular(): Promise<void> {
  await simular(
    selecionados.value.map((i) => i.contaReceberId),
    Number(desagio.value.replace(',', '.')),
  );
  await carregar();
}

onMounted(() => {
  void carregarCarteira();
  void carregar();
});
</script>

<style scoped>
.secao-titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-md);
}
.header-acoes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.resultado {
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
}
</style>
