import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { pedidoVendaService } from 'services/pedido-venda.service';
import type {
  ListarPedidosVendaParams,
  PedidoVendaDto,
  PedidoVendaFormModel,
  PedidoVendaResumoDto,
} from 'types/dtos/pedido-venda.dto';
import { formParaCriarPayload, formParaEditarPayload } from 'utils/mappers/pedido-venda.mapper';
import { baixarArquivo } from 'utils/download';
import {
  ExportacaoPedidoFormato,
  type ExportacaoPedidoFormatoValor,
} from 'constants/enums';
import { ref } from 'vue';

export function usePedidosVenda() {
  const pedidos = ref<PedidoVendaResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const exportando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarPedidosVendaParams): Promise<void> {
    carregando.value = true;

    try {
      pedidos.value = await pedidoVendaService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: PedidoVendaFormModel): Promise<PedidoVendaDto | null> {
    salvando.value = true;

    try {
      const criado = await pedidoVendaService.criar(formParaCriarPayload(form));
      sucesso('Pedido de venda criado com sucesso.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(
    pedidoId: string,
    form: PedidoVendaFormModel,
  ): Promise<PedidoVendaDto | null> {
    salvando.value = true;

    try {
      const atualizado = await pedidoVendaService.editar(
        pedidoId,
        formParaEditarPayload(form),
      );
      sucesso('Pedido de venda atualizado com sucesso.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function exportar(
    formato: ExportacaoPedidoFormatoValor,
    params?: Omit<ListarPedidosVendaParams, 'exportar'>,
  ): Promise<boolean> {
    exportando.value = true;

    try {
      const blob = await pedidoVendaService.exportar(formato, params);
      const extensao = formato === ExportacaoPedidoFormato.Excel ? 'xlsx' : 'pdf';
      baixarArquivo(blob, `pedidos-venda.${extensao}`);
      sucesso('Exportação concluída.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      exportando.value = false;
    }
  }

  return {
    pedidos,
    carregando,
    salvando,
    exportando,
    carregar,
    criar,
    editar,
    exportar,
  };
}
