<template>
  <q-page class="agro-page">
    <app-page-header titulo="PDV" subtitulo="Venda de balcão com barcode, pagamentos e troco." />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-checkbox
                v-model="consumidorSemCadastro"
                label="Consumidor sem cadastro"
                @update:model-value="onConsumidorSemCadastroChange"
              />
            </div>
            <div v-if="!consumidorSemCadastro" class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="formulario.clienteId"
                entidade="cliente"
                use-input
                fill-input
                hide-selected
                input-debounce="300"
                label="Cliente (busca rápida)"
                clearable
                :options="clienteOpcoesFiltradas"
                :loading="carregandoClientes"
                @filter="filtrarClientes"
                @atualizar="carregarClientes({ ativo: true })"
                @update:model-value="onClienteSelect"
              />
            </div>
            <div class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="formulario.tabelaPrecoId"
                entidade="tabelaPreco"
                label="Tabela de preço"
                hint="Tabelas exclusivas do cliente só aparecem após selecionar o cliente"
                clearable
                :options="tabelaOpcoes"
                :loading="carregandoTabelas"
                @atualizar="carregarTabelasPermitidas({ clienteId: formulario.clienteId || null })"
              />
            </div>
            <template v-if="consumidorSemCadastro">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.clienteDocumentoAvulso"
                  outlined
                  label="CPF/CNPJ avulso"
                  hint="Consumidor sem cadastro — CPF ou CNPJ"
                  :mask="mascaraDocumentoAtual"
                  :maxlength="tamanhoDocumentoAtual"
                  inputmode="numeric"
                  :rules="[documentoValidator]"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.clienteNomeAvulso"
                  outlined
                  label="Nome avulso"
                  hint="Opcional se informado CPF"
                />
              </div>
            </template>
            <div class="col-12 col-md-4">
              <q-toggle v-model="formulario.aPrazo" label="Venda a prazo" />
            </div>
          </div>

          <div class="pdv-vender__itens-header">
            <h3 class="pdv-vender__titulo">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionarItem" />
          </div>

          <div
            v-for="(item, index) in formulario.itens"
            :key="item.chave"
            class="row q-col-gutter-md pdv-vender__item"
          >
            <div class="col-12 col-md-4">
              <agro-select-cadastro
                v-model="item.produtoId"
                entidade="produto"
                dense
                label="Produto"
                :options="produtoOpcoes"
                :loading="carregandoItensTabela"
                :rules="[obrigatorio]"
                @atualizar="carregarProdutos({ ativo: true })"
                @update:model-value="(valor: unknown) => void onProdutoItem(index, typeof valor === 'string' ? valor : '')"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="item.quantidade" outlined dense label="Qtd" type="number" :rules="[obrigatorio]" />
            </div>
            <div class="col-6 col-md-2">
              <AgroMoneyInput
                v-model="item.precoUnitario"
                dense
                label="Preço"
                :loading="resolvendoPreco"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="item.numeroLote" outlined dense label="Nº lote" />
            </div>
            <div class="col-6 col-md-1">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover item"
                :disable="formulario.itens.length <= 1"
                @click="removerItem(index)"
              />
            </div>
          </div>

          <div class="pdv-vender__total">
            <span>Total</span>
            <span class="text-metric">{{ formatarMoeda(totalItens) }}</span>
          </div>

          <template v-if="!formulario.aPrazo">
            <div class="pdv-vender__itens-header">
              <h3 class="pdv-vender__titulo">Pagamentos</h3>
              <agro-btn
                flat
                icon="add"
                label="Pagamento"
                descricao="Adicionar forma de pagamento"
                @click="adicionarPagamento"
              />
            </div>

            <div
              v-for="(pagamento, index) in formulario.pagamentos"
              :key="pagamento.chave"
              class="row q-col-gutter-md pdv-vender__item"
            >
              <div class="col-12 col-md-5">
                <q-select
                  v-model="pagamento.formaPagamento"
                  outlined
                  dense
                  label="Forma"
                  emit-value
                  map-options
                  :options="FormaPagamentoPdvOpcoes"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-8 col-md-5">
                <AgroMoneyInput v-model="pagamento.valor" dense label="Valor" :rules="[obrigatorio]" />
              </div>
              <div class="col-4 col-md-2">
                <agro-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  descricao="Remover pagamento"
                  :disable="formulario.pagamentos.length <= 1"
                  @click="removerPagamento(index)"
                />
              </div>
            </div>

            <div class="pdv-vender__total">
              <span>Pago</span>
              <span class="text-metric">{{ formatarMoeda(totalPago) }}</span>
            </div>
            <div class="pdv-vender__total">
              <span>Troco</span>
              <span class="text-metric">{{ formatarMoeda(troco) }}</span>
            </div>
          </template>

          <div class="agro-form-actions">
            <agro-btn flat label="Ver vendas" descricao="Ir para listagem" :to="{ name: 'pdv-vendas' }" />
            <agro-btn
              color="primary"
              unelevated
              label="Finalizar venda"
              descricao="Registrar venda no PDV"
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
import AgroCard from 'components/ui/AgroCard.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useClientes } from 'composables/useClientes';
import { useNotificacao } from 'composables/useNotificacao';
import { usePdv } from 'composables/usePdv';
import { usePrecificacao } from 'composables/usePrecificacao';
import { useProdutos } from 'composables/useProdutos';
import {
  mapearItensTabelaParaLinhas,
  useProdutosPorTabelaPreco,
} from 'composables/useProdutosPorTabelaPreco';
import { FormaPagamento, FormaPagamentoPdvOpcoes } from 'constants/enums';
import { mascaraDocumento, tamanhoFormatadoDocumento } from 'constants/masks';
import type {
  PdvItemFormModel,
  PdvPagamentoFormModel,
  PdvVendaFormModel,
} from 'types/dtos/pdv.dto';
import { formatarMoeda, formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import { documentoCpfCnpj, obrigatorio } from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

function novoItem(): PdvItemFormModel {
  return {
    chave: crypto.randomUUID(),
    produtoId: '',
    quantidade: '1',
    precoUnitario: '',
    numeroLote: '',
    loteId: '',
  };
}

function novoPagamento(): PdvPagamentoFormModel {
  return {
    chave: crypto.randomUUID(),
    formaPagamento: FormaPagamento.Dinheiro,
    valor: '',
  };
}

const router = useRouter();
const { salvando, vender } = usePdv();
const { clientes, carregando: carregandoClientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();
const {
  tabelaOpcoes,
  tabelaPadraoId,
  carregandoTabelas,
  resolvendoPreco,
  carregarTabelasPermitidas,
  resolverPreco,
} = usePrecificacao();
const { erro } = useNotificacao();

const consumidorSemCadastro = ref(false);

const formulario = ref<PdvVendaFormModel>({
  clienteId: '',
  clienteBusca: '',
  clienteNomeAvulso: '',
  clienteDocumentoAvulso: '',
  tabelaPrecoId: '',
  aPrazo: false,
  itens: [novoItem()],
  pagamentos: [novoPagamento()],
});

const documentoValidator = documentoCpfCnpj;
const mascaraDocumentoAtual = computed(() =>
  mascaraDocumento(formulario.value.clienteDocumentoAvulso),
);
const tamanhoDocumentoAtual = computed(() =>
  tamanhoFormatadoDocumento(formulario.value.clienteDocumentoAvulso),
);

const {
  itensTabela,
  produtoOpcoes,
  carregandoItensTabela,
  produtoIdsPermitidos,
} = useProdutosPorTabelaPreco(
  () => formulario.value.tabelaPrecoId,
  () => produtos.value,
);

const reResolverPrecosPendente = ref(false);
const substituirItensPendente = ref(false);
const tabelaPrecoAnteriorSync = ref<string | undefined>(undefined);
const filtroCliente = ref('');

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({
    label: `${c.nomeRazao}${c.documento ? ` — ${c.documento}` : ''}`,
    value: c.id,
  })),
);

