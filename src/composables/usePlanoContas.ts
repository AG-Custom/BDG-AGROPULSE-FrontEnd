import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { planoContasService } from 'services/plano-contas.service';
import type { ContaContabilDto, ContaContabilFormModel } from 'types/dtos/plano-contas.dto';
import { computed, ref } from 'vue';

export function usePlanoContas() {
  const contas = ref<ContaContabilDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const contaOpcoes = computed(() =>
    contas.value
      .filter((c) => c.ativo && c.analitica)
      .map((c) => ({ label: `${c.codigo} - ${c.nome}`, value: c.codigo })),
  );

  const contasSinteticasOpcoes = computed(() =>
    contas.value
      .filter((c) => c.ativo && !c.analitica)
      .map((c) => ({ label: `${c.codigo} - ${c.nome}`, value: c.id })),
  );

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      contas.value = await planoContasService.listar();
    } catch (e) {
      erro(mensagem(e));
      contas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function executar(acao: () => Promise<unknown>, mensagemSucesso: string): Promise<boolean> {
    salvando.value = true;
    try {
      await acao();
      sucesso(mensagemSucesso);
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  function criar(form: ContaContabilFormModel): Promise<boolean> {
    return executar(
      () =>
        planoContasService.criar({
          codigo: form.codigo.trim(),
          nome: form.nome.trim(),
          natureza: form.natureza,
          analitica: form.analitica,
          paiId: form.paiId,
        }),
      'Conta contábil criada.',
    );
  }

  function editar(id: string, form: ContaContabilFormModel): Promise<boolean> {
    return executar(
      () =>
        planoContasService.editar(id, {
          nome: form.nome.trim(),
          natureza: form.natureza,
          analitica: form.analitica,
        }),
      'Conta contábil atualizada.',
    );
  }

  function inativar(id: string): Promise<boolean> {
    return executar(() => planoContasService.inativar(id), 'Conta inativada.');
  }

  function ativar(id: string): Promise<boolean> {
    return executar(() => planoContasService.ativar(id), 'Conta ativada.');
  }

  return {
    contas,
    contaOpcoes,
    contasSinteticasOpcoes,
    carregando,
    salvando,
    carregar,
    criar,
    editar,
    inativar,
    ativar,
  };
}
