<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Planejamento de cultura, área e época." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.nome"
                outlined
                label="Nome"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.cultura"
                outlined
                label="Cultura"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.fazendaId"
                outlined
                label="Fazenda"
                clearable
                emit-value
                map-options
                :options="fazendaOpcoes"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.talhaoId"
                outlined
                label="Talhão"
                clearable
                emit-value
                map-options
                :options="talhaoOpcoes"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.areaPlanejadaHa"
                outlined
                label="Área planejada (ha)"
                type="number"
                step="0.01"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.areaRealizadaHa"
                outlined
                label="Área realizada (ha)"
                type="number"
                step="0.01"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.dataInicio" outlined label="Início" type="date" />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.dataFim" outlined label="Fim" type="date" />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.produtividadePlanejada"
                outlined
                label="Prod. planejada"
                type="number"
                step="0.01"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.produtividadeRealizada"
                outlined
                label="Prod. realizada"
                type="number"
                step="0.01"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.observacoes"
                outlined
                label="Observações"
                type="textarea"
                autogrow
              />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'safras-planejamento' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Criar' : 'Salvar'"
              type="submit"
              :loading="salvando"
            />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useFazendas } from 'composables/useFazendas';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import { useSafras } from 'composables/useSafras';
import type { SafraFormModel } from 'types/dtos/safras.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { safra, salvando, obter, criar, editar } = useSafras();
const { fazendaOpcoes, carregar: carregarFazendas } = useFazendas();
const { talhoes, carregarTalhoes } = useRastreabilidade();

const modo = computed(() => (route.name === 'safra-editar' ? 'editar' : 'criar'));
const safraId = computed(() => route.params.id as string | undefined);
const titulo = computed(() =>
  modo.value === 'criar' ? 'Nova safra' : 'Editar safra',
);

const carregandoPagina = ref(false);
const formulario = ref<SafraFormModel>({
  nome: '',
  cultura: '',
  fazendaId: '',
  talhaoId: '',
  areaPlanejadaHa: '',
  areaRealizadaHa: '',
  dataInicio: '',
  dataFim: '',
  produtividadePlanejada: '',
  produtividadeRealizada: '',
  observacoes: '',
});

const talhaoOpcoes = computed(() =>
  talhoes.value.filter((t) => t.ativo).map((t) => ({ label: t.nome, value: t.id })),
);

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criada = await criar(formulario.value);
    if (criada) await router.push({ name: 'safras-planejamento' });
    return;
  }
  if (!safraId.value) return;
  const ok = await editar(safraId.value, formulario.value);
  if (ok) await router.push({ name: 'safras-planejamento' });
}

onMounted(async () => {
  void carregarFazendas();
  void carregarTalhoes();

  if (modo.value === 'editar' && safraId.value) {
    carregandoPagina.value = true;
    const ok = await obter(safraId.value);
    if (!ok || !safra.value) {
      await router.replace({ name: 'safras-planejamento' });
      return;
    }
    formulario.value = {
      nome: safra.value.nome,
      cultura: safra.value.cultura,
      fazendaId: safra.value.fazendaId ?? '',
      talhaoId: safra.value.talhaoId ?? '',
      areaPlanejadaHa:
        safra.value.areaPlanejadaHa != null ? String(safra.value.areaPlanejadaHa) : '',
      areaRealizadaHa:
        safra.value.areaRealizadaHa != null ? String(safra.value.areaRealizadaHa) : '',
      dataInicio: safra.value.dataInicio?.slice(0, 10) ?? '',
      dataFim: safra.value.dataFim?.slice(0, 10) ?? '',
      produtividadePlanejada:
        safra.value.produtividadePlanejada != null
          ? String(safra.value.produtividadePlanejada)
          : '',
      produtividadeRealizada:
        safra.value.produtividadeRealizada != null
          ? String(safra.value.produtividadeRealizada)
          : '',
      observacoes: safra.value.observacoes ?? '',
    };
    carregandoPagina.value = false;
  }
});
</script>
