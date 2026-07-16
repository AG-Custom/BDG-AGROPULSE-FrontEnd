import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { safrasService } from 'services/safras.service';
import type {
  CriarSafraPayload,
  EditarSafraPayload,
  SafraDto,
  SafraFormModel,
} from 'types/dtos/safras.dto';
import { computed, ref } from 'vue';

function parseNum(valor: string): number | null {
  return valor.trim() ? Number(valor) : null;
}

function formParaCriar(form: SafraFormModel): CriarSafraPayload {
  return {
    nome: form.nome.trim(),
    cultura: form.cultura.trim(),
    fazendaId: form.fazendaId.trim() || null,
    talhaoId: form.talhaoId.trim() || null,
    areaPlanejadaHa: parseNum(form.areaPlanejadaHa),
    dataInicio: form.dataInicio || null,
    dataFim: form.dataFim || null,
    produtividadePlanejada: parseNum(form.produtividadePlanejada),
    observacoes: form.observacoes.trim() || null,
  };
}

function formParaEditar(form: SafraFormModel): EditarSafraPayload {
  return {
    ...formParaCriar(form),
    areaRealizadaHa: parseNum(form.areaRealizadaHa),
    produtividadeRealizada: parseNum(form.produtividadeRealizada),
  };
}

export function useSafras() {
  const safras = ref<SafraDto[]>([]);
  const safra = ref<SafraDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const safraOpcoes = computed(() =>
    safras.value.map((s) => ({
      label: `${s.nome} (${s.cultura})`,
      value: s.id,
    })),
  );

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      safras.value = await safrasService.listarSafras();
    } catch (e) {
      erro(mensagem(e));
      safras.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      safra.value = await safrasService.obterSafra(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: SafraFormModel): Promise<SafraDto | null> {
    salvando.value = true;
    try {
      const criada = await safrasService.criarSafra(formParaCriar(form));
      sucesso('Safra cadastrada.');
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: SafraFormModel): Promise<SafraDto | null> {
    salvando.value = true;
    try {
      const atualizada = await safrasService.editarSafra(id, formParaEditar(form));
      sucesso('Safra atualizada.');
      return atualizada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function encerrar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Encerrar safra',
      mensagem: 'Deseja encerrar este planejamento de safra?',
      textoConfirmar: 'Encerrar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await safrasService.encerrarSafra(id, {});
      sucesso('Safra encerrada.');
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
      titulo: 'Cancelar safra',
      mensagem: 'Deseja cancelar este planejamento de safra?',
      textoConfirmar: 'Cancelar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await safrasService.cancelarSafra(id);
      sucesso('Safra cancelada.');
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
    safras,
    safra,
    safraOpcoes,
    carregando,
    salvando,
    carregar,
    obter,
    criar,
    editar,
    encerrar,
    cancelar,
  };
}
