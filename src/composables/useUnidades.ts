import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { unidadeService } from 'services/unidade.service';
import type { UnidadeDto } from 'types/dtos/unidade.dto';
import { ref } from 'vue';

export function useUnidades() {
  const unidades = ref<UnidadeDto[]>([]);
  const carregando = ref(false);
  const inativando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      unidades.value = await unidadeService.listar();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function inativar(unidadeId: string): Promise<boolean> {
    inativando.value = true;

    try {
      await unidadeService.inativar(unidadeId);
      sucesso('Unidade inativada com sucesso.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  return {
    unidades,
    carregando,
    inativando,
    carregar,
    inativar,
  };
}
