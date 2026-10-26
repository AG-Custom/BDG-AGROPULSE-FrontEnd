import type { TributoApuracaoValor } from 'constants/enums';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { apuracaoFiscalService } from 'services/apuracao-fiscal.service';
import type {
  AjusteApuracaoFormModel,
  ApuracaoFiscalDto,
  DecisaoApuracaoFormModel,
} from 'types/dtos/apuracao-fiscal.dto';
import { parseMascaraMoedaObrigatorio } from 'utils/formatters';
import { computed, ref } from 'vue';

function competenciaAtual(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
}

export function useApuracaoFiscal(tributo: TributoApuracaoValor) {
  const competencia = ref(competenciaAtual());
  const apuracao = ref<ApuracaoFiscalDto | null>(null);
  const carregando = ref(false);
  const executando = ref(false);

  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const competenciaValida = computed(() => /^\d{4}-(0[1-9]|1[0-2])$/.test(competencia.value));
  const fechada = computed(() => apuracao.value?.status === 'Fechada');
  const pendenciasBloqueantes = computed(
    () => apuracao.value?.pendencias.filter((p) => p.gravidade === 'Bloqueante').length ?? 0,
  );

  async function carregar(): Promise<void> {
    if (!competenciaValida.value) return;
    carregando.value = true;
    try {
      apuracao.value = await apuracaoFiscalService.obter(tributo, competencia.value);
    } catch (e) {
      erro(mensagem(e));
      apuracao.value = null;
    } finally {
      carregando.value = false;
    }
  }

  async function executar(
    operacao: () => Promise<ApuracaoFiscalDto>,
    mensagemSucesso: string,
  ): Promise<boolean> {
    executando.value = true;
    try {
      apuracao.value = await operacao();
      sucesso(mensagemSucesso);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      executando.value = false;
    }
  }

  function fechar(): Promise<boolean> {
    return executar(() => apuracaoFiscalService.fechar(tributo, competencia.value), 'Apuração fechada.');
  }

  function reabrir(): Promise<boolean> {
    return executar(() => apuracaoFiscalService.reabrir(tributo, competencia.value), 'Apuração reaberta.');
  }

  function decidir(documentoId: string, form: DecisaoApuracaoFormModel): Promise<boolean> {
    return executar(
      () =>
        apuracaoFiscalService.decidir(tributo, competencia.value, documentoId, {
          decisao: form.decisao,
          justificativa: form.justificativa,
        }),
      'Decisão registrada.',
    );
  }

  function adicionarAjuste(form: AjusteApuracaoFormModel): Promise<boolean> {
    return executar(
      () =>
        apuracaoFiscalService.adicionarAjuste(tributo, competencia.value, {
          tipo: form.tipo,
          valor: parseMascaraMoedaObrigatorio(form.valor),
          descricao: form.descricao,
          codigoAjuste: form.codigoAjuste || null,
        }),
      'Ajuste registrado.',
    );
  }

  function removerAjuste(ajusteId: string): Promise<boolean> {
    return executar(
      () => apuracaoFiscalService.removerAjuste(tributo, competencia.value, ajusteId),
      'Ajuste removido.',
    );
  }

  return {
    competencia,
    competenciaValida,
    apuracao,
    fechada,
    pendenciasBloqueantes,
    carregando,
    executando,
    carregar,
    fechar,
    reabrir,
    decidir,
    adicionarAjuste,
    removerAjuste,
  };
}
