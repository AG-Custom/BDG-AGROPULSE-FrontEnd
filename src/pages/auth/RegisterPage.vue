<template>
  <q-page class="auth-page">
    <auth-card subtitulo="Crie sua conta no AgroPulse">
      <q-banner v-if="cadastroEnviado" rounded class="register-banner">
        {{ mensagemCadastro }}
      </q-banner>

      <q-form v-else class="auth-form" greedy @submit.prevent="enviar">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="nome"
              outlined
              label="Nome"
              class="field-required"
              autocomplete="given-name"
              :disable="carregando"
              aria-required="true"
              :rules="[obrigatorio]"
            />
          </div>

          <div class="col-12 col-sm-6">
            <q-input
              v-model="sobrenome"
              outlined
              label="Sobrenome"
              class="field-required"
              autocomplete="family-name"
              :disable="carregando"
              aria-required="true"
              :rules="[obrigatorio]"
            />
          </div>
        </div>

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
          autocomplete="new-password"
          :disable="carregando"
          aria-required="true"
          hint="Mín. 8 caracteres, maiúscula, minúscula e número"
          :rules="[obrigatorio, senhaContrato]"
        >
          <template #append>
            <q-icon
              :name="mostrarSenha ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </q-input>

        <q-input
          v-model="confirmarSenhaValor"
          outlined
          label="Confirmar senha"
          class="field-required"
          :type="mostrarConfirmarSenha ? 'text' : 'password'"
          autocomplete="new-password"
          :disable="carregando"
          aria-required="true"
          :rules="[obrigatorio, confirmarSenhaRule]"
        >
          <template #append>
            <q-icon
              :name="mostrarConfirmarSenha ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="mostrarConfirmarSenha = !mostrarConfirmarSenha"
            />
          </template>
        </q-input>

        <q-btn
          color="primary"
          unelevated
          type="submit"
          class="full-width"
          label="Cadastrar"
          :loading="carregando"
        />
      </q-form>

      <template #footer>
        <span class="text-body-md text-secondary">
          Já possui conta?
          <router-link :to="{ name: 'login' }" class="auth-link">Entrar</router-link>
        </span>
      </template>
    </auth-card>
  </q-page>
</template>

<script setup lang="ts">
import AuthCard from 'components/shared/AuthCard.vue';
import { useAutenticacao } from 'composables/useAutenticacao';
import { computed, ref } from 'vue';
import {
  confirmarSenha,
  email as emailValidator,
  obrigatorio,
  senhaContrato,
} from 'utils/validators';

const { carregando, register } = useAutenticacao();

const nome = ref('');
const sobrenome = ref('');
const email = ref('');
const senha = ref('');
const confirmarSenhaValor = ref('');
const mostrarSenha = ref(false);
const mostrarConfirmarSenha = ref(false);
const cadastroEnviado = ref(false);
const mensagemCadastro = ref('');

const confirmarSenhaRule = computed(() => confirmarSenha(senha.value));

async function enviar(): Promise<void> {
  const resposta = await register({
    nome: nome.value.trim(),
    sobrenome: sobrenome.value.trim(),
    email: email.value.trim(),
    senha: senha.value,
    confirmarSenha: confirmarSenhaValor.value,
  });

  if (resposta) {
    mensagemCadastro.value = resposta.message;
    cadastroEnviado.value = true;
  }
}
</script>

<style scoped>
.register-banner {
  background: var(--color-info-50);
  color: var(--color-info-700);
}
</style>