const clienteOpcoesFiltradas = computed(() => {
  const termo = filtroCliente.value.trim().toLowerCase();
  if (!termo) {
    return clienteOpcoes.value;
  }
  return clienteOpcoes.value.filter((opcao) => opcao.label.toLowerCase().includes(termo));
});

const totalItens = computed(() =>
  formulario.value.itens.reduce((acc, item) => {
    const qtd = Number(item.quantidade) || 0;
    const preco = parseMascaraMoeda(item.precoUnitario) ?? 0;
    return acc + qtd * preco;
  }, 0),
);

const totalPago = computed(() =>
  formulario.value.pagamentos.reduce(
    (acc, pagamento) => acc + (parseMascaraMoeda(pagamento.valor) ?? 0),
    0,
  ),
);

const troco = computed(() => Math.max(0, totalPago.value - totalItens.value));

function filtrarClientes(val: string, update: (fn: () => void) => void): void {
  update(() => {
    filtroCliente.value = val;
  });
}

async function aplicarTabelasDoCliente(clienteId: string | null): Promise<void> {
  await carregarTabelasPermitidas({ clienteId });

  const tabelaAtual = formulario.value.tabelaPrecoId;
  if (tabelaAtual && !tabelaOpcoes.value.some((opcao) => opcao.value === tabelaAtual)) {
    formulario.value.tabelaPrecoId = '';
  }

  if (!formulario.value.tabelaPrecoId && tabelaPadraoId.value) {
    formulario.value.tabelaPrecoId = tabelaPadraoId.value;
  }
}

function onConsumidorSemCadastroChange(valor: boolean | null): void {
  if (valor) {
    formulario.value.clienteId = '';
    void aplicarTabelasDoCliente(null);
    return;
  }

  formulario.value.clienteNomeAvulso = '';
  formulario.value.clienteDocumentoAvulso = '';
}

