import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { auditoriaService } from 'services/auditoria.service';
import type {
  ListarAuditoriaParams,
  LogAuditoriaDto,
} from 'types/dtos/auditoria.dto';
import { ref } from 'vue';

export function useAuditoria() {
  const logs = ref<LogAuditoriaDto[]>([]);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarAuditoriaParams): Promise<void> {
    carregando.value = true;

    try {
      logs.value = await auditoriaService.listar(params);
    } catch (e) {
      erro(mensagem(e));
      logs.value = [];
    } finally {
      carregando.value = false;
    }
  }

  return {
    logs,
    carregando,
    carregar,
  };
}
