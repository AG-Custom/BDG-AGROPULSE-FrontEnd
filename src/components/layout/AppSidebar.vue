<template>
  <nav class="app-sidebar">
    <div class="app-sidebar__section">
      <div class="text-overline app-sidebar__label">Principal</div>
      <q-list padding class="app-sidebar__list">
        <q-item
          clickable
          :to="{ name: 'dashboard' }"
          exact
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" size="20px" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="app-sidebar__section">
      <div class="text-overline app-sidebar__label">Cadastros</div>
      <q-list padding class="app-sidebar__list">
        <q-item
          clickable
          :to="{ name: 'unidades' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="store" size="20px" />
          </q-item-section>
          <q-item-section>Unidades</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'fornecedores' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="local_shipping" size="20px" />
          </q-item-section>
          <q-item-section>Fornecedores</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarClientes"
          clickable
          :to="{ name: 'clientes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="groups" size="20px" />
          </q-item-section>
          <q-item-section>Clientes</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="podeAcessarProdutos" class="app-sidebar__section">
      <div class="text-overline app-sidebar__label">Produtos</div>
      <q-list padding class="app-sidebar__list">
        <q-item
          v-if="podeGerenciarProdutos"
          clickable
          :to="{ name: 'produtos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="inventory_2" size="20px" />
          </q-item-section>
          <q-item-section>Produtos</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarCategoriasProduto"
          clickable
          :to="{ name: 'categorias-produto' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="category" size="20px" />
          </q-item-section>
          <q-item-section>Categorias</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarUnidadesMedida"
          clickable
          :to="{ name: 'unidades-medida' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="straighten" size="20px" />
          </q-item-section>
          <q-item-section>Unid. de medida</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarTabelasPreco"
          clickable
          :to="{ name: 'tabelas-preco' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="sell" size="20px" />
          </q-item-section>
          <q-item-section>Tabelas de preço</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="podeGerenciarEstoque" class="app-sidebar__section">
      <div class="text-overline app-sidebar__label">Estoque</div>
      <q-list padding class="app-sidebar__list">
        <q-item
          clickable
          :to="{ name: 'estoque-saldos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="warehouse" size="20px" />
          </q-item-section>
          <q-item-section>Saldos</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'estoque-lotes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="qr_code_2" size="20px" />
          </q-item-section>
          <q-item-section>Lotes</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'estoque-movimentacoes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="swap_vert" size="20px" />
          </q-item-section>
          <q-item-section>Movimentações</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'estoque-inicial' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="start" size="20px" />
          </q-item-section>
          <q-item-section>Estoque inicial</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'estoque-inventarios' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="fact_check" size="20px" />
          </q-item-section>
          <q-item-section>Inventários</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'estoque-transferencias' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="swap_horiz" size="20px" />
          </q-item-section>
          <q-item-section>Transferências</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'estoque-alertas' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="notification_important" size="20px" />
          </q-item-section>
          <q-item-section>Alertas</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="podeAcessarVendas" class="app-sidebar__section">
      <div class="text-overline app-sidebar__label">Vendas</div>
      <q-list padding class="app-sidebar__list">
        <q-item
          v-if="podeGerenciarPedidosVenda"
          clickable
          :to="{ name: 'pedidos-venda' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="shopping_cart" size="20px" />
          </q-item-section>
          <q-item-section>Pedidos</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarOrcamentos"
          clickable
          :to="{ name: 'orcamentos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="request_quote" size="20px" />
          </q-item-section>
          <q-item-section>Orçamentos</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarPdv"
          clickable
          :to="{ name: 'pdv-vender' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="point_of_sale" size="20px" />
          </q-item-section>
          <q-item-section>PDV</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarAprovacoes"
          clickable
          :to="{ name: 'aprovacoes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="rule" size="20px" />
          </q-item-section>
          <q-item-section>Aprovações</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="podeAcessarCompras" class="app-sidebar__section">
      <div class="text-overline app-sidebar__label">Compras</div>
      <q-list padding class="app-sidebar__list">
        <q-item
          v-if="podeGerenciarCompras"
          clickable
          :to="{ name: 'solicitacoes-compra' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="assignment" size="20px" />
          </q-item-section>
          <q-item-section>Solicitações</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarCompras"
          clickable
          :to="{ name: 'cotacoes-compra' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="compare" size="20px" />
          </q-item-section>
          <q-item-section>Cotações</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarCompras"
          clickable
          :to="{ name: 'pedidos-compra' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="local_mall" size="20px" />
          </q-item-section>
          <q-item-section>Pedidos compra</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarDevolucoes"
          clickable
          :to="{ name: 'devolucoes-venda' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="assignment_return" size="20px" />
          </q-item-section>
          <q-item-section>Devoluções</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarExpedicao"
          clickable
          :to="{ name: 'expedicao' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="local_shipping" size="20px" />
          </q-item-section>
          <q-item-section>Expedição</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="podeAcessarOperacoes" class="app-sidebar__section">
      <div class="text-overline app-sidebar__label">Operações</div>
      <q-list padding class="app-sidebar__list">
        <q-item
          v-if="podeGerenciarContratos"
          clickable
          :to="{ name: 'contratos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="handshake" size="20px" />
          </q-item-section>
          <q-item-section>Contratos</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarProducao"
          clickable
          :to="{ name: 'ordens-producao' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="precision_manufacturing" size="20px" />
          </q-item-section>
          <q-item-section>Ordens produção</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarProducao"
          clickable
          :to="{ name: 'beneficiamentos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="transform" size="20px" />
          </q-item-section>
          <q-item-section>Beneficiamentos</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarRastreabilidade"
          clickable
          :to="{ name: 'talhoes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="grass" size="20px" />
          </q-item-section>
          <q-item-section>Talhões</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarRastreabilidade"
          clickable
          :to="{ name: 'aplicacoes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="science" size="20px" />
          </q-item-section>
          <q-item-section>Aplicações</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="podeGerenciarFiscal" class="app-sidebar__section">
      <div class="text-overline app-sidebar__label">Fiscal</div>
      <q-list padding class="app-sidebar__list">
        <q-item
          clickable
          :to="{ name: 'fiscal-config' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="receipt_long" size="20px" />
          </q-item-section>
          <q-item-section>Configuração fiscal</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="podeGerenciarFormasPagamentoConfig" class="app-sidebar__section">
      <div class="text-overline app-sidebar__label">Financeiro</div>
      <q-list padding class="app-sidebar__list">
        <q-item
          clickable
          :to="{ name: 'formas-pagamento-config' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="payments" size="20px" />
          </q-item-section>
          <q-item-section>Formas de pagamento</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="podeGerenciarRelatorios" class="app-sidebar__section">
      <div class="text-overline app-sidebar__label">Relatórios</div>
      <q-list padding class="app-sidebar__list">
        <q-item
          clickable
          :to="{ name: 'relatorios' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="analytics" size="20px" />
          </q-item-section>
          <q-item-section>Relatórios</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-if="podeAcessarAdministracao" class="app-sidebar__section">
      <div class="text-overline app-sidebar__label">Administração</div>
      <q-list padding class="app-sidebar__list">
        <q-item
          v-if="podeGerenciarUsuarios"
          clickable
          :to="{ name: 'usuarios' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="manage_accounts" size="20px" />
          </q-item-section>
          <q-item-section>Usuários</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarColaboradores"
          clickable
          :to="{ name: 'colaboradores' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="badge" size="20px" />
          </q-item-section>
          <q-item-section>Colaboradores</q-item-section>
        </q-item>
      </q-list>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from 'composables/useAuth';
