import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  ContaBancariaDto,
  ContaBancariaFormModel,
  EscopoListagemParams,
} from 'types/dtos/financeiro-gestao.dto';
import type { TipoContaBancariaValor } from 'constants/enums';
import { parseMascaraMoeda } from 'utils/formatters';
import { computed, ref } from 'vue';

function formParaCriar(form: ContaBancariaFormModel) {
  return {
    cnpjId: form.cnpjId || null,
    unidadeId: form.unidadeId || null,
    banco: form.banco.trim(),
    agencia: form.agencia.trim(),
    conta: form.conta.trim(),
    tipo: form.tipo as TipoContaBancariaValor,
    saldoAtual: parseMascaraMoeda(form.saldoAtual) ?? 0,
    saldoMinimo: parseMascaraMoeda(form.saldoMinimo) ?? 0,
  };
}

export function useContasBancarias() {
  const contas = ref<ContaBancariaDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const ativando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const contaOpcoes = computed(() =>
    contas.value
      .filter((c) => c.ativo)
      .map((c) => ({
        label: `${c.banco} — ${c.agencia}/${c.conta}`,
        value: c.id,
      })),
  );

  async function carregar(params?: EscopoListagemParams): Promise<void> {
    carregando.value = true;
    try {
      contas.value = await financeiroGestaoService.listarContasBancarias(params);
    } catch (e) {
      erro(mensagem(e));
      contas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: ContaBancariaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.criarContaBancaria(formParaCriar(form));
      sucesso('Conta bancária criada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: ContaBancariaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      const base = formParaCriar(form);
      await financeiroGestaoService.editarContaBancaria(id, {
        cnpjId: base.cnpjId,
        unidadeId: base.unidadeId,
        banco: base.banco,
        agencia: base.agencia,
        conta: base.conta,
        tipo: base.tipo,
        saldoMinimo: base.saldoMinimo,
      });
      sucesso('Conta bancária atualizada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function solicitarInativacao(item: ContaBancariaDto): Promise<boolean> {
    const justificativa = await messageService.confirmarComJustificativa({
      titulo: 'Inativar conta',
      mensagem: 'Deseja inativar esta conta bancária?',
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });
    if (!justificativa) return false;

    salvando.value = true;
    try {
      await financeiroGestaoService.inativarContaBancaria(item.id, justificativa);
      sucesso('Conta inativada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function solicitarAtivacao(item: ContaBancariaDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Ativar conta',
      mensagem: 'Deseja reativar esta conta bancária?',
      textoConfirmar: 'Ativar',
      icone: 'info',
    });

    if (!confirmou) return false;

    ativando.value = true;
    try {
      await financeiroGestaoService.ativarContaBancaria(item.id);
      sucesso('Conta ativada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      ativando.value = false;
    }
  }

  return {
    contas,
    contaOpcoes,
    carregando,
    salvando,
    ativando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
    solicitarAtivacao,
  };
}
