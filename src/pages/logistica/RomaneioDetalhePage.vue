<template>
  <q-page class="agro-page">
    <app-page-header titulo="Romaneio" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="romaneio?.status === StatusRomaneioLogistica.Pendente"
          color="primary"
          unelevated
          label="Iniciar rota"
          descricao="Iniciar rota"
          :loading="salvando"
          @click="iniciarRotaRomaneio(id)"
        />
        <agro-btn
          v-if="
            romaneio?.status === StatusRomaneioLogistica.EmRota ||
            romaneio?.status === StatusRomaneioLogistica.Ocorrencia
          "
          color="primary"
          unelevated
          label="Entregar"
          descricao="Marcar entregue"
          :loading="salvando"
          @click="entregarRomaneio(id)"
        />
        <agro-btn
          v-if="podeOcorrencia"
          flat
          color="negative"
          label="Ocorrência"
          descricao="Registrar ocorrência"
          @click="dialogOcorrencia = true"
        />
      </div>
    </app-page-header>

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && !romaneio" :campos="5" />
      <template v-else-if="romaneio">
        <agro-card class="q-mb-md">
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-3">
              <div class="text-caption">Número</div>
              <div class="text-metric">{{ romaneio.numero }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Status</div>
              <logistica-status-badge :valor="romaneio.status" />
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Rastreio</div>
              <div class="text-metric">{{ romaneio.codigoRastreamento }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Cliente</div>
              <div>{{ romaneio.clienteNome }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-caption">Endereço</div>
              <div>{{ romaneio.endereco }} — {{ romaneio.cidade }}/{{ romaneio.uf }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Prevista</div>
              <div>{{ formatarData(romaneio.dataPrevista) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Entrega</div>
              <div>
                {{ romaneio.dataHoraEntrega ? formatarDataHora(romaneio.dataHoraEntrega) : '—' }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Peso (kg)</div>
              <div class="text-metric">
                {{ romaneio.pesoKg != null ? formatarDecimal(romaneio.pesoKg) : '—' }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Volumes</div>
              <div class="text-metric">{{ romaneio.volumes ?? '—' }}</div>
            </div>
          </div>
        </agro-card>

        <agro-card>
          <h3 class="titulo-sec">Ocorrências</h3>
          <empty-state
            v-if="!romaneio.ocorrencias?.length"
            titulo="Sem ocorrências"
            descricao="Nenhuma ocorrência registrada neste romaneio."
            icon="report_problem"
          />
          <q-table
            v-else
            flat
            bordered
            row-key="id"
            :rows="romaneio.ocorrencias"
            :columns="colunasOcorrencias"
            hide-pagination
            :rows-per-page-options="[0]"
          />
        </agro-card>
      </template>
    </section>

    <q-dialog v-model="dialogOcorrencia" persistent>
      <q-card class="dialog-card">
        <q-card-section>
          <div class="text-h6">Registrar ocorrência</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form greedy @submit.prevent="salvarOcorrencia">
            <q-select
              v-model="formOcorrencia.tipo"
              outlined
              label="Tipo"
              emit-value
              map-options
              class="field-required q-mb-md"
              :options="TipoOcorrenciaEntregaOpcoes"
              :rules="[obrigatorio]"
            />
            <q-input
              v-model="formOcorrencia.descricao"
              outlined
              label="Descrição"
              type="textarea"
              autogrow
              class="field-required q-mb-md"
              :rules="[obrigatorio]"
            />
            <q-toggle v-model="formOcorrencia.temFoto" label="Possui foto" color="primary" />
            <q-toggle
              v-model="formOcorrencia.temGeolocalizacao"
              label="Possui geolocalização"
              color="primary"
            />
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogOcorrencia = false" />
              <agro-btn
                color="primary"
                unelevated
                label="Registrar"
                descricao="Salvar ocorrência"
                type="submit"
                :loading="salvando"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import LogisticaStatusBadge from 'components/logistica/LogisticaStatusBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { ocorrenciaVazia, useLogistica } from 'composables/useLogistica';
import {
  StatusRomaneioLogistica,
  TipoOcorrenciaEntregaOpcoes,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { OcorrenciaEntregaDto, RegistrarOcorrenciaFormModel } from 'types/dtos/logistica.dto';
import { formatarData, formatarDataHora, formatarDecimal } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = computed(() => String(route.params.id));
const {
  romaneio,
  carregando,
  salvando,
  obterRomaneio,
  iniciarRotaRomaneio,
  entregarRomaneio,
  registrarOcorrencia,
} = useLogistica();

const dialogOcorrencia = ref(false);
const formOcorrencia = ref<RegistrarOcorrenciaFormModel>(ocorrenciaVazia());

const subtitulo = computed(() =>
  romaneio.value ? `${romaneio.value.numero} · ${romaneio.value.clienteNome}` : '',
);

const podeOcorrencia = computed(() => {
  const s = romaneio.value?.status;
  return (
    s === StatusRomaneioLogistica.Pendente ||
    s === StatusRomaneioLogistica.EmRota ||
    s === StatusRomaneioLogistica.Ocorrencia
  );
});

const colunasOcorrencias: QTableColumn<OcorrenciaEntregaDto>[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
];

async function salvarOcorrencia(): Promise<void> {
  const ok = await registrarOcorrencia(id.value, formOcorrencia.value);
  if (ok) {
    dialogOcorrencia.value = false;
    formOcorrencia.value = ocorrenciaVazia();
  }
}

onMounted(() => {
  void obterRomaneio(id.value);
});
</script>

<style scoped>
.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
.titulo-sec {
  margin: 0 0 var(--spacing-3);
  font-size: var(--font-size-md);
  font-family: var(--font-family-display);
}
.dialog-card {
  min-width: min(480px, 92vw);
  background: var(--color-surface-default);
}
</style>
