import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { producaoService } from 'services/producao.service';
import type {
  CriarFichaTecnicaProcessoPayload,
  FichaTecnicaFormModel,
  FichaTecnicaProcessoDto,
} from 'types/dtos/producao.dto';
import { ref } from 'vue';

function formParaPayload(form: FichaTecnicaFormModel): CriarFichaTecnicaProcessoPayload {
  return {
    produtoId: form.produtoId || null,
    receitaId: form.receitaId || null,
    temperaturaMin: form.temperaturaMin ? Number(form.temperaturaMin) : null,
    temperaturaMax: form.temperaturaMax ? Number(form.temperaturaMax) : null,
    umidadeMin: form.umidadeMin ? Number(form.umidadeMin) : null,
    umidadeMax: form.umidadeMax ? Number(form.umidadeMax) : null,
    tempoMinutos: form.tempoMinutos ? Number(form.tempoMinutos) : null,
    observacao: form.observacao.trim() || null,
  };
}

export function useFichasTecnicas() {
  const fichas = ref<FichaTecnicaProcessoDto[]>([]);
  const ficha = ref<FichaTecnicaProcessoDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      fichas.value = await producaoService.listarFichasTecnicas();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      ficha.value = await producaoService.obterFichaTecnica(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: FichaTecnicaFormModel): Promise<FichaTecnicaProcessoDto | null> {
    salvando.value = true;
    try {
      const criada = await producaoService.criarFichaTecnica(formParaPayload(form));
      sucesso('Ficha técnica criada.');
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(
    id: string,
    form: FichaTecnicaFormModel,
  ): Promise<FichaTecnicaProcessoDto | null> {
    salvando.value = true;
    try {
      const atualizada = await producaoService.editarFichaTecnica(id, formParaPayload(form));
      sucesso('Ficha técnica atualizada.');
      return atualizada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function remover(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover ficha técnica',
      mensagem: 'Deseja remover esta ficha técnica?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await producaoService.removerFichaTecnica(id);
      sucesso('Ficha técnica removida.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    fichas,
    ficha,
    carregando,
    salvando,
    carregar,
    obter,
    criar,
    editar,
    remover,
  };
}
