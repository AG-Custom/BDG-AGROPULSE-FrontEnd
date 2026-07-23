<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" :subtitulo="subtitulo" />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="4" />
        <template v-else>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12">
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
                  v-model="formulario.numeroParcelas"
                  outlined
                  label="Número de parcelas"
                  type="number"
                  class="field-required"
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
                  :rules="[obrigatorio]"
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Voltar" @click="voltar" />
              <agro-btn
                color="primary"
                unelevated
                :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
                type="submit"
                :loading="salvando"
              />
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

const modo = computed(() => (route.params.id ? 'editar' : 'criar'));
const titulo = computed(() =>
  modo.value === 'criar' ? 'Nova condição de pagamento' : 'Editar condição de pagamento',
);
const subtitulo = computed(() =>
  modo.value === 'criar'
    ? 'Defina nome, parcelas e intervalo.'
    : 'Atualize os dados da condição.',
);
const carregandoPagina = computed(() => modo.value === 'editar' && carregando.value);

const formulario = ref<CondicaoPagamentoFormModel>({
  nome: '',
  numeroParcelas: '1',
  intervaloDias: '30',
});

function voltar(): void {
  void router.push({ name: 'condicoes-pagamento' });
}

async function salvar(): Promise<void> {
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
  if (modo.value !== 'editar') return;
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