import { Permissoes } from 'constants/permissoes';
import { computed } from 'vue';

const { possuiPermissao } = useAuth();

const podeGerenciarUsuarios = computed(() =>
  possuiPermissao(Permissoes.Usuarios.Visualizar),
);
const podeGerenciarColaboradores = computed(() =>
  possuiPermissao(Permissoes.Colaboradores.Visualizar),
);
const podeGerenciarClientes = computed(() =>
  possuiPermissao(Permissoes.Clientes.Visualizar),
);
const podeGerenciarProdutos = computed(() =>
  possuiPermissao(Permissoes.Produtos.Visualizar),
);
const podeGerenciarCategoriasProduto = computed(() =>
  possuiPermissao(Permissoes.CategoriasProduto.Visualizar),
);
const podeGerenciarUnidadesMedida = computed(() =>
  possuiPermissao(Permissoes.UnidadesMedida.Visualizar),
);
const podeGerenciarTabelasPreco = computed(() =>
  possuiPermissao(Permissoes.TabelasPreco.Visualizar),
);
const podeGerenciarEstoque = computed(() =>
  possuiPermissao(Permissoes.Estoque.Visualizar),
);
const podeGerenciarPedidosVenda = computed(() =>
  possuiPermissao(Permissoes.PedidosVenda.Visualizar),
);
const podeGerenciarAprovacoes = computed(() =>
  possuiPermissao(Permissoes.Aprovacoes.Visualizar),
);
const podeGerenciarOrcamentos = computed(() =>
  possuiPermissao(Permissoes.Orcamentos.Visualizar),
);
const podeGerenciarPdv = computed(() => possuiPermissao(Permissoes.Pdv.Visualizar));
const podeGerenciarCompras = computed(() =>
  possuiPermissao(Permissoes.Compras.Visualizar),
);
const podeGerenciarDevolucoes = computed(() =>
  possuiPermissao(Permissoes.DevolucoesVenda.Visualizar),
);
const podeGerenciarExpedicao = computed(() =>
  possuiPermissao(Permissoes.Expedicao.Visualizar),
);
const podeGerenciarContratos = computed(() =>
  possuiPermissao(Permissoes.Contratos.Visualizar),
);
const podeGerenciarProducao = computed(() =>
  possuiPermissao(Permissoes.Producao.Visualizar),
);
const podeGerenciarRastreabilidade = computed(() =>
  possuiPermissao(Permissoes.Rastreabilidade.Visualizar),
);
const podeGerenciarFiscal = computed(() =>
  possuiPermissao(Permissoes.Fiscal.Visualizar),
);
const podeGerenciarFormasPagamentoConfig = computed(() =>
  possuiPermissao(Permissoes.FormasPagamentoConfig.Visualizar),
);
const podeGerenciarRelatorios = computed(() =>
  possuiPermissao(Permissoes.Relatorios.Visualizar),
);

