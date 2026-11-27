import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  ConciliacaoBancariaDto,
  ImportarExtratoPayload,
} from 'types/dtos/financeiro-gestao.dto';
import { ref } from 'vue';

export function useConciliacaoBancaria() {
  const conciliacao = ref<ConciliacaoBancariaDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarUltima(): Promise<void> {
    carregando.value = true;
    try {
      const lista = await financeiroGestaoService.listarConciliacoes();
      conciliacao.value = lista[0] ?? null;
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function executar(
    acao: () => Promise<ConciliacaoBancariaDto | void>,
    textoSucesso: string,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      const resultado = await acao();
      if (resultado) conciliacao.value = resultado;
      else await carregarUltima();
      sucesso(textoSucesso);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  function importarExtrato(payload: ImportarExtratoPayload): Promise<boolean> {
    return executar(() => financeiroGestaoService.importarExtrato(payload), 'Extrato importado.');
  }

  function conciliarAutomaticamente(): Promise<boolean> {
    const atual = conciliacao.value;
    if (!atual) return Promise.resolve(false);
    return executar(
      () => financeiroGestaoService.conciliarAutomaticamente(atual.id),
      'Conciliação automática concluída.',
    );
  }

  function propor(): Promise<boolean> {
    const atual = conciliacao.value;
    if (!atual) return Promise.resolve(false);
    return executar(() => financeiroGestaoService.proporLancamentos(atual.id), 'Propostas geradas.');
  }

  return { conciliacao, carregando, salvando, carregarUltima, importarExtrato, conciliarAutomaticamente, propor };
}
