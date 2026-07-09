import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { produtoService } from 'services/produto.service';
import type { ProdutoFiscalFormModel } from 'types/dtos/produto.dto';
import { formParaFiscalPayload } from 'utils/mappers/produto.mapper';
import { ref } from 'vue';

export function useProdutoFiscal(produtoId: () => string | undefined) {
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function salvar(form: ProdutoFiscalFormModel): Promise<boolean> {
    const id = produtoId();

    if (!id) {
      return true;
    }

    salvando.value = true;

    try {
      await produtoService.salvarFiscal(id, formParaFiscalPayload(form));
      sucesso('Configuração fiscal salva com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { salvando, salvar };
}
