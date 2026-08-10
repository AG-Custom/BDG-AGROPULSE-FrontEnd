<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header
      titulo="Nova devolução"
      subtitulo="Selecione o pedido de venda faturado e informe destino do estoque e crédito."
    />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.pedidoVendaId"
                outlined
                use-input
                fill-input
                hide-selected
                input-debounce="300"
                label="Pedido de venda"
                emit-value
                map-options
                class="field-required"
                :options="pedidoOpcoesFiltradas"
                :loading="carregandoPedidos || carregandoOrigem"
                :disable="!carregandoPedidos && pedidoOpcoes.length === 0"
                :hint="hintPedidoVenda"
                :rules="[obrigatorio]"
                @filter="filtrarPedidos"
                @update:model-value="onPedidoSelect"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="devolucao-form__sem-pedido">
                      {{ mensagemSemPedidos }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.destinoCredito"
                outlined
                label="Destino do crédito"
                class="field-required"
                emit-value
                map-options
                :options="DestinoCreditoDevolucaoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.observacao" outlined label="Observação" />
            </div>
          </div>

          <q-banner v-if="pedidoOrigem" rounded class="devolucao-form__origem">
            Origem: {{ rotuloCliente(pedidoOrigem.clienteId) }} ·
            {{ formatarMoeda(pedidoOrigem.valorTotal) }} ·
            {{ formatarData(pedidoOrigem.faturadoEm ?? pedidoOrigem.createdAt) }}
          </q-banner>

          <div class="header">
            <h3 class="titulo">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionar" />
          </div>

          <div
            v-for="(item, index) in formulario.itens"
            :key="item.chave"
            class="row q-col-gutter-md q-mb-sm"
          >
            <div class="col-12 col-md-4">
              <agro-select-cadastro
                v-model="item.produtoId"
                entidade="produto"
                dense
                label="Produto"
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
                @atualizar="carregarProdutos()"
              />
            </div>
            <div class="col-4 col-md-1">
              <q-input
                v-model="item.quantidade"
                outlined
                dense
                label="Qtd"
                type="number"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-8 col-md-2">
              <q-input v-model="item.numeroLote" outlined dense label="Nº lote" />
            </div>
            <div class="col-12 col-md-2">
              <q-select
                v-model="item.destino"
                outlined
                dense
                label="Destino"
                emit-value
                map-options
                :options="DestinoDevolucaoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-10 col-md-2">
              <q-input
                v-if="item.destino === DestinoDevolucao.Descarte"
                v-model="item.justificativaDescarte"
                outlined
                dense
                label="Justificativa"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-2 col-md-1">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover"
                :disable="formulario.itens.length <= 1"
                @click="formulario.itens.splice(index, 1)"
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'devolucoes-venda' }" />
            <agro-btn
              color="primary"
              unelevated
              label="Criar"
              descricao="Criar devolução"
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
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useClientes } from 'composables/useClientes';
import { useDevolucoesVenda } from 'composables/useDevolucoesVenda';
import { usePedidoVenda } from 'composables/usePedidoVenda';
import { usePedidosVenda } from 'composables/usePedidosVenda';
import { useProdutos } from 'composables/useProdutos';
import {
  DestinoCreditoDevolucaoOpcoes,
  DestinoDevolucao,
  DestinoDevolucaoOpcoes,
  PedidoVendaStatus,
} from 'constants/enums';
import type { DevolucaoItemFormModel, DevolucaoVendaFormModel } from 'types/dtos/devolucao-venda.dto';
import type { PedidoVendaDto } from 'types/dtos/pedido-venda.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

function novoItem(): DevolucaoItemFormModel {
  return {
    chave: crypto.randomUUID(),
    produtoId: '',
    quantidade: '1',
    destino: '',
    loteId: '',
    numeroLote: '',
    justificativaDescarte: '',
  };
}

const router = useRouter();
const { salvando, criar } = useDevolucoesVenda();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { clientes, carregar: carregarClientes } = useClientes();
const {
  pedidos,
  carregando: carregandoPedidos,
  carregar: carregarPedidos,
} = usePedidosVenda();
const { obter: obterPedido, pedido: pedidoDetalhe } = usePedidoVenda();

