<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Régua de cobrança"
      subtitulo="Configuração de etapas e painel de títulos em atraso."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="play_arrow"
        label="Processar dia"
        descricao="Executar processamento diário"
        :loading="salvando"
        @click="processarDia"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card class="q-mb-md">
        <template #header>
          <h3 class="secao-titulo">Configuração</h3>
        </template>
        <agro-form-skeleton v-if="carregando && !form.etapas.length" :campos="4" />
        <template v-else>
          <q-toggle v-model="form.ativo" label="Régua ativa" class="q-mb-md" />
          <div
            v-for="(etapa, index) in form.etapas"
            :key="index"
            class="etapa row q-col-gutter-sm q-mb-sm"
          >
            <div class="col-12 col-md-2">
              <q-input v-model="etapa.etapaDias" outlined dense label="D+ dias" type="number" />
            </div>
            <div class="col-12 col-md-2">
              <q-input v-model="etapa.nomeEtapa" outlined dense label="Nome" />
            </div>
            <div class="col-6 col-md-2 flex flex-center">
              <q-toggle v-model="etapa.avisarGerente" label="Aviso gerente" />
            </div>
            <div class="col-6 col-md-2 flex flex-center">
              <q-toggle v-model="etapa.avisarVendedor" label="Aviso vendedor" />
            </div>
            <div class="col-6 col-md-2 flex flex-center">
              <q-toggle v-model="etapa.bloquearPedidos" label="Bloquear pedidos" />
            </div>
            <div class="col-6 col-md-1 flex flex-center">
              <q-toggle v-model="etapa.ativo" label="Ativa" />
            </div>
            <div class="col-12 col-md-1 flex flex-center">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover etapa"
                :disable="form.etapas.length <= 1"
                @click="form.etapas.splice(index, 1)"
              />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat icon="add" label="Etapa" descricao="Adicionar etapa" @click="addEtapa" />
            <agro-btn
              color="primary"
              unelevated
              label="Salvar configuração"
              descricao="Salvar régua"
              :loading="salvando"
              @click="onSalvar"
            />
          </div>
        </template>
      </agro-card>

      <agro-card>
        <template #header>
          <h3 class="secao-titulo">Painel</h3>
        </template>
        <agro-table-skeleton v-if="carregando && !painel" :colunas="6" />
        <empty-state
          v-else-if="itensPainel.length === 0"
          titulo="Nenhum título em atraso"
          descricao="O painel agrupa contas a receber vencidas por etapa da régua."
          icon="campaign"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="itensPainel"
          :columns="colunas"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valor) }}
            </q-td>
          </template>
          <template #body-cell-saldo="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.saldo) }}
            </q-td>
          </template>
          <template #body-cell-vencimento="props">
            <q-td :props="props">
              {{ formatarData(props.row.vencimento) }}
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useReguaCobranca } from 'composables/useReguaCobranca';
import type { QTableColumn } from 'quasar';
import type {
  ReguaCobrancaConfigFormModel,
  ReguaCobrancaPainelItemDto,
} from 'types/dtos/financeiro-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { onMounted, reactive, watch } from 'vue';

const {
  config,
  painel,
  itensPainel,
  carregando,
  salvando,
  carregarConfig,
  carregarPainel,
  salvar,
  processarDia,
} = useReguaCobranca();

const form = reactive<ReguaCobrancaConfigFormModel>({
  ativo: true,
  etapas: [
    {
      etapaDias: '1',
      nomeEtapa: 'D+1',
      avisarGerente: false,
      avisarVendedor: true,
      bloquearPedidos: false,
      ativo: true,
    },
    {
      etapaDias: '5',
      nomeEtapa: 'D+5',
      avisarGerente: true,
      avisarVendedor: true,
      bloquearPedidos: false,
      ativo: true,
    },
    {
      etapaDias: '15',
      nomeEtapa: 'D+15',
      avisarGerente: true,
      avisarVendedor: true,
      bloquearPedidos: true,
      ativo: true,
    },
  ],
});

const colunas: QTableColumn<ReguaCobrancaPainelItemDto>[] = [
  { name: 'nomeEtapa', label: 'Etapa', field: 'nomeEtapa', align: 'left' },
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'parcela', label: 'Parcela', field: 'parcela', align: 'right' },
  { name: 'vencimento', label: 'Vencimento', field: 'vencimento', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'saldo', label: 'Saldo', field: 'saldo', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
];

function addEtapa(): void {
  form.etapas.push({
    etapaDias: '30',
    nomeEtapa: 'D+30',
    avisarGerente: true,
    avisarVendedor: true,
    bloquearPedidos: true,
    ativo: true,
  });
}

async function onSalvar(): Promise<void> {
  await salvar(form);
}

watch(
  config,
  (value) => {
    if (!value?.length) return;
    form.ativo = value.some((e) => e.ativo);
    form.etapas = value.map((e) => ({
      etapaDias: String(e.etapaDias),
      nomeEtapa: e.nomeEtapa,
      avisarGerente: e.avisarGerente,
      avisarVendedor: e.avisarVendedor,
      bloquearPedidos: e.bloquearPedidos,
      ativo: e.ativo,
    }));
  },
  { immediate: true },
);

onMounted(() => {
  void carregarConfig();
  void carregarPainel();
});
</script>

<style scoped>
.secao-titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-md);
}
.etapa {
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-2);
}
</style>
