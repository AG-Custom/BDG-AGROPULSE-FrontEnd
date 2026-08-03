import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { useAuth } from 'composables/useAuth';
import type {
  ConfirmEmailPayload,
  DefinirSenhaPrimeiroAcessoPayload,
  LoginPayload,
} from 'types/dtos/auth.dto';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

type DestinoPosLogin = 'dashboard' | 'redirect';

export function useAutenticacao() {
  const route = useRoute();
  const router = useRouter();
  const { entrar, confirmarEmail, definirSenhaPrimeiroAcesso: definirSenhaStore, isSuperHost, precisaSelecionarUnidade } =
    useAuth();
  const { erro, sucesso } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const carregando = ref(false);

  async function login(payload: LoginPayload, destino: DestinoPosLogin = 'dashboard'): Promise<boolean> {
    carregando.value = true;

    try {
      await entrar(payload);

      if (isSuperHost.value) {
        await router.replace({ name: 'plataforma' });
      } else if (destino === 'redirect' && typeof route.query.redirect === 'string') {
        await router.replace(route.query.redirect);
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

  async function definirSenhaPrimeiroAcesso(payload: DefinirSenhaPrimeiroAcessoPayload): Promise<boolean> {
    carregando.value = true;

    try {
      await definirSenhaStore(payload);
      sucesso('Senha definida com sucesso. Faça login para continuar.');
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
    confirmar,
    definirSenhaPrimeiroAcesso,
  };
}
