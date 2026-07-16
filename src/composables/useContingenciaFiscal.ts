import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { ModoContingenciaFiscalValor } from 'constants/enums';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import type {
  ContingenciaStatusDto,
  FilaContingenciaDto,
  NotaFiscalGestaoDto,
} from 'types/dtos/fiscal-gestao.dto';
import { ref } from 'vue';

export function useContingenciaFiscal() {
  const status = ref<ContingenciaStatusDto | null>(null);
  const pendentes = ref<FilaContingenciaDto[]>([]);
  const alertas = ref<NotaFiscalGestaoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      const [statusRes, pendentesRes, alertasRes] = await Promise.all([
        fiscalGestaoService.statusContingencia(),
        fiscalGestaoService.pendentesContingencia(),
        fiscalGestaoService.alertaContingencia168h(),
      ]);
      status.value = statusRes;
      pendentes.value = pendentesRes;
      alertas.value = alertasRes;
    } catch (e) {
      erro(mensagem(e));
      status.value = null;
      pendentes.value = [];
      alertas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function ativar(modo: ModoContingenciaFiscalValor): Promise<boolean> {
    salvando.value = true;
    try {
      status.value = await fiscalGestaoService.ativarContingencia({ modo });
      sucesso('Contingência ativada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function desativar(): Promise<boolean> {
    salvando.value = true;
    try {
      status.value = await fiscalGestaoService.desativarContingencia();
      sucesso('Contingência desativada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function reprocessar(): Promise<boolean> {
    salvando.value = true;
    try {
      const result = await fiscalGestaoService.reprocessarContingencia();
      sucesso(`${result.processados} documento(s) reprocessado(s).`);
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    status,
    pendentes,
    alertas,
    carregando,
    salvando,
    carregar,
    ativar,
    desativar,
    reprocessar,
  };
}
