import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { fornecedorService } from 'services/fornecedor.service';
import type {
  ContatoFornecedorDto,
  ContatoFornecedorFormModel,
} from 'types/dtos/fornecedor.dto';
import { formParaContatoPayload } from 'utils/mappers/fornecedor.mapper';
import { ref } from 'vue';

export function useFornecedorContatos(fornecedorId: () => string) {
  const contatos = ref<ContatoFornecedorDto[]>([]);
  const salvando = ref(false);
  const removendo = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  function definirContatos(lista: ContatoFornecedorDto[]): void {
    contatos.value = lista;
  }

  async function recarregar(): Promise<void> {
    const fornecedor = await fornecedorService.obter(fornecedorId());
    contatos.value = fornecedor.contatos;
  }

  async function adicionar(form: ContatoFornecedorFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await fornecedorService.adicionarContato(
        fornecedorId(),
        formParaContatoPayload(form),
      );
      await recarregar();
      sucesso('Contato adicionado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(contatoId: string, form: ContatoFornecedorFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await fornecedorService.editarContato(
        fornecedorId(),
        contatoId,
        formParaContatoPayload(form),
      );
      await recarregar();
      sucesso('Contato atualizado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function remover(contatoId: string): Promise<boolean> {
    removendo.value = true;

    try {
      await fornecedorService.removerContato(fornecedorId(), contatoId);
      contatos.value = contatos.value.filter((item) => item.id !== contatoId);
      sucesso('Contato removido com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      removendo.value = false;
    }
  }

  async function solicitarRemocao(contato: ContatoFornecedorDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover contato',
      mensagem: `Deseja remover o contato ${contato.nome}?`,
      textoConfirmar: 'Remover',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return remover(contato.id);
  }

  return {
    contatos,
    salvando,
    removendo,
    definirContatos,
    adicionar,
    editar,
    solicitarRemocao,
  };
}
