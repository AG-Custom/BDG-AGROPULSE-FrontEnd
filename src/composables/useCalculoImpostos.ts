import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { TipoDestinatarioFiscalValor } from 'constants/enums';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type { CalculoImpostosDto } from 'types/dtos/fiscal-gestao.dto';
import { parseMascaraMoedaObrigatorio } from 'utils/formatters';
import { ref } from 'vue';

function toNumber(value: string): number {
  return Number(String(value).replace(',', '.'));
}

export function useCalculoImpostos() {
  const resultado = ref<CalculoImpostosDto | null>(null);
  const calculando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function calcular(params: {
    produtoId: string;
    valor: string;
    quantidade: string;
    ufDestino: string;
    tipoDestinatario: TipoDestinatarioFiscalValor | '';
  }): Promise<boolean> {
    if (!params.tipoDestinatario) {
      erro('Selecione o tipo de destinatário.');
      return false;
    }
    calculando.value = true;
    try {
      resultado.value = await fiscalGestaoService.calcularImpostos({
        itens: [
          {
            produtoId: params.produtoId.trim(),
            valor: parseMascaraMoedaObrigatorio(params.valor),
            quantidade: toNumber(params.quantidade),
          },
        ],
        ufDestino: params.ufDestino.trim().toUpperCase(),
        tipoDestinatario: params.tipoDestinatario,
      });
      sucesso('Impostos calculados.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      resultado.value = null;
      return false;
    } finally {
      calculando.value = false;
    }
  }

  return { resultado, calculando, calcular };
}
