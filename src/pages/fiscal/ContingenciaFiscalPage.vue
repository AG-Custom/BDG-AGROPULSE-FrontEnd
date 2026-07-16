<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Contingência SEFAZ"
      subtitulo="Status, fila de pendentes e alerta de 168h."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="sync"
        label="Reprocessar"
        descricao="Reprocessar fila de contingência"
        :loading="salvando"
        @click="reprocessar"
      />
    </app-page-header>

    <section class="agro-section grid">
      <agro-card>
        <h3 class="titulo">Status</h3>
        <agro-form-skeleton v-if="carregando && !status" :campos="3" />
        <template v-else-if="status">
          <div class="status-grid row q-col-gutter-md q-mb-md">
            <div class="col-6 col-md-3">
              <span class="label">Modo</span>
              <p>{{ status.modo }}</p>
            </div>
            <div class="col-6 col-md-3">
              <span class="label">Ativo</span>
              <p>
                <agro-badge
                  :label="status.ativo ? 'Sim' : 'Não'"
                  :variant="status.ativo ? 'warning' : 'success'"
                />
              </p>
            </div>
            <div class="col-6 col-md-3">
              <span class="label">Desde</span>
              <p>{{ formatarData(status.ativoDesde) }}</p>
            </div>
            <div class="col-6 col-md-3">
              <span class="label">Até</span>
              <p>{{ status.ativoAte ? formatarData(status.ativoAte) : '—' }}</p>
            </div>
          </div>
          <div class="row q-col-gutter-md items-end">
            <div class="col-12 col-md-4">
              <q-select
                v-model="modoAtivar"
                outlined
                emit-value
                map-options
                label="Modo ao ativar"
                :options="ModoContingenciaAtivarOpcoes"
              />
            </div>
            <div class="col-12 col-md-8 acoes">
              <agro-btn
                color="primary"
                unelevated
                label="Ativar"
                descricao="Ativar contingência"
                :loading="salvando"
                :disable="!modoAtivar"
                @click="onAtivar"
              />
              <agro-btn
                flat
                label="Desativar"
                descricao="Desativar contingência"
                :loading="salvando"
                :disable="!status.ativo"
                @click="desativar"
              />
            </div>
          </div>
        </template>
        <empty-state
          v-else
          titulo="Status indisponível"
          descricao="Não foi possível carregar o status de contingência."
          icon="cloud_off"
        />
      </agro-card>

      <agro-card>
        <h3 class="titulo">Pendentes</h3>
        <agro-table-skeleton v-if="carregando && pendentes.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && pendentes.length === 0"
          titulo="Nenhum pendente"
          descricao="A fila de contingência está vazia."
          icon="inbox"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="pendentes"
          :columns="colunasPendentes"
          :loading="carregando"
          :rows-per-page-options="[10, 25]"
        >
          <template #body-cell-proximaTentativa="props">
            <q-td :props="props">{{ formatarData(props.row.proximaTentativa) }}</q-td>
          </template>
        </q-table>
      </agro-card>

      <agro-card>
        <h3 class="titulo">Alerta 168h</h3>
        <agro-table-skeleton v-if="carregando && alertas.length === 0" :colunas="4" />
        <empty-state
          v-else-if="!carregando && alertas.length === 0"
          titulo="Sem alertas"
          descricao="Nenhuma nota próxima do limite de 168h."
          icon="verified"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="alertas"
          :columns="colunasAlertas"
          :loading="carregando"
          :rows-per-page-options="[10, 25]"
        >
          <template #body-cell-valorTotal="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorTotal) }}</q-td>
          </template>
          <template #body-cell-contingenciaDesde="props">
            <q-td :props="props">
              {{ props.row.contingenciaDesde ? formatarData(props.row.contingenciaDesde) : '—' }}
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
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useContingenciaFiscal } from 'composables/useContingenciaFiscal';
import {
  ModoContingenciaAtivarOpcoes,
  type ModoContingenciaFiscalValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { FilaContingenciaDto, NotaFiscalGestaoDto } from 'types/dtos/fiscal-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { onMounted, ref } from 'vue';

const {
  status,
  pendentes,
  alertas,
  carregando,
  salvando,
  carregar,
  ativar,
  desativar,
  reprocessar,
} = useContingenciaFiscal();

const modoAtivar = ref<ModoContingenciaFiscalValor | ''>('');

const colunasPendentes: QTableColumn<FilaContingenciaDto>[] = [
  { name: 'notaFiscalId', label: 'Nota', field: 'notaFiscalId', align: 'left' },
  { name: 'tentativas', label: 'Tentativas', field: 'tentativas', align: 'right' },
  { name: 'proximaTentativa', label: 'Próxima', field: 'proximaTentativa', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'ultimoErro', label: 'Último erro', field: 'ultimoErro', align: 'left' },
];

const colunasAlertas: QTableColumn<NotaFiscalGestaoDto>[] = [
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'modeloDocumento', label: 'Modelo', field: 'modeloDocumento', align: 'left' },
  { name: 'valorTotal', label: 'Valor', field: 'valorTotal', align: 'right' },
  { name: 'contingenciaDesde', label: 'Desde', field: 'contingenciaDesde', align: 'left' },
];

async function onAtivar(): Promise<void> {
  if (!modoAtivar.value) return;
  await ativar(modoAtivar.value);
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.grid {
  display: grid;
  gap: var(--spacing-6);
}
.titulo {
  margin: 0 0 var(--spacing-4);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.label {
  display: block;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.acoes {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}
</style>
