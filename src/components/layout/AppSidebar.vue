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
