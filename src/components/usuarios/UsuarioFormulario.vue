<template>
  <q-form ref="formRef" class="usuario-formulario agro-formulario" greedy :class="{ 'agro-formulario--bloqueado': somenteLeitura }">
    <fieldset class="agro-formulario__fieldset">
<div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.nome"
          outlined
          label="Nome"
          class="field-required"
          maxlength="100"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.sobrenome"
          outlined
          label="Sobrenome"
          class="field-required"
          maxlength="100"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.email"
          outlined
          label="E-mail"
          class="field-required"
          maxlength="256"
          type="email"
          aria-required="true"
          :rules="modo === 'criar' ? [obrigatorio, emailValidator] : undefined"
          :readonly="modo === 'editar' || somenteLeitura"
        />
      </div>
      <div v-if="modo === 'criar'" class="col-12 col-md-6">
        <q-input
          v-model="formulario.senha"
          outlined
          label="Senha inicial"
          class="field-required"
          type="password"
          aria-required="true"
          :rules="[obrigatorio, senhaContratoValidator]"
          :readonly="somenteLeitura"
        />
      </div>
      <div v-if="modo === 'criar'" class="col-12 col-md-6">
        <q-input
          v-model="formulario.confirmarSenha"
          outlined
          label="Confirmar senha"
          class="field-required"
          type="password"
          aria-required="true"
          :rules="[obrigatorio, confirmarSenhaValidator]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          v-model="formulario.perfil"
          outlined
          label="Perfil"
          class="field-required"
          emit-value
          map-options
          aria-required="true"
          :options="perfilOpcoes"
          :readonly="somenteLeitura"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          v-model="formulario.colaboradorId"
          outlined
          label="Colaborador vinculado"
          emit-value
          map-options
          clearable
          :options="colaboradorOpcoes"
          :loading="carregandoColaboradores"
          :readonly="somenteLeitura"
          hint="Opcional — vincule a um cadastro de RH existente"
        />
      </div>
      <div class="col-12">
        <q-select
          v-model="formulario.unidadeIds"
          outlined
          label="Unidades permitidas"
          emit-value
          map-options
          multiple
          use-chips
          :options="unidadeOpcoes"
          :loading="carregandoUnidades"
          :readonly="somenteLeitura || perfilGlobal"
          :hint="
            perfilGlobal
              ? 'Perfil global — acesso a todas as unidades'
              : 'Selecione as unidades que o usuário pode acessar'
          "
        />
      </div>
    </div>
  </fieldset>
</q-form>
</template>

<script setup lang="ts">
import { useColaboradores } from 'composables/useColaboradores';
import { useUnidades } from 'composables/useUnidades';
import {
  isPerfilUsuarioGlobal,
  PerfilUsuarioCadastroOpcoes,
  PerfilUsuarioOpcoes,
  UnidadeStatus,
} from 'constants/enums';
import type { QForm } from 'quasar';
import type { UsuarioFormModel } from 'types/dtos/usuario.dto';
import {
  confirmarSenha,
  email,
  obrigatorio,
  senhaContrato,
} from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  modo: 'criar' | 'editar';
  somenteLeitura?: boolean;
  colaboradorVinculadoId?: string | null;
}>();

const formulario = defineModel<UsuarioFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const { unidades, carregando: carregandoUnidades, carregar } = useUnidades();
const {
  colaboradores,
  carregando: carregandoColaboradores,
  carregar: carregarColaboradores,
  nomeCompleto: nomeCompletoColaborador,
} = useColaboradores();

const emailValidator = email;
const senhaContratoValidator = senhaContrato;
const confirmarSenhaValidator = computed(() => confirmarSenha(formulario.value.senha));

const perfilOpcoes = computed(() =>
  props.modo === 'criar' ? PerfilUsuarioCadastroOpcoes : PerfilUsuarioOpcoes,
);

const perfilGlobal = computed(() => isPerfilUsuarioGlobal(formulario.value.perfil));

const unidadeOpcoes = computed(() =>
  unidades.value
    .filter((unidade) => unidade.status === UnidadeStatus.Ativa)
    .map((unidade) => ({
      label: unidade.nome,
      value: unidade.id,
    })),
);

const colaboradorOpcoes = computed(() =>
  colaboradores.value
    .filter(
      (colaborador) =>
        colaborador.usuarioId === null ||
        colaborador.id === props.colaboradorVinculadoId ||
        colaborador.id === formulario.value.colaboradorId,
    )
    .map((colaborador) => ({
      label: nomeCompletoColaborador(colaborador),
      value: colaborador.id,
    })),
);

watch(perfilGlobal, (global) => {
  if (global) {
    formulario.value.unidadeIds = [];
  }
});

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

onMounted(() => {
  void carregar({ ativo: true });
  void carregarColaboradores({ ativo: true });
});

defineExpose({ validar });
</script>

<style scoped>

.agro-formulario__fieldset {
  border: 0;
  margin: 0;
  min-width: 0;
  padding: 0;
}

.agro-formulario__fieldset:disabled {
  opacity: 1;
}

.usuario-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
