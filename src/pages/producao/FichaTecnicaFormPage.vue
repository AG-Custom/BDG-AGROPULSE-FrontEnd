<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" :subtitulo="subtitulo" />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="6" />
        <q-form
          v-else
          greedy
          class="agro-formulario"
          :class="{ 'agro-formulario--bloqueado': somenteLeitura }"
          @submit.prevent="salvar"
        >
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.produtoId"
                outlined
                label="Produto"
                emit-value
                map-options
                clearable
                :options="produtoOpcoes"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.receitaId"
                outlined
                label="Receita (opcional)"
                emit-value
                map-options
                clearable
                :options="receitaOpcoes"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.temperaturaMin"
                outlined
                label="Temp. mín. (°C)"
                type="number"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.temperaturaMax"
                outlined
                label="Temp. máx. (°C)"
                type="number"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.umidadeMin"
                outlined
                label="Umidade mín. (%)"
                type="number"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.umidadeMax"
                outlined
                label="Umidade máx. (%)"
                type="number"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.tempoMinutos"
                outlined
                label="Tempo (min)"
                type="number"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.observacao"
                outlined
                label="Observação"
                type="textarea"
                autogrow
                :readonly="somenteLeitura"
              />
            </div>
          </div>

          <div v-if="!somenteLeitura" class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'fichas-tecnicas' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Criar' : 'Salvar'"
              descricao="Salvar ficha"
              type="submit"
              :loading="salvando"
            />
          </div>
          <div v-else class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Retornar" :to="{ name: 'fichas-tecnicas' }" />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useFichasTecnicas } from 'composables/useFichasTecnicas';
import { useProdutos } from 'composables/useProdutos';
import { useReceitasProducao } from 'composables/useReceitasProducao';
import type { FichaTecnicaFormModel } from 'types/dtos/producao.dto';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { ficha, salvando, obter, criar, editar } = useFichasTecnicas();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { receitas, carregar: carregarReceitas } = useReceitasProducao();

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'ficha-tecnica-visualizar') {
    return 'visualizar';
  }

  return route.name === 'ficha-tecnica-editar' ? 'editar' : 'criar';
});

const somenteLeitura = computed(() => modo.value === 'visualizar');
const fichaId = computed(() => route.params.id as string | undefined);

const titulo = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova ficha técnica';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar ficha técnica';
  }

  return 'Editar ficha técnica';
});

const subtitulo = computed(() => {
  if (modo.value === 'visualizar') {
    return 'Consulte os parâmetros estruturados do processo.';
  }

  return 'Parâmetros estruturados do processo.';
});

const carregandoPagina = ref(false);
const formulario = ref<FichaTecnicaFormModel>({
  produtoId: '',
  receitaId: '',
  temperaturaMin: '',
  temperaturaMax: '',
  umidadeMin: '',
  umidadeMax: '',
  tempoMinutos: '',
  observacao: '',
});

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);

const receitaOpcoes = computed(() =>
  receitas.value.map((r) => ({
    label: `v${r.versao} — ${produtoOpcoes.value.find((p) => p.value === r.produtoSaidaId)?.label ?? r.produtoSaidaId}`,
    value: r.id,
  })),
);

async function salvar(): Promise<void> {
  if (somenteLeitura.value) {
    return;
  }

  if (modo.value === 'criar') {
    const criada = await criar(formulario.value);
    if (criada) await router.push({ name: 'fichas-tecnicas' });
    return;
  }
  if (!fichaId.value) return;
  const ok = await editar(fichaId.value, formulario.value);
  if (ok) await router.push({ name: 'fichas-tecnicas' });
}

onMounted(async () => {
  void carregarProdutos();
  void carregarReceitas();
  if ((modo.value === 'editar' || modo.value === 'visualizar') && fichaId.value) {
    carregandoPagina.value = true;
    const ok = await obter(fichaId.value);
    if (!ok || !ficha.value) {
      await router.replace({ name: 'fichas-tecnicas' });
      return;
    }
    formulario.value = {
      produtoId: ficha.value.produtoId ?? '',
      receitaId: ficha.value.receitaId ?? '',
      temperaturaMin: ficha.value.temperaturaMin != null ? String(ficha.value.temperaturaMin) : '',
      temperaturaMax: ficha.value.temperaturaMax != null ? String(ficha.value.temperaturaMax) : '',
      umidadeMin: ficha.value.umidadeMin != null ? String(ficha.value.umidadeMin) : '',
      umidadeMax: ficha.value.umidadeMax != null ? String(ficha.value.umidadeMax) : '',
      tempoMinutos: ficha.value.tempoMinutos != null ? String(ficha.value.tempoMinutos) : '',
      observacao: ficha.value.observacao ?? '',
    };
    carregandoPagina.value = false;
  }
});
</script>
