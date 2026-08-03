<template>
  <q-form
    ref="formRef"
    class="unidade-formulario agro-formulario"
    greedy
    :class="{ 'agro-formulario--bloqueado': bloqueado }"
  >
    <fieldset class="agro-formulario__fieldset">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <agro-select-cadastro
            v-model="formulario.cnpjEmpresaId"
            entidade="cnpj"
            label="CNPJ"
            class="field-required"
            aria-required="true"
            :options="cnpjOpcoes"
            :loading="carregandoCnpjs"
            :readonly="bloqueado || !!carregandoCnpjs"
            :desabilitar-cadastro="bloqueado"
            :rules="bloqueado ? undefined : [obrigatorio]"
            @atualizar="emit('atualizarCnpjs')"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="formulario.nome"
            outlined
            label="Nome"
            class="field-required"
            aria-required="true"
            :readonly="bloqueado"
            :rules="bloqueado ? undefined : [obrigatorio]"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="formulario.codigo"
            outlined
            label="Código"
            hint="Gerado automaticamente para identificação interna"
            disable
            readonly
          />
        </div>
        <div class="col-12 col-md-6 unidade-matriz">
          <q-toggle
            v-model="formulario.matriz"
            label="Unidade matriz"
            :disable="bloqueado"
            @update:model-value="onMatrizChange"
          />
          <q-icon
            name="info"
            size="18px"
            class="unidade-matriz__info text-tertiary"
            aria-label="Sobre unidade matriz"
          >
            <q-tooltip max-width="280px">
              Unidade matriz é a unidade principal (sede) da empresa dentro do AgroPulse.
            </q-tooltip>
          </q-icon>
        </div>
        <div v-if="formulario.matriz" class="col-12">
          <q-toggle
            v-model="formulario.propagarCadastrosParaFiliais"
            label="Deseja que os itens cadastráveis a partir da matriz sejam também criados nas filiais?"
            :disable="bloqueado"
          />
          <p class="hint-propagacao">
            Produtos, categorias, unidades de medida, clientes, fornecedores e tabelas de preço
            criados/editados na matriz serão refletidos nas filiais ativas.
          </p>
        </div>
        <div v-if="modo !== 'criar'" class="col-12 col-md-6">
          <q-select
            v-model="formulario.status"
            outlined
            label="Status"
            class="field-required"
            emit-value
            map-options
            aria-required="true"
            :options="UnidadeStatusOpcoes"
            :readonly="bloqueado"
            :rules="bloqueado ? undefined : [obrigatorio]"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="formulario.timeZoneId"
            outlined
            label="Fuso horário"
            class="field-required"
            emit-value
            map-options
            aria-required="true"
            :options="TimeZoneOpcoes"
            :readonly="bloqueado"
            :rules="bloqueado ? undefined : [obrigatorio]"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="formulario.telefone"
            outlined
            label="Telefone"
            hint="10 ou 11 dígitos"
            :mask="mascaraTelefoneAtual"
            :maxlength="tamanhoTelefone"
            inputmode="numeric"
            :readonly="bloqueado"
            :rules="bloqueado ? undefined : [telefoneValidator]"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="formulario.email"
            outlined
            label="E-mail"
            type="email"
            :readonly="bloqueado"
            :rules="bloqueado ? undefined : [emailValidator]"
          />
        </div>
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
            :readonly="bloqueado"
            :rules="bloqueado ? undefined : [obrigatorio, cepValidator]"
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
            :readonly="bloqueado"
            :rules="bloqueado ? undefined : [obrigatorio]"
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
            :readonly="bloqueado"
            :rules="bloqueado ? undefined : [obrigatorio, numeroEnderecoValidator]"
          />
        </div>
        <div class="col-12 col-md-5">
          <q-input
            v-model="formulario.bairro"
            outlined
            label="Bairro"
            class="field-required"
            aria-required="true"
            :readonly="bloqueado"
            :rules="bloqueado ? undefined : [obrigatorio]"
          />
        </div>
        <div class="col-12 col-md-4">
          <q-input
            v-model="formulario.complemento"
            outlined
            label="Complemento"
            :readonly="bloqueado"
          />
        </div>
        <div class="col-12 col-md-8">
          <q-input
            v-model="formulario.cidade"
            outlined
            label="Cidade"
            class="field-required"
            aria-required="true"
            :readonly="bloqueado"
            :rules="bloqueado ? undefined : [obrigatorio]"
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
            :readonly="bloqueado"
            :rules="bloqueado ? undefined : [obrigatorio, ufValidator]"
          />
        </div>
      </div>
    </fieldset>
  </q-form>
</template>

<script setup lang="ts">
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useBuscaCep } from 'composables/useBuscaCep';
import { TimeZoneOpcoes, TipoUnidade, UnidadeStatusOpcoes } from 'constants/enums';
import { MASCARAS, TAMANHO_FORMATADO, mascaraTelefone, tamanhoFormatadoTelefone } from 'constants/masks';
import type { QForm } from 'quasar';
import type { CnpjEmpresaDto } from 'types/dtos/cnpj.dto';
import type { UnidadeFormModel } from 'types/dtos/unidade.dto';
import { formatarCnpj, gerarCodigoUnidade } from 'utils/formatters';
import { cep, email, numeroEndereco, obrigatorio, telefone, uf } from 'utils/validators';
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modo: 'criar' | 'editar';
    somenteLeitura?: boolean;
    cnpjs: CnpjEmpresaDto[];
    carregandoCnpjs?: boolean;
  }>(),
  {
    somenteLeitura: false,
    carregandoCnpjs: false,
  },
);

const emit = defineEmits<{
  atualizarCnpjs: [];
}>();

const formulario = defineModel<UnidadeFormModel>('formulario', { required: true });

const formRef = ref<QForm | null>(null);
const { buscandoCep, buscarSeCepValido } = useBuscaCep(formulario);

const bloqueado = computed(() => props.somenteLeitura === true);

const cepValidator = cep;
const ufValidator = uf;
const emailValidator = email;
const telefoneValidator = telefone;
const numeroEnderecoValidator = numeroEndereco;

const mascaraTelefoneAtual = computed(() => mascaraTelefone(formulario.value.telefone));
const tamanhoTelefone = computed(() => tamanhoFormatadoTelefone(formulario.value.telefone));

const cnpjOpcoes = computed(() =>
  props.cnpjs.map((cnpj) => ({
    label: `${formatarCnpj(cnpj.numero)} — ${cnpj.razaoSocial}`,
    value: cnpj.id,
  })),
);

watch(
  () => [formulario.value.nome, formulario.value.matriz] as const,
  ([nome, matriz]) => {
    if (props.modo === 'criar' && !props.somenteLeitura) {
      formulario.value.tipo = TipoUnidade.Filial;
      formulario.value.codigo = gerarCodigoUnidade(TipoUnidade.Filial, nome, matriz);
    }
  },
  { immediate: true },
);

function onMatrizChange(valor: boolean): void {
  if (!valor) {
    formulario.value.propagarCadastrosParaFiliais = false;
  }
}

async function validar(): Promise<boolean> {
  formulario.value.tipo = TipoUnidade.Filial;
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

.hint-propagacao {
  margin: calc(var(--spacing-1) * -1) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
</style>
