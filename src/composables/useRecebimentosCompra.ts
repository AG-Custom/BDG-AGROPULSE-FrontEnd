import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { comprasService } from 'services/compras.service';
import type {
  AtualizarItensRecebimentoPayload,
  ConfirmarRecebimentoPayload,
  CompararFiscalEntradaDto,
  ConverterQuantidadeNfeDto,
  DivergenciaFiscalEntradaDto,
  CriarRecebimentoPayload,
  ListarRecebimentosCompraParams,
  PreviewRecebimentoXmlDto,
  PreviewXmlRecebimentoPayload,
  RecebimentoCompraDto,
  RegistrarDivergenciaRecebimentoPayload,
} from 'types/dtos/compras.dto';
import { parseMascaraMoeda } from 'utils/formatters';
import { ref } from 'vue';

export interface ItemFiscalNfe {
  chave: string;
  produtoId: string;
  ncm: string;
  cest: string;
  origem: string;
  cstIcms: string;
  csosn: string;
  aliquotaIcms: number | null;
  divergenciasFiscais: DivergenciaFiscalEntradaDto[];
}

export interface ItemConversaoNfe {
  chave: string;
  produtoId: string;
  quantidadeRecebida: string;
  custoUnitario: string;
  fatorDivisaoNfe: number;
  quantidadeEstoque: number | null;
  custoUnitarioEstoque: number | null;
}

export function useRecebimentosCompra() {
  const recebimentos = ref<RecebimentoCompraDto[]>([]);
  const recebimento = ref<RecebimentoCompraDto | null>(null);
  const previewXml = ref<PreviewRecebimentoXmlDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();
  const conversoesAplicadas = new Map<string, string>();
  const fiscaisAplicados = new Map<string, string>();

  async function carregar(params?: ListarRecebimentosCompraParams): Promise<void> {
    carregando.value = true;

    try {
      recebimentos.value = await comprasService.listarRecebimentos(params);
    } catch (e) {
      erro(mensagem(e));
      recebimentos.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      recebimento.value = await comprasService.obterRecebimento(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function previewXmlConteudo(
    payload: PreviewXmlRecebimentoPayload,
  ): Promise<PreviewRecebimentoXmlDto | null> {
    salvando.value = true;

    try {
      previewXml.value = await comprasService.previewXmlRecebimento(payload);
      sucesso('XML analisado.');
      return previewXml.value;
    } catch (e) {
      erro(mensagem(e));
      previewXml.value = null;
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function criar(
    payload: CriarRecebimentoPayload,
  ): Promise<RecebimentoCompraDto | null> {
    salvando.value = true;

    try {
      const criado = await comprasService.criarRecebimento(payload);
      sucesso('Recebimento criado.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function atualizarItens(
    id: string,
    payload: AtualizarItensRecebimentoPayload,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      recebimento.value = await comprasService.atualizarItensRecebimento(id, payload);
      sucesso('Itens atualizados.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function registrarDivergencia(
    id: string,
    payload: RegistrarDivergenciaRecebimentoPayload,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      recebimento.value = await comprasService.registrarDivergenciaRecebimento(id, payload);
      sucesso('Divergência registrada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function confirmar(
    id: string,
    payload?: ConfirmarRecebimentoPayload | null,
  ): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Confirmar recebimento',
      mensagem:
        'Confirma o recebimento? Isso gera entrada de estoque, contas a pagar e histórico.',
      textoConfirmar: 'Confirmar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      recebimento.value = await comprasService.confirmarRecebimento(id, payload);
      sucesso('Recebimento confirmado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  function limparPreview(): void {
    previewXml.value = null;
  }

  function lembrarConversao(
    chave: string,
    produtoId: string,
    quantidade: number,
    custoUnitario: number,
  ): void {
    conversoesAplicadas.set(chave, `${produtoId}|${quantidade}|${custoUnitario}`);
  }

  async function sincronizarConversoes(itens: ItemConversaoNfe[]): Promise<void> {
    await Promise.all(
      itens.map(async (item) => {
        const quantidade = Number(item.quantidadeRecebida);
        const custoUnitario = parseMascaraMoeda(item.custoUnitario) ?? 0;
        if (!Number.isFinite(quantidade) || quantidade < 0) {
          return;
        }

        const assinatura = `${item.produtoId}|${quantidade}|${custoUnitario}`;
        if (conversoesAplicadas.get(item.chave) === assinatura) {
          return;
        }

        try {
          const resultado: ConverterQuantidadeNfeDto = await comprasService.converterQuantidadeNfe({
            produtoId: item.produtoId || null,
            quantidade,
            custoUnitario,
          });
          conversoesAplicadas.set(item.chave, assinatura);
          item.fatorDivisaoNfe = resultado.fatorDivisaoNfe;
          item.quantidadeEstoque = resultado.quantidadeEstoque;
          item.custoUnitarioEstoque = resultado.custoUnitarioEstoque;
        } catch (e) {
          erro(mensagem(e));
        }
      }),
    );
  }

  function assinaturaFiscal(item: ItemFiscalNfe): string {
    return [
      item.produtoId,
      item.ncm,
      item.cest,
      item.origem,
      item.cstIcms,
      item.csosn,
      item.aliquotaIcms ?? '',
    ].join('|');
  }

  function lembrarFiscal(item: ItemFiscalNfe): void {
    fiscaisAplicados.set(item.chave, assinaturaFiscal(item));
  }

  function invalidarFiscal(chave: string): void {
    fiscaisAplicados.delete(chave);
  }

  async function sincronizarDivergenciasFiscais(itens: ItemFiscalNfe[]): Promise<void> {
    await Promise.all(
      itens.map(async (item) => {
        if (!item.produtoId) {
          item.divergenciasFiscais = [];
          fiscaisAplicados.set(item.chave, assinaturaFiscal(item));
          return;
        }

        const assinatura = assinaturaFiscal(item);
        if (fiscaisAplicados.get(item.chave) === assinatura) {
          return;
        }

        try {
          const resultado: CompararFiscalEntradaDto = await comprasService.compararFiscalRecebimento({
            produtoId: item.produtoId,
            ncm: item.ncm || null,
            cest: item.cest || null,
            origem: item.origem || null,
            cstIcms: item.cstIcms || null,
            csosn: item.csosn || null,
            aliquotaIcms: item.aliquotaIcms,
          });
          fiscaisAplicados.set(item.chave, assinatura);
          item.divergenciasFiscais = resultado.divergencias ?? [];
        } catch (e) {
          erro(mensagem(e));
        }
      }),
    );
  }

  return {
    recebimentos,
    recebimento,
    previewXml,
    carregando,
    salvando,
    carregar,
    obter,
    previewXmlConteudo,
    criar,
    atualizarItens,
    registrarDivergencia,
    confirmar,
    limparPreview,
    lembrarConversao,
    sincronizarConversoes,
    lembrarFiscal,
    invalidarFiscal,
    sincronizarDivergenciasFiscais,
  };
}
