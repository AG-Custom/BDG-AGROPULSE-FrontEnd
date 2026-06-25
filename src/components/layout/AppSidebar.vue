<template>
  <q-list padding>
    <q-item clickable :to="{ name: 'dashboard' }" exact>
      <q-item-section avatar>
        <q-icon name="dashboard" />
      </q-item-section>
      <q-item-section>Dashboard</q-item-section>
    </q-item>
  </q-list>
</template>
