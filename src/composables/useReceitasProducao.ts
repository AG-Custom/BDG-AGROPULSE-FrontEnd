import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { producaoService } from 'services/producao.service';
import type {
  CriarReceitaProducaoPayload,
  ReceitaProducaoDto,
  ReceitaProducaoFormModel,
} from 'types/dtos/producao.dto';
import { ref } from 'vue';

function formParaPayload(form: ReceitaProducaoFormModel): CriarReceitaProducaoPayload {
  return {
    produtoSaidaId: form.produtoSaidaId,
    versao: Number(form.versao),
    observacao: form.observacao.trim() || null,
    itens: form.itens.map((item) => ({
      produtoInsumoId: item.produtoInsumoId,
      quantidade: Number(item.quantidade),
      toleranciaPct: item.toleranciaPct ? Number(item.toleranciaPct) : null,
    })),
  };
}

export function useReceitasProducao() {
  const receitas = ref<ReceitaProducaoDto[]>([]);
  const receita = ref<ReceitaProducaoDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(produtoSaidaId?: string): Promise<void> {
    carregando.value = true;
    try {
      receitas.value = await producaoService.listarReceitas(produtoSaidaId);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      receita.value = await producaoService.obterReceita(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: ReceitaProducaoFormModel): Promise<ReceitaProducaoDto | null> {
    salvando.value = true;
    try {
      const criada = await producaoService.criarReceita(formParaPayload(form));
      sucesso('Receita criada.');
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
    form: ReceitaProducaoFormModel,
  ): Promise<ReceitaProducaoDto | null> {
    salvando.value = true;
    try {
      const atualizada = await producaoService.editarReceita(id, formParaPayload(form));
      sucesso('Receita atualizada.');
      return atualizada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function ativar(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      const atualizada = await producaoService.ativarReceita(id);
      sucesso('Receita ativada.');
      const idx = receitas.value.findIndex((r) => r.id === id);
      if (idx >= 0) receitas.value[idx] = atualizada;
      if (receita.value?.id === id) receita.value = atualizada;
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
      titulo: 'Remover receita',
      mensagem: 'Deseja remover esta receita/BOM?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await producaoService.removerReceita(id);
      sucesso('Receita removida.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    receitas,
    receita,
    carregando,
    salvando,
    carregar,
    obter,
    criar,
    editar,
    ativar,
    remover,
  };
}
