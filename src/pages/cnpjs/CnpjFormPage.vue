<template>
  <q-page class="agro-page">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="6" />

        <cnpj-formulario
          v-else
          ref="formularioRef"
          v-model:formulario="formulario"
          :modo="modo"
          :desabilitar-principal="desabilitarPrincipal"
          :somente-leitura="somenteLeitura"
        />

        <div v-if="!carregandoPagina && modo !== 'visualizar'" class="agro-form-actions">
          <agro-btn
            flat
            label="Cancelar"
            descricao="Voltar para a listagem sem salvar"
            :disable="salvando"
            @click="voltar"
          />
          <agro-btn
            color="primary"
            unelevated
            :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
            :descricao="modo === 'criar' ? 'Cadastrar novo CNPJ na empresa' : 'Salvar alterações do CNPJ'"
            :loading="salvando"
            @click="salvar"
          />
        </div>

        <div v-else-if="!carregandoPagina && modo === 'visualizar'" class="agro-form-actions">
          <agro-btn
            flat
            label="Voltar"
            descricao="Retornar para a listagem de CNPJs"
            @click="voltar"
          />
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import CnpjFormulario from 'components/cnpjs/CnpjFormulario.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useCnpjs } from 'composables/useCnpjs';
import type { CnpjFormModel } from 'types/dtos/cnpj.dto';
import { cnpjDtoParaForm, criarCnpjFormVazia } from 'utils/mappers/cnpj.mapper';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { cnpjs, salvando, carregar, criar, editar } = useCnpjs();

const formularioRef = ref<InstanceType<typeof CnpjFormulario> | null>(null);
const formulario = ref<CnpjFormModel>(criarCnpjFormVazia());
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'cnpj-visualizar') {
    return 'visualizar';
  }

  return route.name === 'cnpj-editar' ? 'editar' : 'criar';
});

const somenteLeitura = computed(() => modo.value === 'visualizar');

const cnpjId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Novo CNPJ';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar CNPJ';
  }

  return 'Editar CNPJ';
});

const subtituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Cadastre um novo CNPJ vinculado à sua empresa.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte os dados do CNPJ selecionado.';
  }

  return 'Atualize os dados do CNPJ selecionado. O número não pode ser alterado.';
});

const desabilitarPrincipal = computed(() => {
  if (modo.value === 'editar' || modo.value === 'visualizar') {
    return false;
  }

  return cnpjs.value.some((cnpj) => cnpj.principal);
});

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  await carregar();

  if (modo.value === 'editar' || modo.value === 'visualizar') {
    const cnpj = cnpjs.value.find((item) => item.id === cnpjId.value);

    if (!cnpj) {
      await router.replace({ name: 'cnpjs' });
      carregandoPagina.value = false;
      return;
    }

    formulario.value = cnpjDtoParaForm(cnpj);
  } else {
    const possuiPrincipal = cnpjs.value.some((cnpj) => cnpj.principal);
    formulario.value = criarCnpjFormVazia(!possuiPrincipal);
  }

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'cnpjs' });
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modo.value === 'criar'
      ? await criar(formulario.value)
      : await editar(cnpjId.value!, formulario.value);

  if (sucesso) {
    await router.push({ name: 'cnpjs' });
  }
}

onMounted(() => {
  void inicializar();
});
</script>
