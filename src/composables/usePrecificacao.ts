import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { precificacaoService } from 'services/precificacao.service';
import type {
  ListarTabelasPermitidasParams,
  PrecoResolvidoDto,
  ResolverPrecoParams,
  TabelaPrecoPermitidaDto,
} from 'types/dtos/precificacao.dto';
import { computed, ref } from 'vue';

export function usePrecificacao() {
  const tabelasPermitidas = ref<TabelaPrecoPermitidaDto[]>([]);
  const carregandoTabelas = ref(false);
  const resolvendoPreco = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const tabelaOpcoes = computed(() =>
    tabelasPermitidas.value.map((tabela) => {
      if (tabela.ehPadrao) {
        return { label: `${tabela.nome} (padrão)`, value: tabela.id };
      }

      if (tabela.clienteId) {
        return { label: `${tabela.nome} (cliente)`, value: tabela.id };
      }

      return { label: tabela.nome, value: tabela.id };
    }),
  );

  const tabelaPadraoId = computed(
    () => tabelasPermitidas.value.find((tabela) => tabela.ehPadrao)?.id ?? '',
  );

  async function carregarTabelasPermitidas(
    params?: ListarTabelasPermitidasParams,
  ): Promise<void> {
    carregandoTabelas.value = true;

    try {
      tabelasPermitidas.value = await precificacaoService.listarTabelasPermitidas(params);
    } catch (e) {
      tabelasPermitidas.value = [];
      erro(mensagem(e));
    } finally {
      carregandoTabelas.value = false;
    }
  }

  async function resolverPreco(
    params: ResolverPrecoParams,
    silencioso = false,
  ): Promise<PrecoResolvidoDto | null> {
    if (!params.produtoId) {
      return null;
    }

    resolvendoPreco.value = true;

    try {
      return await precificacaoService.resolver(params);
    } catch (e) {
      if (!silencioso) {
        erro(mensagem(e));
      }
      return null;
    } finally {
      resolvendoPreco.value = false;
    }
  }

  return {
    tabelasPermitidas,
    tabelaOpcoes,
    tabelaPadraoId,
    carregandoTabelas,
    resolvendoPreco,
    carregarTabelasPermitidas,
    resolverPreco,
  };
}
