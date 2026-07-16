import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { TipoOrdemServicoAgricolaValor } from 'constants/enums';
import { messageService } from 'services/message.service';
import { safrasService } from 'services/safras.service';
import type {
  OrdemServicoAgricolaDto,
  OrdemServicoAgricolaFormModel,
} from 'types/dtos/safras.dto';
import { ref } from 'vue';

function formParaPayload(form: OrdemServicoAgricolaFormModel) {
  return {
    safraId: form.safraId.trim() || null,
    talhaoId: form.talhaoId.trim() || null,
    tipo: form.tipo as TipoOrdemServicoAgricolaValor,
    dataPlanejada: form.dataPlanejada || null,
    descricao: form.descricao.trim() || null,
    responsavel: form.responsavel.trim() || null,
  };
}

export function useOrdensServicoAgricola() {
  const ordens = ref<OrdemServicoAgricolaDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      ordens.value = await safrasService.listarOrdensServico();
    } catch (e) {
      erro(mensagem(e));
      ordens.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: OrdemServicoAgricolaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.criarOrdemServico(formParaPayload(form));
      sucesso('Ordem de serviço criada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: OrdemServicoAgricolaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.editarOrdemServico(id, formParaPayload(form));
      sucesso('Ordem de serviço atualizada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function iniciar(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.iniciarOrdemServico(id);
      sucesso('OS iniciada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function concluir(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.concluirOrdemServico(id);
      sucesso('OS concluída.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar OS',
      mensagem: 'Deseja cancelar esta ordem de serviço?',
      textoConfirmar: 'Cancelar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await safrasService.cancelarOrdemServico(id);
      sucesso('OS cancelada.');
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
    ordens,
    carregando,
    salvando,
    carregar,
    criar,
    editar,
    iniciar,
    concluir,
    cancelar,
  };
}
