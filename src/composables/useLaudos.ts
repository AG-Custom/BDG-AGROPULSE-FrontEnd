import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { producaoService } from 'services/producao.service';
import type {
  CriarLaudoQualidadePayload,
  LaudoQualidadeDto,
  LaudoQualidadeFormModel,
} from 'types/dtos/producao.dto';
import { ref } from 'vue';

function formParaPayload(form: LaudoQualidadeFormModel): CriarLaudoQualidadePayload {
  return {
    loteId: form.loteId,
    produtoId: form.produtoId,
    ordemProducaoId: form.ordemProducaoId || null,
    dataAnalise: form.dataAnalise,
    resultado: form.resultado.trim() || null,
    parametros: form.parametros.map((p) => ({
      nome: p.nome.trim(),
      valor: p.valor.trim(),
      unidade: p.unidade.trim() || null,
      minimo: p.minimo.trim() || null,
      maximo: p.maximo.trim() || null,
    })),
  };
}

export function useLaudos() {
  const laudos = ref<LaudoQualidadeDto[]>([]);
  const laudo = ref<LaudoQualidadeDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      laudos.value = await producaoService.listarLaudos();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      laudo.value = await producaoService.obterLaudo(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: LaudoQualidadeFormModel): Promise<LaudoQualidadeDto | null> {
    salvando.value = true;
    try {
      const criado = await producaoService.criarLaudo(formParaPayload(form));
      sucesso('Laudo criado.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(
    id: string,
    form: LaudoQualidadeFormModel,
  ): Promise<LaudoQualidadeDto | null> {
    salvando.value = true;
    try {
      const atualizado = await producaoService.editarLaudo(id, formParaPayload(form));
      sucesso('Laudo atualizado.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function aprovar(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      laudo.value = await producaoService.aprovarLaudo(id);
      sucesso('Laudo aprovado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function reprovar(id: string, resultado?: string): Promise<boolean> {
    salvando.value = true;
    try {
      laudo.value = await producaoService.reprovarLaudo(id, {
        resultado: resultado?.trim() || null,
      });
      sucesso('Laudo reprovado.');
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
      titulo: 'Remover laudo',
      mensagem: 'Deseja remover este laudo?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await producaoService.removerLaudo(id);
      sucesso('Laudo removido.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    laudos,
    laudo,
    carregando,
    salvando,
    carregar,
    obter,
    criar,
    editar,
    aprovar,
    reprovar,
    remover,
  };
}
