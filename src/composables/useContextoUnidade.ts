import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { useAuth } from 'composables/useAuth';
import { messageService } from 'services/message.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useContextoUnidade() {
  const router = useRouter();
  const { selecionarUnidade, listarUnidades } = useAuth();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const carregando = ref(false);
  const unidadeSelecionandoId = ref<string | null>(null);

  async function selecionarUnidadeInicial(unidadeId: string): Promise<boolean> {
    carregando.value = true;
    unidadeSelecionandoId.value = unidadeId;

    try {
      await selecionarUnidade(unidadeId);
      await router.replace({ name: 'dashboard' });
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
      unidadeSelecionandoId.value = null;
    }
  }

  async function trocarUnidade(unidadeId: string, nomeUnidade: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Trocar unidade',
      mensagem: `Deseja operar em ${nomeUnidade}? Os dados exibidos serão filtrados por esta unidade.`,
      textoConfirmar: 'Trocar',
      icone: 'question',
    });

    if (!confirmou) {
      return false;
    }

    carregando.value = true;

    try {
      await selecionarUnidade(unidadeId);
      sucesso('Unidade alterada com sucesso.');
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
    unidadeSelecionandoId,
    listarUnidades,
    selecionarUnidadeInicial,
    trocarUnidade,
  };
}
