<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header :titulo="titulo" :subtitulo="subtitulo" />

    <section class="agro-section">
      <cotacao-mercado-card
        class="q-mb-md"
        :cotacao="cotacao"
        mostrar-aplicar
        @atualizar="carregarCotacaoMercado()"
        @aplicar="aplicarCotacao"
      />

      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="8" />
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.clienteId"
                outlined
                label="Cliente"
                class="field-required"
                emit-value
                map-options
                :options="clienteOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.produtoId"
                outlined
                label="Produto"
                class="field-required"
                emit-value
                map-options
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.quantidade"
                outlined
                label="Quantidade"
                type="number"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <AgroMoneyInput v-model="formulario.preco" label="Preço" :rules="[obrigatorio]" />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="formulario.fontePreco"
                outlined
                label="Fonte do preço"
                emit-value
                map-options
                :options="FontePrecoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.dataInicio"
                outlined
                label="Início"
                type="date"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input v-model="formulario.dataFim" outlined label="Fim" type="date" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.safraId"
                outlined
                clearable
                emit-value
                map-options
                label="Safra"
                :options="safraOpcoes"
              />
            </div>

            <template v-if="tipo === TipoContrato.Cpr">
              <div class="col-12"><div class="text-subtitle2">Dados da CPR</div></div>
              <div class="col-12 col-md-4">
                <q-input v-model="formulario.numeroCpr" outlined label="Número da CPR" />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="formulario.localEntrega" outlined label="Local de entrega" />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.dataEntregaPrevista"
                  outlined
                  label="Data entrega prevista"
                  type="date"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.qualidadeMinima"
                  outlined
                  label="Qualidade mínima"
                  type="textarea"
                  autogrow
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="formulario.partes" outlined label="Partes" type="textarea" autogrow />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.garantias"
                  outlined
                  label="Garantias"
                  type="textarea"
                  autogrow
                />
              </div>
            </template>

            <template v-else-if="tipo === TipoContrato.Barter">
              <div class="col-12"><div class="text-subtitle2">Barter — insumos × grãos</div></div>
              <div class="col-12 col-md-4">
                <AgroMoneyInput v-model="formulario.valorInsumos" label="Valor dos insumos" />
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="formulario.produtoGraoId"
                  outlined
                  clearable
                  emit-value
                  map-options
                  label="Produto grão a receber"
                  :options="produtoOpcoes"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="formulario.unidadeGrao"
                  outlined
                  clearable
                  emit-value
                  map-options
                  label="Unidade do grão"
                  :options="UnidadeGraoOpcoes"
                />
              </div>
              <div class="col-12 col-md-4">
                <AgroMoneyInput v-model="formulario.precoReferencia" label="Preço de referência" />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.quantidadeGraos"
                  outlined
                  label="Quantidade de grãos"
                  type="number"
                  step="0.001"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.quantidadeEquivalente"
                  outlined
                  label="Qtd. equivalente"
                  type="number"
                  step="0.001"
                  readonly
                />
              </div>
              <div class="col-12">
                <agro-btn
                  color="primary"
                  unelevated
                  icon="calculate"
                  label="Calcular equivalente"
                  descricao="Calcular grãos equivalentes"
                  :loading="calculando"
                  @click="calcular"
                />
              </div>
            </template>

            <template v-else-if="tipo === TipoContrato.Termo">
              <div class="col-12"><div class="text-subtitle2">Contrato a termo</div></div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="formulario.tipoOperacao"
                  outlined
                  emit-value
                  map-options
                  label="Tipo de operação"
                  class="field-required"
                  :options="TipoOperacaoTermoOpcoes"
                  :rules="[obrigatorio]"
                />
              </div>
            </template>

            <div class="col-12">
              <q-input
                v-model="formulario.observacao"
                outlined
                label="Observação"
                type="textarea"
                autogrow
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn
              flat
              label="Cancelar"
              descricao="Voltar"
              :to="{ name: 'contratos', query: { tipo } }"
            />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Criar' : 'Salvar'"
              descricao="Salvar contrato"
              type="submit"
              :loading="salvando"
            />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import CotacaoMercadoCard from 'components/contratos/CotacaoMercadoCard.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import { useClientes } from 'composables/useClientes';
