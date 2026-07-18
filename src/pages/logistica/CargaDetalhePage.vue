<template>
  <q-page class="agro-page">
    <app-page-header titulo="Carga" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="carga?.status === StatusCargaLogistica.Programado"
          color="primary"
          unelevated
          label="Iniciar"
          descricao="Iniciar carga"
          :loading="salvando"
          @click="iniciarCarga(id)"
        />
        <agro-btn
          v-if="carga?.status === StatusCargaLogistica.EmRota"
          color="primary"
          unelevated
          label="Concluir"
          descricao="Concluir carga"
          :loading="salvando"
          @click="concluirCarga(id)"
        />
        <agro-btn
          v-if="
            carga?.status === StatusCargaLogistica.Programado ||
            carga?.status === StatusCargaLogistica.EmRota
          "
          color="negative"
          unelevated
          label="Cancelar"
          descricao="Cancelar carga"
          :loading="salvando"
          @click="cancelarCarga(id)"
        />
        <agro-btn
          v-if="carga?.status === StatusCargaLogistica.Programado"
          flat
          label="Editar"
          descricao="Editar carga"
          :to="{ name: 'logistica-carga-editar', params: { id } }"
        />
      </div>
    </app-page-header>

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && !carga" :campos="5" />
      <template v-else-if="carga">
        <agro-card class="q-mb-md">
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-3">
              <div class="text-caption">Número</div>
              <div class="text-metric">{{ carga.numero }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Status</div>
              <logistica-status-badge :valor="carga.status" />
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Região</div>
              <div>{{ carga.regiao }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Motorista</div>
              <div>{{ carga.motoristaNome }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Saída</div>
              <div>{{ formatarDataHora(carga.dataHoraSaida) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Peso (kg)</div>
              <div class="text-metric">
                {{ carga.pesoKg != null ? formatarDecimal(carga.pesoKg) : '—' }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Pedágio</div>
              <div class="text-metric">
                {{ carga.pedagio != null ? formatarMoeda(carga.pedagio) : '—' }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Custo motorista</div>
              <div class="text-metric">
                {{ carga.custoMotorista != null ? formatarMoeda(carga.custoMotorista) : '—' }}
              </div>
            </div>
          </div>
        </agro-card>

        <agro-card>
          <h3 class="titulo-sec">Paradas</h3>
          <empty-state
            v-if="!carga.paradas?.length"
            titulo="Sem paradas"
            descricao="Nenhuma parada cadastrada nesta carga."
            icon="place"
          />
          <q-table
            v-else
            flat
            bordered
            row-key="id"
            :rows="carga.paradas"
            :columns="colunasParadas"
            hide-pagination
            :rows-per-page-options="[0]"
          >
            <template #body-cell-kmParcial="props">
              <q-td :props="props" class="text-metric">
                {{ props.row.kmParcial != null ? formatarDecimal(props.row.kmParcial) : '—' }}
              </q-td>
            </template>
          </q-table>
        </agro-card>
      </template>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import LogisticaStatusBadge from 'components/logistica/LogisticaStatusBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useLogistica } from 'composables/useLogistica';
import { StatusCargaLogistica } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { CargaParadaDto } from 'types/dtos/logistica.dto';
import { formatarDataHora, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = computed(() => String(route.params.id));
const {
  carga,
  carregando,
  salvando,
  obterCarga,
  iniciarCarga,
  concluirCarga,
  cancelarCarga,
} = useLogistica();

const subtitulo = computed(() =>
  carga.value ? `${carga.value.numero} · ${carga.value.regiao}` : '',
);

const colunasParadas: QTableColumn<CargaParadaDto>[] = [
  { name: 'ordem', label: 'Ordem', field: 'ordem', align: 'left' },
  { name: 'clienteNome', label: 'Cliente', field: 'clienteNome', align: 'left' },
  { name: 'cidade', label: 'Cidade', field: 'cidade', align: 'left' },
  { name: 'uf', label: 'UF', field: 'uf', align: 'left' },
  { name: 'kmParcial', label: 'Km parcial', field: 'kmParcial', align: 'right' },
];

onMounted(() => {
  void obterCarga(id.value);
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
</style>