function onClienteSelect(valor: unknown): void {
  const clienteId = typeof valor === 'string' ? valor : '';

  if (clienteId) {
    formulario.value.clienteNomeAvulso = '';
    formulario.value.clienteDocumentoAvulso = '';
  }
}

watch(
  () => formulario.value.clienteId,
  (clienteId) => {
    if (consumidorSemCadastro.value) {
      return;
    }

    void aplicarTabelasDoCliente(clienteId || null);
  },
);

function adicionarItem(): void {
  formulario.value.itens.push(novoItem());
}

function removerItem(index: number): void {
  if (formulario.value.itens.length > 1) {
    formulario.value.itens.splice(index, 1);
  }
}

function adicionarPagamento(): void {
  formulario.value.pagamentos.push(novoPagamento());
}

function removerPagamento(index: number): void {
  if (formulario.value.pagamentos.length > 1) {
    formulario.value.pagamentos.splice(index, 1);
  }
}

async function onProdutoItem(index: number, produtoId: string): Promise<void> {
  if (!produtoId) {
    return;
  }

  formulario.value.itens[index].precoUnitario = '';

  const resolvido = await resolverPreco({
    produtoId,
    clienteId: formulario.value.clienteId || null,
    tabelaPrecoId: formulario.value.tabelaPrecoId || null,
  });

  if (resolvido) {
    formulario.value.itens[index].precoUnitario = formatarMoedaParaInput(resolvido.preco);
  }
}

async function sincronizarItensComTabela(): Promise<void> {
  if (carregandoItensTabela.value) {
    return;
  }

  if (substituirItensPendente.value) {
    substituirItensPendente.value = false;
    reResolverPrecosPendente.value = false;

    const linhas = mapearItensTabelaParaLinhas(itensTabela.value);
    formulario.value.itens =
      linhas.length > 0
        ? linhas.map((linha) => ({
            chave: crypto.randomUUID(),
            produtoId: linha.produtoId,
            quantidade: linha.quantidade,
            precoUnitario: linha.precoUnitario,
            numeroLote: '',
            loteId: '',
          }))
        : [novoItem()];
    return;
  }

  const deveReResolver = reResolverPrecosPendente.value;
  reResolverPrecosPendente.value = false;

  const ids = produtoIdsPermitidos.value;
  const tarefas: Promise<void>[] = [];

  for (let index = 0; index < formulario.value.itens.length; index++) {
    const item = formulario.value.itens[index];

    if (!item.produtoId) {
      continue;
    }

    if (ids && !ids.has(item.produtoId)) {
      item.produtoId = '';
      item.precoUnitario = '';
      continue;
    }

    if (deveReResolver) {
      tarefas.push(onProdutoItem(index, item.produtoId));
    }
  }

  await Promise.all(tarefas);
}

async function salvar(): Promise<void> {
  if (!formulario.value.aPrazo && totalPago.value + 0.009 < totalItens.value) {
    erro('O valor pago é inferior ao total da venda.');
    return;
  }

  const venda = await vender(formulario.value);
  if (venda) {
    await router.push({ name: 'pdv-venda-detalhe', params: { id: venda.id } });
  }
}

watch(tabelaPadraoId, (id) => {
  if (id && !formulario.value.tabelaPrecoId) {
    formulario.value.tabelaPrecoId = id;
  }
});

watch(
  [() => formulario.value.tabelaPrecoId, produtoIdsPermitidos, carregandoItensTabela],
  () => {
    const tabelaAtual = formulario.value.tabelaPrecoId?.trim() ?? '';
    const tabelaAnterior = tabelaPrecoAnteriorSync.value;

    if (tabelaAnterior !== undefined && tabelaAtual !== tabelaAnterior) {
      if (tabelaAtual) {
        substituirItensPendente.value = true;
      } else {
        substituirItensPendente.value = false;
        reResolverPrecosPendente.value = false;
      }
    } else if (tabelaAnterior === undefined && tabelaAtual) {
      const soVazios = formulario.value.itens.every((item) => !item.produtoId);
      if (soVazios) {
        substituirItensPendente.value = true;
      }
    }

    tabelaPrecoAnteriorSync.value = tabelaAtual;
    void sincronizarItensComTabela();
  },
);

onMounted(async () => {
  void carregarClientes({ ativo: true });
  void carregarProdutos({ ativo: true });
  await carregarTabelasPermitidas();
  if (tabelaPadraoId.value) {
    formulario.value.tabelaPrecoId = tabelaPadraoId.value;
  }
});
</script>

<style scoped>
.pdv-vender__itens-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: var(--spacing-6) 0 var(--spacing-3);
}
.pdv-vender__titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.pdv-vender__item {
  margin-bottom: var(--spacing-2);
}
.pdv-vender__total {
  align-items: center;
  display: flex;
  font-weight: var(--font-weight-semibold);
  justify-content: space-between;
  margin-top: var(--spacing-3);
}
</style>
