import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { produtoService } from 'services/produto.service';
import type { ProdutoCodigoDto, ProdutoCodigoFormModel } from 'types/dtos/produto.dto';
import {
  codigoFormParaDtoLocal,
  formParaCodigoPayload,
} from 'utils/mappers/produto.mapper';
import { ref } from 'vue';

export function useProdutoCodigos(produtoId: () => string | undefined) {
  const codigos = ref<ProdutoCodigoDto[]>([]);
  const salvando = ref(false);
  const removendo = ref(false);
  const removendoId = ref<string | null>(null);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  function estaPersistido(): boolean {
    return Boolean(produtoId());
  }

  function definirCodigos(lista: ProdutoCodigoDto[]): void {
    codigos.value = Array.isArray(lista) ? [...lista] : [];
  }

  function aplicarPrincipalLocal(form: ProdutoCodigoFormModel, codigoId?: string): void {
    if (!form.principal) {
      return;
    }

    for (const item of codigos.value) {
      if (item.tipo === form.tipo && item.id !== codigoId) {
        item.principal = false;
      }
    }
  }

  async function recarregar(): Promise<void> {
    const id = produtoId();
    if (!id) {
      return;
    }

    codigos.value = await produtoService.listarCodigos(id);
  }

  async function adicionar(form: ProdutoCodigoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      const id = produtoId();

      if (!id) {
        aplicarPrincipalLocal(form);
        codigos.value = [...codigos.value, codigoFormParaDtoLocal(form)];
        return true;
      }

      await produtoService.adicionarCodigo(id, formParaCodigoPayload(form));
      await recarregar();
      sucesso('Código adicionado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(codigoId: string, form: ProdutoCodigoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      const id = produtoId();

      if (!id) {
        aplicarPrincipalLocal(form, codigoId);
        codigos.value = codigos.value.map((item) =>
          item.id === codigoId
            ? {
                ...item,
                tipo: form.tipo,
                valor: form.valor.trim(),
                principal: form.principal,
              }
            : item,
        );
        return true;
      }

      await produtoService.editarCodigo(id, codigoId, formParaCodigoPayload(form));
      await recarregar();
      sucesso('Código atualizado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function remover(codigoId: string): Promise<boolean> {
    removendo.value = true;
    removendoId.value = codigoId;

    try {
      const id = produtoId();

      if (!id) {
        codigos.value = codigos.value.filter((item) => item.id !== codigoId);
        return true;
      }

      await produtoService.removerCodigo(id, codigoId);
      await recarregar();
      sucesso('Código removido com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      removendo.value = false;
      removendoId.value = null;
    }
  }

  async function solicitarRemocao(codigo: ProdutoCodigoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover código',
      mensagem: `Deseja remover o código ${codigo.valor}?`,
      textoConfirmar: 'Remover',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return remover(codigo.id);
  }

  return {
    codigos,
    salvando,
    removendo,
    removendoId,
    estaPersistido,
    definirCodigos,
    adicionar,
    editar,
    solicitarRemocao,
  };
}
