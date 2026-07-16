import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  ChequeDto,
  ChequeFormModel,
  ListarChequesParams,
} from 'types/dtos/financeiro-gestao.dto';
import type { TipoChequeValor } from 'constants/enums';
import { ref } from 'vue';

export function useCheques() {
  const cheques = ref<ChequeDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarChequesParams): Promise<void> {
    carregando.value = true;
    try {
      cheques.value = await financeiroGestaoService.listarCheques(params);
    } catch (e) {
      erro(mensagem(e));
      cheques.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: ChequeFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.criarCheque({
        tipo: form.tipo as TipoChequeValor,
        numero: form.numero.trim(),
        banco: form.banco.trim(),
        agencia: form.agencia.trim(),
        valor: Number(form.valor.replace(',', '.')),
        bomPara: form.bomPara,
        emitente: form.emitente.trim() || null,
        contaBancariaId: form.contaBancariaId || null,
        observacao: form.observacao.trim() || null,
      });
      sucesso('Cheque registrado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function depositar(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.depositarCheque(id);
      sucesso('Cheque depositado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function compensar(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.compensarCheque(id);
      sucesso('Cheque compensado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function devolver(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.devolverCheque(id);
      sucesso('Cheque devolvido.');
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
    cheques,
    carregando,
    salvando,
    carregar,
    criar,
    depositar,
    compensar,
    devolver,
  };
}
