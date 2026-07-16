import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  CaixaDto,
  CaixaFormModel,
  EscopoListagemParams,
} from 'types/dtos/financeiro-gestao.dto';
import { computed, ref } from 'vue';

export function useCaixas() {
  const caixas = ref<CaixaDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const caixaOpcoes = computed(() =>
    caixas.value
      .filter((c) => c.ativo)
      .map((c) => ({ label: c.nome, value: c.id })),
  );

  async function carregar(params?: EscopoListagemParams): Promise<void> {
    carregando.value = true;
    try {
      caixas.value = await financeiroGestaoService.listarCaixas(params);
    } catch (e) {
      erro(mensagem(e));
      caixas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: CaixaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.criarCaixa({
        nome: form.nome.trim(),
        unidadeId: form.unidadeId || null,
      });
      sucesso('Caixa criado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: CaixaFormModel, ativo = true): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.editarCaixa(id, {
        nome: form.nome.trim(),
        ativo,
      });
      sucesso('Caixa atualizado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { caixas, caixaOpcoes, carregando, salvando, carregar, criar, editar };
}
