<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Defina gatilho e intervalo do plano." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="4" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.ativoId"
                outlined
                label="Ativo"
                emit-value
                map-options
                class="field-required"
                :options="ativoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.descricao"
                outlined
                label="Descrição"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.tipoGatilho"
                outlined
                label="Tipo de gatilho"
                emit-value
                map-options
                class="field-required"
                :options="GatilhoPlanoManutencaoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.intervalo"
                outlined
                label="Intervalo"
                type="number"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'manutencao-planos' }" />
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
import {
  planoDtoParaForm,
  planoVazio,
  useManutencao,
} from 'composables/useManutencao';
import { GatilhoPlanoManutencaoOpcoes } from 'constants/enums';
import type { PlanoManutencaoFormModel } from 'types/dtos/manutencao.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const {
  criarPlano,
  editarPlano,
  obterPlano,
  plano,
  ativos,
  carregarAtivos,
  salvando,
} = useManutencao();

const modo = computed(() => (route.params.id ? 'editar' : 'criar'));
const titulo = computed(() => (modo.value === 'criar' ? 'Novo plano' : 'Editar plano'));
const carregandoPagina = ref(modo.value === 'editar');
const formulario = ref<PlanoManutencaoFormModel>(planoVazio());

const ativoOpcoes = computed(() =>
  ativos.value.map((a) => ({ label: a.nome, value: a.id })),
);

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criarPlano(formulario.value);
    if (criado) await router.push({ name: 'manutencao-planos' });
    return;
  }
  const ok = await editarPlano(String(route.params.id), formulario.value);
  if (ok) await router.push({ name: 'manutencao-planos' });
}

onMounted(async () => {
  await carregarAtivos();
  if (modo.value === 'editar') {
    const ok = await obterPlano(String(route.params.id));
    if (ok && plano.value) formulario.value = planoDtoParaForm(plano.value);
  }
  carregandoPagina.value = false;
});
</script>
