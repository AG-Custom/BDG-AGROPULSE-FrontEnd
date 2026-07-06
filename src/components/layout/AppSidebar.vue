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
      </q-list>
    </div>
  </nav>
</template>

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
