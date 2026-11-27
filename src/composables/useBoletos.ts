import { copyToClipboard } from 'quasar';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import { messageService } from 'services/message.service';
import type { BoletoDto } from 'types/dtos/financeiro-gestao.dto';
import { ref } from 'vue';

export function useBoletos() {
  const boletos = ref<BoletoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      boletos.value = await financeiroGestaoService.listarBoletos();
    } catch (e) {
      erro(mensagem(e));
      boletos.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function executar(acao: () => Promise<unknown>, textoSucesso: string): Promise<boolean> {
    salvando.value = true;
    try {
      await acao();
      sucesso(textoSucesso);
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  function emitir(contaReceberId: string): Promise<boolean> {
    return executar(() => financeiroGestaoService.emitirBoleto({ contaReceberId }), 'Boleto emitido.');
  }

  function sincronizar(boleto: BoletoDto): Promise<boolean> {
    return executar(() => financeiroGestaoService.sincronizarBoleto(boleto.id), 'Situação atualizada.');
  }

  async function baixar(boleto: BoletoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Baixar boleto',
      mensagem: 'O boleto deixará de ser cobrado no banco. Deseja continuar?',
      textoConfirmar: 'Baixar boleto',
      icone: 'warning',
    });
    if (!confirmou) return false;
    return executar(() => financeiroGestaoService.baixarBoleto(boleto.id), 'Boleto baixado.');
  }

  async function copiar(texto: string, descricao: string): Promise<void> {
    try {
      await copyToClipboard(texto);
      sucesso(`${descricao} copiado.`);
    } catch {
      erro('Não foi possível copiar.');
    }
  }

  return { boletos, carregando, salvando, carregar, emitir, sincronizar, baixar, copiar };
}
