import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { categoriaProdutoService } from 'services/categoria-produto.service';
import type {
  CategoriaProdutoFormModel,
  CategoriaProdutoResumoDto,
  ListarCategoriasProdutoParams,
} from 'types/dtos/categoria-produto.dto';
import { formParaSalvarCategoriaProdutoPayload } from 'utils/mappers/categoria-produto.mapper';
import { ref } from 'vue';

export function useCategoriasProduto() {
  const categorias = ref<CategoriaProdutoResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const inativando = ref(false);
  const ativando = ref(false);
  const ultimosParams = ref<ListarCategoriasProdutoParams | undefined>();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarCategoriasProdutoParams): Promise<void> {
    ultimosParams.value = params;
    carregando.value = true;

    try {
      categorias.value = await categoriaProdutoService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: CategoriaProdutoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await categoriaProdutoService.criar(formParaSalvarCategoriaProdutoPayload(form));
      sucesso('Categoria cadastrada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(categoriaId: string, form: CategoriaProdutoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await categoriaProdutoService.editar(categoriaId, formParaSalvarCategoriaProdutoPayload(form));
      sucesso('Categoria atualizada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function inativar(categoriaId: string): Promise<boolean> {
    inativando.value = true;

    try {
      await categoriaProdutoService.inativar(categoriaId);
      sucesso('Categoria inativada com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      inativando.value = false;
    }
  }

  async function ativar(categoriaId: string): Promise<boolean> {
    ativando.value = true;

    try {
      await categoriaProdutoService.ativar(categoriaId);
      sucesso('Categoria ativada com sucesso.');
      await carregar(ultimosParams.value);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  async function solicitarInativacao(categoria: CategoriaProdutoResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar categoria',
      mensagem: `Deseja inativar a categoria ${categoria.nome}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return inativar(categoria.id);
  }

  async function solicitarAtivacao(categoria: CategoriaProdutoResumoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Ativar categoria',
      mensagem: `Deseja reativar a categoria ${categoria.nome}?`,
      textoConfirmar: 'Ativar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    return ativar(categoria.id);
  }

  function rotuloCategoria(categoria: CategoriaProdutoResumoDto): string {
    return `${categoria.codigo} — ${categoria.nome}`;
  }

  return {
    categorias,
    carregando,
    salvando,
    inativando,
    ativando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
    solicitarAtivacao,
    rotuloCategoria,
  };
}
