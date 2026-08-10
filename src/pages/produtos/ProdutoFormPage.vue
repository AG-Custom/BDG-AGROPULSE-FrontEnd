<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section produto-form-page">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />

        <q-banner
          v-if="!carregandoPagina && produtoInativo"
          rounded
          class="produto-form-page__aviso"
        >
          Este produto está inativo e não pode ser editado.
        </q-banner>

        <produto-formulario
          v-if="!carregandoPagina"
          ref="formularioRef"
          v-model:formulario="formulario"
          :modo="modoFormulario"
          :somente-leitura="somenteLeitura || produtoInativo"
          :custo-medio-ponderado="produtoCarregado?.custoMedioPonderado"
        />

        <div
          v-if="!carregandoPagina && !etapaInicialCadastro && modo !== 'visualizar' && !produtoInativo"
          class="agro-form-actions"
        >
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
            label="Salvar"
            :descricao="descricaoBotaoPrincipal"
            :loading="salvando"
            @click="salvar"
          />
        </div>

        <div v-else-if="!carregandoPagina && (modo === 'visualizar' || produtoInativo)" class="agro-form-actions">
          <agro-btn
            flat
            label="Voltar"
            descricao="Retornar para a listagem de produtos"
            @click="voltar"
          />
        </div>
      </agro-card>

      <produto-limites-estoque-section
        v-if="!carregandoPagina && etapaInicialCadastro"
        ref="limitesSectionRef"
        :produto-id="produtoIdPersistido"
        :somente-leitura="somenteLeitura"
        v-model:limites="complementos.limites"
      />

      <div
        v-if="!carregandoPagina && etapaInicialCadastro && !produtoInativo"
        class="agro-form-actions"
      >
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
          label="Salvar"
          :descricao="descricaoBotaoPrincipal"
          :loading="salvando"
          @click="salvar"
        />
      </div>

      <template v-if="mostrarComplementos">
        <produto-fiscal-section
          :produto-id="produtoIdPersistido"
          :fiscal-inicial="produtoCarregado?.fiscal"
          :somente-leitura="somenteLeitura"
          v-model:formulario="complementos.fiscal"
        />

        <produto-codigos-section
          :produto-id="produtoIdPersistido"
          :somente-leitura="somenteLeitura"
          v-model:codigos="complementos.codigos"
        />

        <produto-documentos-section
          :produto-id="produtoIdPersistido"
          :somente-leitura="somenteLeitura"
          v-model:documentos="complementos.documentos"
        />

        <produto-limites-estoque-section
          ref="limitesSectionRef"
          :produto-id="produtoIdPersistido"
          :somente-leitura="somenteLeitura"
          v-model:limites="complementos.limites"
        />

        <produto-conversoes-section
          :produto-id="produtoIdPersistido"
          :somente-leitura="somenteLeitura"
          v-model:conversoes="complementos.conversoes"
        />

        <div
          v-if="fluxoCadastro && !somenteLeitura && !produtoInativo"
          class="agro-form-actions produto-form-page__acoes-finais"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Cadastrar produto"
            descricao="Concluir o cadastro do produto e voltar à listagem"
            :loading="salvando"
            @click="concluirCadastro"
          />
        </div>
      </template>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import ProdutoCodigosSection from 'components/produtos/ProdutoCodigosSection.vue';
import ProdutoConversoesSection from 'components/produtos/ProdutoConversoesSection.vue';
import ProdutoDocumentosSection from 'components/produtos/ProdutoDocumentosSection.vue';
import ProdutoFiscalSection from 'components/produtos/ProdutoFiscalSection.vue';
import ProdutoFormulario from 'components/produtos/ProdutoFormulario.vue';
import ProdutoLimitesEstoqueSection from 'components/produtos/ProdutoLimitesEstoqueSection.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useProdutos } from 'composables/useProdutos';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { produtoService } from 'services/produto.service';
import type {
  ProdutoComplementosFormModel,
  ProdutoDto,
  ProdutoFormModel,
} from 'types/dtos/produto.dto';
import {
  criarComplementosFormVazio,
  criarProdutoFormVazio,
  fiscalDtoParaForm,
  limiteDtoParaForm,
  produtoDtoParaForm,
} from 'utils/mappers/produto.mapper';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { salvando, criar, editar } = useProdutos();
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();

const formularioRef = ref<InstanceType<typeof ProdutoFormulario> | null>(null);
const limitesSectionRef = ref<InstanceType<typeof ProdutoLimitesEstoqueSection> | null>(null);
const formulario = ref<ProdutoFormModel>(criarProdutoFormVazio());
const complementos = ref<ProdutoComplementosFormModel>(criarComplementosFormVazio());
const produtoCarregado = ref<ProdutoDto | null>(null);
const carregandoPagina = ref(true);

const modo = computed<'criar' | 'editar' | 'visualizar'>(() => {
  if (route.name === 'produto-visualizar') {
    return 'visualizar';
  }

  return route.name === 'produto-editar' ? 'editar' : 'criar';
});

/** Cadastro em etapas: URL pode ser editar, mas a UX permanece como "Novo produto". */
const fluxoCadastro = computed(
  () =>
    modo.value === 'criar' ||
    (modo.value === 'editar' && route.query.origem === 'cadastro'),
);

