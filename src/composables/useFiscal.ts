import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { RegimeTributarioValor } from 'constants/enums';
import { fiscalService } from 'services/fiscal.service';
import type {
  ConfiguracaoFiscalDto,
  ConfiguracaoFiscalFormModel,
  ImportacaoXmlDto,
  Sped0200Dto,
} from 'types/dtos/fiscal.dto';
import { baixarArquivo } from 'utils/download';
import { ref } from 'vue';

export function useFiscal() {
  const configuracao = ref<ConfiguracaoFiscalDto | null>(null);
  const ultimaImportacao = ref<ImportacaoXmlDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const importando = ref(false);
  const exportando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function obterConfiguracao(): Promise<boolean> {
    carregando.value = true;

    try {
      configuracao.value = await fiscalService.obterConfiguracao();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function salvarConfiguracao(form: ConfiguracaoFiscalFormModel): Promise<boolean> {
    if (!form.regimeTributario) {
      erro('Selecione o regime tributário.');
      return false;
    }

    salvando.value = true;

    try {
      configuracao.value = await fiscalService.salvarConfiguracao({
        regimeTributario: form.regimeTributario as RegimeTributarioValor,
        focusNfeToken: form.focusNfeToken.trim() || null,
      });
      sucesso('Configuração fiscal salva.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function importarXml(xmlConteudo: string): Promise<boolean> {
    importando.value = true;

    try {
      ultimaImportacao.value = await fiscalService.importarXml({ xmlConteudo });
      sucesso('XML importado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      importando.value = false;
    }
  }

  async function exportarSped0200(): Promise<boolean> {
    exportando.value = true;

    try {
      const sped: Sped0200Dto = await fiscalService.exportarSped0200();
      const blob = new Blob([sped.linhas.join('\n')], { type: 'text/plain;charset=utf-8' });
      baixarArquivo(blob, 'sped-0200.txt');
      sucesso('SPED 0200 exportado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      exportando.value = false;
    }
  }

  return {
    configuracao,
    ultimaImportacao,
    carregando,
    salvando,
    importando,
    exportando,
    obterConfiguracao,
    salvarConfiguracao,
    importarXml,
    exportarSped0200,
  };
}
