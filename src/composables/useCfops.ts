import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type { CfopDto } from 'types/dtos/fiscal-gestao.dto';
import { ref } from 'vue';

export function useCfops() {
  const itens = ref<CfopDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      itens.value = await fiscalGestaoService.listarCfops();
    } catch (e) {
      erro(mensagem(e));
      itens.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function relacionar(codigo: string, cfopSaida: string | null): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.relacionarCfopSaida(codigo, { cfopSaida });
      sucesso(cfopSaida ? 'CFOP de saída relacionado.' : 'Vínculo de CFOP de saída removido.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { itens, carregando, salvando, carregar, relacionar };
}
