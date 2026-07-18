import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { safrasService } from 'services/safras.service';
import type { RecomendacaoDto, RecomendacaoFormModel } from 'types/dtos/safras.dto';
import { ref } from 'vue';

function formParaPayload(form: RecomendacaoFormModel) {
  return {
    visitaId: form.visitaId?.trim() || null,
    clienteId: form.clienteId?.trim() || null,
    fazendaId: form.fazendaId?.trim() || null,
    talhaoId: form.talhaoId?.trim() || null,
    safraId: form.safraId?.trim() || null,
    produtoId: form.produtoId?.trim() || null,
    descricao: form.descricao.trim(),
    dose: form.dose.trim() || null,
    unidade: form.unidade.trim() || null,
    dataRecomendacao: form.dataRecomendacao,
  };
}

export function useRecomendacoes() {
  const recomendacoes = ref<RecomendacaoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      recomendacoes.value = await safrasService.listarRecomendacoes();
    } catch (e) {
      erro(mensagem(e));
      recomendacoes.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: RecomendacaoFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.criarRecomendacao(formParaPayload(form));
      sucesso('Recomendação criada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: RecomendacaoFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.editarRecomendacao(id, formParaPayload(form));
      sucesso('Recomendação atualizada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function aplicar(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      await safrasService.aplicarRecomendacao(id);
      sucesso('Recomendação marcada como aplicada.');
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
      titulo: 'Cancelar recomendação',
      mensagem: 'Deseja cancelar esta recomendação?',
      textoConfirmar: 'Cancelar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await safrasService.cancelarRecomendacao(id);
      sucesso('Recomendação cancelada.');
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
    recomendacoes,
    carregando,
    salvando,
    carregar,
    criar,
    editar,
    aplicar,
    cancelar,
  };
}
