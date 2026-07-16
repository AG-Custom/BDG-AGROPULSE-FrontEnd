import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  ReguaCobrancaConfigDto,
  ReguaCobrancaConfigFormModel,
  ReguaCobrancaPainelDto,
} from 'types/dtos/financeiro-gestao.dto';
import { ref } from 'vue';

export function useReguaCobranca() {
  const config = ref<ReguaCobrancaConfigDto | null>(null);
  const painel = ref<ReguaCobrancaPainelDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarConfig(): Promise<void> {
    carregando.value = true;
    try {
      config.value = await financeiroGestaoService.obterReguaConfig();
    } catch (e) {
      erro(mensagem(e));
      config.value = null;
    } finally {
      carregando.value = false;
    }
  }

  async function carregarPainel(): Promise<void> {
    carregando.value = true;
    try {
      painel.value = await financeiroGestaoService.obterReguaPainel();
    } catch (e) {
      erro(mensagem(e));
      painel.value = null;
    } finally {
      carregando.value = false;
    }
  }

  async function salvar(form: ReguaCobrancaConfigFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      config.value = await financeiroGestaoService.salvarReguaConfig({
        ativo: form.ativo,
        etapas: form.etapas.map((e) => ({
          diasAtraso: Number(e.diasAtraso),
          avisoGerente: e.avisoGerente,
          avisoVendedor: e.avisoVendedor,
          bloquearPedidos: e.bloquearPedidos,
        })),
      });
      sucesso('Régua de cobrança salva.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function processarDia(): Promise<boolean> {
    salvando.value = true;
    try {
      painel.value = await financeiroGestaoService.processarReguaDia();
      sucesso('Processamento diário concluído.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    config,
    painel,
    carregando,
    salvando,
    carregarConfig,
    carregarPainel,
    salvar,
    processarDia,
  };
}
