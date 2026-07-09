import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { clienteService } from 'services/cliente.service';
import type {
  ClienteFormModel,
  ClienteResumoDto,
  ListarClientesParams,
} from 'types/dtos/cliente.dto';
import { formParaCriarPayload, formParaEditarPayload } from 'utils/mappers/cliente.mapper';
import { formatarDocumento } from 'utils/formatters';
import { ref } from 'vue';

export function useClientes() {
  const clientes = ref<ClienteResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarClientesParams): Promise<void> {
    carregando.value = true;

    try {
      clientes.value = await clienteService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: ClienteFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await clienteService.criar(formParaCriarPayload(form));
      sucesso('Cliente cadastrado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(clienteId: string, form: ClienteFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await clienteService.editar(clienteId, formParaEditarPayload(form));
      sucesso('Cliente atualizado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(clienteId: string): Promise<boolean> {
    inativando.value = true;

    try {
      await clienteService.inativar(clienteId);
      sucesso('Cliente inativado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function ativar(clienteId: string): Promise<boolean> {
    ativando.value = true;

    try {
      await clienteService.ativar(clienteId);
      sucesso('Cliente ativado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  async function solicitarInativacao(cliente: ClienteResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar cliente',
      mensagem: `Deseja inativar o cliente ${cliente.nomeRazao}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return inativar(cliente.id);
  }

  async function solicitarAtivacao(cliente: ClienteResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Ativar cliente',
      mensagem: `Deseja reativar o cliente ${cliente.nomeRazao}?`,
      textoConfirmar: 'Ativar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    return ativar(cliente.id);
  }

  function rotuloDocumento(cliente: ClienteResumoDto): string {
    return formatarDocumento(cliente.tipoPessoa, cliente.documento);
  }

  return {
    clientes,
    carregando,
    salvando,
    inativando,
    ativando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
    solicitarAtivacao,
    rotuloDocumento,
  };
}
