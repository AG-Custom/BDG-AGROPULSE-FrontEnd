import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { UnidadeStatus } from 'constants/enums';
import { messageService } from 'services/message.service';
import { unidadeService } from 'services/unidade.service';
import type { ListarUnidadesParams, UnidadeDto } from 'types/dtos/unidade.dto';
import {
  formParaEditarPayload,
  unidadeDtoParaForm,
} from 'utils/mappers/unidade.mapper';
import { ref } from 'vue';

export function useUnidades() {
  const unidades = ref<UnidadeDto[]>([]);
  const carregando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const ultimosParams = ref<ListarUnidadesParams | undefined>();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarUnidadesParams): Promise<void> {
    ultimosParams.value = params;
    carregando.value = true;

    try {
      unidades.value = await unidadeService.listar(params);
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
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function ativar(unidadeId: string): Promise<boolean> {
    ativando.value = true;

    try {
      const unidade = await unidadeService.obter(unidadeId);
      const formulario = unidadeDtoParaForm(unidade);
      formulario.status = UnidadeStatus.Ativa;
      await unidadeService.editar(unidadeId, formParaEditarPayload(formulario));
      sucesso('Unidade reativada com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  async function solicitarInativacao(unidade: UnidadeDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar unidade',
      mensagem: `Deseja inativar a unidade ${unidade.nome}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return inativar(unidade.id);
  }

  async function solicitarAtivacao(unidade: UnidadeDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Reativar unidade',
      mensagem: `Deseja reativar a unidade ${unidade.nome}?`,
      textoConfirmar: 'Reativar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    return ativar(unidade.id);
  }

  return {
    unidades,
    carregando,
    inativando,
    ativando,
    carregar,
    solicitarInativacao,
    solicitarAtivacao,
  };
}
