import { useProdutos } from 'composables/useProdutos';
import type { ProdutoDto, ProdutoResumoDto } from 'types/dtos/produto.dto';
import { produtoService } from 'services/produto.service';
import { computed, onMounted, ref } from 'vue';

export function useProdutoOpcoesEstoque() {
  const { produtos, carregando, carregar } = useProdutos();
  const detalhes = ref<Record<string, ProdutoDto>>({});
  const carregandoDetalhe = ref(false);

  const produtoOpcoes = computed(() =>
    produtos.value.map((produto) => ({
      label: `${produto.descricao}`,
      value: produto.id,
    })),
  );

  function rotuloProduto(produtoId: string): string {
    const produto = produtos.value.find((item) => item.id === produtoId);
    return produto ? `${produto.descricao}` : produtoId;
  }

  function obterResumo(produtoId: string): ProdutoResumoDto | undefined {
    return produtos.value.find((item) => item.id === produtoId);
  }

  async function carregarDetalhe(produtoId: string): Promise<ProdutoDto | null> {
    if (!produtoId) {
      return null;
    }

    if (detalhes.value[produtoId]) {
      return detalhes.value[produtoId];
    }

    carregandoDetalhe.value = true;

    try {
      const produto = await produtoService.obter(produtoId);
      detalhes.value = { ...detalhes.value, [produtoId]: produto };
      return produto;
    } catch {
      return null;
    } finally {
      carregandoDetalhe.value = false;
    }
  }

  onMounted(() => {
    void carregar({ ativo: true });
  });

  return {
    produtos,
    produtoOpcoes,
    carregando,
    carregandoDetalhe,
    rotuloProduto,
    obterResumo,
    carregarDetalhe,
    carregar: () => carregar({ ativo: true }),
    detalhes,
  };
}
