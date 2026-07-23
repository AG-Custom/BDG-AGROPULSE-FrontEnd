import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { financeiroService } from 'services/financeiro.service';
import type {
  CondicaoPagamentoDto,
  CondicaoPagamentoFormModel,
} from 'types/dtos/financeiro.dto';
import { computed, ref } from 'vue';

function formParaPayload(form: CondicaoPagamentoFormModel) {
  return {
    nome: form.nome.trim(),
    numeroParcelas: Number(form.numeroParcelas),
    intervaloDias: Number(form.intervaloDias),
  };
}

export function useCondicoesPagamento() {
  const condicoes = ref<CondicaoPagamentoDto[]>([]);
  const condicao = ref<CondicaoPagamentoDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const condicaoOpcoes = computed(() =>
    condicoes.value
      .filter((item) => item.ativo)
      .map((item) => ({
        label: `${item.nome}`,
        value: item.id,
      })),
  );

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      condicoes.value = await financeiroService.listarCondicoesPagamento();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      condicao.value = await financeiroService.obterCondicaoPagamento(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(
    form: CondicaoPagamentoFormModel,
  ): Promise<CondicaoPagamentoDto | null> {
    salvando.value = true;

    try {
      const criado = await financeiroService.criarCondicaoPagamento(formParaPayload(form));
      sucesso('Condição criada com sucesso.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: CondicaoPagamentoFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      condicao.value = await financeiroService.editarCondicaoPagamento(
        id,
        formParaPayload(form),
      );
      sucesso('Condição atualizada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function solicitarInativacao(item: CondicaoPagamentoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar condição',
      mensagem: `Deseja inativar a condição ${item.nome}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await financeiroService.inativarCondicaoPagamento(item.id);
      sucesso('Condição inativada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  function rotuloCondicao(condicaoId: string): string {
    const item = condicoes.value.find((c) => c.id === condicaoId);
    if (!item) {
      return condicaoId;
    }
    return `${item.nome}`;
  }

  return {
    condicoes,
    condicao,
    condicaoOpcoes,
    carregando,
    salvando,
    carregar,
    obter,
    criar,
    editar,
    solicitarInativacao,
    rotuloCondicao,
  };
}
