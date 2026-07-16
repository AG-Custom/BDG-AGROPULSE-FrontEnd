<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Conciliação bancária"
      subtitulo="Importação OFX, vínculo e proposta de lançamentos."
    />

    <section class="agro-section">
      <q-banner v-if="conciliacao?.stub" rounded class="q-mb-md stub-banner">
        Integração externa em modo stub — importação OFX pode retornar dados simulados.
        <span v-if="conciliacao.mensagem"> {{ conciliacao.mensagem }}</span>
      </q-banner>

      <agro-card class="q-mb-md">
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-5">
            <q-select
              v-model="contaBancariaId"
              outlined
              emit-value
              map-options
              label="Conta bancária"
              :options="contaOpcoes"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-file
              v-model="arquivo"
              outlined
              label="Arquivo OFX"
              accept=".ofx,.OFX"
              clearable
            />
          </div>
          <div class="col-12 col-md-3">
            <agro-btn
              color="primary"
              unelevated
              class="full-width"
              label="Importar OFX"
              descricao="Importar arquivo OFX"
              :loading="salvando"
              :disable="!contaBancariaId || !arquivo"
              @click="onImportar"
            />
          </div>
        </div>
      </agro-card>

      <agro-card>
        <template #header>
          <div class="header-acoes">
            <h3 class="secao-titulo">Lançamentos</h3>
            <agro-btn
              v-if="conciliacao"
              flat
              icon="auto_fix"
              label="Propor lançamentos"
              descricao="Gerar propostas"
              :loading="salvando"
              @click="propor"
            />
          </div>
        </template>

        <empty-state
          v-if="!conciliacao"
          titulo="Nenhuma conciliação"
          descricao="Importe um arquivo OFX para iniciar."
          icon="sync_alt"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="conciliacao.lancamentos"
          :columns="colunas"
          :rows-per-page-options="[15, 30, 50]"
        >
          <template #body-cell-data="props">
            <q-td :props="props">{{ formatarData(props.row.data) }}</q-td>
          </template>
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
          </template>
          <template #body-cell-vinculado="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.vinculado ? 'Vinculado' : 'Pendente'"
                :variant="props.row.vinculado ? 'success' : 'warning'"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-btn
                v-if="!props.row.vinculado"
                flat
                dense
                label="Vincular CR"
                descricao="Vincular a conta a receber"
                :loading="salvando"
                @click="vincularCr(props.row.id)"
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
import EmptyState from 'components/ui/EmptyState.vue';
import { useConciliacaoBancaria } from 'composables/useConciliacaoBancaria';
import { useContasBancarias } from 'composables/useContasBancarias';
import { useContasReceber } from 'composables/useContasReceber';
import { ContaReceberStatus } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { ConciliacaoLancamentoDto } from 'types/dtos/financeiro-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { onMounted, ref } from 'vue';

const { conciliacao, salvando, importarOfx, vincular, propor } = useConciliacaoBancaria();
const { contaOpcoes, carregar: carregarContas } = useContasBancarias();
const { contas, carregar: carregarCr } = useContasReceber();

const contaBancariaId = ref('');
const arquivo = ref<File | null>(null);

const colunas: QTableColumn<ConciliacaoLancamentoDto>[] = [
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'vinculado', label: 'Status', field: 'vinculado', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

async function onImportar(): Promise<void> {
  if (!contaBancariaId.value || !arquivo.value) return;
  await importarOfx(contaBancariaId.value, arquivo.value);
}

async function vincularCr(lancamentoId: string): Promise<void> {
  const aberta = contas.value.find((c) => c.status === ContaReceberStatus.Aberta);
  if (!aberta) return;
  await vincular({ lancamentoId, contaReceberId: aberta.id });
}

onMounted(() => {
  void carregarContas();
  void carregarCr({ status: ContaReceberStatus.Aberta });
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
</style>
