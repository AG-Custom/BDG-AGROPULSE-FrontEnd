import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type { CfopDto } from 'types/dtos/fiscal-gestao.dto';
import { ref, shallowRef } from 'vue';

let catalogoCfop: CfopDto[] | null = null;
let catalogoCfopPendente: Promise<CfopDto[]> | null = null;

export function useCfops() {
  const itens = shallowRef<CfopDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    if (catalogoCfop) {
      itens.value = catalogoCfop;
      return;
    }

    carregando.value = true;
    try {
      catalogoCfopPendente ??= fiscalGestaoService.listarCfops().finally(() => {
        catalogoCfopPendente = null;
      });
      catalogoCfop = await catalogoCfopPendente;
      itens.value = catalogoCfop;
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
      catalogoCfop = null;
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
