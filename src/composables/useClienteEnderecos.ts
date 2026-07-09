import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { clienteService } from 'services/cliente.service';
import type {
  ClienteEnderecoDto,
  ClienteEnderecoFormModel,
} from 'types/dtos/cliente.dto';
import { formParaEnderecoPayload } from 'utils/mappers/cliente.mapper';
import { ref } from 'vue';

export function useClienteEnderecos(clienteId: () => string) {
  const enderecos = ref<ClienteEnderecoDto[]>([]);
  const salvando = ref(false);
  const removendo = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  function definirEnderecos(lista: ClienteEnderecoDto[]): void {
    enderecos.value = lista;
  }

  async function recarregar(): Promise<void> {
    enderecos.value = await clienteService.listarEnderecos(clienteId());
  }

  async function adicionar(form: ClienteEnderecoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await clienteService.adicionarEndereco(clienteId(), formParaEnderecoPayload(form));
      await recarregar();
      sucesso('Endereço adicionado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(enderecoId: string, form: ClienteEnderecoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await clienteService.editarEndereco(
        clienteId(),
        enderecoId,
        formParaEnderecoPayload(form),
      );
      await recarregar();
      sucesso('Endereço atualizado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function remover(enderecoId: string): Promise<boolean> {
    removendo.value = true;

    try {
      await clienteService.removerEndereco(clienteId(), enderecoId);
      enderecos.value = enderecos.value.filter((item) => item.id !== enderecoId);
      sucesso('Endereço removido com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      removendo.value = false;
    }
  }

  async function solicitarRemocao(endereco: ClienteEnderecoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover endereço',
      mensagem: `Deseja remover o endereço em ${endereco.endereco.cidade}?`,
      textoConfirmar: 'Remover',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return remover(endereco.id);
  }

  return {
    enderecos,
    salvando,
    removendo,
    definirEnderecos,
    adicionar,
    editar,
    solicitarRemocao,
  };
}
