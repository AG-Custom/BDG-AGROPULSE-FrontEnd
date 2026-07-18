<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Planos preventivos"
      subtitulo="Gatilhos por horas, km ou dias."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo plano"
        descricao="Criar plano"
        :to="{ name: 'manutencao-plano-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <q-banner
        v-if="alertas.length > 0"
        rounded
        class="q-mb-md alerta-banner"
        :class="temVencido ? 'alerta-banner--erro' : 'alerta-banner--aviso'"
      >
        <template #avatar>
          <q-icon :name="temVencido ? 'warning' : 'schedule'" />
        </template>
        {{ alertas.length }} alerta(s) de manutenção preventiva —
        {{ alertas.filter((a) => a.status === StatusPlanoManutencao.Vencido).length }} vencido(s),
        {{ alertas.filter((a) => a.status === StatusPlanoManutencao.Proximo).length }} próximo(s).
      </q-banner>

      <agro-card>
        <agro-table-skeleton v-if="carregando && planos.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && planos.length === 0"
          titulo="Nenhum plano"
          descricao="Crie planos preventivos por ativo."
          icon="event_repeat"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo plano"
            descricao="Criar"
            :to="{ name: 'manutencao-plano-novo' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="planos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-intervalo="props">
            <q-td :props="props" class="text-metric">{{ props.row.intervalo }}</q-td>
          </template>
          <template #body-cell-proximoValor="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.proximoValor != null ? formatarDecimal(props.row.proximoValor) : '—' }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <manutencao-status-badge :valor="props.row.status" tipo="plano" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-btn
                flat
                round
                dense
                icon="play_arrow"
                color="primary"
                descricao="Registrar execução"
                @click="abrirExecucao(props.row)"
              />
              <agro-btn
                flat
                round
                dense
                icon="edit"
                descricao="Editar plano"
                :to="{ name: 'manutencao-plano-editar', params: { id: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogExecucao" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Registrar execução</h4>
          <p class="text-caption">{{ planoSelecionado?.descricao }}</p>
        </q-card-section>
        <q-card-section>
          <q-form greedy @submit.prevent="salvarExecucao">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="formExecucao.dataExecucao"
                  outlined
                  label="Data execução"
                  type="date"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formExecucao.valorMedidor"
                  outlined
                  label="Valor medidor (horas/km)"
                  type="number"
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogExecucao = false" />
              <agro-btn color="primary" unelevated label="Registrar" type="submit" :loading="salvando" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import ManutencaoStatusBadge from 'components/manutencao/ManutencaoStatusBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useManutencao } from 'composables/useManutencao';
import { StatusPlanoManutencao } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  PlanoManutencaoDto,
  RegistrarExecucaoPlanoFormModel,
} from 'types/dtos/manutencao.dto';
import { formatarDecimal } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const {
  planos,
  alertas,
  ativos,
  carregando,
  salvando,
  carregarPlanos,
  carregarAlertas,
  carregarAtivos,
  registrarExecucaoPlano,
} = useManutencao();

const dialogExecucao = ref(false);
const planoSelecionado = ref<PlanoManutencaoDto | null>(null);
const formExecucao = ref<RegistrarExecucaoPlanoFormModel>({
  dataExecucao: new Date().toISOString().slice(0, 10),
  valorMedidor: '',
});

const temVencido = computed(() =>
  alertas.value.some((a) => a.status === StatusPlanoManutencao.Vencido),
);

function nomeAtivo(ativoId: string): string {
  return ativos.value.find((a) => a.id === ativoId)?.nome ?? ativoId;
}

const colunas: QTableColumn<PlanoManutencaoDto>[] = [
  { name: 'ativoId', label: 'Ativo', field: (r) => nomeAtivo(r.ativoId), align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'tipoGatilho', label: 'Gatilho', field: 'tipoGatilho', align: 'left' },
  { name: 'intervalo', label: 'Intervalo', field: 'intervalo', align: 'right' },
  { name: 'proximoValor', label: 'Próximo', field: 'proximoValor', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirExecucao(plano: PlanoManutencaoDto): void {
  planoSelecionado.value = plano;
  formExecucao.value = {
    dataExecucao: new Date().toISOString().slice(0, 10),
    valorMedidor: '',
  };
  dialogExecucao.value = true;
}

async function salvarExecucao(): Promise<void> {
  if (!planoSelecionado.value) return;
  const ok = await registrarExecucaoPlano(planoSelecionado.value.id, formExecucao.value);
  if (ok) dialogExecucao.value = false;
}

onMounted(() => {
  void carregarAtivos();
  void carregarPlanos();
  void carregarAlertas();
});
</script>

<style scoped>
.alerta-banner--aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
}
.alerta-banner--erro {
  background: var(--color-error-50);
  color: var(--color-error-700);
}
.dialog {
  min-width: min(420px, 92vw);
  padding: var(--spacing-2);
}
.titulo {
  margin: 0;
  font-size: var(--font-size-lg);
}
</style>
