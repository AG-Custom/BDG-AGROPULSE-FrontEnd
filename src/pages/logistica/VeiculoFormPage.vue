<template>
  <q-page class="agro-page agro-page--form">
    <app-page-header :titulo="titulo" :subtitulo="subtitulo" />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />
        <q-form
          v-else
          greedy
          class="agro-formulario"
          :class="{ 'agro-formulario--bloqueado': somenteLeitura }"
          @submit.prevent="salvar"
        >
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <q-input
                v-model="formulario.placa"
                outlined
                label="Placa"
                class="field-required"
                :readonly="somenteLeitura"
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
                :options="TipoVeiculoLogisticaOpcoes"
                :readonly="somenteLeitura"
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
                :options="StatusVeiculoLogisticaOpcoes"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="formulario.ano"
                outlined
                label="Ano"
                type="number"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.marca" outlined label="Marca" :readonly="somenteLeitura" />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.modelo"
                outlined
                label="Modelo"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.kmAtual"
                outlined
                label="Km atual"
                type="number"
                step="0.1"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.capacidadeKg"
                outlined
                label="Capacidade (kg)"
                type="number"
                step="0.01"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.capacidadeM3"
                outlined
                label="Capacidade (m³)"
                type="number"
                step="0.01"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.vencimentoCrlv"
                outlined
                label="Venc. CRLV"
                type="date"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.vencimentoTacografo"
                outlined
                label="Venc. tacógrafo"
                type="date"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.motoristaNome"
                outlined
                label="Motorista"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-input
                v-model="formulario.motoristaCnh"
                outlined
                label="CNH"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-input
                v-model="formulario.motoristaCategoria"
                outlined
                label="Categoria CNH"
                :readonly="somenteLeitura"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.descricao"
                outlined
                label="Descrição"
                type="textarea"
                autogrow
                :readonly="somenteLeitura"
              />
            </div>
          </div>

          <div v-if="!somenteLeitura" class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'logistica-veiculos' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
              descricao="Salvar veículo"
              type="submit"
              :loading="salvando"
            />
          </div>
          <div v-else class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Retornar" :to="{ name: 'logistica-veiculos' }" />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useLogistica, veiculoDtoParaForm, veiculoVazio } from 'composables/useLogistica';
import { StatusVeiculoLogisticaOpcoes, TipoVeiculoLogisticaOpcoes } from 'constants/enums';
import type { VeiculoLogisticaFormModel } from 'types/dtos/logistica.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { criarVeiculo, editarVeiculo, obterVeiculo, veiculo, salvando } = useLogistica();

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'logistica-veiculo-visualizar') {
    return 'visualizar';
  }

  return route.name === 'logistica-veiculo-editar' ? 'editar' : 'criar';
});

const somenteLeitura = computed(() => modo.value === 'visualizar');

const titulo = computed(() => {
  if (modo.value === 'criar') {
    return 'Novo veículo';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar veículo';
  }

  return 'Editar veículo';
});

const subtitulo = computed(() => {
  if (modo.value === 'visualizar') {
    return 'Consulte dados do veículo, capacidade e documentos.';
  }

  return 'Dados do veículo, capacidade e documentos.';
});

const carregandoPagina = ref(modo.value === 'editar' || modo.value === 'visualizar');
const formulario = ref<VeiculoLogisticaFormModel>(veiculoVazio());

async function salvar(): Promise<void> {
  if (somenteLeitura.value) {
    return;
  }

  if (modo.value === 'criar') {
    const criado = await criarVeiculo(formulario.value);
    if (criado) await router.push({ name: 'logistica-veiculos' });
    return;
  }
  const id = String(route.params.id);
  const atualizado = await editarVeiculo(id, formulario.value);
  if (atualizado) await router.push({ name: 'logistica-veiculos' });
}

onMounted(async () => {
  if (modo.value === 'editar' || modo.value === 'visualizar') {
    const ok = await obterVeiculo(String(route.params.id));
    if (ok && veiculo.value) formulario.value = veiculoDtoParaForm(veiculo.value);
  }
  carregandoPagina.value = false;
});
</script>