const formulario = ref<DevolucaoVendaFormModel>({
  pedidoVendaId: '',
  buscaNf: '',
  destinoCredito: '',
  observacao: '',
  itens: [novoItem()],
});

const pedidoOrigem = ref<PedidoVendaDto | null>(null);
const carregandoOrigem = ref(false);
const filtroPedido = ref('');

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);

const mapaClientes = computed(() => {
  const mapa = new Map<string, string>();
  for (const cliente of clientes.value) {
    mapa.set(cliente.id, cliente.nomeRazao);
  }
  return mapa;
});

const pedidoOpcoes = computed(() =>
  pedidos.value.map((p) => ({
    label: `${p.id.slice(0, 8)}… · ${rotuloCliente(p.clienteId)} · ${formatarMoeda(p.valorTotal)} · ${formatarData(p.createdAt)}`,
    value: p.id,
  })),
);

const pedidoOpcoesFiltradas = computed(() => {
  const termo = filtroPedido.value.trim().toLowerCase();
  if (!termo) {
    return pedidoOpcoes.value;
  }
  return pedidoOpcoes.value.filter((opcao) => opcao.label.toLowerCase().includes(termo));
});

const mensagemSemPedidos = computed(() => {
  if (carregandoPedidos.value) {
    return 'Carregando pedidos…';
  }

  if (pedidoOpcoes.value.length === 0) {
    return 'Nenhum pedido faturado disponível para devolução.';
  }

  return 'Nenhum pedido corresponde à busca.';
});

const hintPedidoVenda = computed(() => {
  if (carregandoPedidos.value || pedidoOpcoes.value.length > 0) {
    return 'Digite para filtrar pedidos faturados';
  }

  return 'Nenhum pedido faturado disponível para devolução';
});

function rotuloCliente(clienteId: string): string {
  return mapaClientes.value.get(clienteId) ?? clienteId;
}

function filtrarPedidos(val: string, update: (fn: () => void) => void): void {
  update(() => {
    filtroPedido.value = val;
  });
}

function adicionar(): void {
  formulario.value.itens.push(novoItem());
}

function preencherItensDoPedido(pedido: PedidoVendaDto): void {
  if (pedido.itens.length === 0) {
    formulario.value.itens = [novoItem()];
    return;
  }

  formulario.value.itens = pedido.itens.map((item) => ({
    chave: crypto.randomUUID(),
    produtoId: item.produtoId,
    quantidade: String(item.quantidade),
    destino: DestinoDevolucao.Reposicao,
    loteId: '',
    numeroLote: '',
    justificativaDescarte: '',
  }));
}

async function onPedidoSelect(valor: unknown): Promise<void> {
  const pedidoId = typeof valor === 'string' ? valor : '';

  if (!pedidoId) {
    pedidoOrigem.value = null;
    formulario.value.itens = [novoItem()];
    return;
  }

  carregandoOrigem.value = true;
  const ok = await obterPedido(pedidoId);
  carregandoOrigem.value = false;

  if (!ok || !pedidoDetalhe.value) {
    pedidoOrigem.value = null;
    formulario.value.itens = [novoItem()];
    return;
  }

  pedidoOrigem.value = pedidoDetalhe.value;
  preencherItensDoPedido(pedidoDetalhe.value);
}

async function salvar(): Promise<void> {
  const criada = await criar(formulario.value);
  if (criada) await router.push({ name: 'devolucao-venda-detalhe', params: { id: criada.id } });
}

onMounted(() => {
  void carregarProdutos();
  void carregarClientes({ ativo: true });
  void carregarPedidos({ status: PedidoVendaStatus.Faturado });
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-4) 0 var(--spacing-3);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.devolucao-form__origem {
  margin-bottom: var(--spacing-4);
  background: var(--color-bg-subtle);
}
.devolucao-form__sem-pedido {
  color: var(--color-text-secondary);
}
</style>
