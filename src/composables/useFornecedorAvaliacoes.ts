import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { fornecedorService } from 'services/fornecedor.service';
import type {
  AvaliacaoFornecedorDto,
  AvaliacaoFornecedorFormModel,
} from 'types/dtos/fornecedor.dto';
import { formParaAvaliacaoPayload } from 'utils/mappers/fornecedor.mapper';
import { ref } from 'vue';

export function useFornecedorAvaliacoes(fornecedorId: () => string) {
  const avaliacoes = ref<AvaliacaoFornecedorDto[]>([]);
  const salvando = ref(false);
  const removendo = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  function definirAvaliacoes(lista: AvaliacaoFornecedorDto[]): void {
    avaliacoes.value = lista;
  }

  async function recarregar(): Promise<void> {
    avaliacoes.value = await fornecedorService.listarAvaliacoes(fornecedorId());
  }

  async function adicionar(form: AvaliacaoFornecedorFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await fornecedorService.adicionarAvaliacao(
        fornecedorId(),
        formParaAvaliacaoPayload(form),
      );
      await recarregar();
      sucesso('Avaliação registrada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(
    avaliacaoId: string,
    form: AvaliacaoFornecedorFormModel,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      await fornecedorService.editarAvaliacao(
        fornecedorId(),
        avaliacaoId,
        formParaAvaliacaoPayload(form),
      );
      await recarregar();
      sucesso('Avaliação atualizada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function remover(avaliacaoId: string): Promise<boolean> {
    removendo.value = true;

    try {
      await fornecedorService.removerAvaliacao(fornecedorId(), avaliacaoId);
      avaliacoes.value = avaliacoes.value.filter((item) => item.id !== avaliacaoId);
      sucesso('Avaliação removida com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      removendo.value = false;
    }
  }

  async function solicitarRemocao(avaliacao: AvaliacaoFornecedorDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover avaliação',
      mensagem: 'Deseja remover esta avaliação do fornecedor?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return remover(avaliacao.id);
  }

  return {
    avaliacoes,
    salvando,
    removendo,
    definirAvaliacoes,
    adicionar,
    editar,
    solicitarRemocao,
  };
}
