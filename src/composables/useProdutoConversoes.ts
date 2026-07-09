import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { produtoService } from 'services/produto.service';
import type {
  ProdutoConversaoEdicaoFormModel,
  ProdutoConversaoFormModel,
  ProdutoConversaoUnidadeDto,
} from 'types/dtos/produto.dto';
import {
  conversaoFormParaDtoLocal,
  formParaConversaoPayload,
  formParaEditarConversaoPayload,
} from 'utils/mappers/produto.mapper';
import { ref } from 'vue';

export function useProdutoConversoes(produtoId: () => string | undefined) {
  const conversoes = ref<ProdutoConversaoUnidadeDto[]>([]);
  const salvando = ref(false);
  const removendo = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  function definirConversoes(lista: ProdutoConversaoUnidadeDto[]): void {
    conversoes.value = lista;
  }

  async function recarregar(): Promise<void> {
    const id = produtoId();
    if (!id) {
      return;
    }

    conversoes.value = await produtoService.listarConversoes(id);
  }

  async function adicionar(form: ProdutoConversaoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      const id = produtoId();

      if (!id) {
        conversoes.value = [...conversoes.value, conversaoFormParaDtoLocal(form)];
        return true;
      }

      await produtoService.adicionarConversao(id, formParaConversaoPayload(form));
      await recarregar();
      sucesso('Conversão adicionada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(
    conversaoId: string,
    form: ProdutoConversaoEdicaoFormModel,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      const id = produtoId();

      if (!id) {
        const fator = Number(form.fatorConversao.replace(',', '.'));
        conversoes.value = conversoes.value.map((item) =>
          item.id === conversaoId ? { ...item, fatorConversao: fator } : item,
        );
        return true;
      }

      await produtoService.editarConversao(
        id,
        conversaoId,
        formParaEditarConversaoPayload(form),
      );
      await recarregar();
      sucesso('Conversão atualizada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function remover(conversaoId: string): Promise<boolean> {
    removendo.value = true;

    try {
      const id = produtoId();

      if (!id) {
        conversoes.value = conversoes.value.filter((item) => item.id !== conversaoId);
        return true;
      }

      await produtoService.removerConversao(id, conversaoId);
      conversoes.value = conversoes.value.filter((item) => item.id !== conversaoId);
      sucesso('Conversão removida com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      removendo.value = false;
    }
  }

  async function solicitarRemocao(conversao: ProdutoConversaoUnidadeDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover conversão',
      mensagem: 'Deseja remover esta conversão de unidade?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return remover(conversao.id);
  }

  return {
    conversoes,
    salvando,
    removendo,
    definirConversoes,
    adicionar,
    editar,
    solicitarRemocao,
  };
}
