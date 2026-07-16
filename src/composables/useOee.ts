import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { producaoService } from 'services/producao.service';
import type { OeeDto } from 'types/dtos/producao.dto';
import { ref } from 'vue';

export function useOee() {
  const oee = ref<OeeDto | null>(null);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(mes: number, ano: number): Promise<void> {
    carregando.value = true;
    try {
      oee.value = await producaoService.obterOee(mes, ano);
    } catch (e) {
      erro(mensagem(e));
      oee.value = null;
    } finally {
      carregando.value = false;
    }
  }

  return {
    oee,
    carregando,
    carregar,
  };
}
