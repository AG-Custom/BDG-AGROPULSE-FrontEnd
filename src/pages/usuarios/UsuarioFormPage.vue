<template>
  <q-page class="agro-page">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section usuario-form-page">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="6" />

        <q-banner
          v-if="!carregandoPagina && usuarioInativo"
          rounded
          class="usuario-form-page__aviso"
        >
          Este usuário está inativo e não pode ser editado.
        </q-banner>

        <usuario-formulario
          v-if="!carregandoPagina"
          ref="formularioRef"
          v-model:formulario="formulario"
          :modo="modoFormulario"
          :somente-leitura="somenteLeitura || usuarioInativo"
          :colaborador-vinculado-id="usuarioCarregado?.colaboradorId"
        />

        <div v-if="!carregandoPagina && modo !== 'visualizar' && !usuarioInativo" class="agro-form-actions">
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
            :descricao="modo === 'criar' ? 'Cadastrar novo usuário' : 'Salvar alterações do usuário'"
            :loading="salvando"
            @click="salvar"
          />
        </div>

        <div v-else-if="!carregandoPagina && (modo === 'visualizar' || usuarioInativo)" class="agro-form-actions">
          <agro-btn
            flat
            label="Voltar"
            descricao="Retornar para a listagem de usuários"
            @click="voltar"
          />
        </div>

        <div
          v-if="!carregandoPagina && modo === 'editar' && usuarioAtivo && usuarioCarregado"
          class="usuario-form-page__acoes-secundarias"
        >
          <agro-btn
            flat
            color="warning"
            icon="logout"
            label="Revogar sessões"
            descricao="Encerrar todas as sessões ativas deste usuário"
            :loading="revogandoSessoes"
            @click="revogarSessoesUsuario"
          />
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import UsuarioFormulario from 'components/usuarios/UsuarioFormulario.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useUsuarios } from 'composables/useUsuarios';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { UsuarioStatus } from 'constants/enums';
import { usuarioService } from 'services/usuario.service';
import type { UsuarioDto, UsuarioFormModel } from 'types/dtos/usuario.dto';
import { criarUsuarioFormVazia, usuarioDtoParaForm } from 'utils/mappers/usuario.mapper';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { salvando, revogandoSessoes, criar, editar, solicitarRevogacaoSessoes } = useUsuarios();
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();

const formularioRef = ref<InstanceType<typeof UsuarioFormulario> | null>(null);
const formulario = ref<UsuarioFormModel>(criarUsuarioFormVazia());
const usuarioCarregado = ref<UsuarioDto | null>(null);
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'usuario-visualizar') {
    return 'visualizar';
  }

  return route.name === 'usuario-editar' ? 'editar' : 'criar';
});

const modoFormulario = computed<'criar' | 'editar'>(() =>
  modo.value === 'criar' ? 'criar' : 'editar',
);

const somenteLeitura = computed(() => modo.value === 'visualizar');

const usuarioId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Novo usuário';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar usuário';
  }

  return 'Editar usuário';
});

const subtituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Cadastre um novo usuário com acesso à sua empresa.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte os dados e permissões do usuário selecionado.';
  }

  return 'Atualize os dados e permissões do usuário selecionado.';
});

const usuarioInativo = computed(
  () => modo.value === 'editar' && usuarioCarregado.value?.status === UsuarioStatus.Inativo,
);

const usuarioAtivo = computed(
  () => modo.value === 'editar' && usuarioCarregado.value?.status === UsuarioStatus.Ativo,
);

async function carregarUsuario(): Promise<void> {
  if (!usuarioId.value) {
    return;
  }

  try {
    usuarioCarregado.value = await usuarioService.obter(usuarioId.value);
    formulario.value = usuarioDtoParaForm(usuarioCarregado.value);
  } catch (e) {
    erro(mensagem(e));
    await router.replace({ name: 'usuarios' });
  }
}

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  if (modo.value === 'editar' || modo.value === 'visualizar') {
    await carregarUsuario();
  } else {
    formulario.value = criarUsuarioFormVazia();
  }

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'usuarios' });
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modo.value === 'criar'
      ? await criar(formulario.value)
      : await editar(usuarioId.value!, formulario.value);

  if (sucesso) {
    await router.push({ name: 'usuarios' });
  }
}

async function revogarSessoesUsuario(): Promise<void> {
  if (!usuarioCarregado.value) {
    return;
  }

  await solicitarRevogacaoSessoes(usuarioCarregado.value);
}

onMounted(() => {
  void inicializar();
});
</script>

<style scoped>
.usuario-form-page {
  display: grid;
  gap: var(--spacing-6);
}

.usuario-form-page__aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  margin-bottom: var(--spacing-4);
}

.usuario-form-page__acoes-secundarias {
  border-top: 1px solid var(--color-border-default);
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
}
</style>
