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
import { computed, ref } from 'vue';

function formParaCriar(form: ContaBancariaFormModel) {
  return {
    cnpjId: form.cnpjId,
    unidadeId: form.unidadeId || null,
    banco: form.banco.trim(),
    agencia: form.agencia.trim(),
    numero: form.numero.trim(),
    tipo: form.tipo as TipoContaBancariaValor,
    saldoMinimo: form.saldoMinimo ? Number(form.saldoMinimo.replace(',', '.')) : null,
    descricao: form.descricao.trim() || null,
  };
}

export function useContasBancarias() {
  const contas = ref<ContaBancariaDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const contaOpcoes = computed(() =>
    contas.value
      .filter((c) => c.ativo)
      .map((c) => ({
        label: `${c.banco} — ${c.agencia}/${c.numero}`,
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

  async function editar(id: string, form: ContaBancariaFormModel, ativo = true): Promise<boolean> {
    salvando.value = true;
    try {
      const base = formParaCriar(form);
      await financeiroGestaoService.editarContaBancaria(id, {
        banco: base.banco,
        agencia: base.agencia,
        numero: base.numero,
        tipo: base.tipo,
        saldoMinimo: base.saldoMinimo,
        descricao: base.descricao,
        ativo,
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
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar conta',
      mensagem: 'Deseja inativar esta conta bancária?',
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await financeiroGestaoService.inativarContaBancaria(item.id);
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

  return {
    contas,
    contaOpcoes,
    carregando,
    salvando,
    carregar,
    criar,
    editar,
    solicitarInativacao,
  };
}
