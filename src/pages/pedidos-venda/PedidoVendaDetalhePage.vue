<template>
  <q-page class="agro-page">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina">
      <div class="pedido-venda-detalhe__acoes-header">
        <agro-btn
          v-if="ehOrcamento"
          flat
          icon="edit"
          label="Editar"
          descricao="Editar orçamento"
          :to="{ name: 'pedido-venda-editar', params: { id: pedidoId } }"
        />
        <agro-btn
          v-if="ehOrcamento"
          color="primary"
          unelevated
          label="Enviar para aprovação"
          descricao="Reservar estoque e enviar para aprovação"
          :loading="salvando"
          @click="enviar"
        />
        <agro-btn
          v-if="ehAguardando && podeDecidirAprovacao"
          color="primary"
          unelevated
          label="Aprovar"
          descricao="Aprovar pedido de venda"
          :loading="salvando"
          @click="aprovarPedido"
        />
        <agro-btn
          v-if="ehAguardando && podeDecidirAprovacao"
          color="negative"
          unelevated
          label="Recusar"
          descricao="Recusar pedido e devolver estoque"
          :loading="salvando"
          @click="abrirRecusa"
        />
        <agro-btn
          v-if="ehAguardando && podeDecidirAprovacao"
          flat
          label="Expirar"
          descricao="Expirar pedido e devolver estoque"
          :loading="salvando"
          @click="expirarPedido"
        />
        <agro-btn
          v-if="ehAprovado"
          color="primary"
          unelevated
          label="Faturar"
          descricao="Faturar pedido e gerar contas a receber"
          :loading="salvando"
          @click="faturarPedido"
        />
      </div>
    </app-page-header>

    <section class="agro-section pedido-venda-detalhe">
      <agro-form-skeleton v-if="carregando && !pedido" :campos="8" />

      <template v-else-if="pedido">
        <q-banner
          v-if="ehPendenteEstoque"
          rounded
          class="pedido-venda-detalhe__aviso"
        >
          Pedido pendente de estoque. Será liberado automaticamente quando houver
          saldo suficiente.
        </q-banner>

        <pedido-venda-resumo-card
          :pedido="pedido"
          :rotulo-cliente="rotuloCliente(pedido.clienteId)"
          :rotulo-vendedor="rotuloVendedor(pedido.vendedorUsuarioId)"
          :rotulo-condicao="rotuloCondicao(pedido.condicaoPagamentoId)"
          :rotulo-recusado-por="rotuloRecusadoPor(pedido.recusadoPorUsuarioId)"
        />

        <pedido-venda-travas-card
          v-if="ehAguardando || ehPendenteEstoque || travas.length > 0"
          :travas="travas"
          :carregando="carregandoTravas"
        />

        <pedido-venda-itens-detalhe
          :itens="pedido.itens"
          :rotulo-produto="rotuloProduto"
        />

        <pedido-venda-parcelas-section
          v-if="ehFaturado"
          :contas="contas"
          :carregando="carregandoContas"
        />
      </template>

      <div class="agro-form-actions">
        <agro-btn
          flat
          label="Voltar"
          descricao="Retornar à listagem de pedidos"
          :to="{ name: 'pedidos-venda' }"
        />
      </div>
    </section>

    <pedido-venda-recusar-dialog
      v-model="dialogRecusaAberto"
      :loading="salvando"
      @confirmar="confirmarRecusa"
    />
  </q-page>
</template>

<script setup lang="ts">
import PedidoVendaItensDetalhe from 'components/pedidos-venda/PedidoVendaItensDetalhe.vue';
import PedidoVendaParcelasSection from 'components/pedidos-venda/PedidoVendaParcelasSection.vue';
import PedidoVendaRecusarDialog from 'components/pedidos-venda/PedidoVendaRecusarDialog.vue';
import PedidoVendaResumoCard from 'components/pedidos-venda/PedidoVendaResumoCard.vue';
import PedidoVendaTravasCard from 'components/pedidos-venda/PedidoVendaTravasCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useAuth } from 'composables/useAuth';
import { useClientes } from 'composables/useClientes';
import { useCondicoesPagamento } from 'composables/useCondicoesPagamento';
import { useContasReceber } from 'composables/useContasReceber';
import { usePedidoVenda } from 'composables/usePedidoVenda';
import { useProdutos } from 'composables/useProdutos';
import { useUsuarios } from 'composables/useUsuarios';
import { PedidoVendaStatus } from 'constants/enums';
import { Permissoes } from 'constants/permissoes';
import { rotuloPedidoVendaStatus } from 'utils/pedido-venda.helpers';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { possuiPermissao } = useAuth();

