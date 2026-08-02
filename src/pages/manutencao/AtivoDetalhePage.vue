<template>
  <q-page class="agro-page">
    <app-page-header :titulo="ativo?.nome ?? 'Ativo'" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          flat
          icon="edit"
          label="Editar"
          descricao="Editar ativo"
          :to="{ name: 'manutencao-ativo-editar', params: { id } }"
        />
        <agro-btn
          color="primary"
          unelevated
          icon="speed"
          label="Horímetro"
          descricao="Registrar leitura"
          @click="dialogHorimetro = true"
        />
      </div>
    </app-page-header>

    <section class="agro-section detalhe">
      <agro-form-skeleton v-if="carregando && !ativo" :campos="6" />
      <template v-else-if="ativo">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-3">
              <div class="text-caption">Status</div>
              <manutencao-status-badge :valor="ativo.status" tipo="ativo" />
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Tipo</div>
              <div>{{ ativo.tipo }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Fabricante / Modelo</div>
              <div>{{ ativo.fabricante ?? '—' }} {{ ativo.modelo ?? '' }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Série</div>
              <div>{{ ativo.numeroSerie ?? '—' }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Horímetro</div>
              <div class="text-metric">
                {{ ativo.horimetroAtual != null ? formatarDecimal(ativo.horimetroAtual) : '—' }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Km</div>
              <div class="text-metric">
                {{ ativo.kmAtual != null ? formatarDecimal(ativo.kmAtual) : '—' }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Última manutenção</div>
              <div>{{ formatarData(ativo.ultimaManutencao) || '—' }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Próxima manutenção</div>
              <div>{{ formatarData(ativo.proximaManutencao) || '—' }}</div>
            </div>
          </div>
        </agro-card>

        <agro-card v-if="depreciacao">
          <h3 class="titulo-sec">Depreciação</h3>
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-3">
              <div class="text-caption">Valor contábil atual</div>
              <div class="text-metric">{{ formatarMoeda(depreciacao.valorContabilAtual) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Acumulada</div>
              <div class="text-metric">{{ formatarMoeda(depreciacao.depreciacaoAcumulada) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Anual</div>
              <div class="text-metric">{{ formatarMoeda(depreciacao.depreciacaoAnual) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Mensal</div>
              <div class="text-metric">{{ formatarMoeda(depreciacao.depreciacaoMensal) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Método</div>
              <div>{{ depreciacao.metodo }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Anos decorridos</div>
              <div class="text-metric">{{ formatarDecimal(depreciacao.anosDecorridos) }}</div>
            </div>
          </div>
        </agro-card>
      </template>
    </section>

    <q-dialog v-model="dialogHorimetro" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Registrar horímetro</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy @submit.prevent="salvarHorimetro">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="formHorimetro.horimetro"
                  outlined
                  label="Horímetro"
                  type="number"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12">
                <q-input v-model="formHorimetro.km" outlined label="Km (opcional)" type="number" />
              </div>
              <div class="col-12">
                <q-input v-model="formHorimetro.lidoEm" outlined label="Lido em" type="datetime-local" />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogHorimetro = false" />
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
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useManutencao } from 'composables/useManutencao';
import type { LeituraHorimetroFormModel } from 'types/dtos/manutencao.dto';
import { formatarData, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = computed(() => String(route.params.id));
const {
  ativo,
  depreciacao,
  carregando,
  salvando,
  obterAtivo,
  carregarDepreciacao,
  registrarLeituraHorimetro,
} = useManutencao();

const dialogHorimetro = ref(false);
const formHorimetro = ref<LeituraHorimetroFormModel>({ horimetro: '', km: '', lidoEm: '' });

const subtitulo = computed(() =>
  ativo.value ? `${ativo.value.tipo} · ${ativo.value.localizacao ?? 'Sem localização'}` : '',
);

async function salvarHorimetro(): Promise<void> {
  const ok = await registrarLeituraHorimetro(id.value, formHorimetro.value);
  if (ok) {
    dialogHorimetro.value = false;
    await carregarDepreciacao(id.value);
  }
}

onMounted(async () => {
  const ok = await obterAtivo(id.value);
  if (ok) await carregarDepreciacao(id.value);
});
</script>

<style scoped>
.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
.detalhe {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}
.titulo-sec {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-3);
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
