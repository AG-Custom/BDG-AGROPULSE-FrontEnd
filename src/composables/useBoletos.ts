import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  BoletoDto,
  EscopoListagemParams,
  RemessaBoletoResultDto,
  RetornoBoletoResultDto,
} from 'types/dtos/financeiro-gestao.dto';
import { ref } from 'vue';

export function useBoletos() {
  const boletos = ref<BoletoDto[]>([]);
  const ultimaRemessa = ref<RemessaBoletoResultDto | null>(null);
  const ultimoRetorno = ref<RetornoBoletoResultDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: EscopoListagemParams): Promise<void> {
    carregando.value = true;
    try {
      boletos.value = await financeiroGestaoService.listarBoletos(params);
    } catch (e) {
      erro(mensagem(e));
      boletos.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function emitir(contaReceberId: string, contaBancariaId?: string): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.emitirBoleto({
        contaReceberId,
        contaBancariaId: contaBancariaId || null,
      });
      sucesso('Boleto emitido.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function gerarRemessa(boletoIds: string[]): Promise<boolean> {
    salvando.value = true;
    try {
      ultimaRemessa.value = await financeiroGestaoService.gerarRemessa({ boletoIds });
      sucesso('Remessa gerada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function processarRetorno(arquivo: File): Promise<boolean> {
    salvando.value = true;
    try {
      ultimoRetorno.value = await financeiroGestaoService.processarRetorno(arquivo);
      sucesso('Retorno processado.');
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
    boletos,
    ultimaRemessa,
    ultimoRetorno,
    carregando,
    salvando,
    carregar,
    emitir,
    gerarRemessa,
    processarRetorno,
  };
}
