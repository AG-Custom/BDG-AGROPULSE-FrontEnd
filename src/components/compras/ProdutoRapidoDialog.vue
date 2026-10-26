<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section class="dialog__cabecalho">
        <h4 class="titulo">Cadastrar produto</h4>
        <p class="subtitulo">
          NCM e origem da mercadoria são obrigatórios. Sem eles no cadastro, a entrada da nota não pode ser criada.
        </p>
        <p v-if="codigoProdutoXml" class="subtitulo">
          SKU do XML: <span class="text-metric">{{ codigoProdutoXml }}</span>
        </p>
      </q-card-section>

      <q-form class="dialog__form" greedy @submit.prevent="salvar" @validation-error="abrirSecoes">
      <q-card-section class="dialog__corpo">
        <div class="agro-formulario">
          <recebimento-secao-expansivel
            v-model="secaoProdutoAberta"
            compacta
            titulo="Dados do produto"
            :subtitulo="subtituloProduto"
          >
          <div class="secao">
            <q-input
              v-model="form.descricao"
              outlined
              label="Descrição"
              class="field-required"
              :rules="[obrigatorio]"
            />

            <div class="form-grid-2">
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
            </div>

            <div class="form-grid-3">
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

              <q-input
                :model-value="unidadeXml?.trim() || '—'"
                outlined
                readonly
                label="UN (XML)"
                hint="Unidade comercial da nota"
              />

              <AgroMoneyInput
                v-model="form.precoVenda"
                label="Preço de venda"
                class="field-required"
                :hint="hintPreco"
                :rules="[obrigatorio]"
              />
            </div>

            <div class="form-grid-2">
              <q-input v-model="ean" outlined label="EAN" hint="Código de barras da nota, se houver" />
              <q-input
                v-model="form.fatorDivisaoNfe"
                outlined
                label="Fator divisão"
                type="number"
                min="0"
                step="any"
                hint="Multiplica a quantidade da nota na entrada"
                :rules="[fatorMaiorQueZero]"
              />
            </div>

            <div class="form-flags">
              <q-toggle v-model="form.exigeLote" label="Exige lote" color="primary" />
              <q-toggle v-model="form.exigeValidade" label="Exige validade" color="primary" />
              <q-toggle v-model="form.exigeFabricacao" label="Exige fabricação" color="primary" />
            </div>
          </div>
          </recebimento-secao-expansivel>

          <recebimento-secao-expansivel
            v-model="secaoFiscalAberta"
            compacta
            titulo="Dados fiscais"
            :subtitulo="subtituloFiscal"
          >
          <div class="secao">

            <div class="form-grid-3">
              <q-input
                v-model="fiscal.ncm"
                outlined
                label="NCM"
                class="field-required"
                mask="########"
                hint="8 dígitos"
                inputmode="numeric"
                :rules="[obrigatorio, ncmValidator]"
              />
              <q-select
                v-model="fiscal.origemMercadoria"
                outlined
                emit-value
                map-options
                label="Origem da mercadoria"
                class="field-required"
                :options="OrigemMercadoriaOpcoes"
                :rules="[obrigatorio]"
              />
              <q-input
                v-model="fiscal.cest"
                outlined
                label="CEST"
                mask="#######"
                hint="7 dígitos, se houver"
                inputmode="numeric"
                :rules="[cestValidator]"
              />
            </div>

            <div class="form-grid-3">
              <q-input v-model="fiscal.csosn" outlined label="CSOSN" maxlength="10" :hint="hintCsosn" />
              <q-input v-model="fiscal.cstIcms" outlined label="CST ICMS" maxlength="10" :hint="hintCstIcms" />
              <q-input
                v-model="fiscal.aliquotaIcms"
                outlined
                label="Alíquota ICMS (%)"
                inputmode="decimal"
              />
            </div>

            <div class="form-grid-2">
              <q-input
                v-model="fiscal.cfopPadraoInterno"
                outlined
                label="CFOP interno"
                mask="####"
                :hint="hintCfopInterno"
                inputmode="numeric"
                :rules="[cfopValidator]"
              />
              <q-input
                v-model="fiscal.cfopPadraoExterno"
                outlined
                label="CFOP externo"
                mask="####"
                :hint="hintCfopExterno"
                inputmode="numeric"
                :rules="[cfopValidator]"
              />
            </div>

            <q-input
              v-model="fiscal.observacoesFiscais"
              outlined
              type="textarea"
              autogrow
              label="Observações fiscais"
            />
          </div>
          </recebimento-secao-expansivel>
        </div>
      </q-card-section>
          <div class="agro-form-actions dialog__acoes">
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
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import RecebimentoSecaoExpansivel from 'components/compras/RecebimentoSecaoExpansivel.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useCategoriasProduto } from 'composables/useCategoriasProduto';
import { useCfops } from 'composables/useCfops';
import { useIcms } from 'composables/useIcms';
import { useProdutos } from 'composables/useProdutos';
import { useUnidadesMedida } from 'composables/useUnidadesMedida';
import {
  OrigemMercadoria,
  OrigemMercadoriaOpcoes,
  TipoCodigoProduto,
  TipoProdutoOpcoes,
} from 'constants/enums';
import type { ProdutoDto, ProdutoFiscalFormModel, ProdutoFormModel } from 'types/dtos/produto.dto';
import { resolverCfopSaidaDaNota } from 'utils/cfop-saida-produto';
import { formatarMoeda, formatarMoedaParaInput } from 'utils/formatters';
import { resolverIcmsSaidaDaNota } from 'utils/icms-saida-produto';
import { mapearOrigemMercadoriaNfe } from 'utils/mappers/nfe-origem.mapper';
import {
  codigoFormParaDtoLocal,
  criarCodigoFormVazio,
  criarComplementosFormVazio,
  criarFiscalFormVazio,
  criarProdutoFormVazio,
} from 'utils/mappers/produto.mapper';
import { resolverUnidadeMedidaIdPorXml } from 'utils/unidade-medida-nfe';
import { cest as cestValidator, cfop as cfopValidator, ncm as ncmValidator, obrigatorio } from 'utils/validators';
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  descricaoProdutoXml?: string;
  codigoProdutoXml?: string;
  precoSugerido?: number | null;
  ncmXml?: string | null;
  cestXml?: string | null;
  cfopXml?: string | null;
  eanXml?: string | null;
  unidadeXml?: string | null;
  unidadeMedidaId?: string | null;
  origemXml?: string | null;
  cstIcmsXml?: string | null;
  csosnXml?: string | null;
  aliquotaIcmsXml?: number | null;
  informacaoAdicionalXml?: string | null;
  numeroLoteXml?: string | null;
  dataValidadeXml?: string | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  criado: [produto: ProdutoDto];
}>();

