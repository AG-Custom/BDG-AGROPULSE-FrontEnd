import { useAuth } from 'composables/useAuth';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { produtoService } from 'services/produto.service';
import type {
  ListarProdutosParams,
  ProdutoComplementosFormModel,
  ProdutoFormModel,
  ProdutoResumoDto,
} from 'types/dtos/produto.dto';
import {
  conversaoDtoParaForm,
  fiscalFormTemDados,
  formParaConversaoPayload,
  formParaCriarPayload,
  formParaEditarPayload,
  formParaFiscalPayload,
  formParaLimitePayload,
} from 'utils/mappers/produto.mapper';
import { ref } from 'vue';

export function useProdutos() {
  const produtos = ref<ProdutoResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const ultimosParams = ref<ListarProdutosParams | undefined>();
  const { unidadeId } = useAuth();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarProdutosParams): Promise<void> {
    ultimosParams.value = params;
    carregando.value = true;

    try {
      produtos.value = await produtoService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function persistirComplementos(
    produtoId: string,
    complementos: ProdutoComplementosFormModel,
  ): Promise<boolean> {
    if (fiscalFormTemDados(complementos.fiscal)) {
      await produtoService.salvarFiscal(produtoId, formParaFiscalPayload(complementos.fiscal));
    }

    for (const codigo of complementos.codigos) {
      await produtoService.adicionarCodigo(produtoId, {
        tipo: codigo.tipo,
        valor: codigo.valor.trim(),
        principal: codigo.principal,
      });
    }

    for (const documento of complementos.documentos) {
      if (!('arquivo' in documento)) {
        continue;
      }

      await produtoService.adicionarDocumento(produtoId, documento.tipo, documento.arquivo);
    }

    if (complementos.limites.length > 0) {
      const unidadeAtual = unidadeId.value;

      if (!unidadeAtual) {
        erro('Selecione uma unidade operacional para salvar os limites de estoque.');
        return false;
      }

      await produtoService.sincronizarLimitesEstoque(produtoId, {
        limites: complementos.limites.map((limite) =>
          formParaLimitePayload({
            ...limite,
            unidadeId: limite.unidadeId ?? unidadeAtual,
          }),
        ),
      });
    }

    for (const conversao of complementos.conversoes) {
      await produtoService.adicionarConversao(
        produtoId,
        formParaConversaoPayload(conversaoDtoParaForm(conversao)),
      );
    }

    return true;
  }

  async function criar(
    form: ProdutoFormModel,
    complementos?: ProdutoComplementosFormModel,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      const produto = await produtoService.criar(formParaCriarPayload(form));

      if (complementos) {
        const complementosOk = await persistirComplementos(produto.id, complementos);

        if (!complementosOk) {
          return false;
        }
      }

      sucesso('Produto cadastrado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(produtoId: string, form: ProdutoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await produtoService.editar(produtoId, formParaEditarPayload(form));
      sucesso('Produto atualizado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(produtoId: string): Promise<boolean> {
    inativando.value = true;

    try {
      await produtoService.inativar(produtoId);
      sucesso('Produto inativado com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function ativar(produtoId: string): Promise<boolean> {
    ativando.value = true;

    try {
      await produtoService.ativar(produtoId);
      sucesso('Produto ativado com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  async function solicitarInativacao(produto: ProdutoResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar produto',
      mensagem: `Deseja inativar o produto ${produto.descricao}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return inativar(produto.id);
  }

  async function solicitarAtivacao(produto: ProdutoResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Ativar produto',
      mensagem: `Deseja reativar o produto ${produto.descricao}?`,
      textoConfirmar: 'Ativar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    return ativar(produto.id);
  }

  return {
    produtos,
    carregando,
    salvando,
    inativando,
    ativando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
    solicitarAtivacao,
  };
}
