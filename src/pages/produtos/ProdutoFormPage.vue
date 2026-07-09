<template>
  <q-page class="agro-page">
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
        />

        <div v-if="!carregandoPagina && modo !== 'visualizar' && !produtoInativo" class="agro-form-actions">
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
            :descricao="modo === 'criar' ? 'Cadastrar novo produto' : 'Salvar alterações do produto'"
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

      <template v-if="mostrarComplementos">
        <produto-fiscal-section
          ref="fiscalSectionRef"
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
  fiscalFormTemDados,
  limiteDtoParaForm,
  produtoDtoParaForm,
} from 'utils/mappers/produto.mapper';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { salvando, criar, editar } = useProdutos();
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();

const formularioRef = ref<InstanceType<typeof ProdutoFormulario> | null>(null);
const fiscalSectionRef = ref<InstanceType<typeof ProdutoFiscalSection> | null>(null);
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

const modoFormulario = computed<'criar' | 'editar'>(() =>
  modo.value === 'criar' ? 'criar' : 'editar',
);

const somenteLeitura = computed(() => modo.value === 'visualizar');

const produtoId = computed(() => route.params.id as string | undefined);

const produtoIdPersistido = computed(() =>
  modo.value === 'editar' || modo.value === 'visualizar' ? produtoId.value : undefined,
);

const tituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Novo produto';
  }

  if (modo.value === 'visualizar') {
    return 'Visualizar produto';
  }

  return 'Editar produto';
});

const subtituloPagina = computed(() => {
  if (modo.value === 'criar') {
    return 'Cadastre o produto e os dados complementares na mesma tela.';
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
    (modo.value === 'criar' ||
      modo.value === 'visualizar' ||
      (modo.value === 'editar' && !produtoInativo.value)),
);

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

async function validarComplementosCriacao(): Promise<boolean> {
  if (fiscalFormTemDados(complementos.value.fiscal)) {
    const fiscalValido = (await fiscalSectionRef.value?.validar()) ?? false;

    if (!fiscalValido) {
      return false;
    }
  }

  if (complementos.value.limites.length > 0) {
    const limitesValidos = limitesSectionRef.value?.validarLimites() ?? false;

    if (!limitesValidos) {
      erro('Verifique os limites de estoque: mínimo e máximo (mínimo ≤ máximo).');
      return false;
    }
  }

  return true;
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;

  if (!valido) {
    return;
  }

  if (modo.value === 'criar') {
    const complementosValidos = await validarComplementosCriacao();

    if (!complementosValidos) {
      return;
    }

    const sucesso = await criar(formulario.value, complementos.value);

    if (sucesso) {
      await router.push({ name: 'produtos' });
    }

    return;
  }

  const sucesso = await editar(produtoId.value!, formulario.value);

  if (sucesso) {
    await router.push({ name: 'produtos' });
  }
}

onMounted(() => {
  void inicializar();
});
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
</style>
