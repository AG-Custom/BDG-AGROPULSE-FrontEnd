<template>
  <q-page class="agro-page">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section fornecedor-form-page">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />

        <q-banner
          v-if="!carregandoPagina && fornecedorInativo"
          rounded
          class="fornecedor-form-page__aviso"
        >
          Este fornecedor está inativo e não pode ser editado.
        </q-banner>

        <fornecedor-formulario
          v-if="!carregandoPagina"
          ref="formularioRef"
          v-model:formulario="formulario"
          :modo="modo"
          :somente-leitura="fornecedorInativo"
        />

        <div v-if="!carregandoPagina && !fornecedorInativo" class="agro-form-actions">
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
            :descricao="modo === 'criar' ? 'Cadastrar novo fornecedor' : 'Salvar alterações do fornecedor'"
            :loading="salvando"
            @click="salvar"
          />
        </div>

        <div v-else-if="!carregandoPagina && fornecedorInativo" class="agro-form-actions">
          <agro-btn
            flat
            label="Voltar"
            descricao="Retornar para a listagem de fornecedores"
            @click="voltar"
          />
        </div>
      </agro-card>

      <fornecedor-contatos-section
        v-if="modo === 'editar' && fornecedorAtivo && fornecedorCarregado"
        :fornecedor-id="fornecedorId!"
        :contatos-iniciais="fornecedorCarregado.contatos"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import FornecedorContatosSection from 'components/fornecedores/FornecedorContatosSection.vue';
import FornecedorFormulario from 'components/fornecedores/FornecedorFormulario.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useFornecedores } from 'composables/useFornecedores';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { fornecedorService } from 'services/fornecedor.service';
import type { FornecedorDto, FornecedorFormModel } from 'types/dtos/fornecedor.dto';
import {
  criarFornecedorFormVazia,
  fornecedorDtoParaForm,
} from 'utils/mappers/fornecedor.mapper';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { salvando, criar, editar } = useFornecedores();
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();

const formularioRef = ref<InstanceType<typeof FornecedorFormulario> | null>(null);
const formulario = ref<FornecedorFormModel>(criarFornecedorFormVazia());
const fornecedorCarregado = ref<FornecedorDto | null>(null);
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar'>(() =>
  route.name === 'fornecedor-editar' ? 'editar' : 'criar',
);

const fornecedorId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() =>
  modo.value === 'criar' ? 'Novo fornecedor' : 'Editar fornecedor',
);

const subtituloPagina = computed(() =>
  modo.value === 'criar'
    ? 'Cadastre um novo fornecedor vinculado à sua empresa.'
    : 'Atualize os dados do fornecedor selecionado.',
);

const fornecedorInativo = computed(
  () => modo.value === 'editar' && fornecedorCarregado.value?.ativo === false,
);

const fornecedorAtivo = computed(
  () => modo.value === 'editar' && fornecedorCarregado.value?.ativo === true,
);

async function carregarFornecedor(): Promise<void> {
  if (!fornecedorId.value) {
    return;
  }

  try {
    fornecedorCarregado.value = await fornecedorService.obter(fornecedorId.value);
    formulario.value = fornecedorDtoParaForm(fornecedorCarregado.value);
  } catch (e) {
    erro(mensagem(e));
    await router.replace({ name: 'fornecedores' });
  }
}

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  if (modo.value === 'editar') {
    await carregarFornecedor();
  } else {
    formulario.value = criarFornecedorFormVazia();
  }

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'fornecedores' });
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modo.value === 'criar'
      ? await criar(formulario.value)
      : await editar(fornecedorId.value!, formulario.value);

  if (sucesso) {
    await router.push({ name: 'fornecedores' });
  }
}

onMounted(() => {
  void inicializar();
});
</script>

<style scoped>
.fornecedor-form-page {
  display: grid;
  gap: var(--spacing-6);
}

.fornecedor-form-page__aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  margin-bottom: var(--spacing-4);
}
</style>
