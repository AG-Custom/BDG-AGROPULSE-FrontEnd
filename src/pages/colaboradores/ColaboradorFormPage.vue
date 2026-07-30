<template>
  <q-page class="agro-page agro-page--form">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section colaborador-form-page">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="12" />

        <q-banner
          v-if="!carregandoPagina && colaboradorInativo"
          rounded
          class="colaborador-form-page__aviso"
        >
          Este colaborador está inativo e não pode ser editado.
        </q-banner>

        <colaborador-formulario
          v-if="!carregandoPagina"
          ref="formularioRef"
          v-model:formulario="formulario"
          :modo="modoFormulario"
          :somente-leitura="somenteLeitura || colaboradorInativo"
          :usuario-vinculado-id="colaboradorCarregado?.usuarioId"
        />

        <div v-if="!carregandoPagina && modo !== 'visualizar' && !colaboradorInativo" class="agro-form-actions">
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
            :descricao="modo === 'criar' ? 'Cadastrar novo colaborador' : 'Salvar alterações do colaborador'"
            :loading="salvando"
            @click="salvar"
          />
        </div>

        <div v-else-if="!carregandoPagina && (modo === 'visualizar' || colaboradorInativo)" class="agro-form-actions">
          <agro-btn
            flat
            label="Voltar"
            descricao="Retornar para a listagem de colaboradores"
            @click="voltar"
          />
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import ColaboradorFormulario from 'components/colaboradores/ColaboradorFormulario.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useColaboradores } from 'composables/useColaboradores';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { ColaboradorStatus } from 'constants/enums';
import { colaboradorService } from 'services/colaborador.service';
import type { ColaboradorDto, ColaboradorFormModel } from 'types/dtos/colaborador.dto';
import {
  colaboradorDtoParaForm,
  criarColaboradorFormVazia,
} from 'utils/mappers/colaborador.mapper';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { salvando, criar, editar } = useColaboradores();
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();

const formularioRef = ref<InstanceType<typeof ColaboradorFormulario> | null>(null);
const formulario = ref<ColaboradorFormModel>(criarColaboradorFormVazia());
const colaboradorCarregado = ref<ColaboradorDto | null>(null);
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'colaborador-visualizar') {
    return 'visualizar';
  }

  return route.name === 'colaborador-editar' ? 'editar' : 'criar';
});

const modoFormulario = computed<'criar' | 'editar'>(() =>
  modo.value === 'criar' ? 'criar' : 'editar',
);

const somenteLeitura = computed(() => modo.value === 'visualizar');

const colaboradorId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Novo colaborador';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar colaborador';
  }

  return 'Editar colaborador';
});

const subtituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Cadastre uma pessoa da empresa no RH. O vínculo com usuário de acesso é opcional.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte os dados do colaborador selecionado.';
  }

  return 'Atualize os dados do colaborador selecionado.';
});

const colaboradorInativo = computed(
  () => modo.value === 'editar' && colaboradorCarregado.value?.status === ColaboradorStatus.Inativo,
);

async function carregarColaborador(): Promise<void> {
  if (!colaboradorId.value) {
    return;
  }

  try {
    colaboradorCarregado.value = await colaboradorService.obter(colaboradorId.value);
    formulario.value = colaboradorDtoParaForm(colaboradorCarregado.value);
  } catch (e) {
    erro(mensagem(e));
    await router.replace({ name: 'colaboradores' });
  }
}

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  if (modo.value === 'editar' || modo.value === 'visualizar') {
    await carregarColaborador();
  } else {
    formulario.value = criarColaboradorFormVazia();
  }

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'colaboradores' });
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modo.value === 'criar'
      ? await criar(formulario.value)
      : await editar(colaboradorId.value!, formulario.value);

  if (sucesso) {
    await router.push({ name: 'colaboradores' });
  }
}

onMounted(() => {
  void inicializar();
});
</script>

<style scoped>
.colaborador-form-page__aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  margin-bottom: var(--spacing-4);
}
</style>