const form = ref<ProdutoFormModel>(criarProdutoFormVazio());
const fiscal = ref<ProdutoFiscalFormModel>(criarFiscalFormVazio());
const secaoProdutoAberta = ref(true);
const secaoFiscalAberta = ref(true);
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

const { itens: cfops, carregar: carregarCfops } = useCfops();
const { itens: icms, carregar: carregarIcms } = useIcms();

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

const hintPreco = computed(() => {
  if (props.precoSugerido == null || props.precoSugerido <= 0) return undefined;
  return `Custo unitário da NF: ${formatarMoeda(props.precoSugerido)}`;
});

function resolverUnidadeMedidaId(unidadeXml: string | null | undefined): string | null {
  const idApi = props.unidadeMedidaId?.trim();
  if (idApi) return idApi;
  return resolverUnidadeMedidaIdPorXml(unidadeXml, unidadesMedida.value);
}

const relacaoCfop = computed(() => resolverCfopSaidaDaNota(props.cfopXml, cfops.value));

const relacaoCstIcms = computed(() => resolverIcmsSaidaDaNota(props.cstIcmsXml, 'Cst', icms.value));

const relacaoCsosn = computed(() => resolverIcmsSaidaDaNota(props.csosnXml, 'Csosn', icms.value));

const subtituloProduto = computed(() => form.value.descricao.trim() || 'Descrição, unidade e preço');

const subtituloFiscal = computed(() => {
  const ncm = fiscal.value.ncm.replace(/\D/g, '');
  if (ncm.length === 8) return `NCM ${ncm}`;
  return 'NCM e origem obrigatórios';
});

function fatorMaiorQueZero(valor: string): true | string {
  const texto = valor.trim();
  if (!texto) return true;
  const numero = Number(texto.replace(',', '.'));
  if (!Number.isFinite(numero) || numero <= 0) return 'Informe um fator maior que zero';
  return true;
}

function abrirSecoes(): void {
  secaoProdutoAberta.value = true;
  secaoFiscalAberta.value = true;
}

function hintRelacao(codigoCampo: string, padrao: string): string {
  const relacao = relacaoCfop.value;
  const codigo = codigoCampo.replace(/\D/g, '');
  if (!relacao.entrada || (codigo !== relacao.interno && codigo !== relacao.externo)) return padrao;
  return `Saída relacionada ao CFOP ${relacao.entrada} da nota`;
}

const hintCstIcms = computed(() => {
  const relacao = relacaoCstIcms.value;
  if (!relacao.entrada || fiscal.value.cstIcms.trim() !== relacao.codigo) return undefined;
  return `Saída relacionada ao CST ${relacao.entrada} da nota`;
});

const hintCsosn = computed(() => {
  const relacao = relacaoCsosn.value;
  if (!relacao.entrada || fiscal.value.csosn.trim() !== relacao.codigo) return 'Simples Nacional';
  return `Saída relacionada ao CSOSN ${relacao.entrada} da nota`;
});

