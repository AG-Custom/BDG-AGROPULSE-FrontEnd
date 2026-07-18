<template>
  <q-page class="agro-page">
    <app-page-header titulo="Abrir ordem de serviço" subtitulo="Preventiva ou corretiva." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="6" />
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
            <div class="col-12 col-md-3">
              <q-select
                v-model="formulario.tipo"
                outlined
                label="Tipo"
                emit-value
                map-options
                :options="TipoOrdemServicoManutencaoOpcoes"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="formulario.prioridade"
                outlined
                label="Prioridade"
                emit-value
                map-options
                :options="PrioridadeOrdemServicoManutencaoOpcoes"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.descricao"
                outlined
                label="Descrição do problema / serviço"
                type="textarea"
                autogrow
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.dataAbertura"
                outlined
                label="Data abertura"
                type="date"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.dataPrevisao" outlined label="Data previsão" type="date" />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.custoMaoObra"
                outlined
                label="Custo mão de obra"
                type="number"
                step="0.01"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.responsavelNome" outlined label="Responsável" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.colaboradorId" outlined label="Colaborador (ID, opcional)" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.planoId"
                outlined
                label="Plano vinculado (opcional)"
                emit-value
                map-options
                clearable
                :options="planoOpcoes"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.horasTrabalhadas"
                outlined
                label="Horas trabalhadas"
                type="number"
                step="0.1"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.causaRaiz"
                outlined
                label="Causa raiz"
                type="textarea"
                autogrow
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'manutencao-ordens' }" />
            <agro-btn
              color="primary"
              unelevated
              label="Abrir OS"
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
import { osVazia, useManutencao } from 'composables/useManutencao';
import {
  PrioridadeOrdemServicoManutencaoOpcoes,
  TipoOrdemServicoManutencaoOpcoes,
} from 'constants/enums';
import type { OrdemServicoManutencaoFormModel } from 'types/dtos/manutencao.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const {
  criarOrdem,
  salvando,
  ativos,
  planos,
  carregarAtivos,
  carregarPlanos,
} = useManutencao();

const carregandoPagina = ref(true);
const formulario = ref<OrdemServicoManutencaoFormModel>(osVazia());

const ativoOpcoes = computed(() =>
  ativos.value.map((a) => ({ label: a.nome, value: a.id })),
);
const planoOpcoes = computed(() =>
  planos.value.map((p) => ({
    label: p.descricao,
    value: p.id,
  })),
);

async function salvar(): Promise<void> {
  const criada = await criarOrdem(formulario.value);
  if (criada) {
    await router.push({ name: 'manutencao-ordem-detalhe', params: { id: criada.id } });
  }
}

onMounted(async () => {
  await Promise.all([carregarAtivos(), carregarPlanos()]);
  carregandoPagina.value = false;
});
</script>
