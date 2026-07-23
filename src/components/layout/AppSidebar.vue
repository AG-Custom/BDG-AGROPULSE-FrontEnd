<template>
  <nav class="app-sidebar">
    <app-sidebar-section label="Principal" :rotas-ativas="['/']" default-opened>
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
    </app-sidebar-section>

    <app-sidebar-section label="Cadastros" :rotas-ativas="['/unidades', '/fornecedores', '/clientes']">
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
    </app-sidebar-section>

    <app-sidebar-section v-if="podeAcessarProdutos" label="Produtos" :rotas-ativas="['/produtos', '/categorias-produto', '/unidades-medida', '/tabelas-preco']">
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
    </app-sidebar-section>

    <app-sidebar-section v-if="podeGerenciarEstoque" label="Estoque" :rotas-ativas="['/estoque']">
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
    </app-sidebar-section>

    <app-sidebar-section v-if="podeAcessarVendas" label="Vendas" :rotas-ativas="['/pedidos-venda', '/orcamentos', '/pdv', '/metas-vendedor', '/representantes', '/regras-comissao', '/aprovacoes']">
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
          v-if="podeGerenciarMetasVendedor"
          clickable
          :to="{ name: 'metas-vendedor' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="flag" size="20px" />
          </q-item-section>
          <q-item-section>Metas</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarRepresentantes"
          clickable
          :to="{ name: 'representantes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="handshake" size="20px" />
          </q-item-section>
          <q-item-section>Representantes</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarRegrasComissao"
          clickable
          :to="{ name: 'regras-comissao' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="percent" size="20px" />
          </q-item-section>
          <q-item-section>Comissões</q-item-section>
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
    </app-sidebar-section>

    <app-sidebar-section v-if="podeAcessarCompras" label="Compras" :rotas-ativas="['/compras', '/devolucoes-venda', '/expedicao']">
        <q-item
          v-if="podeGerenciarCompras"
          clickable
          :to="{ name: 'recebimentos-compra' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="inventory_2" size="20px" />
          </q-item-section>
          <q-item-section>Recebimentos</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarCompras"
          clickable
          :to="{ name: 'historico-compras' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="history" size="20px" />
          </q-item-section>
          <q-item-section>Histórico</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarCompras && fluxoCompletoHabilitado"
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
          v-if="podeGerenciarCompras && fluxoCompletoHabilitado"
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
          v-if="podeGerenciarCompras && fluxoCompletoHabilitado"
          clickable
          :to="{ name: 'contratos-fornecimento' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="description" size="20px" />
          </q-item-section>
          <q-item-section>Contratos fornecimento</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarCompras && fluxoCompletoHabilitado"
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
          v-if="podeGerenciarCompras && fluxoCompletoHabilitado"
          clickable
          :to="{ name: 'compras-aprovacoes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="verified" size="20px" />
          </q-item-section>
          <q-item-section>Aprovações</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarCompras && fluxoCompletoHabilitado"
          clickable
          :to="{ name: 'compras-alcadas' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="rule" size="20px" />
          </q-item-section>
          <q-item-section>Alçadas / config</q-item-section>
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
    </app-sidebar-section>

    <app-sidebar-section v-if="podeAcessarOperacoes" label="Operações" :rotas-ativas="['/contratos', '/producao']">
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
          :to="{ name: 'receitas-producao' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="menu_book" size="20px" />
          </q-item-section>
          <q-item-section>Receitas / BOM</q-item-section>
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
          v-if="podeGerenciarProducao"
          clickable
          :to="{ name: 'laudos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="biotech" size="20px" />
          </q-item-section>
          <q-item-section>Laudos qualidade</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarProducao"
          clickable
          :to="{ name: 'fichas-tecnicas' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="description" size="20px" />
          </q-item-section>
          <q-item-section>Fichas técnicas</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarProducao"
          clickable
          :to="{ name: 'paradas-linha' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="pause_circle" size="20px" />
          </q-item-section>
          <q-item-section>Paradas de linha</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarProducao"
          clickable
          :to="{ name: 'oee' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="speed" size="20px" />
          </q-item-section>
          <q-item-section>OEE</q-item-section>
        </q-item>
    </app-sidebar-section>

    <app-sidebar-section v-if="podeGerenciarManutencao" label="Manutenção" :rotas-ativas="['/manutencao']">
        <q-item
          clickable
          :to="{ name: 'manutencao-dashboard' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" size="20px" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'manutencao-ativos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="agriculture" size="20px" />
          </q-item-section>
          <q-item-section>Ativos</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'manutencao-planos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="event_repeat" size="20px" />
          </q-item-section>
          <q-item-section>Planos preventivos</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'manutencao-ordens' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="handyman" size="20px" />
          </q-item-section>
          <q-item-section>Ordens de serviço</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'manutencao-checklists' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="checklist" size="20px" />
          </q-item-section>
          <q-item-section>Checklists</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'manutencao-custos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="payments" size="20px" />
          </q-item-section>
          <q-item-section>Custos</q-item-section>
        </q-item>
    </app-sidebar-section>

    <app-sidebar-section v-if="podeGerenciarLogistica" label="Logística" :rotas-ativas="['/logistica']">
        <q-item
          clickable
          :to="{ name: 'logistica-dashboard' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" size="20px" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'logistica-veiculos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="local_shipping" size="20px" />
          </q-item-section>
          <q-item-section>Frota</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'logistica-cargas' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="inventory_2" size="20px" />
          </q-item-section>
          <q-item-section>Cargas</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'logistica-romaneios' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="assignment" size="20px" />
          </q-item-section>
          <q-item-section>Romaneios</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'logistica-transportadoras' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="business" size="20px" />
          </q-item-section>
          <q-item-section>Transportadoras</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'logistica-abastecimentos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="local_gas_station" size="20px" />
          </q-item-section>
          <q-item-section>Abastecimento</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'logistica-docs-transporte' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="description" size="20px" />
          </q-item-section>
          <q-item-section>Docs</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'logistica-custos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="payments" size="20px" />
          </q-item-section>
          <q-item-section>Custos</q-item-section>
        </q-item>
    </app-sidebar-section>

    <app-sidebar-section v-if="podeGerenciarCrm" label="CRM Agrícola" :rotas-ativas="['/crm']">
        <q-item
          clickable
          :to="{ name: 'crm-dashboard' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" size="20px" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'crm-carteira' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="agriculture" size="20px" />
          </q-item-section>
          <q-item-section>Carteira</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'crm-oportunidades' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="trending_up" size="20px" />
          </q-item-section>
          <q-item-section>Oportunidades</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'crm-amostras' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="science" size="20px" />
          </q-item-section>
          <q-item-section>Amostras</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'crm-campanhas' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="campaign" size="20px" />
          </q-item-section>
          <q-item-section>Campanhas</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'crm-credito' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="account_balance" size="20px" />
          </q-item-section>
          <q-item-section>Crédito</q-item-section>
        </q-item>
    </app-sidebar-section>

    <app-sidebar-section v-if="podeGerenciarCobrancaCredito" label="Cobrança e Crédito" :rotas-ativas="['/cobranca-credito', '/financeiro/contas-receber', '/financeiro/regua-cobranca', '/financeiro/renegociacoes', '/crm/credito']">
        <q-item
          clickable
          :to="{ name: 'cobranca-credito' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="account_balance_wallet" size="20px" />
          </q-item-section>
          <q-item-section>Painel crédito</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          dense
          :to="{ name: 'contas-receber' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item app-sidebar__item--atalho"
        >
          <q-item-section avatar>
            <q-icon name="receipt_long" size="18px" />
          </q-item-section>
          <q-item-section>Contas a receber</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          dense
          :to="{ name: 'regua-cobranca' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item app-sidebar__item--atalho"
        >
          <q-item-section avatar>
            <q-icon name="campaign" size="18px" />
          </q-item-section>
          <q-item-section>Régua de cobrança</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          dense
          :to="{ name: 'renegociacoes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item app-sidebar__item--atalho"
        >
          <q-item-section avatar>
            <q-icon name="handshake" size="18px" />
          </q-item-section>
          <q-item-section>Renegociações</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarCrm"
          clickable
          dense
          :to="{ name: 'crm-credito' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item app-sidebar__item--atalho"
        >
          <q-item-section avatar>
            <q-icon name="account_balance" size="18px" />
          </q-item-section>
          <q-item-section>CRM Crédito</q-item-section>
        </q-item>
    </app-sidebar-section>

    <app-sidebar-section v-if="podeGerenciarRastreabilidade" label="Safras" :rotas-ativas="['/safras', '/rastreabilidade']">
        <q-item
          clickable
          :to="{ name: 'safras-fazendas' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="agriculture" size="20px" />
          </q-item-section>
          <q-item-section>Fazendas</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'safras-glebas' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="map" size="20px" />
          </q-item-section>
          <q-item-section>Glebas</q-item-section>
        </q-item>
        <q-item
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
        <q-item
          clickable
          :to="{ name: 'safras-diario-campo' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="menu_book" size="20px" />
          </q-item-section>
          <q-item-section>Diário de campo</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'safras-historico-aplicacoes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="timeline" size="20px" />
          </q-item-section>
          <q-item-section>Histórico aplicações</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'safras-historico-produtividade' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="insights" size="20px" />
          </q-item-section>
          <q-item-section>Histórico produtividade</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'safras-geo' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="public" size="20px" />
          </q-item-section>
          <q-item-section>Importação geo</q-item-section>
        </q-item>
        <q-item
          v-if="mostrarItensRevenda"
          clickable
          :to="{ name: 'safras-visitas-tecnicas' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="support_agent" size="20px" />
          </q-item-section>
          <q-item-section>Visitas técnicas</q-item-section>
        </q-item>
        <q-item
          v-if="mostrarItensRevenda"
          clickable
          :to="{ name: 'safras-recomendacoes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="recommend" size="20px" />
          </q-item-section>
          <q-item-section>Recomendações</q-item-section>
        </q-item>
        <q-item
          v-if="mostrarItensIndustria"
          clickable
          :to="{ name: 'safras-planejamento' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="calendar_month" size="20px" />
          </q-item-section>
          <q-item-section>Planejamento de safras</q-item-section>
        </q-item>
        <q-item
          v-if="mostrarItensIndustria"
          clickable
          :to="{ name: 'safras-ordens-servico' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="assignment" size="20px" />
          </q-item-section>
          <q-item-section>OS agrícola</q-item-section>
        </q-item>
        <q-item
          v-if="mostrarItensIndustria"
          clickable
          :to="{ name: 'safras-custeio' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="payments" size="20px" />
          </q-item-section>
          <q-item-section>Custeio</q-item-section>
        </q-item>
        <q-item
          v-if="mostrarItensIndustria"
          clickable
          :to="{ name: 'safras-oee-campo' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="speed" size="20px" />
          </q-item-section>
          <q-item-section>OEE campo</q-item-section>
        </q-item>
    </app-sidebar-section>

    <app-sidebar-section v-if="podeGerenciarFiscal" label="Fiscal" :rotas-ativas="['/fiscal']">
        <q-item
          clickable
          :to="{ name: 'fiscal-notas-fiscais' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="description" size="20px" />
          </q-item-section>
          <q-item-section>Notas fiscais</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'fiscal-contingencia' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="cloud_off" size="20px" />
          </q-item-section>
          <q-item-section>Contingência</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'fiscal-inutilizacoes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="block" size="20px" />
          </q-item-section>
          <q-item-section>Inutilizações</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'fiscal-ncm-pis-cofins' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="percent" size="20px" />
          </q-item-section>
          <q-item-section>PIS/COFINS NCM</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'fiscal-mva-ncm-uf' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="swap_horiz" size="20px" />
          </q-item-section>
          <q-item-section>MVA NCM/UF</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'fiscal-gnre' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="account_balance" size="20px" />
          </q-item-section>
          <q-item-section>GNRE</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'fiscal-funrural' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="agriculture" size="20px" />
          </q-item-section>
          <q-item-section>Funrural</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'fiscal-regimes-cnpj' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="business" size="20px" />
          </q-item-section>
          <q-item-section>Regimes por CNPJ</q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'fiscal-sped' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="folder_zip" size="20px" />
          </q-item-section>
          <q-item-section>SPED</q-item-section>
        </q-item>
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
    </app-sidebar-section>

    <app-sidebar-section v-if="podeGerenciarFinanceiro || podeGerenciarFormasPagamentoConfig" label="Financeiro" :rotas-ativas="['/financeiro', '/formas-pagamento-config']">
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'contas-receber' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="request_quote" size="20px" />
          </q-item-section>
          <q-item-section>Contas a receber</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'contas-pagar' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="payments" size="20px" />
          </q-item-section>
          <q-item-section>Contas a pagar</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'condicoes-pagamento' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="event_repeat" size="20px" />
          </q-item-section>
          <q-item-section>Condições de pagamento</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFormasPagamentoConfig"
          clickable
          :to="{ name: 'formas-pagamento-config' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="credit_card" size="20px" />
          </q-item-section>
          <q-item-section>Formas de pagamento</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'contas-bancarias' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="account_balance" size="20px" />
          </q-item-section>
          <q-item-section>Contas bancárias</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'caixas' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="point_of_sale" size="20px" />
          </q-item-section>
          <q-item-section>Caixas</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'centros-custo' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="account_tree" size="20px" />
          </q-item-section>
          <q-item-section>Centros de custo</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'transferencias-financeiras' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="swap_horiz" size="20px" />
          </q-item-section>
          <q-item-section>Transferências</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'cheques' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="money" size="20px" />
          </q-item-section>
          <q-item-section>Cheques</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'fluxo-caixa' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="waterfall_chart" size="20px" />
          </q-item-section>
          <q-item-section>Fluxo de caixa</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'tesouraria' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="savings" size="20px" />
          </q-item-section>
          <q-item-section>Tesouraria</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'conciliacao-bancaria' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="sync_alt" size="20px" />
          </q-item-section>
          <q-item-section>Conciliação</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'boletos' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="receipt" size="20px" />
          </q-item-section>
          <q-item-section>Boletos</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'regua-cobranca' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="campaign" size="20px" />
          </q-item-section>
          <q-item-section>Régua de cobrança</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'renegociacoes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="handshake" size="20px" />
          </q-item-section>
          <q-item-section>Renegociações</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'antecipacoes' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="account_balance_wallet" size="20px" />
          </q-item-section>
          <q-item-section>Antecipações</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'orcamento-financeiro' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="pie_chart" size="20px" />
          </q-item-section>
          <q-item-section>Orçamento financeiro</q-item-section>
        </q-item>
        <q-item
          v-if="podeGerenciarFinanceiro"
          clickable
          :to="{ name: 'cotacoes-moeda' }"
          active-class="app-sidebar__item--active"
          class="app-sidebar__item"
        >
          <q-item-section avatar>
            <q-icon name="currency_exchange" size="20px" />
          </q-item-section>
          <q-item-section>Cotações / multi-moeda</q-item-section>
        </q-item>
    </app-sidebar-section>

    <app-sidebar-section v-if="podeGerenciarRelatorios" label="Relatórios" :rotas-ativas="['/relatorios']">
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
    </app-sidebar-section>

    <app-sidebar-section v-if="podeAcessarAdministracao" label="Administração" :rotas-ativas="['/usuarios', '/colaboradores']">
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
    </app-sidebar-section>
  </nav>