/** Etapa 1: formulário completo (identificação + estoque + comercial), sem complementos. */
const etapaInicialCadastro = computed(() => modo.value === 'criar');

const modoFormulario = computed<'criar' | 'editar'>(() =>
  modo.value === 'criar' ? 'criar' : 'editar',
);

const somenteLeitura = computed(() => modo.value === 'visualizar');

const produtoId = computed(() => route.params.id as string | undefined);

const produtoIdPersistido = computed(() =>
  modo.value === 'editar' || modo.value === 'visualizar' ? produtoId.value : undefined,
);

const tituloPagina = computed(() => {
  if (fluxoCadastro.value) {
    return 'Novo produto';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar produto';
  }

  return 'Editar produto';
});

const subtituloPagina = computed(() => {
  if (etapaInicialCadastro.value) {
    return 'Cadastre o produto e os dados complementares na mesma tela.';
  }

  if (fluxoCadastro.value) {
    return 'Complete as configurações do produto e finalize o cadastro.';
  }

  if (modo.value === 'visualizar') {
    return 'Consulte os dados do produto selecionado.';
  }

  return 'Atualize os dados do produto selecionado.';
});

const produtoInativo = computed(
  () => modo.value === 'editar' && produtoCarregado.value?.ativo === false,
);

const mostrarComplementos = computed(
  () =>
    !carregandoPagina.value &&
    !etapaInicialCadastro.value &&
    (modo.value === 'visualizar' || (modo.value === 'editar' && !produtoInativo.value)),
);

const descricaoBotaoPrincipal = computed(() => {
  if (etapaInicialCadastro.value) {
    return 'Salvar o produto e liberar as configurações complementares';
  }

  if (fluxoCadastro.value) {
    return 'Salvar alterações do produto sem sair do cadastro';
  }

  return 'Salvar alterações do produto';
});

function hidratarComplementos(produto: ProdutoDto): void {
  complementos.value = {
    fiscal: produto.fiscal ? fiscalDtoParaForm(produto.fiscal) : criarComplementosFormVazio().fiscal,
    codigos: [...produto.codigos],
    documentos: [...produto.documentos],
    limites: produto.limitesEstoque.map(limiteDtoParaForm),
    conversoes: [...produto.conversoesUnidade],
  };
}

async function carregarProduto(): Promise<void> {
  if (!produtoId.value) {
    return;
  }

  try {
    produtoCarregado.value = await produtoService.obter(produtoId.value);
    formulario.value = produtoDtoParaForm(produtoCarregado.value);
    hidratarComplementos(produtoCarregado.value);
  } catch (e) {
    erro(mensagem(e));
    await router.replace({ name: 'produtos' });
  }
}

async function inicializar(): Promise<void> {
  carregandoPagina.value = true;

  if (modo.value === 'editar' || modo.value === 'visualizar') {
    await carregarProduto();
  } else {
    produtoCarregado.value = null;
    formulario.value = criarProdutoFormVazio();
    complementos.value = criarComplementosFormVazio();
  }

  carregandoPagina.value = false;
}

function voltar(): void {
  void router.push({ name: 'produtos' });
}

function limitesEstoqueValidos(): boolean {
  if (complementos.value.limites.length === 0) {
    return true;
  }

  const limitesValidos = limitesSectionRef.value?.validarLimites() ?? false;

  if (!limitesValidos) {
    erro('Verifique os limites de estoque: mínimo e máximo (mínimo ≤ máximo).');
    return false;
  }

  return true;
}

async function salvarCadastroInicial(): Promise<void> {
  if (!limitesEstoqueValidos()) {
    return;
  }

  const produto = await criar(formulario.value, complementos.value, {
    mensagemSucesso: 'Produto salvo. Continue com as configurações complementares.',
  });

  if (!produto) {
    return;
  }

  // Mantém a sensação de cadastro; internamente passa a editar o registro criado.
  await router.replace({
    name: 'produto-editar',
    params: { id: produto.id },
    query: { origem: 'cadastro' },
  });
}

async function salvarEdicao(opcoes?: { mensagemSucesso?: string; irParaLista?: boolean }): Promise<boolean> {
  if (!limitesEstoqueValidos()) {
    return false;
  }

  const sucesso = await editar(produtoId.value!, formulario.value, {
    mensagemSucesso: opcoes?.mensagemSucesso,
  });

  if (sucesso && opcoes?.irParaLista) {
    await router.push({ name: 'produtos' });
  }

  return sucesso;
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  if (etapaInicialCadastro.value) {
    await salvarCadastroInicial();
    return;
  }

  await salvarEdicao(
    fluxoCadastro.value
      ? { mensagemSucesso: 'Dados do produto atualizados.' }
      : undefined,
  );

  if (!fluxoCadastro.value) {
    await router.push({ name: 'produtos' });
  }
}

async function concluirCadastro(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  await salvarEdicao({
    mensagemSucesso: 'Produto cadastrado com sucesso.',
    irParaLista: true,
  });
}

watch(
  () => [route.name, route.params.id] as const,
  () => {
    void inicializar();
  },
  { immediate: true },
);
</script>

<style scoped>
.produto-form-page {
  display: grid;
  gap: var(--spacing-6);
}

.produto-form-page__aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  margin-bottom: var(--spacing-4);
}

.produto-form-page__acoes-finais {
  justify-content: flex-end;
  margin-top: var(--spacing-2);
}
</style>
