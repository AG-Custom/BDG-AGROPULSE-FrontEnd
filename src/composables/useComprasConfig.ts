import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { comprasService } from 'services/compras.service';
import type { ComprasConfigDto, SalvarComprasConfigPayload } from 'types/dtos/compras.dto';
import { ref } from 'vue';

const config = ref<ComprasConfigDto | null>(null);
const carregandoConfig = ref(false);
let carregamentoIniciado = false;

export function useComprasConfig() {
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(forcar = false): Promise<void> {
    if (carregandoConfig.value) {
      return;
    }

    if (config.value && !forcar) {
      return;
    }

    if (carregamentoIniciado && !forcar && config.value) {
      return;
    }

    carregamentoIniciado = true;
    carregandoConfig.value = true;

    try {
      config.value = await comprasService.obterConfig();
    } catch (e) {
      erro(mensagem(e));
      config.value = { fluxoCompletoHabilitado: false };
    } finally {
      carregandoConfig.value = false;
    }
  }

  async function salvar(payload: SalvarComprasConfigPayload): Promise<boolean> {
    salvando.value = true;

    try {
      config.value = await comprasService.salvarConfig(payload);
      sucesso('Configuração de compras salva.');
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
    carregando: carregandoConfig,
    salvando,
    carregar,
    salvar,
  };
}
