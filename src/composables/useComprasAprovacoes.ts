import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { comprasService } from 'services/compras.service';
import type {
  AlcadaAprovacaoCompraDto,
  DefinirAlcadasAprovacaoPayload,
  PedidoCompraDto,
} from 'types/dtos/compras.dto';
import { ref } from 'vue';

export function useComprasAprovacoes() {
  const aprovacoes = ref<PedidoCompraDto[]>([]);
  const alcadas = ref<AlcadaAprovacaoCompraDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarAprovacoes(): Promise<void> {
    carregando.value = true;

    try {
      aprovacoes.value = await comprasService.listarAprovacoesPendentes();
    } catch (e) {
      erro(mensagem(e));
      aprovacoes.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function carregarAlcadas(): Promise<void> {
    carregando.value = true;

    try {
      alcadas.value = await comprasService.listarAlcadas();
    } catch (e) {
      erro(mensagem(e));
      alcadas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function salvarAlcadas(payload: DefinirAlcadasAprovacaoPayload): Promise<boolean> {
    salvando.value = true;

    try {
      alcadas.value = await comprasService.definirAlcadas(payload);
      sucesso('Alçadas de aprovação salvas.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function aprovar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Aprovar pedido',
      mensagem: 'Confirma a aprovação deste pedido de compra?',
      textoConfirmar: 'Aprovar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await comprasService.aprovarPedido(id);
      sucesso('Pedido aprovado.');
      aprovacoes.value = aprovacoes.value.filter((p) => p.id !== id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function rejeitar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Rejeitar pedido',
      mensagem: 'Deseja rejeitar este pedido de compra?',
      textoConfirmar: 'Rejeitar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await comprasService.rejeitarPedido(id);
      sucesso('Pedido rejeitado.');
      aprovacoes.value = aprovacoes.value.filter((p) => p.id !== id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    aprovacoes,
    alcadas,
    carregando,
    salvando,
    carregarAprovacoes,
    carregarAlcadas,
    salvarAlcadas,
    aprovar,
    rejeitar,
  };
}
