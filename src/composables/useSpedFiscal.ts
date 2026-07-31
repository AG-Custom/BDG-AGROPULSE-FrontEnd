import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { TipoSpedFiscalValor } from 'constants/enums';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type {
  EnvioEscritorioFiscalDto,
  ListarSpedParams,
} from 'types/dtos/fiscal-gestao.dto';
import { baixarArquivo } from 'utils/download';
import { ref } from 'vue';

export type TipoExportacaoSped =
  | 'efd-icms-ipi'
  | 'efd-contribuicoes'
  | 'contabil'
  | 'efd-reinf';

export function useSpedFiscal() {
  const ultimoEnvio = ref<EnvioEscritorioFiscalDto | null>(null);
  const exportando = ref(false);
  const enviando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function exportar(tipo: TipoExportacaoSped, params: ListarSpedParams): Promise<boolean> {
    if (!params.dataInicio || !params.dataFim) {
      erro('Informe o período de exportação.');
      return false;
    }
    exportando.value = true;
    try {
      const sped =
        tipo === 'efd-icms-ipi'
          ? await fiscalGestaoService.spedEfdIcmsIpi(params)
          : tipo === 'efd-contribuicoes'
            ? await fiscalGestaoService.spedEfdContribuicoes(params)
            : tipo === 'efd-reinf'
              ? await fiscalGestaoService.spedEfdReinf(params)
              : await fiscalGestaoService.spedContabil(params);
      const blob = new Blob([sped.linhas.join('\n')], { type: 'text/plain;charset=utf-8' });
      baixarArquivo(blob, `sped-${tipo}.txt`);
      sucesso('SPED exportado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      exportando.value = false;
    }
  }

  async function enviarEscritorio(
    tipo: TipoSpedFiscalValor,
    periodo: string,
    emailEscritorio: string,
  ): Promise<boolean> {
    if (!periodo.trim() || !emailEscritorio.trim()) {
      erro('Informe período e e-mail do escritório.');
      return false;
    }
    enviando.value = true;
    try {
      ultimoEnvio.value = await fiscalGestaoService.enviarEscritorio({
        tipo,
        periodo: periodo.trim(),
        emailEscritorio: emailEscritorio.trim(),
      });
      sucesso('Envio ao escritório registrado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      enviando.value = false;
    }
  }

  return { ultimoEnvio, exportando, enviando, exportar, enviarEscritorio };
}
