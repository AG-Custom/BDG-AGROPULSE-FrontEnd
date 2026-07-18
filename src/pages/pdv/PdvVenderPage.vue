<template>
  <q-page class="agro-page">
    <app-page-header titulo="PDV" subtitulo="Venda de balcão com barcode, pagamentos e troco." />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.clienteId"
                outlined
                use-input
                fill-input
                hide-selected
                input-debounce="300"
                label="Cliente (busca rápida)"
                emit-value
                map-options
                clearable
                :options="clienteOpcoesFiltradas"
                :loading="carregandoClientes"
                @filter="filtrarClientes"
                @update:model-value="onClienteSelect"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">Nenhum cliente encontrado</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.tabelaPrecoId"
                outlined
                label="Tabela de preço"
                emit-value
                map-options
                clearable
                :options="tabelaOpcoes"
                :loading="carregandoTabelas"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="formulario.clienteDocumentoAvulso"
                outlined
                label="CPF/CNPJ avulso"
                hint="Consumidor sem cadastro"
                maxlength="18"
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
            <div class="col-12 col-md-4">
              <q-toggle v-model="formulario.aPrazo" label="Venda a prazo" />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.codigoBarras"
                outlined
                label="Código de barras / SKU"
                hint="Pressione Enter para adicionar"
                @keyup.enter="adicionarPorCodigo"
              >
                <template #append>
                  <agro-btn
                    flat
                    dense
                    icon="qr_code_scanner"
                    descricao="Buscar produto por código"
                    :loading="buscandoCodigo"
                    @click="adicionarPorCodigo"
                  />
                </template>
              </q-input>
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
              <q-select
                v-model="item.produtoId"
                outlined
                dense
                label="Produto"
                emit-value
                map-options
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
                @update:model-value="(id: string) => void onProdutoItem(index, id)"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="item.quantidade" outlined dense label="Qtd" type="number" :rules="[obrigatorio]" />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model="item.precoUnitario"
                outlined
                dense
                label="Preço"
                type="number"
                step="0.01"
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
                <q-input
                  v-model="pagamento.valor"
                  outlined
                  dense
                  label="Valor"
                  type="number"
                  step="0.01"
                  :rules="[obrigatorio]"
                />
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
import { useClientes } from 'composables/useClientes';
import { useEstoqueDispositivos } from 'composables/useEstoqueDispositivos';
import { useNotificacao } from 'composables/useNotificacao';
import { usePdv } from 'composables/usePdv';
import { usePrecificacao } from 'composables/usePrecificacao';
import { useProdutos } from 'composables/useProdutos';
import { FormaPagamento, FormaPagamentoPdvOpcoes } from 'constants/enums';
import type {
  PdvItemFormModel,
  PdvPagamentoFormModel,
  PdvVendaFormModel,
} from 'types/dtos/pdv.dto';
import { formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
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
const { buscandoCodigo, buscarProdutoPorCodigo } = useEstoqueDispositivos();
const {
  tabelaOpcoes,
  tabelaPadraoId,
  carregandoTabelas,
  resolvendoPreco,
  carregarTabelasPermitidas,
  resolverPreco,
} = usePrecificacao();
const { erro } = useNotificacao();

const formulario = ref<PdvVendaFormModel>({
  clienteId: '',
  clienteBusca: '',
  clienteNomeAvulso: '',
  clienteDocumentoAvulso: '',
  tabelaPrecoId: '',
  aPrazo: false,
  codigoBarras: '',
  itens: [novoItem()],
  pagamentos: [novoPagamento()],
});

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

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);

const totalItens = computed(() =>
  formulario.value.itens.reduce((acc, item) => {
    const qtd = Number(item.quantidade) || 0;
    const preco = Number(item.precoUnitario) || 0;
    return acc + qtd * preco;
  }, 0),
);

const totalPago = computed(() =>
  formulario.value.pagamentos.reduce(
    (acc, pagamento) => acc + (Number(pagamento.valor.replace(',', '.')) || 0),
    0,
  ),
);

const troco = computed(() => Math.max(0, totalPago.value - totalItens.value));

function filtrarClientes(val: string, update: (fn: () => void) => void): void {
  update(() => {
    filtroCliente.value = val;
  });
}

function onClienteSelect(clienteId: string | null): void {
  if (clienteId) {
    formulario.value.clienteNomeAvulso = '';
    formulario.value.clienteDocumentoAvulso = '';
    void carregarTabelasPermitidas({ clienteId });
  }
}

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
    formulario.value.itens[index].precoUnitario = String(resolvido.preco);
  }
}

async function adicionarPorCodigo(): Promise<void> {
  const produto = await buscarProdutoPorCodigo(formulario.value.codigoBarras);
  if (!produto) {
    return;
  }

  let alvo = formulario.value.itens.find((item) => !item.produtoId);
  if (!alvo) {
    formulario.value.itens.push(novoItem());
    alvo = formulario.value.itens[formulario.value.itens.length - 1];
  }

  alvo.produtoId = produto.id;
  const indice = formulario.value.itens.findIndex((item) => item.chave === alvo!.chave);
  await onProdutoItem(indice, produto.id);
  formulario.value.codigoBarras = '';
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
