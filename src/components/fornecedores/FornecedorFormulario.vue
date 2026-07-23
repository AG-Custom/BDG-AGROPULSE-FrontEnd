<template>
  <q-form ref="formRef" class="fornecedor-formulario agro-formulario" greedy :class="{ 'agro-formulario--bloqueado': somenteLeitura }">
    <fieldset class="agro-formulario__fieldset">
<h3 class="fornecedor-formulario__secao-titulo">Identificação</h3>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-select
          v-model="formulario.tipoPessoa"
          outlined
          label="Tipo de pessoa"
          class="field-required"
          emit-value
          map-options
          aria-required="true"
          :options="TipoPessoaFornecedorOpcoes"
          :readonly="modo === 'editar' || somenteLeitura"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="documentoExibicao"
          outlined
          :label="rotuloDocumento"
          class="field-required"
          aria-required="true"
          :mask="modo === 'criar' && !somenteLeitura ? mascaraDocumentoAtual : undefined"
          :maxlength="modo === 'criar' && !somenteLeitura ? tamanhoDocumentoAtual : undefined"
          inputmode="numeric"
          :rules="modo === 'criar' ? [obrigatorio, documentoValidator] : undefined"
          :readonly="modo === 'editar' || somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.razaoSocial"
          outlined
          label="Razão social / Nome"
          class="field-required"
          maxlength="200"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.nomeFantasia"
          outlined
          label="Nome fantasia"
          maxlength="200"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.inscricaoEstadual"
          outlined
          label="Inscrição estadual"
          maxlength="30"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.inscricaoMunicipal"
          outlined
          label="Inscrição municipal"
          maxlength="30"
          :readonly="somenteLeitura"
        />
      </div>
    </div>

    <h3 class="fornecedor-formulario__secao-titulo">Contato comercial</h3>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="formulario.email"
          outlined
          label="E-mail"
          type="email"
          maxlength="150"
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
          maxlength="15"
          :mask="mascaraTelefoneAtual"
          inputmode="numeric"
          :rules="[telefoneValidator]"
          :readonly="somenteLeitura"
        />
      </div>
    </div>

    <h3 class="fornecedor-formulario__secao-titulo">Endereço</h3>
    <q-toggle
      v-model="formulario.possuiEndereco"
      label="Possui endereço cadastrado"
      :disable="somenteLeitura"
    />

    <div v-if="formulario.possuiEndereco" class="row q-col-gutter-md fornecedor-formulario__endereco">
      <div class="col-12 col-md-4">
        <q-input
          v-model="formulario.cep"
          outlined
          label="CEP"
          class="field-required"
          hint="8 dígitos — preenchimento automático do endereço"
          aria-required="true"
          :mask="MASCARAS.CEP"
          :maxlength="TAMANHO_FORMATADO.CEP"
          inputmode="numeric"
          :loading="buscandoCep"
          :rules="[obrigatorio, cepValidator]"
          :readonly="somenteLeitura"
          @blur="buscarSeCepValido"
        />
      </div>
      <div class="col-12 col-md-8">
        <q-input
          v-model="formulario.logradouro"
          outlined
          label="Endereço"
          class="field-required"
          aria-required="true"
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
          aria-required="true"
          :mask="MASCARAS.NUMERO_ENDERECO"
          :maxlength="TAMANHO_FORMATADO.NUMERO_ENDERECO"
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
          aria-required="true"
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
          aria-required="true"
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
          aria-required="true"
          :rules="[obrigatorio, ufValidator]"
          :readonly="somenteLeitura"
        />
      </div>
    </div>

    <h3 class="fornecedor-formulario__secao-titulo">Observações</h3>
    <q-input
      v-model="formulario.observacoes"
      outlined
      label="Observações"
      type="textarea"
      maxlength="1000"
      autogrow
          :readonly="somenteLeitura"
        />
  </fieldset>
</q-form>
</template>

<script setup lang="ts">
import { useBuscaCep } from 'composables/useBuscaCep';
import { TipoPessoaFornecedor, TipoPessoaFornecedorOpcoes } from 'constants/enums';
import { DIGITOS, MASCARAS, TAMANHO_FORMATADO, mascaraTelefone } from 'constants/masks';
import type { QForm } from 'quasar';
import type { FornecedorFormModel } from 'types/dtos/fornecedor.dto';
import { formatarDocumento } from 'utils/formatters';
import {
  cep,
  documentoFornecedor,
  email,
  numeroEndereco,
  obrigatorio,
  telefone,
  uf,
} from 'utils/validators';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  modo: 'criar' | 'editar';
  somenteLeitura?: boolean;
}>();

const formulario = defineModel<FornecedorFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const { buscandoCep, buscarSeCepValido } = useBuscaCep(formulario);

const cepValidator = cep;
const ufValidator = uf;
const emailValidator = email;
const telefoneValidator = telefone;
const numeroEnderecoValidator = numeroEndereco;

const mascaraTelefoneAtual = computed(() => mascaraTelefone(formulario.value.telefone));

const rotuloDocumento = computed(() =>
  formulario.value.tipoPessoa === TipoPessoaFornecedor.PessoaFisica ? 'CPF' : 'CNPJ',
);

const mascaraDocumentoAtual = computed(() =>
  formulario.value.tipoPessoa === TipoPessoaFornecedor.PessoaFisica
    ? MASCARAS.CPF
    : MASCARAS.CNPJ,
);

const tamanhoDocumentoAtual = computed(() =>
  formulario.value.tipoPessoa === TipoPessoaFornecedor.PessoaFisica
    ? TAMANHO_FORMATADO.CPF
    : TAMANHO_FORMATADO.CNPJ,
);

const documentoValidator = computed(() => documentoFornecedor(formulario.value.tipoPessoa));

const documentoExibicao = computed({
  get() {
    if (props.modo === 'editar' || props.somenteLeitura) {
      return formatarDocumento(formulario.value.tipoPessoa, formulario.value.documento);
    }

    return formulario.value.documento;
  },
  set(valor: string) {
    if (props.modo === 'criar' && !props.somenteLeitura) {
      formulario.value.documento = valor;
    }
  },
});

watch(
  () => formulario.value.tipoPessoa,
  (tipoAtual, tipoAnterior) => {
    if (props.modo === 'criar' && tipoAnterior !== undefined && tipoAtual !== tipoAnterior) {
      formulario.value.documento = '';
    }
  },
);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

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

.fornecedor-formulario {
  display: grid;
  gap: var(--spacing-4);
}

.fornecedor-formulario__secao-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-2) 0 0;
}

.fornecedor-formulario__endereco {
  margin-top: var(--spacing-2);
}
</style>
