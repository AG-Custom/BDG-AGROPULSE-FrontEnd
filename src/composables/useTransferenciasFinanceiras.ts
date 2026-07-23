import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  EscopoListagemParams,
  TransferenciaFinanceiraDto,
  TransferenciaFormModel,
} from 'types/dtos/financeiro-gestao.dto';
import { parseMascaraMoeda } from 'utils/formatters';
import { ref } from 'vue';

export function useTransferenciasFinanceiras() {
  const transferencias = ref<TransferenciaFinanceiraDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: EscopoListagemParams): Promise<void> {
    carregando.value = true;
    try {
      transferencias.value = await financeiroGestaoService.listarTransferencias(params);
    } catch (e) {
      erro(mensagem(e));
      transferencias.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: TransferenciaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.criarTransferencia({
        origemContaBancariaId: form.origemContaBancariaId || null,
        origemCaixaId: form.origemCaixaId || null,
        destinoContaBancariaId: form.destinoContaBancariaId || null,
        destinoCaixaId: form.destinoCaixaId || null,
        valor: parseMascaraMoeda(form.valor) ?? 0,
        data: form.data,
        observacao: form.observacao.trim() || null,
      });
      sucesso('Transferência criada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function confirmar(item: TransferenciaFinanceiraDto): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.confirmarTransferencia(item.id);
      sucesso('Transferência confirmada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelar(item: TransferenciaFinanceiraDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar transferência',
      mensagem: 'Deseja cancelar esta transferência?',
      textoConfirmar: 'Cancelar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await financeiroGestaoService.cancelarTransferencia(item.id);
      sucesso('Transferência cancelada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    transferencias,
    carregando,
    salvando,
    carregar,
    criar,
    confirmar,
    cancelar,
  };
}