const hintCfopInterno = computed(() =>
  hintRelacao(fiscal.value.cfopPadraoInterno, '4 dígitos, venda interna'),
);

const hintCfopExterno = computed(() =>
  hintRelacao(fiscal.value.cfopPadraoExterno, '4 dígitos, venda interestadual'),
);

async function preencherFormulario(): Promise<void> {
  const cfop = resolverCfopSaidaDaNota(props.cfopXml, cfops.value);
  const cstIcms = resolverIcmsSaidaDaNota(props.cstIcmsXml, 'Cst', icms.value);
  const csosn = resolverIcmsSaidaDaNota(props.csosnXml, 'Csosn', icms.value);
  const origem =
    mapearOrigemMercadoriaNfe(props.origemXml) ?? OrigemMercadoria.Nacional;
  const unidadeMedidaId = resolverUnidadeMedidaId(props.unidadeXml);

  form.value = {
    ...criarProdutoFormVazio(),
    descricao: props.descricaoProdutoXml?.trim() ?? '',
    precoVenda: formatarMoedaParaInput(props.precoSugerido ?? 0),
    unidadeMedidaId: null,
    exigeLote: Boolean(props.numeroLoteXml?.trim()),
    exigeValidade: Boolean(props.dataValidadeXml?.trim()),
  };

  fiscal.value = {
    ...criarFiscalFormVazio(),
    ncm: props.ncmXml?.trim() ?? '',
    cest: props.cestXml?.trim() ?? '',
    origemMercadoria: origem,
    csosn: csosn.codigo,
    cstIcms: cstIcms.codigo,
    aliquotaIcms:
      props.aliquotaIcmsXml != null && Number.isFinite(props.aliquotaIcmsXml)
        ? String(props.aliquotaIcmsXml)
        : '',
    cfopPadraoInterno: cfop.interno,
    cfopPadraoExterno: cfop.externo,
    observacoesFiscais: props.informacaoAdicionalXml?.trim() ?? '',
  };

  ean.value = props.eanXml?.trim() ?? '';

  await nextTick();
  if (!props.modelValue) return;
  form.value.unidadeMedidaId = unidadeMedidaId;
}

let abertura = 0;

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;

    const ticket = ++abertura;
    secaoProdutoAberta.value = true;
    secaoFiscalAberta.value = true;
    void carregarCategorias();
    void carregarUnidadesMedida({ ativo: true });
    void preencherFormulario().then(() => {
      const interno = fiscal.value.cfopPadraoInterno;
      const externo = fiscal.value.cfopPadraoExterno;
      void carregarCfops().then(() => {
        if (ticket !== abertura || !props.modelValue) return;
        if (fiscal.value.cfopPadraoInterno !== interno || fiscal.value.cfopPadraoExterno !== externo) return;
        const cfop = resolverCfopSaidaDaNota(props.cfopXml, cfops.value);
        fiscal.value.cfopPadraoInterno = cfop.interno;
        fiscal.value.cfopPadraoExterno = cfop.externo;
      });

      const csosnAplicado = fiscal.value.csosn;
      const cstIcmsAplicado = fiscal.value.cstIcms;
      void carregarIcms().then(() => {
        if (ticket !== abertura || !props.modelValue) return;
        if (fiscal.value.csosn === csosnAplicado) {
          fiscal.value.csosn = relacaoCsosn.value.codigo;
        }
        if (fiscal.value.cstIcms === cstIcmsAplicado) {
          fiscal.value.cstIcms = relacaoCstIcms.value.codigo;
        }
      });
    });
  },
);

watch(unidadesMedida, () => {
  if (!props.modelValue || form.value.unidadeMedidaId) return;
  form.value.unidadeMedidaId = resolverUnidadeMedidaId(props.unidadeXml);
});

async function salvar(): Promise<void> {
  const codigoXml = props.codigoProdutoXml?.trim();
  const eanValor = ean.value.trim();
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
  complementos.fiscal = { ...fiscal.value };

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
.dialog.q-card {
  width: min(1240px, 94vw);
  max-width: min(1240px, 94vw);
  max-height: min(92vh, 920px);
  display: flex;
  flex-direction: column;
}

.dialog__form {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.dialog__cabecalho {
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
}

.dialog__corpo {
  flex: 1;
  min-height: 0;
  overflow: auto;
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
  gap: var(--spacing-3);
}

.secao {
  display: grid;
  gap: var(--spacing-4);
}

.form-grid-2,
.form-grid-3 {
  display: grid;
  gap: var(--spacing-3);
}

.form-grid-2 {
  grid-template-columns: 1fr 1fr;
}

.form-grid-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.form-flags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.dialog__acoes {
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--color-surface-default);
  border-top: var(--border-width-thin) solid var(--color-border-default);
}

@media (max-width: 800px) {
  .form-grid-3 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .form-grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
