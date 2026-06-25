<template>
  <q-page class="not-found-page">
    <div class="text-h5">Página não encontrada</div>
    <q-btn color="primary" flat :to="{ name: 'dashboard' }" label="Voltar" />
  </q-page>
</template>

<style scoped>
.not-found-page {
  align-items: center;
  display: grid;
  gap: 16px;
  justify-content: center;
  min-height: 100vh;
}
</style>
