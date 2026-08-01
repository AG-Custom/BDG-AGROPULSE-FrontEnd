<template>
  <q-page class="agro-page agro-page--form">
    <app-page-header :titulo="titulo" subtitulo="Planejamento de cultura, área e época." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />
        <q-form v-else greedy class="agro-formulario safra-form" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
          <h3 class="safra-form__secao-titulo">Dados gerais</h3>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.nome"
                outlined
                label="Nome"
                class="field-required"
                :rules="[obrigatorio]"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.cultura"
                outlined
                label="Cultura"
                class="field-required"
                :rules="[obrigatorio]"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="formulario.fazendaId"
                entidade="fazenda"
                label="Fazenda"
                clearable
                :options="fazendaOpcoes"
                :readonly="somenteLeitura"
                @atualizar="carregarFazendas()"
              />
            </div>
            <div class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="formulario.talhaoId"
                entidade="talhao"
                label="Talhão"
                clearable
                :options="talhaoOpcoes"
                :readonly="somenteLeitura"
                @atualizar="carregarTalhoes()"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="formulario.dataInicio" outlined label="Início" type="date"
                :readonly="somenteLeitura" />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="formulario.dataFim" outlined label="Fim" type="date"
                :readonly="somenteLeitura" />
            </div>
          </div>

          <h3 class="safra-form__secao-titulo">Área e produtividade</h3>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <q-input
                v-model="formulario.areaPlanejadaHa"
                outlined
                label="Área planejada (ha)"
                type="number"
                step="0.01"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="formulario.areaRealizadaHa"
                outlined
                label="Área realizada (ha)"
                type="number"
                step="0.01"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="formulario.produtividadePlanejada"
                outlined
                label="Prod. planejada"
                type="number"
                step="0.01"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="formulario.produtividadeRealizada"
                outlined
                label="Prod. realizada"
                type="number"
                step="0.01"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.observacoes"
                outlined
                label="Observações"
                type="textarea"
                autogrow
                :readonly="somenteLeitura"
              />
            </div>
          </div>
          <div v-if="!somenteLeitura" class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'safras-planejamento' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Criar' : 'Salvar'"
              type="submit"
              :loading="salvando"
            />
          </div>
          <div v-else class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Retornar" :to="{ name: 'safras-planejamento' }" />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
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

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'safra-visualizar') {
    return 'visualizar';
  }

  return route.name === 'safra-editar' ? 'editar' : 'criar';
});

const somenteLeitura = computed(() => modo.value === 'visualizar');
const safraId = computed(() => route.params.id as string | undefined);
const titulo = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova safra';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar safra';
  }

  return 'Editar safra';
});

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

  if ((modo.value === 'editar' || modo.value === 'visualizar') && safraId.value) {
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

<style scoped>
.safra-form__secao-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-2) 0 0;
}
</style>
