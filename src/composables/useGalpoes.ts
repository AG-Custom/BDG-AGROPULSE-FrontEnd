import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { galpaoService } from 'services/galpao.service';
import type { GalpaoFormModel, GalpaoResumoDto, ListarGalpoesParams } from 'types/dtos/galpao.dto';
import { formParaSalvarGalpaoPayload } from 'utils/mappers/galpao.mapper';
import { ref } from 'vue';

export function useGalpoes() {
  const galpoes = ref<GalpaoResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const ultimosParams = ref<ListarGalpoesParams | undefined>();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarGalpoesParams): Promise<void> {
    ultimosParams.value = params;
    carregando.value = true;

    try {
      galpoes.value = await galpaoService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: GalpaoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await galpaoService.criar(formParaSalvarGalpaoPayload(form));
      sucesso('Galpão cadastrado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(galpaoId: string, form: GalpaoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await galpaoService.editar(galpaoId, formParaSalvarGalpaoPayload(form));
      sucesso('Galpão atualizado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(galpaoId: string, justificativa: string): Promise<boolean> {
    inativando.value = true;

    try {
      await galpaoService.inativar(galpaoId, justificativa);
      sucesso('Galpão inativado com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function ativar(galpaoId: string): Promise<boolean> {
    ativando.value = true;

    try {
      await galpaoService.ativar(galpaoId);
      sucesso('Galpão ativado com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  async function solicitarInativacao(galpao: GalpaoResumoDto): Promise<boolean> {
    const justificativa = await messageService.confirmarComJustificativa({
      titulo: 'Inativar galpão',
      mensagem: `Deseja inativar o galpão ${galpao.nome}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!justificativa) {
      return false;
    }

    return inativar(galpao.id, justificativa);
  }

  async function solicitarAtivacao(galpao: GalpaoResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Ativar galpão',
      mensagem: `Deseja reativar o galpão ${galpao.nome}?`,
      textoConfirmar: 'Ativar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    return ativar(galpao.id);
  }

  function rotuloGalpao(galpao: GalpaoResumoDto): string {
    return galpao.nome;
  }

  return {
    galpoes,
    carregando,
    salvando,
    inativando,
    ativando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
    solicitarAtivacao,
    rotuloGalpao,
  };
}
