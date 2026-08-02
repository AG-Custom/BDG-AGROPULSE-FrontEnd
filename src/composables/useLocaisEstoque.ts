import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { estoqueService } from 'services/estoque.service';
import type {
  CriarLocalEstoquePayload,
  EditarLocalEstoquePayload,
  ListarLocaisEstoqueParams,
  LocalEstoqueDto,
  LocalEstoqueNoDto,
} from 'types/dtos/estoque.dto';
import { ref } from 'vue';

export function useLocaisEstoque() {
  const locais = ref<LocalEstoqueDto[]>([]);
  const arvore = ref<LocalEstoqueNoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarLocaisEstoqueParams): Promise<void> {
    carregando.value = true;

    try {
      locais.value = await estoqueService.listarLocais(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarArvore(ativo?: boolean): Promise<void> {
    carregando.value = true;

    try {
      arvore.value = await estoqueService.listarLocaisArvore(ativo);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(payload: CriarLocalEstoquePayload): Promise<LocalEstoqueDto | null> {
    salvando.value = true;

    try {
      const criado = await estoqueService.criarLocal(payload);
      sucesso('Local de estoque criado com sucesso.');
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
    payload: EditarLocalEstoquePayload,
  ): Promise<LocalEstoqueDto | null> {
    salvando.value = true;

    try {
      const atualizado = await estoqueService.editarLocal(id, payload);
      sucesso('Local de estoque atualizado com sucesso.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function solicitarInativacao(local: LocalEstoqueDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar local',
      mensagem: `Deseja inativar o local "${local.nome}"?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await estoqueService.inativarLocal(local.id, 'Inativação solicitada pelo usuário');
      sucesso('Local inativado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function ativar(local: LocalEstoqueDto): Promise<boolean> {
    salvando.value = true;

    try {
      await estoqueService.ativarLocal(local.id);
      sucesso('Local ativado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    locais,
    arvore,
    carregando,
    salvando,
    carregar,
    carregarArvore,
    criar,
    editar,
    solicitarInativacao,
    ativar,
  };
}
