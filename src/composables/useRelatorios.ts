import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { relatorioService } from 'services/relatorio.service';
import type {
  ComissaoRepasseItemDto,
  ComissoesRepasseParams,
  CurvaAbcLucratividadeItemDto,
  CurvaAbcLucratividadeParams,
} from 'types/dtos/relatorio.dto';
import { ref } from 'vue';

export function useRelatorios() {
  const curvaAbc = ref<CurvaAbcLucratividadeItemDto[]>([]);
  const comissoes = ref<ComissaoRepasseItemDto[]>([]);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarCurvaAbc(params?: CurvaAbcLucratividadeParams): Promise<void> {
    carregando.value = true;

    try {
      curvaAbc.value = await relatorioService.curvaAbcLucratividade(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarComissoes(params?: ComissoesRepasseParams): Promise<void> {
    carregando.value = true;

    try {
      comissoes.value = await relatorioService.comissoesRepasse(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  return {
    curvaAbc,
    comissoes,
    carregando,
    carregarCurvaAbc,
    carregarComissoes,
  };
}
