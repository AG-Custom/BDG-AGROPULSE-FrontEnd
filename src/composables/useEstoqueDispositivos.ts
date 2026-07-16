import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { estoqueService } from 'services/estoque.service';
import type { LeituraPesoDto, ProdutoPorCodigoDto } from 'types/dtos/estoque.dto';
import { ref } from 'vue';

export function useEstoqueDispositivos() {
  const buscandoCodigo = ref(false);
  const lendoPeso = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function buscarProdutoPorCodigo(codigo: string): Promise<ProdutoPorCodigoDto | null> {
    const valor = codigo.trim();
    if (!valor) {
      return null;
    }

    buscandoCodigo.value = true;
    try {
      const produto = await estoqueService.obterProdutoPorCodigo(valor);
      sucesso(`Produto ${produto.codigo} selecionado.`);
      return produto;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      buscandoCodigo.value = false;
    }
  }

  async function lerPesoBalanca(dispositivoId?: string): Promise<LeituraPesoDto | null> {
    lendoPeso.value = true;
    try {
      const leitura = await estoqueService.lerPesoBalanca(dispositivoId);
      sucesso('Peso lido da balança.');
      return leitura;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      lendoPeso.value = false;
    }
  }

  return {
    buscandoCodigo,
    lendoPeso,
    buscarProdutoPorCodigo,
    lerPesoBalanca,
  };
}
