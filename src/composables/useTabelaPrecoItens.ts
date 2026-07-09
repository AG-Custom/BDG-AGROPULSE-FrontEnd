import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { tabelaPrecoService } from 'services/tabela-preco.service';
import type {
  TabelaPrecoItemDto,
  TabelaPrecoItemEdicaoFormModel,
  TabelaPrecoItemFormModel,
} from 'types/dtos/tabela-preco.dto';
import {
  formParaEditarItemPayload,
  formParaItemPayload,
} from 'utils/mappers/tabela-preco.mapper';
import { ref } from 'vue';

export function useTabelaPrecoItens(tabelaPrecoId: () => string) {
  const itens = ref<TabelaPrecoItemDto[]>([]);
  const salvando = ref(false);
  const removendo = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  function definirItens(lista: TabelaPrecoItemDto[]): void {
    itens.value = lista;
  }

  async function recarregar(): Promise<void> {
    itens.value = await tabelaPrecoService.listarItens(tabelaPrecoId());
  }

  async function adicionar(form: TabelaPrecoItemFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await tabelaPrecoService.adicionarItem(tabelaPrecoId(), formParaItemPayload(form));
      await recarregar();
      sucesso('Item adicionado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(itemId: string, form: TabelaPrecoItemEdicaoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await tabelaPrecoService.editarItem(
        tabelaPrecoId(),
        itemId,
        formParaEditarItemPayload(form),
      );
      await recarregar();
      sucesso('Item atualizado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function remover(itemId: string): Promise<boolean> {
    removendo.value = true;

    try {
      await tabelaPrecoService.removerItem(tabelaPrecoId(), itemId);
      itens.value = itens.value.filter((item) => item.id !== itemId);
      sucesso('Item removido com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      removendo.value = false;
    }
  }

  async function solicitarRemocao(item: TabelaPrecoItemDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover item',
      mensagem: 'Deseja remover este item da tabela de preço?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return remover(item.id);
  }

  return {
    itens,
    salvando,
    removendo,
    definirItens,
    adicionar,
    editar,
    solicitarRemocao,
  };
}
