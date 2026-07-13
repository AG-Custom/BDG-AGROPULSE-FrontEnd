import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroService } from 'services/financeiro.service';
import type { CondicaoPagamentoDto } from 'types/dtos/financeiro.dto';
import { computed, ref } from 'vue';

export function useCondicoesPagamento() {
  const condicoes = ref<CondicaoPagamentoDto[]>([]);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const condicaoOpcoes = computed(() =>
    condicoes.value
      .filter((condicao) => condicao.ativo)
      .map((condicao) => ({
        label: `${condicao.codigo} — ${condicao.nome}`,
        value: condicao.id,
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

  function rotuloCondicao(condicaoId: string): string {
    const condicao = condicoes.value.find((item) => item.id === condicaoId);

    if (!condicao) {
      return condicaoId;
    }

    return `${condicao.codigo} — ${condicao.nome}`;
  }

  return {
    condicoes,
    condicaoOpcoes,
    carregando,
    carregar,
    rotuloCondicao,
  };
}
