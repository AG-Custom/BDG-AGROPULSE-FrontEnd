import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { pdvService } from 'services/pdv.service';
import type {
  ListarPdvVendasParams,
  PdvVendaDto,
  PdvVendaFormModel,
  PdvVendaResumoDto,
} from 'types/dtos/pdv.dto';
import { ref } from 'vue';

export function usePdv() {
  const vendas = ref<PdvVendaResumoDto[]>([]);
  const venda = ref<PdvVendaDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarVendas(params?: ListarPdvVendasParams): Promise<void> {
    carregando.value = true;

    try {
      vendas.value = await pdvService.listarVendas(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterVenda(vendaId: string): Promise<boolean> {
    carregando.value = true;

    try {
      venda.value = await pdvService.obterVenda(vendaId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function vender(form: PdvVendaFormModel): Promise<PdvVendaDto | null> {
    salvando.value = true;

    try {
      const criada = await pdvService.vender({
        clienteId: form.clienteId || null,
        itens: form.itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: Number(item.quantidade),
          precoUnitario: Number(item.precoUnitario),
          numeroLote: item.numeroLote.trim() || null,
          loteId: item.loteId.trim() || null,
        })),
      });
      sucesso('Venda PDV registrada com sucesso.');
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelar(vendaId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar venda PDV',
      mensagem: 'O estoque será estornado. Deseja cancelar esta venda?',
      textoConfirmar: 'Cancelar venda',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      venda.value = await pdvService.cancelar(vendaId);
      sucesso('Venda PDV cancelada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    vendas,
    venda,
    carregando,
    salvando,
    carregarVendas,
    obterVenda,
    vender,
    cancelar,
  };
}
