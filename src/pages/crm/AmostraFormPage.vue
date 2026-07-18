<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Amostra ou demonstração em campo." />

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
                v-model="formulario.status"
                outlined
                label="Status"
                emit-value
                map-options
                :options="StatusAmostraCampoOpcoes"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-input
                v-model="formulario.quantidade"
                outlined
                label="Quantidade"
                type="number"
                step="0.01"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-4">
              <q-input v-model="formulario.unidade" outlined label="Unidade" />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.dataEntrega"
                outlined
                label="Data entrega"
                type="date"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.dataRetorno"
                outlined
                label="Data retorno"
                type="date"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="formulario.cultura" outlined label="Cultura" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.produtoId" outlined label="Produto ID" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.produtoNome" outlined label="Produto (nome)" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.pedidoVendaId" outlined label="Pedido de venda ID" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.resultado" outlined label="Resultado" />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'crm-amostras' }" />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
              descricao="Salvar amostra"
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
import { amostraDtoParaForm, amostraVazia, useCrm } from 'composables/useCrm';
import { StatusAmostraCampoOpcoes } from 'constants/enums';
import type { AmostraCampoFormModel } from 'types/dtos/crm.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { criarAmostra, editarAmostra, obterAmostra, amostra, salvando } = useCrm();

const modo = computed(() => (route.params.id ? 'editar' : 'criar'));
const titulo = computed(() => (modo.value === 'criar' ? 'Nova amostra' : 'Editar amostra'));
const carregandoPagina = ref(modo.value === 'editar');
const formulario = ref<AmostraCampoFormModel>(amostraVazia());

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criarAmostra(formulario.value);
    if (criado) await router.push({ name: 'crm-amostras' });
    return;
  }
  const id = String(route.params.id);
  const atualizado = await editarAmostra(id, formulario.value);
  if (atualizado) await router.push({ name: 'crm-amostras' });
}

onMounted(async () => {
  if (modo.value === 'editar') {
    const ok = await obterAmostra(String(route.params.id));
    if (ok && amostra.value) formulario.value = amostraDtoParaForm(amostra.value);
  }
  carregandoPagina.value = false;
});
</script>