import {
  contratoParaForm,
  formVazioContrato,
  useContratos,
} from 'composables/useContratos';
import { useProdutos } from 'composables/useProdutos';
import { useSafras } from 'composables/useSafras';
import {
  FontePrecoOpcoes,
  TipoContrato,
  TipoOperacaoTermoOpcoes,
  UnidadeGraoOpcoes,
  type FontePrecoValor,
  type TipoContratoValor,
} from 'constants/enums';
import type { CotacaoMercadoDto } from 'types/dtos/contrato.dto';
import { formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tipo = computed(
  () => (route.query.tipo as TipoContratoValor) || TipoContrato.Cpr,
);
const modo = computed(() => (route.name === 'contrato-editar' ? 'editar' : 'criar'));
const contratoId = computed(() => route.params.id as string | undefined);
const titulo = computed(() =>
  modo.value === 'criar' ? 'Novo contrato' : 'Editar contrato',
);
const subtitulo = computed(() => {
  if (tipo.value === TipoContrato.Cpr) return 'CPR — número, qualidade, local e garantias.';
  if (tipo.value === TipoContrato.Barter) return 'Barter — insumos, grãos e equivalente.';
  return 'Termo — compra ou venda futura com preço travado.';
});

const {
  contrato,
  salvando,
  obter,
  criar,
  editar,
  cotacao,
  carregarCotacaoMercado,
  calcularEquivalente,
} = useContratos(tipo);
const { clientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { safraOpcoes, carregar: carregarSafras } = useSafras();

const carregandoPagina = ref(false);
const calculando = ref(false);
const formulario = ref(formVazioContrato());

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({ label: c.nomeRazao, value: c.id })),
);
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);

function aplicarCotacao(c: CotacaoMercadoDto): void {
  formulario.value.preco = formatarMoedaParaInput(c.preco);
  formulario.value.fontePreco = c.fonte;
  if (tipo.value === TipoContrato.Barter) {
    formulario.value.precoReferencia = formatarMoedaParaInput(c.preco);
  }
}

async function calcular(): Promise<void> {
  const valor = parseMascaraMoeda(formulario.value.valorInsumos);
  const precoRef = parseMascaraMoeda(formulario.value.precoReferencia);
  if (valor === null || precoRef === null || precoRef <= 0) return;
  calculando.value = true;
  const eq = await calcularEquivalente(
    valor,
    precoRef,
    formulario.value.unidadeGrao || null,
  );
  calculando.value = false;
  if (eq != null) {
    formulario.value.quantidadeEquivalente = String(eq);
    if (!formulario.value.quantidadeGraos) {
      formulario.value.quantidadeGraos = String(eq);
    }
  }
}

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criar(formulario.value);
    if (criado) {
      await router.push({
        name: 'contrato-detalhe',
        params: { id: criado.id },
        query: { tipo: tipo.value },
      });
    }
    return;
  }

  if (!contratoId.value) return;
  const atualizado = await editar(contratoId.value, formulario.value);
  if (atualizado) {
    await router.push({
      name: 'contrato-detalhe',
      params: { id: atualizado.id },
      query: { tipo: tipo.value },
    });
  }
}

onMounted(async () => {
  void carregarClientes();
  void carregarProdutos();
  void carregarSafras();
  void carregarCotacaoMercado();

  if (modo.value === 'criar') {
    const precoQuery = route.query.preco as string | undefined;
    const fonteQuery = route.query.fonte as FontePrecoValor | undefined;
    if (precoQuery) formulario.value.preco = formatarMoedaParaInput(precoQuery);
    if (fonteQuery) formulario.value.fontePreco = fonteQuery;
  }

  if (modo.value === 'editar' && contratoId.value) {
    carregandoPagina.value = true;
    const ok = await obter(contratoId.value);
    if (!ok || !contrato.value) {
      await router.replace({ name: 'contratos', query: { tipo: tipo.value } });
      return;
    }
    formulario.value = contratoParaForm(contrato.value);
    carregandoPagina.value = false;
  }
});
</script>
