import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { fornecedorService } from 'services/fornecedor.service';
import type {
  FornecedorDto,
  FornecedorFormModel,
  FornecedorResumoDto,
  ListarFornecedoresParams,
} from 'types/dtos/fornecedor.dto';
import {
  ExportacaoFormato,
  type ExportacaoFormatoValor,
} from 'constants/enums';
import { formParaCriarPayload, formParaEditarPayload } from 'utils/mappers/fornecedor.mapper';
import { baixarArquivo } from 'utils/download';
import { formatarDocumento } from 'utils/formatters';
import { ref } from 'vue';

export function useFornecedores() {
  const fornecedores = ref<FornecedorResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const exportando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarFornecedoresParams): Promise<void> {
    carregando.value = true;

    try {
      fornecedores.value = await fornecedorService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(
    form: FornecedorFormModel,
    opcoes?: { mensagemSucesso?: string },
  ): Promise<FornecedorDto | null> {
    salvando.value = true;

    try {
      const criado = await fornecedorService.criar(formParaCriarPayload(form));
      sucesso(opcoes?.mensagemSucesso ?? 'Fornecedor cadastrado com sucesso.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(fornecedorId: string, form: FornecedorFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await fornecedorService.editar(fornecedorId, formParaEditarPayload(form));
      sucesso('Fornecedor atualizado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(fornecedorId: string, justificativa: string): Promise<boolean> {
    inativando.value = true;

    try {
      await fornecedorService.inativar(fornecedorId, justificativa);
      sucesso('Fornecedor inativado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function ativar(fornecedorId: string): Promise<boolean> {
    ativando.value = true;

    try {
      await fornecedorService.ativar(fornecedorId);
      sucesso('Fornecedor ativado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  async function solicitarInativacao(fornecedor: FornecedorResumoDto): Promise<boolean> {
    const justificativa = await messageService.confirmarDestrutivo({
      titulo: 'Inativar fornecedor',
      mensagem: `Deseja inativar o fornecedor ${fornecedor.razaoSocial}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!justificativa) {
      return false;
    }

    return inativar(fornecedor.id, justificativa);
  }

  async function solicitarAtivacao(fornecedor: FornecedorResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Ativar fornecedor',
      mensagem: `Deseja reativar o fornecedor ${fornecedor.razaoSocial}?`,
      textoConfirmar: 'Ativar',
      icone: 'info',
    });

    return confirmou ? ativar(fornecedor.id) : false;
  }

  async function exportar(
    formato: ExportacaoFormatoValor,
    params?: Omit<ListarFornecedoresParams, 'exportar'>,
  ): Promise<boolean> {
    exportando.value = true;

    try {
      const blob = await fornecedorService.exportar(formato, params);
      const extensao = formato === ExportacaoFormato.Excel ? 'xlsx' : 'pdf';
      baixarArquivo(blob, `fornecedores.${extensao}`);
      sucesso('Exportação concluída.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      exportando.value = false;
    }
  }

  function rotuloDocumento(fornecedor: FornecedorResumoDto): string {
    return formatarDocumento(fornecedor.tipoPessoa, fornecedor.documento);
  }

  return {
    fornecedores,
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
