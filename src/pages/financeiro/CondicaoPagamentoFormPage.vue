<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" :subtitulo="subtitulo" />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="4" />
        <template v-else>
          <q-form
            greedy
            class="agro-formulario"
            :class="{ 'agro-formulario--bloqueado': somenteLeitura }"
            @submit.prevent="salvar"
          >
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="formulario.nome"
                  outlined
                  label="Nome"
                  class="field-required"
                  :readonly="somenteLeitura"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.numeroParcelas"
                  outlined
                  label="Número de parcelas"
                  type="number"
                  class="field-required"
                  :readonly="somenteLeitura"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.intervaloDias"
                  outlined
                  label="Intervalo (dias)"
                  type="number"
                  class="field-required"
                  :readonly="somenteLeitura"
                  :rules="[obrigatorio]"
                />
              </div>
            </div>
            <div v-if="!somenteLeitura" class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Voltar" @click="voltar" />
              <agro-btn
                color="primary"
                unelevated
                :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
                type="submit"
                :loading="salvando"
              />
            </div>
            <div v-else class="agro-form-actions">
              <agro-btn flat label="Voltar" descricao="Retornar para a listagem" @click="voltar" />
            </div>
          </q-form>
        </template>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useCondicoesPagamento } from 'composables/useCondicoesPagamento';
import type { CondicaoPagamentoFormModel } from 'types/dtos/financeiro.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { condicao, carregando, salvando, obter, criar, editar } = useCondicoesPagamento();

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'condicao-pagamento-visualizar') {
    return 'visualizar';
  }

  return route.name === 'condicao-pagamento-editar' ? 'editar' : 'criar';
});

const somenteLeitura = computed(() => modo.value === 'visualizar');

const titulo = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova condição de pagamento';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar condição de pagamento';
  }

  return 'Editar condição de pagamento';
});

const subtitulo = computed(() => {
  if (modo.value === 'criar') {
    return 'Defina nome, parcelas e intervalo.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte os dados da condição selecionada.';
  }

  return 'Atualize os dados da condição.';
});

const carregandoPagina = computed(
  () => (modo.value === 'editar' || modo.value === 'visualizar') && carregando.value,
);

const formulario = ref<CondicaoPagamentoFormModel>({
  nome: '',
  numeroParcelas: '1',
  intervaloDias: '30',
});

function voltar(): void {
  void router.push({ name: 'condicoes-pagamento' });
}

async function salvar(): Promise<void> {
  if (modo.value === 'visualizar') {
    return;
  }

  if (modo.value === 'criar') {
    const criado = await criar(formulario.value);
    if (criado) {
      void router.push({ name: 'condicoes-pagamento' });
    }
    return;
  }

  const id = String(route.params.id);
  const ok = await editar(id, formulario.value);
  if (ok) {
    void router.push({ name: 'condicoes-pagamento' });
  }
}

onMounted(async () => {
  if (modo.value !== 'editar' && modo.value !== 'visualizar') return;
  const id = String(route.params.id);
  const ok = await obter(id);
  if (!ok || !condicao.value) {
    voltar();
    return;
  }
  formulario.value = {
    nome: condicao.value.nome,
    numeroParcelas: String(condicao.value.numeroParcelas),
    intervaloDias: String(condicao.value.intervaloDias),
  };
});
</script>
