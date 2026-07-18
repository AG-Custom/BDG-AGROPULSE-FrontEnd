<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Dados patrimoniais e de depreciação." />

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
            <div class="col-12 col-md-3">
              <q-select
                v-model="formulario.tipo"
                outlined
                label="Tipo"
                emit-value
                map-options
                class="field-required"
                :options="TipoAtivoManutencaoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="formulario.status"
                outlined
                label="Status"
                emit-value
                map-options
                :options="StatusAtivoManutencaoOpcoes"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.fabricante" outlined label="Fabricante" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.modelo" outlined label="Modelo" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.numeroSerie" outlined label="Número de série" />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="formulario.ano" outlined label="Ano" type="number" />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.valorAquisicao"
                outlined
                label="Valor aquisição"
                type="number"
                step="0.01"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.dataAquisicao" outlined label="Data aquisição" type="date" />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="formulario.vidaUtilAnos" outlined label="Vida útil (anos)" type="number" />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.valorResidual"
                outlined
                label="Valor residual"
                type="number"
                step="0.01"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-select
                v-model="formulario.metodoDepreciacao"
                outlined
                label="Método depreciação"
                emit-value
                map-options
                :options="MetodoDepreciacaoOpcoes"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.horimetroAtual"
                outlined
                label="Horímetro atual"
                type="number"
                step="0.1"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.kmAtual" outlined label="Km atual" type="number" step="0.1" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.localizacao" outlined label="Localização" />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'manutencao-ativos' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
              descricao="Salvar ativo"
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
  ativoDtoParaForm,
  ativoVazio,
  useManutencao,
} from 'composables/useManutencao';
import {
  MetodoDepreciacaoOpcoes,
  StatusAtivoManutencaoOpcoes,
  TipoAtivoManutencaoOpcoes,
} from 'constants/enums';
import type { AtivoManutencaoFormModel } from 'types/dtos/manutencao.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { criarAtivo, editarAtivo, obterAtivo, ativo, salvando } = useManutencao();

const modo = computed(() => (route.params.id ? 'editar' : 'criar'));
const titulo = computed(() => (modo.value === 'criar' ? 'Novo ativo' : 'Editar ativo'));
const carregandoPagina = ref(modo.value === 'editar');
const formulario = ref<AtivoManutencaoFormModel>(ativoVazio());

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criarAtivo(formulario.value);
    if (criado) await router.push({ name: 'manutencao-ativo-detalhe', params: { id: criado.id } });
    return;
  }
  const id = String(route.params.id);
  const atualizado = await editarAtivo(id, formulario.value);
  if (atualizado) await router.push({ name: 'manutencao-ativo-detalhe', params: { id } });
}

onMounted(async () => {
  if (modo.value === 'editar') {
    const ok = await obterAtivo(String(route.params.id));
    if (ok && ativo.value) formulario.value = ativoDtoParaForm(ativo.value);
  }
  carregandoPagina.value = false;
});
</script>
