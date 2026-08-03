<template>
  <q-page class="auth-page">
    <auth-card subtitulo="Primeiro acesso">
      <div v-if="parametrosInvalidos" class="primeiro-acesso-estado">
        <q-icon name="error_outline" size="48px" color="negative" />
        <div class="text-h6">Link inválido</div>
        <p class="text-body-md text-secondary">
          O link de primeiro acesso está incompleto ou expirou. Solicite um novo convite ao
          administrador da plataforma.
        </p>
        <agro-btn
          color="primary"
          unelevated
          label="Ir para login"
          descricao="Acessar a tela de login"
          :to="{ name: 'login' }"
        />
      </div>

      <div v-else-if="concluido" class="primeiro-acesso-estado">
        <q-icon name="check_circle" size="48px" color="positive" />
        <div class="text-h6">Senha definida</div>
        <p class="text-body-md text-secondary">
          Sua conta está pronta. Entre com o e-mail e a senha que você acabou de criar.
        </p>
        <agro-btn
          color="primary"
          unelevated
          label="Ir para login"
          descricao="Acessar a tela de login"
          :to="{ name: 'login' }"
        />
      </div>

      <q-form v-else class="auth-form" greedy @submit.prevent="enviar">
        <p class="text-body-md text-secondary">
          Defina sua senha para acessar o AgroPulse pela primeira vez.
        </p>

        <q-input
          v-model="senha"
          outlined
          label="Nova senha"
          class="field-required"
          :type="mostrarSenha ? 'text' : 'password'"
          autocomplete="new-password"
          :disable="carregando"
          aria-required="true"
          :rules="[obrigatorio, senhaForte]"
        >
          <template #append>
            <agro-icon-btn
              :name="mostrarSenha ? 'visibility_off' : 'visibility'"
              :descricao="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </q-input>

        <q-input
          v-model="confirmarSenha"
          outlined
          label="Confirmar senha"
          class="field-required"
          :type="mostrarConfirmar ? 'text' : 'password'"
          autocomplete="new-password"
          :disable="carregando"
          aria-required="true"
          :rules="[obrigatorio, senhasIguais]"
        >
          <template #append>
            <agro-icon-btn
              :name="mostrarConfirmar ? 'visibility_off' : 'visibility'"
              :descricao="mostrarConfirmar ? 'Ocultar senha' : 'Mostrar senha'"
              @click="mostrarConfirmar = !mostrarConfirmar"
            />
          </template>
        </q-input>

        <agro-btn
          color="primary"
          unelevated
          type="submit"
          class="full-width"
          label="Definir senha"
          descricao="Concluir primeiro acesso e definir senha"
          :loading="carregando"
        />
      </q-form>
    </auth-card>
  </q-page>
</template>

<script setup lang="ts">
import AuthCard from 'components/shared/AuthCard.vue';
import AgroIconBtn from 'components/ui/AgroIconBtn.vue';
import { useAutenticacao } from 'composables/useAutenticacao';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { obrigatorio } from 'utils/validators';

const route = useRoute();
const { carregando, definirSenhaPrimeiroAcesso } = useAutenticacao();

const senha = ref('');
const confirmarSenha = ref('');
const mostrarSenha = ref(false);
const mostrarConfirmar = ref(false);
const concluido = ref(false);

const userId = computed(() => {
  const valor = route.query.userId;
  return typeof valor === 'string' ? valor : '';
});

const token = computed(() => {
  const valor = route.query.token;
  return typeof valor === 'string' ? valor : '';
});

const parametrosInvalidos = computed(() => !userId.value || !token.value);

function senhaForte(valor: string): true | string {
  if (valor.length < 8) {
    return 'Mínimo de 8 caracteres';
  }

  if (!/[A-Z]/.test(valor) || !/[a-z]/.test(valor) || !/[0-9]/.test(valor)) {
    return 'Use maiúscula, minúscula e número';
  }

  return true;
}

function senhasIguais(valor: string): true | string {
  return valor === senha.value ? true : 'As senhas não coincidem';
}

async function enviar(): Promise<void> {
  if (parametrosInvalidos.value) {
    return;
  }

  const sucesso = await definirSenhaPrimeiroAcesso({
    userId: userId.value,
    token: token.value,
    senha: senha.value,
  });

  if (sucesso) {
    concluido.value = true;
  }
}
</script>

<style scoped>
.primeiro-acesso-estado {
  align-items: center;
  display: grid;
  gap: var(--spacing-4);
  justify-items: center;
  text-align: center;
  width: 100%;
}
</style>
