<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Informe nome, área, gleba e cultura." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="5" />
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
                v-model="formulario.areaHectares"
                outlined
                label="Área (hectares)"
                type="number"
                step="0.01"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.glebaId"
                outlined
                label="Gleba"
                clearable
                emit-value
                map-options
                :options="glebaOpcoes"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.culturaAtual" outlined label="Cultura atual" />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.coordenadas"
                outlined
                label="Coordenadas (WKT / GeoJSON)"
                type="textarea"
                autogrow
              />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'talhoes' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Criar' : 'Salvar'"
              descricao="Salvar talhão"
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
import { useGlebas } from 'composables/useGlebas';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import type { TalhaoFormModel } from 'types/dtos/rastreabilidade.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { talhao, salvando, obterTalhao, criarTalhao, editarTalhao } = useRastreabilidade();
const { glebaOpcoes, carregar: carregarGlebas } = useGlebas();

const modo = computed(() => (route.name === 'talhao-editar' ? 'editar' : 'criar'));
const talhaoId = computed(() => route.params.id as string | undefined);
const titulo = computed(() => (modo.value === 'criar' ? 'Novo talhão' : 'Editar talhão'));

const carregandoPagina = ref(false);
const formulario = ref<TalhaoFormModel>({
  nome: '',
  areaHectares: '',
  glebaId: '',
  coordenadas: '',
  culturaAtual: '',
});

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criarTalhao(formulario.value);
    if (criado) await router.push({ name: 'talhoes' });
    return;
  }
  if (!talhaoId.value) return;
  const ok = await editarTalhao(talhaoId.value, formulario.value);
  if (ok) await router.push({ name: 'talhoes' });
}

onMounted(async () => {
  void carregarGlebas();

  if (modo.value === 'editar' && talhaoId.value) {
    carregandoPagina.value = true;
    const ok = await obterTalhao(talhaoId.value);
    if (!ok || !talhao.value) {
      await router.replace({ name: 'talhoes' });
      return;
    }
    formulario.value = {
      nome: talhao.value.nome,
      areaHectares:
        talhao.value.areaHectares != null ? String(talhao.value.areaHectares) : '',
      glebaId: talhao.value.glebaId ?? '',
      coordenadas: talhao.value.coordenadas ?? '',
      culturaAtual: talhao.value.culturaAtual ?? '',
    };
    carregandoPagina.value = false;
  }
});
</script>
