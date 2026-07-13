import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { permissaoGranularService } from 'services/permissao-granular.service';
import type {
  PermissaoGranularDto,
  PermissaoGranularFormModel,
} from 'types/dtos/permissao-granular.dto';
import { ref } from 'vue';

export function usePermissaoGranular() {
  const permissao = ref<PermissaoGranularDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function obter(usuarioId: string): Promise<boolean> {
    carregando.value = true;

    try {
      permissao.value = await permissaoGranularService.obter(usuarioId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function salvar(
    usuarioId: string,
    form: PermissaoGranularFormModel,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      permissao.value = await permissaoGranularService.salvar(usuarioId, form);
      sucesso('Permissões granulares salvas.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    permissao,
    carregando,
    salvando,
    obter,
    salvar,
  };
}
