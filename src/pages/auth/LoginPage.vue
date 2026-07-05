<template>
  <q-page class="auth-page">
    <auth-card subtitulo="Gestão agrícola integrada">
      <q-form class="auth-form" @submit.prevent="enviar">
        <q-input
          v-model="email"
          outlined
          label="E-mail"
          class="field-required"
          type="email"
          autocomplete="email"
          :disable="carregando"
          aria-required="true"
          :rules="[obrigatorio, emailValidator]"
        />

        <q-input
          v-model="senha"
          outlined
          label="Senha"
          class="field-required"
          :type="mostrarSenha ? 'text' : 'password'"
          autocomplete="current-password"
          :disable="carregando"
          aria-required="true"
          :rules="[obrigatorio]"
        >
          <template #append>
            <q-icon
              :name="mostrarSenha ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </q-input>

        <q-btn
          color="primary"
          unelevated
          type="submit"
          class="full-width"
          label="Entrar"
          :loading="carregando"
        />
      </q-form>

      <template #footer>
        <span class="text-body-md text-secondary">
          Ainda não tem conta?
          <router-link :to="{ name: 'cadastro' }" class="auth-link">Cadastre-se</router-link>
        </span>
      </template>
    </auth-card>
  </q-page>
</template>

<script setup lang="ts">
import AuthCard from 'components/shared/AuthCard.vue';
import { useAutenticacao } from 'composables/useAutenticacao';
import { ref } from 'vue';
import { email as emailValidator, obrigatorio } from 'utils/validators';

const { carregando, login } = useAutenticacao();

const email = ref('');
const senha = ref('');
const mostrarSenha = ref(false);

async function enviar(): Promise<void> {
  await login({ email: email.value.trim(), senha: senha.value });
}
</script>