</template>

<script setup lang="ts">
import AppSidebarSection from 'components/layout/AppSidebarSection.vue';
import { useComprasConfig } from 'composables/useComprasConfig';
import { usePerfilSafras } from 'composables/usePerfilSafras';
import { usePermissao } from 'composables/usePermissao';
import { Permissoes } from 'constants/permissoes';
import { computed, onMounted } from 'vue';

const { possuiPermissao } = usePermissao();
const { config, carregar: carregarComprasConfig } = useComprasConfig();
const { isRevenda, isIndustria, carregarPerfil } = usePerfilSafras();

const fluxoCompletoHabilitado = computed(
  () => config.value?.fluxoCompletoHabilitado === true,
);

const mostrarItensRevenda = computed(() => isRevenda.value);
const mostrarItensIndustria = computed(() => isIndustria.value);

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
const podeGerenciarMetasVendedor = computed(() =>
  possuiPermissao(Permissoes.MetasVendedor.Visualizar),
);
const podeGerenciarRepresentantes = computed(() =>
  possuiPermissao(Permissoes.Representantes.Visualizar),
);
const podeGerenciarRegrasComissao = computed(() =>
  possuiPermissao(Permissoes.RegrasComissao.Visualizar),
);
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
  possuiPermissao(Permissoes.Producao.Visualizar) && isIndustria.value,
);
const podeGerenciarManutencao = computed(() =>
  possuiPermissao(Permissoes.Manutencao.Visualizar),
);
const podeGerenciarLogistica = computed(() =>
  possuiPermissao(Permissoes.Logistica.Visualizar),
);
const podeGerenciarCrm = computed(() => possuiPermissao(Permissoes.Crm.Visualizar));
const podeGerenciarCobrancaCredito = computed(() =>
  possuiPermissao(Permissoes.CobrancaCredito.Visualizar),
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
const podeGerenciarFinanceiro = computed(() =>
  possuiPermissao(Permissoes.Financeiro.Visualizar),
);
const podeGerenciarRelatorios = computed(() =>
  possuiPermissao(Permissoes.Relatorios.Visualizar),
);

const podeAcessarVendas = computed(
  () =>
    podeGerenciarPedidosVenda.value ||
    podeGerenciarAprovacoes.value ||
    podeGerenciarOrcamentos.value ||
    podeGerenciarPdv.value ||
    podeGerenciarMetasVendedor.value ||
    podeGerenciarRepresentantes.value ||
    podeGerenciarRegrasComissao.value,
);
const podeAcessarCompras = computed(
  () =>
    podeGerenciarCompras.value ||
    podeGerenciarDevolucoes.value ||
    podeGerenciarExpedicao.value,
);
const podeAcessarOperacoes = computed(
  () => podeGerenciarContratos.value || podeGerenciarProducao.value,
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

onMounted(() => {
  if (podeGerenciarCompras.value) {
    void carregarComprasConfig();
  }
  void carregarPerfil();
});
</script>

<style scoped>
.app-sidebar {
  padding: var(--spacing-2) 0;
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
