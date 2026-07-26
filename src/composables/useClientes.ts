import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import {
  ExportacaoFormato,
  type ExportacaoFormatoValor,
} from 'constants/enums';
import { messageService } from 'services/message.service';
import { clienteService } from 'services/cliente.service';
import type {
  ClienteFormModel,
  ClienteResumoDto,
  ListarClientesParams,
} from 'types/dtos/cliente.dto';
import { baixarArquivo } from 'utils/download';
import { formParaCriarPayload, formParaEditarPayload } from 'utils/mappers/cliente.mapper';
import { formatarDocumento } from 'utils/formatters';
import { ref } from 'vue';

export function useClientes() {
  const clientes = ref<ClienteResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const exportando = ref(false);
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

  async function inativar(clienteId: string, justificativa: string): Promise<boolean> {
    inativando.value = true;

    try {
      await clienteService.inativar(clienteId, justificativa);
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
    const justificativa = await messageService.confirmarComJustificativa({
      titulo: 'Inativar cliente',
      mensagem: `Deseja inativar o cliente ${cliente.nomeRazao}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!justificativa) {
      return false;
    }

    return inativar(cliente.id, justificativa);
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

  async function exportar(
    formato: ExportacaoFormatoValor,
    params?: Omit<ListarClientesParams, 'exportar'>,
  ): Promise<boolean> {
    exportando.value = true;

    try {
      const blob = await clienteService.exportar(formato, params);
      const extensao = formato === ExportacaoFormato.Excel ? 'xlsx' : 'pdf';
      baixarArquivo(blob, `clientes.${extensao}`);
      sucesso('Exportação concluída.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      exportando.value = false;
    }
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
    exportando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
    solicitarAtivacao,
    exportar,
    rotuloDocumento,
  };
}
