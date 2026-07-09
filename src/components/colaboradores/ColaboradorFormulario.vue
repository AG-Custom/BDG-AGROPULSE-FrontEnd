<template>
  <q-form ref="formRef" class="colaborador-formulario agro-formulario" greedy :class="{ 'agro-formulario--bloqueado': somenteLeitura }">
    <fieldset class="agro-formulario__fieldset">
<h3 class="colaborador-formulario__secao-titulo">Dados pessoais</h3>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-input
          v-model="formulario.nomeCompleto"
          outlined
          label="Nome completo"
          class="field-required"
          maxlength="200"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.cpf"
          outlined
          label="CPF"
          class="field-required"
          aria-required="true"
          :mask="MASCARAS.CPF"
          :maxlength="TAMANHO_FORMATADO.CPF"
          inputmode="numeric"
          :rules="[obrigatorio, cpfValidator]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.rg"
          outlined
          label="RG"
          maxlength="30"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.dataNascimento"
          outlined
          label="Data de nascimento"
          type="date"
          :readonly="somenteLeitura"
        />
      </div>
    </div>

    <h3 class="colaborador-formulario__secao-titulo">Contrato</h3>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-select
          v-model="formulario.cargo"
          outlined
          label="Cargo"
          class="field-required"
          emit-value
          map-options
          aria-required="true"
          :options="CargoColaboradorOpcoes"
          :readonly="somenteLeitura"
          :rules="[obrigatorio]"
        />
      </div>
      <div v-if="cargoPersonalizado" class="col-12 col-md-4">
        <q-input
          v-model="formulario.cargoPersonalizado"
          outlined
          label="Cargo personalizado"
          class="field-required"
          maxlength="100"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.salarioBase"
          outlined
          label="Salário base"
          hint="Opcional"
          inputmode="decimal"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.dataAdmissao"
          outlined
          label="Data de admissão"
          class="field-required"
          type="date"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.dataDemissao"
          outlined
          label="Data de demissão"
          type="date"
          :readonly="somenteLeitura"
        />
      </div>
      <div v-if="modo === 'editar'" class="col-12 col-md-4">
        <q-select
          v-model="formulario.status"
          outlined
          label="Status"
          class="field-required"
          emit-value
          map-options
          aria-required="true"
          :options="ColaboradorStatusOpcoes"
          disable
        />
      </div>
    </div>

    <h3 class="colaborador-formulario__secao-titulo">Contato</h3>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.email"
          outlined
          label="E-mail"
          type="email"
          maxlength="256"
          :rules="[emailValidator]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.telefone"
          outlined
          label="Telefone"
          hint="10 ou 11 dígitos"
          :mask="mascaraTelefoneAtual"
          inputmode="numeric"
          :rules="[telefoneValidator]"
          :readonly="somenteLeitura"
        />
      </div>
    </div>

    <h3 class="colaborador-formulario__secao-titulo">Endereço</h3>
    <q-toggle
      v-model="formulario.possuiEndereco"
      label="Possui endereço cadastrado"
      :disable="somenteLeitura"
    />

    <div v-if="formulario.possuiEndereco" class="row q-col-gutter-md colaborador-formulario__endereco">
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.cep"
          outlined
          label="CEP"
          class="field-required"
          :mask="MASCARAS.CEP"
          :maxlength="TAMANHO_FORMATADO.CEP"
          inputmode="numeric"
          :rules="[obrigatorio, cepValidator]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-8">
        <q-input
          v-model="formulario.logradouro"
          outlined
          label="Endereço"
          class="field-required"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="formulario.numero"
          outlined
          label="Número"
          class="field-required"
          :mask="MASCARAS.NUMERO_ENDERECO"
          inputmode="numeric"
          :rules="[obrigatorio, numeroEnderecoValidator]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-5">
        <q-input
          v-model="formulario.bairro"
          outlined
          label="Bairro"
          class="field-required"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.complemento"
          outlined
          label="Complemento"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-8">
        <q-input
          v-model="formulario.cidade"
          outlined
          label="Cidade"
          class="field-required"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.estado"
          outlined
          label="UF"
          class="field-required"
          maxlength="2"
          :rules="[obrigatorio, ufValidator]"
          :readonly="somenteLeitura"
        />
      </div>
    </div>

    <h3 class="colaborador-formulario__secao-titulo">Vínculos</h3>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-select
          v-model="formulario.usuarioId"
          outlined
          label="Usuário vinculado"
          emit-value
          map-options
          clearable
          :options="usuarioOpcoes"
          :loading="carregandoUsuarios"
          :readonly="somenteLeitura"
          hint="Opcional — vincule a uma conta de acesso existente (1:1)"
        />
      </div>
      <div class="col-12">
        <q-input
          v-model="formulario.observacoes"
          outlined
          label="Observações"
          type="textarea"
          maxlength="1000"
          autogrow
          :readonly="somenteLeitura"
        />
      </div>
    </div>
  </fieldset>
</q-form>
</template>

<script setup lang="ts">
import { useUsuarios } from 'composables/useUsuarios';
import {
  CargoColaborador,
  CargoColaboradorOpcoes,
  ColaboradorStatusOpcoes,
} from 'constants/enums';
import { MASCARAS, TAMANHO_FORMATADO, mascaraTelefone } from 'constants/masks';
import type { QForm } from 'quasar';
import type { ColaboradorFormModel } from 'types/dtos/colaborador.dto';
import {
  cep,
  cpf,
  email,
  numeroEndereco,
  obrigatorio,
  telefone,
  uf,
} from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  modo: 'criar' | 'editar';
  somenteLeitura?: boolean;
  usuarioVinculadoId?: string | null;
}>();

const formulario = defineModel<ColaboradorFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const { usuarios, carregando: carregandoUsuarios, carregar: carregarUsuarios, nomeCompleto } =
  useUsuarios();

const cpfValidator = cpf;
const cepValidator = cep;
const ufValidator = uf;
const emailValidator = email;
const telefoneValidator = telefone;
const numeroEnderecoValidator = numeroEndereco;

const mascaraTelefoneAtual = computed(() => mascaraTelefone(formulario.value.telefone));
const cargoPersonalizado = computed(() => formulario.value.cargo === CargoColaborador.Personalizado);

const usuarioOpcoes = computed(() =>
  usuarios.value
    .filter(
      (usuario) =>
        usuario.colaboradorId === null ||
        usuario.id === props.usuarioVinculadoId ||
        usuario.id === formulario.value.usuarioId,
    )
    .map((usuario) => ({
      label: `${nomeCompleto(usuario)} (${usuario.email})`,
      value: usuario.id,
    })),
);

watch(cargoPersonalizado, (personalizado) => {
  if (!personalizado) {
    formulario.value.cargoPersonalizado = '';
  }
});

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

onMounted(() => {
  void carregarUsuarios();
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

.colaborador-formulario {
  display: grid;
  gap: var(--spacing-4);
}

.colaborador-formulario__secao-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-2) 0 0;
}

.colaborador-formulario__endereco {
  margin-top: var(--spacing-2);
}
</style>
