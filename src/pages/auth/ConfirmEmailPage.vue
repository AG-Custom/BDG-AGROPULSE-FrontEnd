<template>
  <q-page class="auth-page">
    <auth-card subtitulo="Confirmação de e-mail">
      <div v-if="parametrosInvalidos" class="confirmacao-estado">
        <q-icon name="error_outline" size="48px" color="negative" />
        <div class="text-h6">Link inválido</div>
        <p class="text-body-md text-secondary">
          O link de confirmação está incompleto ou expirou. Solicite um novo cadastro ou entre em
          contato com o suporte.
        </p>
        <agro-btn
          color="primary"
          unelevated
          label="Ir para login"
          descricao="Acessar a tela de login"
          :to="{ name: 'login' }"
        />
      </div>

      <div v-else-if="confirmando" class="confirmacao-estado">
        <q-spinner color="primary" size="40px" />
        <div class="text-h6">Confirmando e-mail...</div>
      </div>

      <div v-else-if="emailConfirmado" class="confirmacao-estado">
        <q-icon name="check_circle" size="48px" color="positive" />
        <div class="text-h6">E-mail confirmado</div>
        <p class="text-body-md text-secondary">
          Informe sua senha para continuar e configurar sua empresa no AgroPulse.
        </p>

        <q-form class="auth-form full-width" greedy @submit.prevent="continuar">
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
              <agro-icon-btn
                :name="mostrarSenha ? 'visibility_off' : 'visibility'"
                :descricao="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
                @click="mostrarSenha = !mostrarSenha"
              />
            </template>
          </q-input>

          <agro-btn
            color="primary"
            unelevated
            type="submit"
            class="full-width"
            label="Continuar para configuração"
            descricao="Entrar e iniciar a configuração da empresa"
            :loading="carregando"
          />
        </q-form>
      </div>

      <div v-else-if="confirmacaoFalhou" class="confirmacao-estado">
        <q-icon name="error_outline" size="48px" color="negative" />
        <div class="text-h6">Não foi possível confirmar</div>
        <p class="text-body-md text-secondary">Tente novamente ou entre em contato com o suporte.</p>
        <agro-btn
          color="primary"
          unelevated
          label="Ir para login"
          descricao="Acessar a tela de login"
          :to="{ name: 'login' }"
        />
      </div>
    </auth-card>
  </q-page>
</template>

<script setup lang="ts">
import AuthCard from 'components/shared/AuthCard.vue';
import AgroIconBtn from 'components/ui/AgroIconBtn.vue';
import { useAutenticacao } from 'composables/useAutenticacao';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { obterEmailPendente } from 'utils/pending-email-storage';
import { email as emailValidator, obrigatorio } from 'utils/validators';

const route = useRoute();
const { carregando, confirmar, loginParaOnboarding } = useAutenticacao();

const confirmando = ref(
  typeof route.query.userId === 'string' &&
    typeof route.query.token === 'string' &&
    route.query.userId.length > 0 &&
    route.query.token.length > 0,
);
const emailConfirmado = ref(false);
const confirmacaoFalhou = ref(false);
const email = ref(obterEmailPendente() ?? '');
const senha = ref('');
const mostrarSenha = ref(false);

const userId = computed(() => {
  const valor = route.query.userId;
  return typeof valor === 'string' ? valor : '';
});

const token = computed(() => {
  const valor = route.query.token;
  return typeof valor === 'string' ? valor : '';
});

const parametrosInvalidos = computed(() => !userId.value || !token.value);

async function confirmarConta(): Promise<void> {
  if (parametrosInvalidos.value) {
    return;
  }

  confirmando.value = true;
  confirmacaoFalhou.value = false;

  const sucesso = await confirmar({
    userId: userId.value,
    token: token.value,
  });

  confirmando.value = false;

  if (sucesso) {
    emailConfirmado.value = true;
  } else {
    confirmacaoFalhou.value = true;
  }
}

async function continuar(): Promise<void> {
  await loginParaOnboarding({
    email: email.value.trim(),
    senha: senha.value,
  });
}

onMounted(() => {
  if (!parametrosInvalidos.value) {
    void confirmarConta();
  }
});
</script>

<style scoped>
.confirmacao-estado {
  align-items: center;
  display: grid;
  gap: var(--spacing-4);
  justify-items: center;
  text-align: center;
  width: 100%;
}
</style>
