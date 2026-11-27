<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Conciliação bancária"
      subtitulo="Extrato do banco, vínculo automático com títulos e proposta de lançamentos."
    />

    <section class="agro-section">
      <q-banner v-if="conciliacao?.stub" rounded class="q-mb-md stub-banner">
        Dados simulados. <span v-if="conciliacao.mensagemStub">{{ conciliacao.mensagemStub }}</span>
      </q-banner>

      <agro-card v-if="podeEditar" class="q-mb-md">
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
            <q-select
              v-model="contaBancariaId"
              outlined
              emit-value
              map-options
              label="Conta bancária"
              :options="contaOpcoes"
            />
          </div>
          <div class="col-6 col-md-2">
            <q-input v-model="dataInicio" outlined type="date" label="De" />
          </div>
          <div class="col-6 col-md-2">
            <q-input v-model="dataFim" outlined type="date" label="Até" />
          </div>
          <div class="col-12 col-md-4">
            <agro-btn
              color="primary"
              unelevated
              class="full-width"
              label="Importar extrato"
              descricao="Importar extrato do banco"
              :loading="salvando"
              :disable="!periodoValido"
              @click="onImportar"
            />
          </div>
        </div>
        <p v-if="dataInicio && dataFim && !periodoValido" class="aviso-periodo">
          Informe um período de no máximo 31 dias.
        </p>
      </agro-card>

      <agro-card>
        <template #header>
          <div class="header-acoes">
            <h3 class="secao-titulo">Lançamentos</h3>
            <div v-if="conciliacao && podeEditar" class="header-acoes__botoes">
              <agro-btn
                flat
                icon="auto_fix_high"
                label="Conciliar automaticamente"
                descricao="Vincular lançamentos a títulos de mesmo valor"
                :loading="salvando"
                @click="conciliarAutomaticamente"
              />
              <agro-btn
                flat
                icon="auto_fix"
                label="Propor lançamentos"
                descricao="Gerar propostas para o restante"
                :loading="salvando"
                @click="propor"
              />
            </div>
          </div>
        </template>

        <agro-table-skeleton v-if="carregando && !conciliacao" :colunas="5" />
        <empty-state
          v-else-if="!conciliacao"
          titulo="Nenhuma conciliação"
          :descricao="podeEditar ? 'Importe o extrato de um período para iniciar.' : 'Ainda não há extrato importado.'"
          icon="sync_alt"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="conciliacao.transacoes"
          :columns="colunas"
          :rows-per-page-options="[15, 30, 50]"
        >
          <template #body-cell-data="props">
            <q-td :props="props">{{ formatarData(props.row.data) }}</q-td>
          </template>
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.tipo === 'Debito' ? '-' : '' }}{{ formatarMoeda(props.row.valor) }}
            </q-td>
          </template>
          <template #body-cell-situacao="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloSituacao(props.row)"
                :variant="varianteSituacao(props.row)"
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
import { useConciliacaoBancaria } from 'composables/useConciliacaoBancaria';
import { useContasBancarias } from 'composables/useContasBancarias';
import { usePermissao } from 'composables/usePermissao';
import { AreaAcesso } from 'constants/areas-acesso';
import { NivelAcesso } from 'constants/niveis-acesso';
import type { QTableColumn } from 'quasar';
import type { TransacaoBancariaDto } from 'types/dtos/financeiro-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const {
  conciliacao,
  carregando,
  salvando,
  carregarUltima,
  importarExtrato,
  conciliarAutomaticamente,
  propor,
} = useConciliacaoBancaria();
const { contaOpcoes, carregar: carregarContas } = useContasBancarias();

const { pode } = usePermissao();
const podeEditar = computed(() => pode(AreaAcesso.Financeiro, NivelAcesso.Editar));

const hoje = new Date();
const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
const contaBancariaId = ref('');
const dataInicio = ref(trintaDiasAtras.toISOString().slice(0, 10));
const dataFim = ref(hoje.toISOString().slice(0, 10));

const periodoValido = computed(() => {
  if (!contaBancariaId.value || !dataInicio.value || !dataFim.value) return false;
  const dias = (Date.parse(dataFim.value) - Date.parse(dataInicio.value)) / 86_400_000;
  return dias >= 0 && dias <= 31;
});

const colunas: QTableColumn<TransacaoBancariaDto>[] = [
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'situacao', label: 'Situação', field: 'conciliado', align: 'left' },
];

function rotuloSituacao(t: TransacaoBancariaDto): string {
  if (t.conciliado) return t.contaReceberId ? 'Conciliado (receber)' : 'Conciliado (pagar)';
  return t.propostaLancamento ? 'Proposta de lançamento' : 'Pendente';
}

function varianteSituacao(t: TransacaoBancariaDto): 'success' | 'info' | 'warning' {
  if (t.conciliado) return 'success';
  return t.propostaLancamento ? 'info' : 'warning';
}

async function onImportar(): Promise<void> {
  await importarExtrato({
    contaBancariaId: contaBancariaId.value,
    dataInicio: dataInicio.value,
    dataFim: dataFim.value,
  });
}

onMounted(() => {
  void carregarContas();
  void carregarUltima();
});
</script>

<style scoped>
.stub-banner {
  background: var(--color-surface-sunken);
  border: var(--border-width-thin) solid var(--color-border-default);
}
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
  gap: var(--spacing-3);
}
.header-acoes__botoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
.aviso-periodo {
  margin: var(--spacing-3) 0 0;
  color: var(--color-text-secondary);
}
</style>
