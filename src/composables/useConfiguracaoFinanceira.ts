import { copyToClipboard } from 'quasar';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  ConfiguracaoFinanceiraDto,
  ConfiguracaoFinanceiraFormModel,
} from 'types/dtos/financeiro-gestao.dto';
import { ref } from 'vue';

function lerArquivoBase64(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result).split(',')[1] ?? '');
    leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo.'));
    leitor.readAsDataURL(arquivo);
  });
}

export function useConfiguracaoFinanceira() {
  const configuracao = ref<ConfiguracaoFinanceiraDto | null>(null);
  const segredoWebhook = ref<string | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      configuracao.value = await financeiroGestaoService.obterConfiguracaoFinanceira();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function salvar(
    form: ConfiguracaoFinanceiraFormModel,
    certificado: File | null,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      const resposta = await financeiroGestaoService.salvarConfiguracaoFinanceira({
        sicoobHabilitado: form.sicoobHabilitado,
        sicoobHomologacao: form.sicoobHomologacao,
        sicoobClientId: form.sicoobClientId || null,
        sicoobNumeroCliente: form.sicoobNumeroCliente || null,
        sicoobNumeroContrato: form.sicoobNumeroContrato || null,
        sicoobModalidade: form.sicoobModalidade,
        sicoobNumeroContaCorrente: form.sicoobNumeroContaCorrente || null,
        sicoobChavePix: form.sicoobChavePix || null,
        sicoobToken: form.sicoobToken || null,
        sicoobCertificadoPfxBase64: certificado ? await lerArquivoBase64(certificado) : null,
        sicoobCertificadoSenha: form.sicoobCertificadoSenha || null,
        removerCertificado: form.removerCertificado,
        gerarWebhookSegredo: form.gerarWebhookSegredo,
      });
      configuracao.value = resposta;
      segredoWebhook.value = resposta.webhookSegredoGerado;
      sucesso('Configuração financeira salva.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function copiar(texto: string, descricao: string): Promise<void> {
    try {
      await copyToClipboard(texto);
      sucesso(`${descricao} copiado.`);
    } catch {
      erro('Não foi possível copiar.');
    }
  }

  return { configuracao, segredoWebhook, carregando, salvando, carregar, salvar, copiar };
}
