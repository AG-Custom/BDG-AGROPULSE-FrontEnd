<template>
  <q-page class="agro-page">
    <app-page-header titulo="Boletos" subtitulo="Emissão, remessa e retorno bancário.">
      <agro-btn
        color="primary"
        unelevated
        icon="upload_file"
        label="Processar retorno"
        descricao="Enviar arquivo de retorno"
        @click="inputRetorno?.click()"
      />
    </app-page-header>

    <section class="agro-section">
      <q-banner
        v-if="temStub"
        rounded
        class="q-mb-md stub-banner"
      >
        Integração externa em modo stub — emissão/remessa/retorno podem ser simulados.
      </q-banner>

      <input
        ref="inputRetorno"
        type="file"
        class="hidden-input"
        accept=".ret,.RET,.txt"
        @change="onRetorno"
      />

      <agro-card>
        <div class="agro-filter-bar q-mb-md row q-col-gutter-md items-end">
          <div class="col-12 col-md-3">
            <filtro-escopo-select v-model="filtroEscopo" @update:model-value="aplicarFiltro" />
          </div>
          <div class="col-12 col-md-3">
            <agro-btn
              color="primary"
              unelevated
              label="Gerar remessa"
              descricao="Gerar remessa dos selecionados"
              :disable="selecionados.length === 0"
              :loading="salvando"
              @click="onRemessa"
            />
          </div>
        </div>

        <agro-table-skeleton v-if="carregando && boletos.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && boletos.length === 0"
          titulo="Nenhum boleto"
          descricao="Emita boletos a partir das contas a receber."
          icon="receipt"
        />
        <q-table
          v-else
          v-model:selected="selecionados"
          flat
          bordered
          row-key="id"
          selection="multiple"
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
              <agro-badge :label="props.row.status" variant="default" />
            </q-td>
          </template>
        </q-table>

        <p v-if="ultimaRemessa" class="resultado text-metric">
          Remessa: {{ ultimaRemessa.quantidade }} boleto(s)
          <span v-if="ultimaRemessa.mensagem"> — {{ ultimaRemessa.mensagem }}</span>
        </p>
        <p v-if="ultimoRetorno" class="resultado text-metric">
          Retorno: {{ ultimoRetorno.processados }} processados,
          {{ ultimoRetorno.pagos }} pagos,
          {{ ultimoRetorno.rejeitados }} rejeitados
        </p>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import FiltroEscopoSelect from 'components/financeiro/FiltroEscopoSelect.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useBoletos } from 'composables/useBoletos';
import { EscopoFinanceiro, type EscopoFinanceiroValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { BoletoDto } from 'types/dtos/financeiro-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const {
  boletos,
  ultimaRemessa,
  ultimoRetorno,
  carregando,
  salvando,
  carregar,
  gerarRemessa,
  processarRetorno,
} = useBoletos();

const filtroEscopo = ref<EscopoFinanceiroValor | null>(EscopoFinanceiro.Unidade);
const selecionados = ref<BoletoDto[]>([]);
const inputRetorno = ref<HTMLInputElement | null>(null);

const temStub = computed(
  () =>
    boletos.value.some((b) => b.stub) ||
    !!ultimaRemessa.value?.stub ||
    !!ultimoRetorno.value?.stub,
);

const colunas: QTableColumn<BoletoDto>[] = [
  { name: 'nossoNumero', label: 'Nosso número', field: 'nossoNumero', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'vencimento', label: 'Vencimento', field: 'vencimento', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'linhaDigitavel', label: 'Linha digitável', field: 'linhaDigitavel', align: 'left' },
];

async function aplicarFiltro(): Promise<void> {
  await carregar({ escopo: filtroEscopo.value ?? undefined });
}

async function onRemessa(): Promise<void> {
  await gerarRemessa(selecionados.value.map((b) => b.id));
}

async function onRetorno(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  await processarRetorno(file);
  input.value = '';
}

onMounted(() => {
  void aplicarFiltro();
});
</script>

<style scoped>
.stub-banner {
  background: var(--color-surface-sunken);
  border: var(--border-width-thin) solid var(--color-border-default);
}
.hidden-input {
  display: none;
}
.resultado {
  margin-top: var(--spacing-4);
  color: var(--color-text-secondary);
}
</style>
