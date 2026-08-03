import { useAuth } from 'composables/useAuth';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { storeToRefs } from 'pinia';
import { usePlataformaStore } from 'stores/plataforma.store';
import type { CriarEmpresaPlataformaPayload } from 'types/dtos/plataforma.dto';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function usePlataforma() {
  const store = usePlataformaStore();
  const router = useRouter();
  const { selecionarEmpresa, precisaSelecionarUnidade } = useAuth();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const { empresas, carregando } = storeToRefs(store);
  const salvando = ref(false);
  const acessandoId = ref<string | null>(null);

  async function carregar(): Promise<void> {
    try {
      await store.listarEmpresas();
    } catch (e) {
      erro(mensagem(e));
    }
  }

  async function criar(payload: CriarEmpresaPlataformaPayload): Promise<boolean> {
    salvando.value = true;

    try {
      const resposta = await store.criarEmpresa(payload);
      sucesso(resposta.message);
      await router.replace({ name: 'plataforma' });
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function acessar(empresaId: string): Promise<boolean> {
    acessandoId.value = empresaId;

    try {
      await selecionarEmpresa(empresaId);

      if (precisaSelecionarUnidade.value) {
        await router.replace({ name: 'selecionar-unidade' });
      } else {
        await router.replace({ name: 'dashboard' });
      }

      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      acessandoId.value = null;
    }
  }

  return {
    empresas,
    carregando,
    salvando,
    acessandoId,
    carregar,
    criar,
    acessar,
  };
}
