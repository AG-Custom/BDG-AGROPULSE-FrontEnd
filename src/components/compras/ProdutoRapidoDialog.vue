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
            :hint="hintUnidadeXml"
            :rules="[obrigatorio]"
          />

          <AgroMoneyInput
            v-model="form.precoVenda"
            label="Preço de venda"
            class="field-required"
            :rules="[obrigatorio]"
          />

          <div class="xml-bloco">
            <h5 class="xml-bloco__titulo">Dados do XML</h5>
            <div class="xml-bloco__grid">
              <q-input v-model="ncm" outlined label="NCM" mask="########" fill-mask="" />
              <q-input v-model="cfop" outlined label="CFOP" mask="####" fill-mask="" />
              <q-input v-model="ean" outlined label="EAN" />
              <q-input
                :model-value="unidadeXml?.trim() || '—'"
                outlined
                readonly
                label="UN (XML)"
                hint="Usada para sugerir a unidade de medida"
              />
            </div>
          </div>

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
  ncmXml?: string | null;
  cfopXml?: string | null;
  eanXml?: string | null;
  unidadeXml?: string | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  criado: [produto: ProdutoDto];
}>();

const form = ref<ProdutoFormModel>(criarProdutoFormVazio());
const ncm = ref('');
const cfop = ref('');
const ean = ref('');
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

const hintUnidadeXml = computed(() => {
  const un = props.unidadeXml?.trim();
  if (!un) return undefined;
  if (form.value.unidadeMedidaId) {
    return `Sugerida a partir da UN do XML: ${un}`;
  }
  return `UN do XML: ${un} — selecione a unidade correspondente`;
});

function normalizarUnidade(valor: string): string {
  return valor.trim().toUpperCase().replace(/\./g, '');
}

function aliasesUnidade(valor: string): string[] {
  const base = normalizarUnidade(valor);
  const mapa: Record<string, string[]> = {
    LT: ['LT', 'L', 'LITRO', 'LITROS'],
    L: ['L', 'LT', 'LITRO', 'LITROS'],
    KG: ['KG', 'KILO', 'QUILO', 'QUILOS'],
    G: ['G', 'GR', 'GRAMA', 'GRAMAS'],
    UN: ['UN', 'UND', 'UNID', 'UNIDADE'],
    CX: ['CX', 'CAIXA'],
    PCT: ['PCT', 'PC', 'PACOTE'],
    SC: ['SC', 'SACO'],
    M: ['M', 'MT', 'METRO'],
    ML: ['ML', 'MILILITRO'],
  };
  return mapa[base] ?? [base];
}

function resolverUnidadeMedidaId(unidadeXml: string | null | undefined): string | null {
  const unXml = unidadeXml?.trim();
  if (!unXml) return null;

  const candidatos = aliasesUnidade(unXml);
  const ativas = unidadesMedida.value.filter((u) => u.ativo);

  const porCodigo = ativas.find((u) => candidatos.includes(normalizarUnidade(u.codigo)));
  if (porCodigo) return porCodigo.id;

  const porDescricao = ativas.find((u) =>
    candidatos.some((alias) => normalizarUnidade(u.descricao).includes(alias)),
  );
  return porDescricao?.id ?? null;
}

function preencherFormulario(): void {
  form.value = {
    ...criarProdutoFormVazio(),
    descricao: props.descricaoProdutoXml?.trim() ?? '',
    precoVenda: formatarMoedaParaInput(props.precoSugerido ?? 0),
    unidadeMedidaId: resolverUnidadeMedidaId(props.unidadeXml),
  };
  ncm.value = props.ncmXml?.trim() ?? '';
  cfop.value = props.cfopXml?.trim() ?? '';
  ean.value = props.eanXml?.trim() ?? '';
}

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return;

    void carregarCategorias();
    await carregarUnidadesMedida({ ativo: true });
    preencherFormulario();
  },
);

watch(unidadesMedida, () => {
  if (!props.modelValue || form.value.unidadeMedidaId) return;
  form.value.unidadeMedidaId = resolverUnidadeMedidaId(props.unidadeXml);
});

async function salvar(): Promise<void> {
  const codigoXml = props.codigoProdutoXml?.trim();
  const eanValor = ean.value.trim();
  const ncmValor = ncm.value.trim();
  const cfopValor = cfop.value.trim();
  const complementos = criarComplementosFormVazio();
  const codigos: ReturnType<typeof codigoFormParaDtoLocal>[] = [];

  if (codigoXml) {
    codigos.push(
      codigoFormParaDtoLocal({
        ...criarCodigoFormVazio(),
        tipo: TipoCodigoProduto.SKU,
        valor: codigoXml,
        principal: true,
      }),
    );
  }

  if (eanValor) {
    codigos.push(
      codigoFormParaDtoLocal({
        ...criarCodigoFormVazio(),
        tipo: TipoCodigoProduto.EAN,
        valor: eanValor,
        principal: !codigoXml,
      }),
    );
  }

  complementos.codigos = codigos;

  if (ncmValor || cfopValor) {
    const cfopInterno = cfopValor.startsWith('5') ? cfopValor : '';
    const cfopExterno = cfopValor.startsWith('6') || (!cfopInterno && cfopValor) ? cfopValor : '';

    complementos.fiscal = {
      ...complementos.fiscal,
      ncm: ncmValor,
      cfopPadraoInterno: cfopInterno,
      cfopPadraoExterno: cfopExterno,
    };
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
.xml-bloco {
  display: grid;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: var(--color-neutral-50);
}
.xml-bloco__titulo {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}
.xml-bloco__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3);
}
@media (max-width: 600px) {
  .xml-bloco__grid {
    grid-template-columns: 1fr;
  }
}
</style>