const podeAcessarVendas = computed(
  () =>
    podeGerenciarPedidosVenda.value ||
    podeGerenciarAprovacoes.value ||
    podeGerenciarOrcamentos.value ||
    podeGerenciarPdv.value,
);
const podeAcessarCompras = computed(
  () =>
    podeGerenciarCompras.value ||
    podeGerenciarDevolucoes.value ||
    podeGerenciarExpedicao.value,
);
const podeAcessarOperacoes = computed(
  () =>
    podeGerenciarContratos.value ||
    podeGerenciarProducao.value ||
    podeGerenciarRastreabilidade.value,
);
const podeAcessarProdutos = computed(
  () =>
    podeGerenciarProdutos.value ||
    podeGerenciarCategoriasProduto.value ||
    podeGerenciarUnidadesMedida.value ||
    podeGerenciarTabelasPreco.value,
);
const podeAcessarAdministracao = computed(
  () => podeGerenciarUsuarios.value || podeGerenciarColaboradores.value,
);
</script>

<style scoped>
.app-sidebar {
  padding: var(--spacing-2) 0;
}

.app-sidebar__section + .app-sidebar__section {
  margin-top: var(--spacing-4);
}

.app-sidebar__label {
  color: var(--color-sidebar-text-muted);
  padding: var(--spacing-2) var(--spacing-4);
}

.app-sidebar__list {
  padding: 0 var(--spacing-2);
}

.app-sidebar__item {
  border-radius: var(--radius-md);
  color: var(--color-sidebar-text-secondary);
  margin-bottom: var(--spacing-1);
  min-height: 40px;
  transition: var(--transition-bg), var(--transition-color);
}

.app-sidebar__item:hover {
  background: var(--color-sidebar-item-hover);
  color: var(--color-sidebar-text);
}

:deep(.app-sidebar__item--active) {
  background: var(--color-sidebar-item-active-bg);
  border-left: var(--border-width-accent) solid var(--color-sidebar-accent);
  color: var(--color-sidebar-item-active-text);
  font-weight: var(--font-weight-medium);
}

:deep(.app-sidebar__item--active .q-icon) {
  color: var(--color-sidebar-accent);
}
</style>
