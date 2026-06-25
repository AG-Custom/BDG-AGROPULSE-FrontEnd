<template>
  <q-page class="login-page">
    <section class="login-panel">
      <div>
        <div class="text-h4 text-weight-semibold">AgroPulse</div>
        <div class="text-body1 text-grey-7">Gestão agrícola integrada</div>
      </div>

      <q-form class="q-gutter-md" @submit.prevent="entrar">
        <q-input v-model="usuario" outlined label="Usuário" />
        <q-input v-model="senha" outlined label="Senha" type="password" />
        <q-btn color="primary" unelevated type="submit" class="full-width" label="Entrar" />
      </q-form>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { useAuth } from 'composables/useAuth';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { entrarSessaoLocal } = useAuth();
const usuario = ref('');
const senha = ref('');

function entrar(): void {
  entrarSessaoLocal();
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/';
  void router.push(redirect);
}
</script>

<style scoped>
.login-page {
  align-items: center;
  background: #eef4ea;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.login-panel {
  background: #ffffff;
  border: 1px solid #dce5d8;
  border-radius: 8px;
  display: grid;
  gap: 28px;
  max-width: 420px;
  padding: 32px;
  width: 100%;
}
</style>
