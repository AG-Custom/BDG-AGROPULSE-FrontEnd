import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { pdvService } from 'services/pdv.service';
import type {
  ListarPdvVendasParams,
  PdvNotaFiscalDto,
  PdvVendaDto,
  PdvVendaFormModel,
  PdvVendaResumoDto,
} from 'types/dtos/pdv.dto';
import type { FormaPagamentoValor } from 'constants/enums';
import { apenasDigitos, parseMascaraMoeda } from 'utils/formatters';
import { ref } from 'vue';

function parsePrecoOpcional(valor: string): number | null {
  const numero = parseMascaraMoeda(valor);
  return numero !== null && numero > 0 ? numero : null;
}

export function usePdv() {
  const vendas = ref<PdvVendaResumoDto[]>([]);
  const venda = ref<PdvVendaDto | null>(null);
  const nota = ref<PdvNotaFiscalDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const emitindoNfce = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarVendas(params?: ListarPdvVendasParams): Promise<void> {
    carregando.value = true;

    try {
      vendas.value = await pdvService.listarVendas(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterVenda(vendaId: string): Promise<boolean> {
    carregando.value = true;

    try {
      venda.value = await pdvService.obterVenda(vendaId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function vender(form: PdvVendaFormModel): Promise<PdvVendaDto | null> {
    salvando.value = true;

    try {
      const criada = await pdvService.vender({
        clienteId: form.clienteId || null,
        clienteNomeAvulso: form.clienteNomeAvulso.trim() || null,
        clienteDocumentoAvulso: apenasDigitos(form.clienteDocumentoAvulso) || null,
        tabelaPrecoId: form.tabelaPrecoId || null,
        aPrazo: form.aPrazo,
        itens: form.itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: Number(item.quantidade),
          precoUnitario: parsePrecoOpcional(item.precoUnitario),
          numeroLote: item.numeroLote.trim() || null,
          loteId: item.loteId.trim() || null,
        })),
        pagamentos: form.aPrazo
          ? undefined
          : form.pagamentos
              .filter((pagamento) => pagamento.formaPagamento && pagamento.valor.trim())
              .map((pagamento) => ({
                formaPagamento: pagamento.formaPagamento as FormaPagamentoValor,
                valor: parseMascaraMoeda(pagamento.valor) ?? 0,
              })),
      });
      sucesso('Venda PDV registrada com sucesso.');
      if (criada.nfceStatus === 'Pendente') {
        erro(`A NFC-e ficou pendente: ${criada.nfceMensagem ?? 'tente emitir novamente pela venda.'}`);
      }
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarNota(vendaId: string): Promise<void> {
    try {
      nota.value = await pdvService.obterNotaFiscal(vendaId);
    } catch (e) {
      erro(mensagem(e));
    }
  }

  async function pedirConfirmacaoCancelamento(): Promise<{ confirmou: boolean; motivo?: string }> {
    const status = nota.value?.status;
    if (status === 'Emitida' || status === 'Contingencia') {
      const motivo = await messageService.confirmarComJustificativa({
        titulo: 'Cancelar venda PDV',
        mensagem:
          'A NFC-e desta venda será cancelada na SEFAZ, as contas a receber serão canceladas e o estoque estornado.',
        textoConfirmar: 'Cancelar venda e NFC-e',
        minimoCaracteres: 15,
        maximoCaracteres: 255,
        placeholder: 'Motivo do cancelamento da NFC-e (15 a 255 caracteres)',
      });
      return { confirmou: motivo !== null, motivo: motivo ?? undefined };
    }

    const confirmou = await messageService.confirmarDestrutivo({
      titulo: 'Cancelar venda PDV',
      mensagem:
        'O estoque será estornado e as contas a receber da venda serão canceladas. Confirme a digitação para cancelar.',
      textoConfirmar: 'Cancelar venda',
      icone: 'warning',
    });
    return { confirmou: Boolean(confirmou) };
  }

  async function cancelar(vendaId: string): Promise<boolean> {
    const { confirmou, motivo } = await pedirConfirmacaoCancelamento();

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      venda.value = await pdvService.cancelar(vendaId, motivo);
      await carregarNota(vendaId);
      sucesso('Venda PDV cancelada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function emitirNfce(vendaId: string): Promise<boolean> {
    emitindoNfce.value = true;

    try {
      const resultado = await pdvService.emitirNfce(vendaId);
      const detalhe = [resultado.status, resultado.chaveAcesso].filter(Boolean).join(' · ');
      sucesso(resultado.mensagem ?? (detalhe ? `NFC-e: ${detalhe}` : 'NFC-e processada'));
      await obterVenda(vendaId);
      await carregarNota(vendaId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      await carregarNota(vendaId);
      return false;
    } finally {
      emitindoNfce.value = false;
    }
  }

  return {
    vendas,
    venda,
    nota,
    carregando,
    salvando,
    emitindoNfce,
    carregarVendas,
    obterVenda,
    carregarNota,
    vender,
    cancelar,
    emitirNfce,
  };
}
