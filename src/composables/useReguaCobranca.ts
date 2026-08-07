import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  ReguaCobrancaConfigEtapaDto,
  ReguaCobrancaConfigFormModel,
  ReguaCobrancaPainelDto,
  ReguaCobrancaPainelItemDto,
} from 'types/dtos/financeiro-gestao.dto';
import { computed, ref } from 'vue';

function normalizarPainel(value: ReguaCobrancaPainelDto | null): ReguaCobrancaPainelDto {
  return { etapas: value?.etapas ?? [] };
}

export function useReguaCobranca() {
  const config = ref<ReguaCobrancaConfigEtapaDto[]>([]);
  const painel = ref<ReguaCobrancaPainelDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const itensPainel = computed<ReguaCobrancaPainelItemDto[]>(() =>
    (painel.value?.etapas ?? []).flatMap((etapa) =>
      (etapa.titulos ?? []).map((titulo) => ({
        id: titulo.id,
        clienteId: titulo.clienteId,
        parcela: titulo.parcela,
        valor: titulo.valor,
        saldo: titulo.saldo,
        vencimento: titulo.vencimento,
        status: titulo.status,
        etapaDias: etapa.etapaDias,
        nomeEtapa: etapa.nomeEtapa,
      })),
    ),
  );

  async function carregarConfig(): Promise<void> {
    carregando.value = true;
    try {
      config.value = await financeiroGestaoService.obterReguaConfig();
    } catch (e) {
      erro(mensagem(e));
      config.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function carregarPainel(): Promise<void> {
    carregando.value = true;
    try {
      painel.value = normalizarPainel(await financeiroGestaoService.obterReguaPainel());
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
        etapas: form.etapas.map((e) => ({
          etapaDias: Number(e.etapaDias),
          nomeEtapa: e.nomeEtapa.trim() || `D+${e.etapaDias}`,
          avisarGerente: e.avisarGerente,
          avisarVendedor: e.avisarVendedor,
          bloquearPedidos: e.bloquearPedidos,
          ativo: form.ativo && e.ativo,
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
      const result = await financeiroGestaoService.processarReguaDia();
      painel.value = normalizarPainel(result.painel);
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
    itensPainel,
    carregando,
    salvando,
    carregarConfig,
    carregarPainel,
    salvar,
    processarDia,
  };
}
