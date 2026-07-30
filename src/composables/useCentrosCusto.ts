import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  CentroCustoDto,
  CentroCustoFormModel,
  EscopoListagemParams,
} from 'types/dtos/financeiro-gestao.dto';
import { computed, ref } from 'vue';

export function useCentrosCusto() {
  const centros = ref<CentroCustoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const centroOpcoes = computed(() =>
    centros.value
      .filter((c) => c.ativo)
      .map((c) => ({ label: `${c.nome}`, value: c.id })),
  );

  async function carregar(params?: EscopoListagemParams): Promise<void> {
    carregando.value = true;
    try {
      centros.value = await financeiroGestaoService.listarCentrosCusto(params);
    } catch (e) {
      erro(mensagem(e));
      centros.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: CentroCustoFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.criarCentroCusto({
        nome: form.nome.trim(),
        unidadeId: form.unidadeId || null,
      });
      sucesso('Centro de custo criado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(
    id: string,
    form: CentroCustoFormModel,
    ativo = true,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.editarCentroCusto(id, {
        nome: form.nome.trim(),
        ativo,
      });
      sucesso('Centro de custo atualizado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { centros, centroOpcoes, carregando, salvando, carregar, criar, editar };
}
