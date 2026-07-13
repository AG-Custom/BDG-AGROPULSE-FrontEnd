import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { orcamentoService } from 'services/orcamento.service';
import type { ConverterOrcamentoPayload, OrcamentoDto } from 'types/dtos/orcamento.dto';
import type { PedidoVendaDto } from 'types/dtos/pedido-venda.dto';
import { ref } from 'vue';

export function useOrcamento() {
  const orcamento = ref<OrcamentoDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function obter(orcamentoId: string): Promise<boolean> {
    carregando.value = true;

    try {
      orcamento.value = await orcamentoService.obter(orcamentoId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function cancelar(orcamentoId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar orçamento',
      mensagem: 'Deseja cancelar este orçamento?',
      textoConfirmar: 'Cancelar orçamento',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await orcamentoService.cancelar(orcamentoId);
      sucesso('Orçamento cancelado.');
      orcamento.value = await orcamentoService.obter(orcamentoId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function converter(
    orcamentoId: string,
    payload: ConverterOrcamentoPayload,
  ): Promise<PedidoVendaDto | null> {
    const confirmou = await messageService.confirmar({
      titulo: 'Converter orçamento',
      mensagem: 'O orçamento será convertido em pedido de venda. Deseja continuar?',
      textoConfirmar: 'Converter',
      icone: 'info',
    });

    if (!confirmou) {
      return null;
    }

    salvando.value = true;

    try {
      const pedido = await orcamentoService.converter(orcamentoId, payload);
      sucesso('Orçamento convertido em pedido de venda.');
      orcamento.value = await orcamentoService.obter(orcamentoId);
      return pedido;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  return {
    orcamento,
    carregando,
    salvando,
    obter,
    cancelar,
    converter,
  };
}
