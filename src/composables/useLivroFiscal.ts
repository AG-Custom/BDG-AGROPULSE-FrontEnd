import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { escrituracaoService } from 'services/escrituracao.service';
import type {
  DirecaoEscrituracao,
  DocumentoEscrituradoDetalheDto,
  LivroFiscalDto,
} from 'types/dtos/escrituracao.dto';
import { computed, ref } from 'vue';

function competenciaAtual(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
}

export function useLivroFiscal() {
  const competencia = ref(competenciaAtual());
  const direcao = ref<DirecaoEscrituracao | null>(null);
  const livro = ref<LivroFiscalDto | null>(null);
  const detalhe = ref<DocumentoEscrituradoDetalheDto | null>(null);
  const carregando = ref(false);
  const carregandoDetalhe = ref(false);
  const reprocessando = ref(false);

  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const competenciaValida = computed(() => /^\d{4}-(0[1-9]|1[0-2])$/.test(competencia.value));

  async function carregar(): Promise<void> {
    if (!competenciaValida.value) return;
    carregando.value = true;
    try {
      livro.value = await escrituracaoService.obterLivro(
        competencia.value,
        direcao.value ?? undefined,
      );
    } catch (e) {
      erro(mensagem(e));
      livro.value = null;
    } finally {
      carregando.value = false;
    }
  }

  async function reprocessar(): Promise<void> {
    if (!competenciaValida.value) return;
    reprocessando.value = true;
    try {
      const resultado = await escrituracaoService.reprocessar(competencia.value);
      sucesso(
        resultado.documentosComPendenciaBloqueante > 0
          ? `${resultado.documentosEscriturados} documentos escriturados, ${resultado.documentosComPendenciaBloqueante} com pendência bloqueante.`
          : `${resultado.documentosEscriturados} documentos escriturados.`,
      );
      await carregar();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      reprocessando.value = false;
    }
  }

  async function abrirDocumento(documentoId: string): Promise<void> {
    carregandoDetalhe.value = true;
    try {
      detalhe.value = await escrituracaoService.obterDocumento(documentoId);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregandoDetalhe.value = false;
    }
  }

  function fecharDocumento(): void {
    detalhe.value = null;
  }

  return {
    competencia,
    competenciaValida,
    direcao,
    livro,
    detalhe,
    carregando,
    carregandoDetalhe,
    reprocessando,
    carregar,
    reprocessar,
    abrirDocumento,
    fecharDocumento,
  };
}
