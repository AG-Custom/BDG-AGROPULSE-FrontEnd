<template>
  <q-page class="agro-page agro-page--form">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="10" />

        <unidade-formulario
          v-else
          ref="formularioRef"
          v-model:formulario="formulario"
          :modo="modoFormulario"
          :somente-leitura="modo === 'visualizar'"
          :cnpjs="cnpjs"
          :carregando-cnpjs="carregandoCnpjs"
          @atualizar-cnpjs="carregarCnpjs()"
        />

        <div v-if="!carregandoPagina && modo !== 'visualizar'" class="agro-form-actions">
          <agro-btn flat label="Cancelar" descricao="Voltar para a listagem sem salvar" :disable="salvando" @click="voltar" />
          <agro-btn
            color="primary"
            unelevated
            :label="modo === 'criar' ? 'Cadastrar' : 'Salvar'"
            :descricao="modo === 'criar' ? 'Cadastrar nova unidade' : 'Salvar alterações da unidade'"
            :loading="salvando"
            @click="salvar"
          />
        </div>

        <div v-else-if="!carregandoPagina && modo === 'visualizar'" class="agro-form-actions">
          <agro-btn flat label="Voltar" descricao="Retornar para a listagem de unidades" @click="voltar" />
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import UnidadeFormulario from 'components/unidades/UnidadeFormulario.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useCnpjs } from 'composables/useCnpjs';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { unidadeService } from 'services/unidade.service';
import type { UnidadeFormModel } from 'types/dtos/unidade.dto';
import {
  criarUnidadeFormVazia,
  formParaCriarPayload,
  formParaEditarPayload,
  unidadeDtoParaForm,
} from 'utils/mappers/unidade.mapper';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { cnpjs, carregando: carregandoCnpjs, carregar: carregarCnpjs } = useCnpjs();
const { sucesso, erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();

const formularioRef = ref<InstanceType<typeof UnidadeFormulario> | null>(null);
const formulario = ref<UnidadeFormModel>(criarUnidadeFormVazia());
const carregandoPagina = ref(true);
const salvando = ref(false);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'unidade-visualizar') {
    return 'visualizar';
  }

  return route.name === 'unidade-editar' ? 'editar' : 'criar';
});

const modoFormulario = computed<'criar' | 'editar'>(() =>
  modo.value === 'criar' ? 'criar' : 'editar',
);

const unidadeId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova unidade';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar unidade';
  }

  return 'Editar unidade';
});

const subtituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Cadastre uma nova unidade vinculada a um CNPJ da empresa.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte os dados da unidade selecionada.';
  }

  return 'Atualize os dados da unidade selecionada.';
});

async function carregarUnidade(): Promise<void> {
  if (!unidadeId.value) {
    return;
  }

  try {
    const unidade = await unidadeService.obter(unidadeId.value);
    formulario.value = unidadeDtoParaForm(unidade);
  } catch (e) {
    erro(mensagem(e));
    await router.replace({ name: 'unidades' });
  }
}

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  await carregarCnpjs();

  if (modo.value === 'editar' || modo.value === 'visualizar') {
    await carregarUnidade();
  } else if (cnpjs.value.length === 1) {
    formulario.value.cnpjEmpresaId = cnpjs.value[0]!.id;
  }

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'unidades' });
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  salvando.value = true;

  try {
    if (modo.value === 'criar') {
      await unidadeService.criar(formParaCriarPayload(formulario.value));
      sucesso('Unidade cadastrada com sucesso.');
    } else {
      await unidadeService.editar(unidadeId.value!, formParaEditarPayload(formulario.value));
      sucesso('Unidade atualizada com sucesso.');
    }

    await router.push({ name: 'unidades' });
  } catch (e) {
    erro(mensagem(e));
  } finally {
    salvando.value = false;
  }
}

onMounted(() => {
  void inicializar();
});
</script>

