import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { auditoriaService } from 'services/auditoria.service';
import type {
  ListaAuditoriaPaginadaDto,
  ListarAuditoriaParams,
  LogAuditoriaDto,
} from 'types/dtos/auditoria.dto';
import { ref } from 'vue';

export function useAuditoria() {
  const logs = ref<LogAuditoriaDto[]>([]);
  const total = ref(0);
  const pagina = ref(1);
  const tamanhoPagina = ref(25);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarAuditoriaParams): Promise<void> {
    carregando.value = true;

    try {
      const resposta: ListaAuditoriaPaginadaDto = await auditoriaService.listar({
        pagina: pagina.value,
        tamanhoPagina: tamanhoPagina.value,
        ...params,
      });
      logs.value = resposta.itens;
      total.value = resposta.total;
      pagina.value = resposta.pagina;
      tamanhoPagina.value = resposta.tamanhoPagina;
    } catch (e) {
      erro(mensagem(e));
      logs.value = [];
      total.value = 0;
    } finally {
      carregando.value = false;
    }
  }

  return {
    logs,
    total,
    pagina,
    tamanhoPagina,
    carregando,
    carregar,
  };
}
