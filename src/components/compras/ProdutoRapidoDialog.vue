<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">Cadastrar produto</h4>
        <p v-if="codigoProdutoXml" class="subtitulo">
          SKU do XML: <span class="text-metric">{{ codigoProdutoXml }}</span>
        </p>
      </q-card-section>

      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <q-input
            v-model="form.descricao"
            outlined
            label="Descrição"
            class="field-required"
            :rules="[obrigatorio]"
          />

          <agro-select-cadastro
            v-model="form.categoriaProdutoId"
            entidade="categoriaProduto"
            label="Categoria"
            class="field-required"
            :options="categoriaOpcoes"
            :loading="carregandoCategorias"
            :rules="[obrigatorio]"
            @atualizar="carregarCategorias()"
          />

          <q-select
            v-model="form.tipoProduto"
            outlined
            label="Tipo"
            emit-value
            map-options
            class="field-required"
            :options="TipoProdutoOpcoes"
            :rules="[obrigatorio]"
          />

          <q-select
            v-model="form.unidadeMedidaId"
            outlined
            label="Unidade de medida"
            emit-value
            map-options
            class="field-required"
            :options="unidadeMedidaOpcoes"
            :loading="carregandoUnidadesMedida"
            :rules="[obrigatorio]"
          />

          <AgroMoneyInput
            v-model="form.precoVenda"
            label="Preço de venda"
            class="field-required"
            :rules="[obrigatorio]"
          />

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="emit('update:modelValue', false)" />
            <agro-btn
              color="primary"
              unelevated
              label="Salvar produto"
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
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useCategoriasProduto } from 'composables/useCategoriasProduto';
import { useProdutos } from 'composables/useProdutos';
import { useUnidadesMedida } from 'composables/useUnidadesMedida';
import { TipoCodigoProduto, TipoProdutoOpcoes } from 'constants/enums';
import type { ProdutoDto, ProdutoFormModel } from 'types/dtos/produto.dto';
import {
  codigoFormParaDtoLocal,
  criarCodigoFormVazio,
  criarComplementosFormVazio,
  criarProdutoFormVazio,
} from 'utils/mappers/produto.mapper';
import { formatarMoedaParaInput } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  descricaoProdutoXml?: string;
  codigoProdutoXml?: string;
  precoSugerido?: number | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  criado: [produto: ProdutoDto];
}>();

const form = ref<ProdutoFormModel>(criarProdutoFormVazio());
const { criar, salvando } = useProdutos();

const {
  categorias,
  carregando: carregandoCategorias,
  carregar: carregarCategorias,
  rotuloCategoria,
} = useCategoriasProduto();

const {
  unidadesMedida,
  carregando: carregandoUnidadesMedida,
  carregar: carregarUnidadesMedida,
  rotuloUnidadeMedida,
} = useUnidadesMedida();

const categoriaOpcoes = computed(() =>
  categorias.value
    .filter((categoria) => categoria.ativo)
    .map((categoria) => ({
      label: rotuloCategoria(categoria),
      value: categoria.id,
    })),
);

const unidadeMedidaOpcoes = computed(() =>
  unidadesMedida.value
    .filter((unidade) => unidade.ativo)
    .map((unidade) => ({
      label: rotuloUnidadeMedida(unidade),
      value: unidade.id,
    })),
);

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      return;
    }

    void carregarCategorias();
    void carregarUnidadesMedida();

    form.value = {
      ...criarProdutoFormVazio(),
      descricao: props.descricaoProdutoXml?.trim() ?? '',
      precoVenda: formatarMoedaParaInput(props.precoSugerido ?? 0),
    };
  },
);

async function salvar(): Promise<void> {
  const codigoXml = props.codigoProdutoXml?.trim();
  const complementos = criarComplementosFormVazio();

  if (codigoXml) {
    complementos.codigos = [
      codigoFormParaDtoLocal({
        ...criarCodigoFormVazio(),
        tipo: TipoCodigoProduto.SKU,
        valor: codigoXml,
        principal: true,
      }),
    ];
  }

  const produto = await criar(form.value, complementos, {
    mensagemSucesso: 'Produto cadastrado. Item vinculado ao recebimento.',
  });

  if (!produto) {
    return;
  }

  emit('criado', produto);
  emit('update:modelValue', false);
}
</script>

<style scoped>
.dialog {
  width: min(560px, 100vw);
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
