<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Régua de cobrança"
      subtitulo="Configuração de etapas e painel de clientes em atraso."
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
              <q-input v-model="etapa.diasAtraso" outlined dense label="D+ dias" />
            </div>
            <div class="col-12 col-md-3 flex flex-center">
              <q-toggle v-model="etapa.avisoGerente" label="Aviso gerente" />
            </div>
            <div class="col-12 col-md-3 flex flex-center">
              <q-toggle v-model="etapa.avisoVendedor" label="Aviso vendedor" />
            </div>
            <div class="col-12 col-md-3 flex flex-center">
              <q-toggle v-model="etapa.bloquearPedidos" label="Bloquear pedidos" />
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
        <agro-table-skeleton v-if="carregando && !painel" :colunas="5" />
        <empty-state
          v-else-if="!painel || painel.itens.length === 0"
          titulo="Nenhum cliente em atraso"
          descricao="O painel é atualizado pelo processamento diário."
          icon="campaign"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="clienteId"
          :rows="painel.itens"
          :columns="colunas"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-valorEmAberto="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorEmAberto) }}
            </q-td>
          </template>
          <template #body-cell-ultimoAvisoEm="props">
            <q-td :props="props">
              {{ props.row.ultimoAvisoEm ? formatarData(props.row.ultimoAvisoEm) : '—' }}
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
    { diasAtraso: '1', avisoGerente: false, avisoVendedor: true, bloquearPedidos: false },
    { diasAtraso: '5', avisoGerente: true, avisoVendedor: true, bloquearPedidos: false },
    { diasAtraso: '15', avisoGerente: true, avisoVendedor: true, bloquearPedidos: true },
  ],
});

const colunas: QTableColumn<ReguaCobrancaPainelItemDto>[] = [
  { name: 'clienteNome', label: 'Cliente', field: 'clienteNome', align: 'left' },
  { name: 'diasAtraso', label: 'Dias atraso', field: 'diasAtraso', align: 'right' },
  { name: 'valorEmAberto', label: 'Valor', field: 'valorEmAberto', align: 'right' },
  { name: 'etapaAtual', label: 'Etapa', field: 'etapaAtual', align: 'right' },
  { name: 'ultimoAvisoEm', label: 'Último aviso', field: 'ultimoAvisoEm', align: 'left' },
];

function addEtapa(): void {
  form.etapas.push({
    diasAtraso: '30',
    avisoGerente: true,
    avisoVendedor: true,
    bloquearPedidos: true,
  });
}

async function onSalvar(): Promise<void> {
  await salvar(form);
}

watch(
  config,
  (value) => {
    if (!value) return;
    form.ativo = value.ativo;
    form.etapas = value.etapas.map((e) => ({
      diasAtraso: String(e.diasAtraso),
      avisoGerente: e.avisoGerente,
      avisoVendedor: e.avisoVendedor,
      bloquearPedidos: e.bloquearPedidos,
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
