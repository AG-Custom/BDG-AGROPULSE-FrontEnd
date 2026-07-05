<template>
  <q-form ref="formRef" class="unidade-form" greedy>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="unidade.nome"
          outlined
          label="Nome"
          class="field-required"
          aria-required="true"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          v-model="unidade.tipo"
          outlined
          label="Tipo"
          class="field-required"
          emit-value
          map-options
          aria-required="true"
          :options="TipoUnidadeOpcoes"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="unidade.codigo"
          outlined
          label="Código"
          hint="Gerado automaticamente para identificação interna"
          disable
        />
      </div>
      <div class="col-12 col-md-6 unidade-matriz">
        <q-toggle v-model="unidade.matriz" label="Unidade matriz" @update:model-value="onMatrizChange" />
        <q-icon name="info" size="18px" color="grey-7" class="unidade-matriz__info" aria-label="Sobre unidade matriz">
          <q-tooltip max-width="280px">
            Unidade matriz é a unidade principal (sede) da empresa dentro do AgroPulse.
          </q-tooltip>
        </q-icon>
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="unidade.telefone"
          outlined
          label="Telefone"
          class="field-required"
          hint="10 ou 11 dígitos"
          aria-required="true"
          :mask="mascaraTelefoneAtual"
          :maxlength="tamanhoTelefone"
          inputmode="numeric"
          :rules="[obrigatorio, telefoneValidator]"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="unidade.email"
          outlined
          label="E-mail"
          class="field-required"
          type="email"
          aria-required="true"
          :rules="[obrigatorio, emailValidator]"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="unidade.cep"
          outlined
          label="CEP"
          class="field-required"
          hint="8 dígitos"
          aria-required="true"
          :mask="MASCARAS.CEP"
          :maxlength="TAMANHO_FORMATADO.CEP"
          inputmode="numeric"
          :rules="[obrigatorio, cepValidator]"
        />
      </div>
      <div class="col-12 col-md-8">
        <q-input
          v-model="unidade.endereco"
          outlined
          label="Endereço"
          class="field-required"
          aria-required="true"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="unidade.numero"
          outlined
          label="Número"
          class="field-required"
          aria-required="true"
          :mask="MASCARAS.NUMERO_ENDERECO"
          :maxlength="TAMANHO_FORMATADO.NUMERO_ENDERECO"
          inputmode="numeric"
          :rules="[obrigatorio, numeroEnderecoValidator]"
        />
      </div>
      <div class="col-12 col-md-5">
        <q-input
          v-model="unidade.bairro"
          outlined
          label="Bairro"
          class="field-required"
          aria-required="true"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="unidade.complemento" outlined label="Complemento" />
      </div>
      <div class="col-12 col-md-8">
        <q-input
          v-model="unidade.cidade"
          outlined
          label="Cidade"
          class="field-required"
          aria-required="true"
          :rules="[obrigatorio]"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="unidade.estado"
          outlined
          label="UF"
          class="field-required"
          maxlength="2"
          aria-required="true"
          :rules="[obrigatorio, ufValidator]"
        />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { TipoUnidadeOpcoes } from 'constants/enums';
import { MASCARAS, TAMANHO_FORMATADO, mascaraTelefone, tamanhoFormatadoTelefone } from 'constants/masks';
import type { QForm } from 'quasar';
import type { UnidadeFormModel } from 'types/dtos/onboarding.dto';
import { gerarCodigoUnidade } from 'utils/formatters';
import { cep, email, numeroEndereco, obrigatorio, telefone, uf } from 'utils/validators';
import { computed, ref, watch } from 'vue';

const unidade = defineModel<UnidadeFormModel>('unidade', { required: true });

const emit = defineEmits<{
  matrizChange: [id: string];
}>();

const formRef = ref<QForm | null>(null);

const cepValidator = cep;
const ufValidator = uf;
const emailValidator = email;
const telefoneValidator = telefone;
const numeroEnderecoValidator = numeroEndereco;

const mascaraTelefoneAtual = computed(() => mascaraTelefone(unidade.value.telefone));
const tamanhoTelefone = computed(() => tamanhoFormatadoTelefone(unidade.value.telefone));

watch(
  () => [unidade.value.tipo, unidade.value.nome] as const,
  ([tipo, nome]) => {
    unidade.value.codigo = gerarCodigoUnidade(tipo, nome);
  },
  { immediate: true },
);

async function validar(): Promise<boolean> {
  return (await formRef.value?.validate()) ?? false;
}

function onMatrizChange(valor: boolean): void {
  if (valor) {
    emit('matrizChange', unidade.value.id);
  }
}

defineExpose({ validar });
</script>

<style scoped>
.unidade-matriz {
  align-items: center;
  display: flex;
  gap: var(--spacing-1);
  min-height: 56px;
}

.unidade-matriz__info {
  cursor: help;
  flex-shrink: 0;
}
</style>
