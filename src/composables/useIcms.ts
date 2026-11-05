import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type { IcmsDto, TipoCodigoIcms } from 'types/dtos/fiscal-gestao.dto';
import { ref, shallowRef } from 'vue';

let catalogoIcms: IcmsDto[] | null = null;
let catalogoIcmsPendente: Promise<IcmsDto[]> | null = null;

export function useIcms() {
  const itens = shallowRef<IcmsDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    if (catalogoIcms) {
      itens.value = catalogoIcms;
      return;
    }

    carregando.value = true;
    try {
      catalogoIcmsPendente ??= fiscalGestaoService.listarIcms().finally(() => {
        catalogoIcmsPendente = null;
      });
      catalogoIcms = await catalogoIcmsPendente;
      itens.value = catalogoIcms;
    } catch (e) {
      erro(mensagem(e));
      itens.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function relacionar(
    tipo: TipoCodigoIcms,
    codigo: string,
    icmsSaida: string | null,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      await fiscalGestaoService.relacionarIcmsSaida(tipo, codigo, { icmsSaida });
      sucesso(icmsSaida ? 'ICMS de saída relacionado.' : 'Vínculo de ICMS de saída removido.');
      catalogoIcms = null;
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
