import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { useAuth } from 'composables/useAuth';
import type { ConfirmEmailPayload, LoginPayload, RegisterPayload } from 'types/dtos/auth.dto';
import type { RegisterResponseDto } from 'types/dtos/auth.dto';
import { salvarEmailPendente } from 'utils/pending-email-storage';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

type DestinoPosLogin = 'dashboard' | 'onboarding' | 'redirect';

export function useAutenticacao() {
  const route = useRoute();
  const router = useRouter();
  const { entrar, cadastrar, confirmarEmail, precisaOnboarding, precisaSelecionarUnidade } = useAuth();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const carregando = ref(false);

  async function login(payload: LoginPayload, destino: DestinoPosLogin = 'dashboard'): Promise<boolean> {
    carregando.value = true;

    try {
      await entrar(payload);

      if (destino === 'redirect' && typeof route.query.redirect === 'string') {
        await router.replace(route.query.redirect);
      } else if (destino === 'onboarding' || precisaOnboarding.value) {
        await router.replace({ name: 'onboarding' });
      } else if (precisaSelecionarUnidade.value) {
        await router.replace({ name: 'selecionar-unidade' });
      } else {
        await router.replace({ name: 'dashboard' });
      }

      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function loginParaOnboarding(payload: LoginPayload): Promise<boolean> {
    return login(payload, 'onboarding');
  }

  async function register(payload: RegisterPayload): Promise<RegisterResponseDto | null> {
    carregando.value = true;

    try {
      const resposta = await cadastrar(payload);
      salvarEmailPendente(payload.email.trim());
      return resposta;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      carregando.value = false;
    }
  }

  async function confirmar(payload: ConfirmEmailPayload): Promise<boolean> {
    carregando.value = true;

    try {
      await confirmarEmail(payload);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  return {
    carregando,
    login,
    loginParaOnboarding,
    register,
    confirmar,
  };
}
