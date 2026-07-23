import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { tabelaPrecoService } from 'services/tabela-preco.service';
import type { ProdutoResumoDto } from 'types/dtos/produto.dto';
import type { TabelaPrecoItemDto } from 'types/dtos/tabela-preco.dto';
import { computed, ref, watch } from 'vue';

export function useProdutosPorTabelaPreco(
  tabelaPrecoId: () => string | null | undefined,
  produtos: () => readonly ProdutoResumoDto[],
) {
  const itensTabela = ref<TabelaPrecoItemDto[]>([]);
  const carregandoItensTabela = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();
  let requisicaoId = 0;

  const filtrandoPorTabela = computed(() => Boolean(tabelaPrecoId()?.trim()));

  const produtoIdsPermitidos = computed(() => {
    if (!filtrandoPorTabela.value) {
      return null;
    }

    return new Set(itensTabela.value.map((item) => item.produtoId));
  });

  const produtoOpcoes = computed(() => {
    const catalogo = produtos();
    const ids = produtoIdsPermitidos.value;
    const filtrados = ids ? catalogo.filter((produto) => ids.has(produto.id)) : catalogo;

    return filtrados.map((produto) => ({
      label: produto.descricao,
      value: produto.id,
    }));
  });

  function produtoPermitido(produtoId: string): boolean {
    const ids = produtoIdsPermitidos.value;

    if (!ids) {
      return true;
    }

    return ids.has(produtoId);
  }

  async function carregarItensTabela(): Promise<void> {
    const id = tabelaPrecoId()?.trim() ?? '';

    if (!id) {
      itensTabela.value = [];
      carregandoItensTabela.value = false;
      return;
    }

    const atual = ++requisicaoId;
    carregandoItensTabela.value = true;

    try {
      const itens = await tabelaPrecoService.listarItens(id);

      if (atual === requisicaoId) {
        itensTabela.value = itens;
      }
    } catch (e) {
      if (atual === requisicaoId) {
        itensTabela.value = [];
        erro(mensagem(e));
      }
    } finally {
      if (atual === requisicaoId) {
        carregandoItensTabela.value = false;
      }
    }
  }

  watch(
    () => tabelaPrecoId()?.trim() ?? '',
    () => {
      void carregarItensTabela();
    },
    { immediate: true },
  );

  return {
    itensTabela,
    carregandoItensTabela,
    filtrandoPorTabela,
    produtoIdsPermitidos,
    produtoOpcoes,
    produtoPermitido,
    carregarItensTabela,
  };
}
