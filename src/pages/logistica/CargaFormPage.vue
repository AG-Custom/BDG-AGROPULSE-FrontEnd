<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Programação de carga, veículo e paradas." />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.motoristaNome"
                outlined
                label="Motorista"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.dataHoraSaida"
                outlined
                label="Data/hora saída"
                type="datetime-local"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.regiao"
                outlined
                label="Região"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="formulario.veiculoId"
                outlined
                label="Veículo"
                emit-value
                map-options
                clearable
                :options="veiculoOpcoes"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="formulario.distanciaKm" outlined label="Distância (km)" type="number" />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="formulario.pesoKg" outlined label="Peso (kg)" type="number" step="0.01" />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="formulario.pedagio" outlined label="Pedágio" type="number" step="0.01" />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model="formulario.custoMotorista"
                outlined
                label="Custo motorista"
                type="number"
                step="0.01"
              />
            </div>
          </div>

          <div class="paradas q-mt-lg">
            <div class="header-paradas">
              <h3 class="titulo-sec">Paradas</h3>
              <agro-btn flat color="primary" icon="add" label="Parada" descricao="Adicionar parada" @click="addParada" />
            </div>
            <div
              v-for="(parada, idx) in formulario.paradas"
              :key="parada.chave"
              class="row q-col-gutter-md q-mb-sm"
            >
              <div class="col-2 col-md-1">
                <q-input v-model="parada.ordem" outlined dense label="Ord." type="number" />
              </div>
              <div class="col-10 col-md-3">
                <q-input v-model="parada.clienteNome" outlined dense label="Cliente" />
              </div>
              <div class="col-8 col-md-3">
                <q-input v-model="parada.cidade" outlined dense label="Cidade" />
              </div>
              <div class="col-4 col-md-1">
                <q-input v-model="parada.uf" outlined dense label="UF" maxlength="2" />
              </div>
              <div class="col-8 col-md-2">
                <q-input v-model="parada.kmParcial" outlined dense label="Km parcial" type="number" />
              </div>
              <div class="col-4 col-md-2">
                <agro-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  descricao="Remover parada"
                  @click="formulario.paradas.splice(idx, 1)"
                />
              </div>
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'logistica-cargas' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Programar' : 'Salvar'"
              descricao="Salvar carga"
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
import { cargaDtoParaForm, cargaVazia, useLogistica } from 'composables/useLogistica';
import type { CargaLogisticaFormModel } from 'types/dtos/logistica.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const {
  criarCarga,
  editarCarga,
  obterCarga,
  carga,
  salvando,
  veiculos,
  carregarVeiculos,
} = useLogistica();

const modo = computed(() => (route.params.id ? 'editar' : 'criar'));
const titulo = computed(() => (modo.value === 'criar' ? 'Nova carga' : 'Editar carga'));
const carregandoPagina = ref(modo.value === 'editar');
const formulario = ref<CargaLogisticaFormModel>(cargaVazia());

const veiculoOpcoes = computed(() =>
  veiculos.value.map((v) => ({
    label: `${v.placa}${v.modelo ? ` — ${v.modelo}` : ''}`,
    value: v.id,
  })),
);

function addParada(): void {
  formulario.value.paradas.push({
    chave: crypto.randomUUID(),
    ordem: String(formulario.value.paradas.length + 1),
    clienteNome: '',
    cidade: '',
    uf: '',
    kmParcial: '',
    pedidoVendaId: '',
  });
}

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criarCarga(formulario.value);
    if (criado) await router.push({ name: 'logistica-carga-detalhe', params: { id: criado.id } });
    return;
  }
  const id = String(route.params.id);
  const atualizado = await editarCarga(id, formulario.value);
  if (atualizado) await router.push({ name: 'logistica-carga-detalhe', params: { id } });
}

onMounted(async () => {
  await carregarVeiculos();
  if (modo.value === 'editar') {
    const ok = await obterCarga(String(route.params.id));
    if (ok && carga.value) formulario.value = cargaDtoParaForm(carga.value);
  }
  carregandoPagina.value = false;
});
</script>

<style scoped>
.header-paradas {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
}
.titulo-sec {
  margin: 0;
  font-size: var(--font-size-md);
  font-family: var(--font-family-display);
}
</style>
