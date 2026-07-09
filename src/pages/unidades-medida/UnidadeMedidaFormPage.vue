<template>
  <q-page class="agro-page">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section unidade-medida-form-page">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="2" />

        <q-banner
          v-if="!carregandoPagina && unidadeInativa"
          rounded
          class="unidade-medida-form-page__aviso"
        >
          Esta unidade de medida está inativa e não pode ser editada.
        </q-banner>

        <unidade-medida-formulario
          v-if="!carregandoPagina"
          ref="formularioRef"
          v-model:formulario="formulario"
          :somente-leitura="somenteLeitura || unidadeInativa"
        />

        <div v-if="!carregandoPagina && modo !== 'visualizar' && !unidadeInativa" class="agro-form-actions">
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
            :descricao="modo === 'criar' ? 'Cadastrar nova unidade' : 'Salvar alterações da unidade'"
            :loading="salvando"
            @click="salvar"
          />
        </div>

        <div v-else-if="!carregandoPagina && (modo === 'visualizar' || unidadeInativa)" class="agro-form-actions">
          <agro-btn
            flat
            label="Voltar"
            descricao="Retornar para a listagem de unidades de medida"
            @click="voltar"
          />
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import UnidadeMedidaFormulario from 'components/unidades-medida/UnidadeMedidaFormulario.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useUnidadesMedida } from 'composables/useUnidadesMedida';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { unidadeMedidaService } from 'services/unidade-medida.service';
import type { UnidadeMedidaDto, UnidadeMedidaFormModel } from 'types/dtos/unidade-medida.dto';
import {
  criarUnidadeMedidaFormVazia,
  unidadeMedidaDtoParaForm,
} from 'utils/mappers/unidade-medida.mapper';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { salvando, criar, editar } = useUnidadesMedida();
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();

const formularioRef = ref<InstanceType<typeof UnidadeMedidaFormulario> | null>(null);
const formulario = ref<UnidadeMedidaFormModel>(criarUnidadeMedidaFormVazia());
const unidadeCarregada = ref<UnidadeMedidaDto | null>(null);
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'unidade-medida-visualizar') {
    return 'visualizar';
  }

  return route.name === 'unidade-medida-editar' ? 'editar' : 'criar';
});


const somenteLeitura = computed(() => modo.value === 'visualizar');

const unidadeId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova unidade de medida';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar unidade de medida';
  }

  return 'Editar unidade de medida';
});

const subtituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Cadastre uma nova unidade de medida para o catálogo.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte os dados da unidade de medida selecionada.';
  }

  return 'Atualize os dados da unidade de medida selecionada.';
});

const unidadeInativa = computed(
  () => modo.value === 'editar' && unidadeCarregada.value?.ativo === false,
);

async function carregarUnidade(): Promise<void> {
  if (!unidadeId.value) {
    return;
  }

  try {
    unidadeCarregada.value = await unidadeMedidaService.obter(unidadeId.value);
    formulario.value = unidadeMedidaDtoParaForm(unidadeCarregada.value);
  } catch (e) {
    erro(mensagem(e));
    await router.replace({ name: 'unidades-medida' });
  }
}

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  if (modo.value === 'editar' || modo.value === 'visualizar') {
    await carregarUnidade();
  } else {
    formulario.value = criarUnidadeMedidaFormVazia();
  }

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'unidades-medida' });
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modo.value === 'criar'
      ? await criar(formulario.value)
      : await editar(unidadeId.value!, formulario.value);

  if (sucesso) {
    await router.push({ name: 'unidades-medida' });
  }
}

onMounted(() => {
  void inicializar();
});
</script>

<style scoped>
.unidade-medida-form-page__aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  margin-bottom: var(--spacing-4);
}
</style>
