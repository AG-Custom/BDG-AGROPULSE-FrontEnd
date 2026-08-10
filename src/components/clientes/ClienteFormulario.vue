<template>
  <q-form ref="formRef" class="cliente-formulario agro-formulario" greedy :class="{ 'agro-formulario--bloqueado': somenteLeitura }">
    <fieldset class="agro-formulario__fieldset">
<h3 class="cliente-formulario__secao-titulo">Identificação</h3>
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
          :options="TipoPessoaClienteOpcoes"
          :readonly="modo === 'editar' || somenteLeitura"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          v-model="formulario.tipoCliente"
          outlined
          label="Tipo de cliente"
          class="field-required"
          emit-value
          map-options
          aria-required="true"
          :options="TipoClienteOpcoes"
          :readonly="somenteLeitura"
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
          v-model="formulario.nomeRazao"
          outlined
          :label="rotuloNomeRazao"
          class="field-required"
          maxlength="200"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div v-if="!ehPessoaFisica" class="col-12 col-md-6">
        <q-input
          v-model="formulario.nomeFantasia"
          outlined
          label="Nome fantasia"
          maxlength="200"
          :readonly="somenteLeitura"
        />
      </div>
      <div v-if="ehPessoaFisica" class="col-12 col-md-3">
        <q-input
          v-model="formulario.dataNascimento"
          outlined
          label="Data de nascimento"
          type="date"
          class="field-required"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
      <div v-else class="col-12 col-md-3">
        <q-input
          v-model="formulario.dataFundacao"
          outlined
          label="Data de fundação"
          type="date"
          class="field-required"
          aria-required="true"
          :rules="[obrigatorio]"
          :readonly="somenteLeitura"
        />
      </div>
    </div>

    <h3 class="cliente-formulario__secao-titulo">Contato</h3>
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

    <h3 class="cliente-formulario__secao-titulo">Comercial</h3>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-input
          v-model="formulario.prazoRecompra"
          outlined
          label="Prazo de recompra (dias)"
          type="number"
          min="0"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-3">
        <AgroMoneyInput
          v-model="formulario.limiteCredito"
          label="Limite de crédito"
          :readonly="somenteLeitura"
        />
      </div>
      <div class="col-12 col-md-6">
        <agro-select-cadastro
          v-model="formulario.vendedorUsuarioId"
          entidade="usuario"
          label="Vendedor"
          :clearable="!carteiraRestrita && !somenteLeitura"
          :options="vendedorOpcoes"
          :loading="carregandoUsuarios"
          :readonly="somenteLeitura || carteiraRestrita"
          :desabilitar-cadastro="somenteLeitura || carteiraRestrita"
          :hint="carteiraRestrita ? 'Carteira vinculada ao seu usuário' : undefined"
          @atualizar="carregarUsuarios()"
        />
      </div>
    </div>
  </fieldset>
</q-form>
</template>

<script setup lang="ts">
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { usePerfilAtual } from 'composables/usePerfilAtual';
import { useUsuarios } from 'composables/useUsuarios';
import {
  isPerfilCarteiraVendedor,
  TipoClienteOpcoes,
  TipoPessoaCliente,
  TipoPessoaClienteOpcoes,
  UsuarioStatus,
} from 'constants/enums';
import { MASCARAS, TAMANHO_FORMATADO, mascaraTelefone } from 'constants/masks';
import type { QForm } from 'quasar';
import type { ClienteFormModel } from 'types/dtos/cliente.dto';
import { formatarDocumento } from 'utils/formatters';
import { documentoFornecedor, email, obrigatorio, telefone } from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  modo: 'criar' | 'editar';
  somenteLeitura?: boolean;
}>();

const formulario = defineModel<ClienteFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const { carteiraRestrita, usuario } = usePerfilAtual();
const {
  usuarios,
  carregando: carregandoUsuarios,
  carregar: carregarUsuarios,
  nomeCompleto,
} = useUsuarios();

const emailValidator = email;
const telefoneValidator = telefone;

const mascaraTelefoneAtual = computed(() => mascaraTelefone(formulario.value.telefone));

const ehPessoaFisica = computed(
  () => formulario.value.tipoPessoa === TipoPessoaCliente.PessoaFisica,
);

const rotuloDocumento = computed(() => (ehPessoaFisica.value ? 'CPF' : 'CNPJ'));

const rotuloNomeRazao = computed(() =>
  ehPessoaFisica.value ? 'Nome completo' : 'Razão social',
);

const mascaraDocumentoAtual = computed(() =>
  ehPessoaFisica.value ? MASCARAS.CPF : MASCARAS.CNPJ,
);

const tamanhoDocumentoAtual = computed(() =>
  ehPessoaFisica.value ? TAMANHO_FORMATADO.CPF : TAMANHO_FORMATADO.CNPJ,
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

const vendedorOpcoes = computed(() => {
  if (carteiraRestrita.value && usuario.value) {
    return [
      {
        label: usuario.value.nome,
        value: usuario.value.id,
      },
    ];
  }

  return usuarios.value
    .filter(
      (item) =>
        item.status === UsuarioStatus.Ativo &&
        (isPerfilCarteiraVendedor(item.perfil) ||
          item.id === formulario.value.vendedorUsuarioId),
    )
    .map((item) => ({
      label: nomeCompleto(item),
      value: item.id,
    }));
});

function aplicarCarteiraVendedor(): void {
  if (!carteiraRestrita.value || !usuario.value || props.somenteLeitura) {
    return;
  }

  formulario.value.vendedorUsuarioId = usuario.value.id;
}

watch(
  () => formulario.value.tipoPessoa,
  (tipoAtual, tipoAnterior) => {
    if (props.modo === 'criar' && tipoAnterior !== undefined && tipoAtual !== tipoAnterior) {
      formulario.value.documento = '';
      formulario.value.dataNascimento = '';
      formulario.value.dataFundacao = '';
      formulario.value.nomeFantasia = '';
    }
  },
);

watch(carteiraRestrita, () => {
  aplicarCarteiraVendedor();
});

async function validar(): Promise<boolean> {
  aplicarCarteiraVendedor();
  return (await formRef.value?.validate()) ?? false;
}

onMounted(() => {
  void carregarUsuarios();
  aplicarCarteiraVendedor();
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

.cliente-formulario {
  display: grid;
  gap: var(--spacing-4);
}

.cliente-formulario__secao-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-2) 0 0;
}
</style>
