import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { expedicaoService } from 'services/expedicao.service';
import type { ExpedicaoPedidoDto, RomaneioDto } from 'types/dtos/expedicao.dto';
import { ref } from 'vue';

export function useExpedicao() {
  const pedidos = ref<ExpedicaoPedidoDto[]>([]);
  const romaneio = ref<RomaneioDto | null>(null);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      pedidos.value = await expedicaoService.listar();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterRomaneio(pedidoId: string): Promise<boolean> {
    carregando.value = true;

    try {
      romaneio.value = await expedicaoService.obterRomaneio(pedidoId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  return {
    pedidos,
    romaneio,
    carregando,
    carregar,
    obterRomaneio,
  };
}