const podeDecidirAprovacao = computed(() =>
  possuiPermissao(Permissoes.Aprovacoes.Aprovar),
);

const {
  pedido,
  travas,
  carregando,
  carregandoTravas,
  salvando,
  obter,
  enviarAprovacao,
  aprovar,
  solicitarRecusa,
  expirar,
  faturar,
} = usePedidoVenda();

const { clientes, carregar: carregarClientes } = useClientes();
const { usuarios, carregar: carregarUsuarios, nomeCompleto } = useUsuarios();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { rotuloCondicao, carregar: carregarCondicoes } = useCondicoesPagamento();
const {
  contas,
  carregando: carregandoContas,
  carregar: carregarContas,
  limpar: limparContas,
} = useContasReceber();

const dialogRecusaAberto = ref(false);

const pedidoId = computed(() => route.params.id as string);

const ehOrcamento = computed(
  () => pedido.value?.status === PedidoVendaStatus.Orcamento,
);
const ehAguardando = computed(
  () => pedido.value?.status === PedidoVendaStatus.Aguardando,
);
const ehPendenteEstoque = computed(
  () => pedido.value?.status === PedidoVendaStatus.PendenteEstoque,
);
const ehAprovado = computed(
  () => pedido.value?.status === PedidoVendaStatus.Aprovado,
);
const ehFaturado = computed(
  () => pedido.value?.status === PedidoVendaStatus.Faturado,
);

const tituloPagina = computed(() => 'Pedido de venda');
const subtituloPagina = computed(() => {
  if (!pedido.value) {
    return 'Carregando detalhes do pedido...';
  }

  return `Status: ${rotuloPedidoVendaStatus(pedido.value.status)}`;
});

const mapaClientes = computed(() => {
  const mapa = new Map<string, string>();
  for (const cliente of clientes.value) {
    mapa.set(cliente.id, cliente.nomeRazao);
  }
  return mapa;
});

const mapaVendedores = computed(() => {
  const mapa = new Map<string, string>();
  for (const usuario of usuarios.value) {
    mapa.set(usuario.id, nomeCompleto(usuario));
  }
  return mapa;
});

const mapaProdutos = computed(() => {
  const mapa = new Map<string, string>();
  for (const produto of produtos.value) {
    mapa.set(produto.id, `${produto.descricao}`);
  }
  return mapa;
});

function rotuloCliente(clienteId: string): string {
  return mapaClientes.value.get(clienteId) ?? clienteId;
}

function rotuloVendedor(vendedorId: string): string {
  return mapaVendedores.value.get(vendedorId) ?? vendedorId;
}

function rotuloRecusadoPor(usuarioId: string | null | undefined): string {
  if (!usuarioId) {
    return '';
  }

  return mapaVendedores.value.get(usuarioId) ?? usuarioId;
}

function rotuloProduto(produtoId: string): string {
  return mapaProdutos.value.get(produtoId) ?? produtoId;
}

async function enviar(): Promise<void> {
  await enviarAprovacao(pedidoId.value);
}

async function aprovarPedido(): Promise<void> {
  await aprovar(pedidoId.value);
}

function abrirRecusa(): void {
  dialogRecusaAberto.value = true;
}

async function confirmarRecusa(motivo: string): Promise<void> {
  const ok = await solicitarRecusa(pedidoId.value, motivo);

  if (ok) {
    dialogRecusaAberto.value = false;
  }
}

async function expirarPedido(): Promise<void> {
  await expirar(pedidoId.value);
}

async function faturarPedido(): Promise<void> {
  const ok = await faturar(pedidoId.value);

  if (ok) {
    await carregarContas({ pedidoId: pedidoId.value });
  }
}

watch(ehFaturado, (faturado) => {
  if (faturado) {
    void carregarContas({ pedidoId: pedidoId.value });
  } else {
    limparContas();
  }
});

onMounted(async () => {
  void carregarClientes();
  void carregarUsuarios();
  void carregarProdutos();
  void carregarCondicoes();

  const ok = await obter(pedidoId.value);

  if (!ok) {
    await router.replace({ name: 'pedidos-venda' });
  }
});
</script>

<style scoped>
.pedido-venda-detalhe {
  display: grid;
  gap: var(--spacing-6);
}

.pedido-venda-detalhe__acoes-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.pedido-venda-detalhe__aviso {
  background: var(--color-warning-50, var(--color-surface-muted));
  color: var(--color-text-primary);
}
</style>
