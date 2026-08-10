<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Cadastrar fornecedor</h4>
        <p v-if="emitente?.documento" class="subtitulo">
          Documento do XML: <span class="text-metric">{{ emitente.documento }}</span>
        </p>
      </q-card-section>

      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <q-input
            v-model="form.documento"
            outlined
            label="CNPJ/CPF"
            class="field-required"
            :rules="[obrigatorio]"
          />
          <q-input
            v-model="form.razaoSocial"
            outlined
            label="Razão social"
            class="field-required"
            :rules="[obrigatorio]"
          />
          <q-input v-model="form.nomeFantasia" outlined label="Nome fantasia" />
          <q-input v-model="form.inscricaoEstadual" outlined label="Inscrição estadual" />
          <q-input v-model="form.inscricaoMunicipal" outlined label="Inscrição municipal" />
          <q-input v-model="form.telefone" outlined label="Telefone" />
          <q-input v-model="form.logradouro" outlined label="Logradouro" />
          <div class="row q-col-gutter-sm">
            <div class="col-4">
              <q-input v-model="form.numero" outlined label="Número" />
            </div>
            <div class="col-8">
              <q-input v-model="form.bairro" outlined label="Bairro" />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input v-model="form.cidade" outlined label="Cidade" />
            </div>
            <div class="col-3">
              <q-input v-model="form.estado" outlined label="UF" maxlength="2" />
            </div>
            <div class="col-3">
              <q-input v-model="form.cep" outlined label="CEP" />
            </div>
          </div>
          <q-input v-model="form.complemento" outlined label="Complemento" />

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="emit('update:modelValue', false)" />
            <agro-btn
              color="primary"
              unelevated
              label="Salvar fornecedor"
              type="submit"
              :loading="salvando"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useFornecedores } from 'composables/useFornecedores';
import { TipoPessoaFornecedor } from 'constants/enums';
import type { FornecedorDto } from 'types/dtos/fornecedor.dto';
import type { PreviewRecebimentoXmlEmitenteDto } from 'types/dtos/compras.dto';
import { criarFornecedorFormVazia } from 'utils/mappers/fornecedor.mapper';
import { apenasDigitos, formatarCep, formatarDocumento, formatarTelefone } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  emitente?: PreviewRecebimentoXmlEmitenteDto | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  criado: [fornecedor: FornecedorDto];
}>();

const form = ref(criarFornecedorFormVazia());
const { criar, salvando } = useFornecedores();

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      return;
    }

    const emitente = props.emitente;
    const documento = apenasDigitos(emitente?.documento ?? '');
    form.value = {
      ...criarFornecedorFormVazia(),
      tipoPessoa:
        documento.length === 11
          ? TipoPessoaFornecedor.PessoaFisica
          : TipoPessoaFornecedor.PessoaJuridica,
      documento: formatarDocumento(
        documento.length === 11
          ? TipoPessoaFornecedor.PessoaFisica
          : TipoPessoaFornecedor.PessoaJuridica,
        documento,
      ),
      razaoSocial: emitente?.razaoSocial?.trim() ?? '',
      nomeFantasia: emitente?.nomeFantasia?.trim() ?? '',
      inscricaoEstadual: emitente?.inscricaoEstadual?.trim() ?? '',
      inscricaoMunicipal: emitente?.inscricaoMunicipal?.trim() ?? '',
      telefone: formatarTelefone(emitente?.telefone ?? ''),
      possuiEndereco: Boolean(emitente?.logradouro || emitente?.cidade),
      logradouro: emitente?.logradouro?.trim() ?? '',
      numero: emitente?.numero?.trim() ?? '',
      bairro: emitente?.bairro?.trim() ?? '',
      cidade: emitente?.cidade?.trim() ?? '',
      estado: emitente?.uf?.trim() ?? '',
      cep: formatarCep(emitente?.cep ?? ''),
      complemento: emitente?.complemento?.trim() ?? '',
    };
  },
);

async function salvar(): Promise<void> {
  const fornecedor = await criar(form.value, {
    mensagemSucesso: 'Fornecedor cadastrado. Vinculado ao recebimento.',
  });

  if (!fornecedor) {
    return;
  }

  emit('criado', fornecedor);
  emit('update:modelValue', false);
}
</script>

<style scoped>
.dialog {
  width: min(640px, 100vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}
.subtitulo {
  margin: var(--spacing-2) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.agro-formulario {
  display: grid;
  gap: var(--spacing-4);
}
</style>
