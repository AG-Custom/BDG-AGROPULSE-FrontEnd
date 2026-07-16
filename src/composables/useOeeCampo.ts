import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { safrasService } from 'services/safras.service';
import type { OeeCampoDto } from 'types/dtos/safras.dto';
import { ref } from 'vue';

export function useOeeCampo() {
  const oee = ref<OeeCampoDto | null>(null);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(mes: number, ano: number): Promise<void> {
    carregando.value = true;
    try {
      oee.value = await safrasService.obterOeeCampo(mes, ano);
    } catch (e) {
      erro(mensagem(e));
      oee.value = null;
    } finally {
      carregando.value = false;
    }
  }

  return { oee, carregando, carregar };
}
