import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { StatusVisitaTecnica } from 'constants/enums';
import type { TipoVisitaTecnicaValor } from 'constants/enums';
import { messageService } from 'services/message.service';
import { safrasService } from 'services/safras.service';
import type {
  AdicionarFotoVisitaFormModel,
  CheckInVisitaTecnicaFormModel,
  VisitaTecnicaDto,
  VisitaTecnicaFormModel,
} from 'types/dtos/safras.dto';
import { ref } from 'vue';

function numOuNulo(valor: string): number | null {
  if (!valor.trim()) return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

function textoOuNulo(valor: string | null | undefined): string | null {
  return valor?.trim() || null;
}

function formParaPayload(form: VisitaTecnicaFormModel) {
  return {
    clienteId: textoOuNulo(form.clienteId),
    fazendaId: textoOuNulo(form.fazendaId),
    talhaoId: textoOuNulo(form.talhaoId),
    dataVisita: form.dataVisita,
    tipo: form.tipo as TipoVisitaTecnicaValor,
    status: form.status,
    tecnicoNome: form.tecnicoNome.trim() || null,
    observacoes: form.observacoes.trim() || null,
    duracaoMin: numOuNulo(form.duracaoMin),
  };
}

export function visitaVazia(): VisitaTecnicaFormModel {
  return {
    clienteId: '',
    fazendaId: '',
    talhaoId: '',
    dataVisita: new Date().toISOString().slice(0, 10),
    tipo: '',
    status: StatusVisitaTecnica.Agendada,
    tecnicoNome: '',
    observacoes: '',
    duracaoMin: '',
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

  async function checkIn(
    id: string,
    form: CheckInVisitaTecnicaFormModel,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.checkInVisita(id, {
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });
      sucesso('Check-in registrado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function adicionarFoto(
    id: string,
    form: AdicionarFotoVisitaFormModel,
  ): Promise<boolean> {
    if (!form.arquivo) {
      erro('Selecione uma foto para enviar.');
      return false;
    }

    salvando.value = true;
    try {
      await safrasService.adicionarFotoVisita(
        id,
        form.arquivo,
        form.legenda.trim() || null,
      );
      sucesso('Foto adicionada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function removerFoto(visitaId: string, fotoId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover foto',
      mensagem: 'Deseja remover esta foto da visita?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await safrasService.removerFotoVisita(visitaId, fotoId);
      sucesso('Foto removida.');
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
    visitas,
    carregando,
    salvando,
    carregar,
    criar,
    editar,
    remover,
    checkIn,
    adicionarFoto,
    removerFoto,
  };
}
