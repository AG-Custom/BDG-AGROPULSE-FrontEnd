import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { clienteService } from 'services/cliente.service';
import type {
  ClienteContatoDto,
  ClienteContatoFormModel,
} from 'types/dtos/cliente.dto';
import { formParaContatoPayload } from 'utils/mappers/cliente.mapper';
import { ref } from 'vue';

export function useClienteContatos(clienteId: () => string) {
  const contatos = ref<ClienteContatoDto[]>([]);
  const salvando = ref(false);
  const removendo = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  function definirContatos(lista: ClienteContatoDto[]): void {
    contatos.value = lista;
  }

  async function recarregar(): Promise<void> {
    contatos.value = await clienteService.listarContatos(clienteId());
  }

  async function adicionar(form: ClienteContatoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await clienteService.adicionarContato(clienteId(), formParaContatoPayload(form));
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

  async function editar(contatoId: string, form: ClienteContatoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await clienteService.editarContato(clienteId(), contatoId, formParaContatoPayload(form));
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
      await clienteService.removerContato(clienteId(), contatoId);
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

  async function solicitarRemocao(contato: ClienteContatoDto): Promise<boolean> {
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
