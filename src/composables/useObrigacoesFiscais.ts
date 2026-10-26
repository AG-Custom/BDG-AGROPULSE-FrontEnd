import { FinalidadeArquivoFiscal, TipoArquivoFiscal } from 'constants/enums';
import type { FinalidadeArquivoFiscalValor, TipoArquivoFiscalValor } from 'constants/enums';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { obrigacaoFiscalService } from 'services/obrigacao-fiscal.service';
import type {
  ArquivoFiscalDto,
  GeracaoArquivoFiscalDto,
  PendenciaGeracaoArquivoDto,
  PerfilContribuicoesDto,
  PerfilEfdDto,
  PerfilEfdFormModel,
} from 'types/dtos/obrigacao-fiscal.dto';
import { baixarArquivo } from 'utils/download';
import { formularioParaPerfilEfd } from 'utils/mappers/perfil-efd.mapper';
import { computed, ref } from 'vue';

function competenciaAtual(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
}

export function useObrigacoesFiscais() {
  const competencia = ref(competenciaAtual());
  const finalidade = ref<FinalidadeArquivoFiscalValor>(FinalidadeArquivoFiscal.Normal);
  const arquivos = ref<ArquivoFiscalDto[]>([]);
  const pendencias = ref<PendenciaGeracaoArquivoDto[]>([]);
  const carregando = ref(false);
  const gerando = ref<TipoArquivoFiscalValor | null>(null);
  const perfilEfd = ref<PerfilEfdDto | null>(null);
  const salvandoPerfil = ref(false);
  const perfilContribuicoes = ref<PerfilContribuicoesDto | null>(null);
  const salvandoPerfilContribuicoes = ref(false);

  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const competenciaValida = computed(() => /^\d{4}-(0[1-9]|1[0-2])$/.test(competencia.value));

  const geradores: Partial<
    Record<TipoArquivoFiscalValor, () => Promise<GeracaoArquivoFiscalDto>>
  > = {
    [TipoArquivoFiscal.Sintegra]: () =>
      obrigacaoFiscalService.gerarSintegra({
        competencia: competencia.value,
        finalidade: finalidade.value,
      }),
    [TipoArquivoFiscal.EfdIcmsIpi]: () =>
      obrigacaoFiscalService.gerarEfdIcmsIpi({
        competencia: competencia.value,
        finalidade: finalidade.value,
      }),
    [TipoArquivoFiscal.EfdContribuicoes]: () =>
      obrigacaoFiscalService.gerarEfdContribuicoes({
        competencia: competencia.value,
        finalidade: finalidade.value,
      }),
  };

  async function carregarArquivos(): Promise<void> {
    carregando.value = true;
    try {
      arquivos.value = await obrigacaoFiscalService.listarArquivos();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function gerar(tipo: TipoArquivoFiscalValor): Promise<void> {
    const gerador = geradores[tipo];
    if (!gerador || !competenciaValida.value) return;
    gerando.value = tipo;
    try {
      const resultado = await gerador();
      pendencias.value = resultado.pendencias;
      if (resultado.arquivo) {
        sucesso(`Arquivo ${resultado.arquivo.nomeArquivo} gerado.`);
        await carregarArquivos();
      } else {
        erro('Arquivo não gerado: resolva as pendências listadas.');
      }
    } catch (e) {
      erro(mensagem(e));
    } finally {
      gerando.value = null;
    }
  }

  async function carregarPerfilEfd(): Promise<void> {
    try {
      perfilEfd.value = await obrigacaoFiscalService.obterPerfilEfd();
    } catch (e) {
      erro(mensagem(e));
    }
  }

  async function salvarPerfilEfd(form: PerfilEfdFormModel): Promise<boolean> {
    salvandoPerfil.value = true;
    try {
      perfilEfd.value = await obrigacaoFiscalService.salvarPerfilEfd(formularioParaPerfilEfd(form));
      sucesso('Perfil EFD salvo.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvandoPerfil.value = false;
    }
  }

  async function carregarPerfilContribuicoes(): Promise<void> {
    try {
      perfilContribuicoes.value = await obrigacaoFiscalService.obterPerfilContribuicoes();
    } catch (e) {
      erro(mensagem(e));
    }
  }

  async function salvarPerfilContribuicoes(form: PerfilContribuicoesDto): Promise<boolean> {
    salvandoPerfilContribuicoes.value = true;
    try {
      perfilContribuicoes.value = await obrigacaoFiscalService.salvarPerfilContribuicoes({
        ...form,
        naturezaBaseCredito: form.naturezaBaseCredito || null,
      });
      sucesso('Perfil da EFD-Contribuições salvo.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvandoPerfilContribuicoes.value = false;
    }
  }

  async function baixar(arquivo: ArquivoFiscalDto): Promise<void> {
    try {
      const blob = await obrigacaoFiscalService.baixarArquivo(arquivo.id);
      baixarArquivo(blob, arquivo.nomeArquivo);
    } catch (e) {
      erro(mensagem(e));
    }
  }

  return {
    competencia,
    competenciaValida,
    finalidade,
    arquivos,
    pendencias,
    carregando,
    gerando,
    perfilEfd,
    salvandoPerfil,
    perfilContribuicoes,
    salvandoPerfilContribuicoes,
    carregarArquivos,
    carregarPerfilEfd,
    salvarPerfilEfd,
    carregarPerfilContribuicoes,
    salvarPerfilContribuicoes,
    gerar,
    baixar,
  };
}
