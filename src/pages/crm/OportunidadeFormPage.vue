<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Dados da oportunidade no pipeline." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.clienteId"
                outlined
                label="Cliente ID"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.vendedorUsuarioId" outlined label="Vendedor ID" />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="formulario.etapa"
                outlined
                label="Etapa"
                emit-value
                map-options
                :options="EtapaOportunidadeOpcoes"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-input
                v-model="formulario.valorEstimado"
                outlined
                label="Valor estimado"
                type="number"
                step="0.01"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-input
                v-model="formulario.probabilidade"
                outlined
                label="Probabilidade (%)"
                type="number"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.cultura" outlined label="Cultura" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.safraRef" outlined label="Safra (ref.)" />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.dataPrevista"
                outlined
                label="Data prevista"
                type="date"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.produtoId" outlined label="Produto ID" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.produtoNome" outlined label="Produto (nome)" />
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
            <agro-btn
              flat
              label="Cancelar"
              descricao="Voltar"
              :to="{ name: 'crm-oportunidades' }"
            />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
              descricao="Salvar oportunidade"
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
  oportunidadeDtoParaForm,
  oportunidadeVazia,
  useCrm,
} from 'composables/useCrm';
import { EtapaOportunidadeOpcoes } from 'constants/enums';
import type { OportunidadeFormModel } from 'types/dtos/crm.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { criarOportunidade, editarOportunidade, obterOportunidade, oportunidade, salvando } =
  useCrm();

const modo = computed(() => (route.params.id ? 'editar' : 'criar'));
const titulo = computed(() =>
  modo.value === 'criar' ? 'Nova oportunidade' : 'Editar oportunidade',
);
const carregandoPagina = ref(modo.value === 'editar');
const formulario = ref<OportunidadeFormModel>(oportunidadeVazia());

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criarOportunidade(formulario.value);
    if (criado) await router.push({ name: 'crm-oportunidades' });
    return;
  }
  const id = String(route.params.id);
  const atualizado = await editarOportunidade(id, formulario.value);
  if (atualizado) await router.push({ name: 'crm-oportunidades' });
}

onMounted(async () => {
  if (modo.value === 'editar') {
    const ok = await obterOportunidade(String(route.params.id));
    if (ok && oportunidade.value) {
      formulario.value = oportunidadeDtoParaForm(oportunidade.value);
    }
  }
  carregandoPagina.value = false;
});
</script>
