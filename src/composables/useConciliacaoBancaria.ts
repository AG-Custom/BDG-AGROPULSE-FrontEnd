import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  ConciliacaoOfxResultDto,
  VincularConciliacaoPayload,
} from 'types/dtos/financeiro-gestao.dto';
import { ref } from 'vue';

export function useConciliacaoBancaria() {
  const conciliacao = ref<ConciliacaoOfxResultDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function importarOfx(contaBancariaId: string, arquivo: File): Promise<boolean> {
    salvando.value = true;
    try {
      conciliacao.value = await financeiroGestaoService.importarOfx(
        contaBancariaId,
        arquivo,
      );
      sucesso('OFX importado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function vincular(payload: VincularConciliacaoPayload): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.vincularLancamento(payload);
      sucesso('Lançamento vinculado.');
      if (conciliacao.value) {
        conciliacao.value = await financeiroGestaoService.proporLancamentos({
          conciliacaoId: conciliacao.value.id,
        });
      }
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function propor(): Promise<boolean> {
    if (!conciliacao.value) return false;
    salvando.value = true;
    try {
      conciliacao.value = await financeiroGestaoService.proporLancamentos({
        conciliacaoId: conciliacao.value.id,
      });
      sucesso('Propostas geradas.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { conciliacao, carregando, salvando, importarOfx, vincular, propor };
}
