import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type { GuiaGnreDto } from 'types/dtos/fiscal-gestao.dto';
import { ref } from 'vue';

export function useGnre() {
  const guias = ref<GuiaGnreDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      guias.value = await fiscalGestaoService.listarGnre();
    } catch (e) {
      erro(mensagem(e));
      guias.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function gerar(notaFiscalId: string): Promise<boolean> {
    if (!notaFiscalId.trim()) {
      erro('Informe o ID da nota fiscal.');
      return false;
    }
    salvando.value = true;
    try {
      await fiscalGestaoService.gerarGnre({ notaFiscalId: notaFiscalId.trim() });
      sucesso('GNRE gerada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { guias, carregando, salvando, carregar, gerar };
}
