import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { TipoVisitaTecnicaValor } from 'constants/enums';
import { messageService } from 'services/message.service';
import { safrasService } from 'services/safras.service';
import type { VisitaTecnicaDto, VisitaTecnicaFormModel } from 'types/dtos/safras.dto';
import { ref } from 'vue';

function formParaPayload(form: VisitaTecnicaFormModel) {
  return {
    clienteId: form.clienteId.trim() || null,
    fazendaId: form.fazendaId.trim() || null,
    talhaoId: form.talhaoId.trim() || null,
    dataVisita: form.dataVisita,
    tipo: form.tipo as TipoVisitaTecnicaValor,
    tecnicoNome: form.tecnicoNome.trim() || null,
    observacoes: form.observacoes.trim() || null,
  };
}

export function useVisitasTecnicas() {
  const visitas = ref<VisitaTecnicaDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      visitas.value = await safrasService.listarVisitas();
    } catch (e) {
      erro(mensagem(e));
      visitas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: VisitaTecnicaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.criarVisita(formParaPayload(form));
      sucesso('Visita técnica registrada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: VisitaTecnicaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.editarVisita(id, formParaPayload(form));
      sucesso('Visita técnica atualizada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function remover(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover visita',
      mensagem: 'Deseja remover esta visita técnica?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await safrasService.removerVisita(id);
      sucesso('Visita removida.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { visitas, carregando, salvando, carregar, criar, editar, remover };
}
