<template>
  <q-page class="agro-page">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section categoria-produto-form-page">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="3" />

        <q-banner
          v-if="!carregandoPagina && categoriaInativa"
          rounded
          class="categoria-produto-form-page__aviso"
        >
          Esta categoria está inativa e não pode ser editada.
        </q-banner>

        <categoria-produto-formulario
          v-if="!carregandoPagina"
          ref="formularioRef"
          v-model:formulario="formulario"
          :somente-leitura="somenteLeitura || categoriaInativa"
        />

        <div v-if="!carregandoPagina && modo !== 'visualizar' && !categoriaInativa" class="agro-form-actions">
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
            no-caps
            :label="rotuloSalvar"
            :descricao="descricaoSalvar"
            :loading="salvando"
            :disable="salvando"
            @click="salvar"
          />
        </div>

        <div v-else-if="!carregandoPagina && (modo === 'visualizar' || categoriaInativa)" class="agro-form-actions">
          <agro-btn
            flat
            label="Voltar"
            descricao="Retornar para a listagem de categorias"
            @click="voltar"
          />
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import CategoriaProdutoFormulario from 'components/categorias-produto/CategoriaProdutoFormulario.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useCategoriasProduto } from 'composables/useCategoriasProduto';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { categoriaProdutoService } from 'services/categoria-produto.service';
import type { CategoriaProdutoDto, CategoriaProdutoFormModel } from 'types/dtos/categoria-produto.dto';
import {
  categoriaProdutoDtoParaForm,
  criarCategoriaProdutoFormVazia,
} from 'utils/mappers/categoria-produto.mapper';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { salvando, criar, editar } = useCategoriasProduto();
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();

const formularioRef = ref<InstanceType<typeof CategoriaProdutoFormulario> | null>(null);
const formulario = ref<CategoriaProdutoFormModel>(criarCategoriaProdutoFormVazia());
const categoriaCarregada = ref<CategoriaProdutoDto | null>(null);
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'categoria-produto-visualizar') {
    return 'visualizar';
  }

  return route.name === 'categoria-produto-editar' ? 'editar' : 'criar';
});


const somenteLeitura = computed(() => modo.value === 'visualizar');

const categoriaId = computed(() => route.params.id as string | undefined);

const tituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Nova categoria';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar categoria';
  }

  return 'Editar categoria';
});

const subtituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Cadastre uma nova categoria de produto.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte os dados da categoria selecionada.';
  }

  return 'Atualize os dados da categoria selecionada.';
});

const categoriaInativa = computed(
  () => modo.value === 'editar' && categoriaCarregada.value?.ativo === false,
);

const rotuloSalvar = computed(() => (modo.value === 'criar' ? 'Cadastrar' : 'Salvar'));

const descricaoSalvar = computed(() =>
  modo.value === 'criar' ? 'Cadastrar nova categoria' : 'Salvar alterações da categoria',
);

async function carregarCategoria(): Promise<void> {
  if (!categoriaId.value) {
    return;
  }

  try {
    categoriaCarregada.value = await categoriaProdutoService.obter(categoriaId.value);
    formulario.value = categoriaProdutoDtoParaForm(categoriaCarregada.value);
  } catch (e) {
    erro(mensagem(e));
    await router.replace({ name: 'categorias-produto' });
  }
}

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  if (modo.value === 'editar' || modo.value === 'visualizar') {
    await carregarCategoria();
  } else {
    formulario.value = criarCategoriaProdutoFormVazia();
  }

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'categorias-produto' });
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  const sucesso =
    modo.value === 'criar'
      ? await criar(formulario.value)
      : await editar(categoriaId.value!, formulario.value);

  if (sucesso) {
    await router.push({ name: 'categorias-produto' });
  }
}

onMounted(() => {
  void inicializar();
});
</script>

<style scoped>
.categoria-produto-form-page__aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  margin-bottom: var(--spacing-4);
}
</style>
