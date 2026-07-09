import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { produtoService } from 'services/produto.service';
import type { TipoDocumentoProdutoValor } from 'constants/enums';
import type {
  ProdutoDocumentoListaItem,
  ProdutoDocumentoRascunho,
} from 'types/dtos/produto.dto';
import { criarDocumentoRascunho } from 'utils/mappers/produto.mapper';
import { ref } from 'vue';

function ehRascunho(item: ProdutoDocumentoListaItem): item is ProdutoDocumentoRascunho {
  return 'arquivo' in item;
}

export function useProdutoDocumentos(produtoId: () => string | undefined) {
  const documentos = ref<ProdutoDocumentoListaItem[]>([]);
  const enviando = ref(false);
  const removendo = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  function definirDocumentos(lista: ProdutoDocumentoListaItem[]): void {
    documentos.value = lista;
  }

  async function recarregar(): Promise<void> {
    const id = produtoId();
    if (!id) {
      return;
    }

    documentos.value = await produtoService.listarDocumentos(id);
  }

  async function enviar(tipo: TipoDocumentoProdutoValor, arquivo: File): Promise<boolean> {
    enviando.value = true;

    try {
      const id = produtoId();

      if (!id) {
        documentos.value = [...documentos.value, criarDocumentoRascunho(tipo, arquivo)];
        return true;
      }

      await produtoService.adicionarDocumento(id, tipo, arquivo);
      await recarregar();
      sucesso('Documento enviado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      enviando.value = false;
    }
  }

  async function remover(documentoId: string): Promise<boolean> {
    removendo.value = true;

    try {
      const id = produtoId();
      const item = documentos.value.find((doc) => doc.id === documentoId);

      if (!id || (item && ehRascunho(item))) {
        documentos.value = documentos.value.filter((doc) => doc.id !== documentoId);
        return true;
      }

      await produtoService.removerDocumento(id, documentoId);
      documentos.value = documentos.value.filter((doc) => doc.id !== documentoId);
      sucesso('Documento removido com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      removendo.value = false;
    }
  }

  async function solicitarRemocao(documento: ProdutoDocumentoListaItem): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover documento',
      mensagem: `Deseja remover o documento ${documento.nomeOriginal}?`,
      textoConfirmar: 'Remover',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return remover(documento.id);
  }

  return {
    documentos,
    enviando,
    removendo,
    definirDocumentos,
    enviar,
    solicitarRemocao,
  };
}
