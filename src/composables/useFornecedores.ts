import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { fornecedorService } from 'services/fornecedor.service';
import type {
  FornecedorFormModel,
  FornecedorResumoDto,
  ListarFornecedoresParams,
} from 'types/dtos/fornecedor.dto';
import { formParaCriarPayload, formParaEditarPayload } from 'utils/mappers/fornecedor.mapper';
import { formatarDocumento } from 'utils/formatters';
import { ref } from 'vue';

export function useFornecedores() {
  const fornecedores = ref<FornecedorResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
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

  async function criar(form: FornecedorFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await fornecedorService.criar(formParaCriarPayload(form));
      sucesso('Fornecedor cadastrado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
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

  async function inativar(fornecedorId: string): Promise<boolean> {
    inativando.value = true;

    try {
      await fornecedorService.inativar(fornecedorId);
      sucesso('Fornecedor inativado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function solicitarInativacao(fornecedor: FornecedorResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar fornecedor',
      mensagem: `Deseja inativar o fornecedor ${fornecedor.razaoSocial}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    const sucessoInativacao = await inativar(fornecedor.id);
    return sucessoInativacao;
  }

  function rotuloDocumento(fornecedor: FornecedorResumoDto): string {
    return formatarDocumento(fornecedor.tipoPessoa, fornecedor.documento);
  }

  return {
    fornecedores,
    carregando,
    salvando,
    inativando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
    rotuloDocumento,
  };
}
