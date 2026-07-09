import { useAuth } from 'composables/useAuth';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { produtoService } from 'services/produto.service';
import type { ProdutoLimiteEstoqueFormModel } from 'types/dtos/produto.dto';
import { formParaLimitePayload } from 'utils/mappers/produto.mapper';
import { ref } from 'vue';

export function useProdutoLimitesEstoque(produtoId: () => string | undefined) {
  const salvando = ref(false);
  const { unidadeId } = useAuth();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function sincronizar(limites: ProdutoLimiteEstoqueFormModel[]): Promise<boolean> {
    const id = produtoId();

    if (!id) {
      return true;
    }

    if (!unidadeId.value) {
      erro('Selecione uma unidade operacional para salvar os limites de estoque.');
      return false;
    }

    const unidadeAtual = unidadeId.value;

    salvando.value = true;

    try {
      await produtoService.sincronizarLimitesEstoque(id, {
        limites: limites.map((limite) =>
          formParaLimitePayload({
            ...limite,
            unidadeId: limite.unidadeId ?? unidadeAtual,
          }),
        ),
      });
      sucesso('Limites de estoque salvos com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { salvando, sincronizar };
}
