import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import {
  CargoColaborador,
  CargoColaboradorOpcoes,
  ColaboradorStatus,
  ColaboradorStatusOpcoes,
} from 'constants/enums';
import { messageService } from 'services/message.service';
import { colaboradorService } from 'services/colaborador.service';
import type {
  ColaboradorFormModel,
  ColaboradorResumoDto,
  ListarColaboradoresParams,
} from 'types/dtos/colaborador.dto';
import type { CargoColaboradorValor, ColaboradorStatusValor } from 'constants/enums';
import { formParaSalvarPayload } from 'utils/mappers/colaborador.mapper';
import { formatarCpf } from 'utils/formatters';
import { ref } from 'vue';

export function useColaboradores() {
  const colaboradores = ref<ColaboradorResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const ultimosParams = ref<ListarColaboradoresParams | undefined>();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarColaboradoresParams): Promise<void> {
    ultimosParams.value = params;
    carregando.value = true;

    try {
      colaboradores.value = await colaboradorService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: ColaboradorFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await colaboradorService.criar(formParaSalvarPayload(form));
      sucesso('Colaborador cadastrado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(colaboradorId: string, form: ColaboradorFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await colaboradorService.editar(colaboradorId, formParaSalvarPayload(form));
      sucesso('Colaborador atualizado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(colaboradorId: string, justificativa: string): Promise<boolean> {
    inativando.value = true;

    try {
      await colaboradorService.inativar(colaboradorId, justificativa);
      sucesso('Colaborador inativado com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function ativar(colaboradorId: string): Promise<boolean> {
    ativando.value = true;

    try {
      await colaboradorService.ativar(colaboradorId);
      sucesso('Colaborador ativado com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  async function solicitarInativacao(colaborador: ColaboradorResumoDto): Promise<boolean> {
    const mensagemConfirmacao = colaborador.usuarioId
      ? `Deseja inativar o colaborador ${colaborador.nomeCompleto}? O usuário vinculado também será inativado e suas sessões encerradas.`
      : `Deseja inativar o colaborador ${colaborador.nomeCompleto}?`;

    const justificativa = await messageService.confirmarComJustificativa({
      titulo: 'Inativar colaborador',
      mensagem: mensagemConfirmacao,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!justificativa) {
      return false;
    }

    return inativar(colaborador.id, justificativa);
  }

  async function solicitarAtivacao(colaborador: ColaboradorResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Ativar colaborador',
      mensagem: `Deseja reativar o colaborador ${colaborador.nomeCompleto}?`,
      textoConfirmar: 'Ativar',
      icone: 'info',
    });

    return confirmou ? ativar(colaborador.id) : false;
  }

  function nomeCompleto(colaborador: Pick<ColaboradorResumoDto, 'nomeCompleto'>): string {
    return colaborador.nomeCompleto;
  }

  function rotuloCargo(colaborador: Pick<ColaboradorResumoDto, 'cargo' | 'cargoPersonalizado'>): string {
    if (colaborador.cargo === CargoColaborador.Personalizado && colaborador.cargoPersonalizado) {
      return colaborador.cargoPersonalizado;
    }

    return CargoColaboradorOpcoes.find((opcao) => opcao.value === colaborador.cargo)?.label ?? colaborador.cargo;
  }

  function rotuloCpf(cpf: string): string {
    return formatarCpf(cpf);
  }

  function rotuloStatus(status: ColaboradorStatusValor): string {
    return ColaboradorStatusOpcoes.find((opcao) => opcao.value === status)?.label ?? status;
  }

  function variantStatus(status: ColaboradorStatusValor): 'success' | 'default' {
    return status === ColaboradorStatus.Ativo ? 'success' : 'default';
  }

  return {
    colaboradores,
    carregando,
    salvando,
    inativando,
    ativando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
    solicitarAtivacao,
    nomeCompleto,
    rotuloCargo,
    rotuloCpf,
    rotuloStatus,
    variantStatus,
  };
}
