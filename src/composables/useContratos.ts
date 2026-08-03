import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import {
  ContratoStatus,
  TipoContrato,
  type FontePrecoValor,
  type TipoContratoValor,
  type TipoOperacaoTermoValor,
  type UnidadeGraoValor,
} from 'constants/enums';
import { messageService } from 'services/message.service';
import { contratoService } from 'services/contrato.service';
import type {
  AlertaContratoDto,
  ContratoDto,
  ContratoFormModel,
  CotacaoMercadoDto,
  CriarContratoPayload,
  EntregaContratoDto,
  EntregaPayload,
  ListarContratosParams,
  LiquidarContratoPayload,
  PainelContratoItemDto,
  PainelSafraItemDto,
  VinculoPedidoContratoDto,
} from 'types/dtos/contrato.dto';
import { formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import { type Ref, ref, unref } from 'vue';

function parseOpcional(valor: string): number | null {
  const t = valor.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function formParaPayload(form: ContratoFormModel): CriarContratoPayload {
  const payload: CriarContratoPayload = {
    clienteId: form.clienteId,
    produtoId: form.produtoId,
    quantidade: Number(form.quantidade),
    preco: parseMascaraMoeda(form.preco) ?? 0,
    fontePreco: form.fontePreco as FontePrecoValor,
    dataInicio: form.dataInicio,
    dataFim: form.dataFim || null,
    observacao: form.observacao.trim() || null,
    safraId: form.safraId.trim() || null,
  };

  if (form.numeroCpr.trim()) payload.numeroCpr = form.numeroCpr.trim();
  if (form.qualidadeMinima.trim()) payload.qualidadeMinima = form.qualidadeMinima.trim();
  if (form.localEntrega.trim()) payload.localEntrega = form.localEntrega.trim();
  if (form.dataEntregaPrevista) payload.dataEntregaPrevista = form.dataEntregaPrevista;
  if (form.partes.trim()) payload.emitenteNome = form.partes.trim();
  if (form.garantias.trim()) {
    payload.garantias = [{ descricao: form.garantias.trim() }];
  }

  const valorInsumos = parseMascaraMoeda(form.valorInsumos);
  const precoRef = parseMascaraMoeda(form.precoReferencia);
  if (valorInsumos !== null) {
    payload.quantidadeInsumo = 1;
    payload.precoInsumo = valorInsumos;
  }
  if (form.produtoGraoId.trim()) payload.produtoGraoId = form.produtoGraoId.trim();
  const qtdGraos = parseOpcional(form.quantidadeGraos);
  if (qtdGraos !== null) payload.quantidadeGrao = qtdGraos;
  if (form.unidadeGrao) payload.unidadeGrao = form.unidadeGrao as UnidadeGraoValor;
  if (precoRef !== null) payload.precoReferenciaGrao = precoRef;

  if (form.tipoOperacao) {
    payload.tipoOperacao = form.tipoOperacao as TipoOperacaoTermoValor;
  }

  return payload;
}

export function formVazioContrato(): ContratoFormModel {
  return {
    clienteId: '',
    produtoId: '',
    quantidade: '',
    preco: '',
    fontePreco: '',
    dataInicio: '',
    dataFim: '',
    observacao: '',
    safraId: '',
    numeroCpr: '',
    qualidadeMinima: '',
    localEntrega: '',
    dataEntregaPrevista: '',
    partes: '',
    garantias: '',
    valorInsumos: '',
    produtoGraoId: '',
    quantidadeGraos: '',
    unidadeGrao: '',
    precoReferencia: '',
    quantidadeEquivalente: '',
    tipoOperacao: '',
  };
}

export function contratoParaForm(c: ContratoDto): ContratoFormModel {
  return {
    clienteId: c.clienteId,
    produtoId: c.produtoId,
    quantidade: String(c.quantidade),
    preco: formatarMoedaParaInput(c.preco),
    fontePreco: c.fontePreco,
    dataInicio: c.dataInicio.slice(0, 10),
    dataFim: c.dataFim?.slice(0, 10) ?? '',
    observacao: c.observacao ?? '',
    safraId: c.safraId ?? '',
    numeroCpr: c.numeroCpr ?? '',
    qualidadeMinima: c.qualidadeMinima ?? '',
    localEntrega: c.localEntrega ?? '',
    dataEntregaPrevista: c.dataEntregaPrevista?.slice(0, 10) ?? '',
    partes: c.emitenteNome ?? c.credorNome ?? '',
    garantias: c.garantias?.map((g) => g.descricao).join('; ') ?? '',
    valorInsumos:
      c.precoInsumo != null && c.quantidadeInsumo != null
        ? formatarMoedaParaInput(c.precoInsumo * c.quantidadeInsumo)
        : '',
    produtoGraoId: c.produtoGraoId ?? '',
    quantidadeGraos: c.quantidadeGrao != null ? String(c.quantidadeGrao) : '',
    unidadeGrao: c.unidadeGrao ?? '',
    precoReferencia: formatarMoedaParaInput(c.precoReferenciaGrao),
    quantidadeEquivalente: c.quantidadeGrao != null ? String(c.quantidadeGrao) : '',
    tipoOperacao: c.tipoOperacao ?? '',
  };
}

export function saldoContrato(c: ContratoDto): number {
  if (c.quantidadePendente != null) return c.quantidadePendente;
  const entregue = c.quantidadeEntregue ?? 0;
  return Math.max(0, c.quantidade - entregue);
}

export function diasVencimentoContrato(c: ContratoDto): number | null {
  if (c.diasParaVencimento != null) return c.diasParaVencimento;
  const ref = c.dataEntregaPrevista ?? c.dataFim;
  if (!ref) return null;
  const fim = new Date(`${ref.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(fim.getTime())) return null;
  const hoje = new Date();
  hoje.setHours(12, 0, 0, 0);
  return Math.round((fim.getTime() - hoje.getTime()) / 86_400_000);
}

export type ContratoComTipo = ContratoDto & { tipoRotulo: string };

export async function listarContratosAbertosPorCliente(
  clienteId: string,
): Promise<ContratoComTipo[]> {
  if (!clienteId) {
    return [];
  }

  const [cprs, barters, termos] = await Promise.all([
    contratoService.listar(TipoContrato.Cpr, { status: ContratoStatus.Aberto }),
    contratoService.listar(TipoContrato.Barter, { status: ContratoStatus.Aberto }),
    contratoService.listar(TipoContrato.Termo, { status: ContratoStatus.Aberto }),
  ]);

  return [
    ...cprs
      .filter((c) => c.clienteId === clienteId)
      .map((c) => ({ ...c, tipoRotulo: 'CPR' })),
    ...barters
      .filter((c) => c.clienteId === clienteId)
      .map((c) => ({ ...c, tipoRotulo: 'Barter' })),
    ...termos
      .filter((c) => c.clienteId === clienteId)
      .map((c) => ({ ...c, tipoRotulo: 'Termo' })),
  ];
}

export function useContratos(tipo: TipoContratoValor | Ref<TipoContratoValor>) {
  const contratos = ref<ContratoDto[]>([]);
  const contrato = ref<ContratoDto | null>(null);
  const cotacao = ref<CotacaoMercadoDto | null>(null);
  const cotacoes = ref<CotacaoMercadoDto[]>([]);
  const alertas = ref<AlertaContratoDto[]>([]);
  const painel = ref<PainelContratoItemDto[]>([]);
  const painelSafra = ref<PainelSafraItemDto[]>([]);
  const vinculos = ref<VinculoPedidoContratoDto[]>([]);
  const entregas = ref<EntregaContratoDto[]>([]);
  const carregando = ref(false);
  const carregandoCotacao = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  function tipoAtual(): TipoContratoValor {
    return unref(tipo);
  }

  async function carregar(params?: ListarContratosParams): Promise<void> {
    carregando.value = true;

    try {
      contratos.value = await contratoService.listar(tipoAtual(), params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      contrato.value = await contratoService.obter(tipoAtual(), id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: ContratoFormModel): Promise<ContratoDto | null> {
    salvando.value = true;

    try {
      const criado = await contratoService.criar(tipoAtual(), formParaPayload(form));
      sucesso('Contrato criado com sucesso.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(id: string, form: ContratoFormModel): Promise<ContratoDto | null> {
    salvando.value = true;

    try {
      const atualizado = await contratoService.editar(
        tipoAtual(),
        id,
        formParaPayload(form),
      );
      sucesso('Contrato atualizado com sucesso.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function liquidar(
    id: string,
    payload?: LiquidarContratoPayload,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      contrato.value = await contratoService.liquidar(tipoAtual(), id, payload);
      sucesso('Contrato liquidado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function entregar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Entregar contrato',
      mensagem: 'Deseja marcar este contrato como totalmente entregue?',
      textoConfirmar: 'Entregar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      contrato.value = await contratoService.entregar(tipoAtual(), id);
      sucesso('Contrato entregue.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function criarEntrega(id: string, payload: EntregaPayload): Promise<boolean> {
    salvando.value = true;

    try {
      await contratoService.criarEntrega(tipoAtual(), id, payload);
      contrato.value = await contratoService.obter(tipoAtual(), id);
      await carregarEntregas(id);
      sucesso('Entrega parcial registrada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar contrato',
      mensagem: 'Deseja cancelar este contrato?',
      textoConfirmar: 'Cancelar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await contratoService.cancelar(tipoAtual(), id);
      sucesso('Contrato cancelado.');
      contrato.value = await contratoService.obter(tipoAtual(), id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarCotacaoMercado(
    produto?: string,
    fonte: FontePrecoValor = 'Esalq',
  ): Promise<void> {
    carregandoCotacao.value = true;

    try {
      if (produto) {
        cotacao.value = await contratoService.cotacaoMercado(produto, fonte);
        return;
      }

      cotacoes.value = await contratoService.listarCotacoesMercado(fonte);
      cotacao.value = cotacoes.value[0] ?? null;
    } catch (e) {
      erro(mensagem(e));
      if (!produto) {
        cotacoes.value = [];
      }
      cotacao.value = null;
    } finally {
      carregandoCotacao.value = false;
    }
  }

  async function carregarAlertas(): Promise<void> {
    try {
      alertas.value = await contratoService.alertas();
    } catch (e) {
      erro(mensagem(e));
      alertas.value = [];
    }
  }

  async function carregarPainel(): Promise<void> {
    try {
      painel.value = await contratoService.painel();
    } catch (e) {
      erro(mensagem(e));
      painel.value = [];
    }
  }

  async function carregarPainelSafra(): Promise<void> {
    try {
      painelSafra.value = await contratoService.painelSafra();
    } catch (e) {
      erro(mensagem(e));
      painelSafra.value = [];
    }
  }

  async function carregarVinculos(id: string): Promise<void> {
    try {
      vinculos.value = await contratoService.vinculos(tipoAtual(), id);
    } catch {
      vinculos.value = [];
    }
  }

  async function calcularEquivalente(
    valorInsumos: number,
    precoReferencia: number,
    _unidadeGrao?: UnidadeGraoValor | null,
  ): Promise<number | null> {
    if (!Number.isFinite(valorInsumos) || !Number.isFinite(precoReferencia) || precoReferencia <= 0) {
      return null;
    }
    return Math.round((valorInsumos / precoReferencia) * 10000) / 10000;
  }

  async function recalcularEquivalenteBarter(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      contrato.value = await contratoService.calcularEquivalente(id);
      sucesso('Equivalente recalculado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarEntregas(id: string): Promise<void> {
    try {
      entregas.value = await contratoService.listarEntregas(tipoAtual(), id);
    } catch {
      entregas.value = [];
    }
  }

  return {
    contratos,
    contrato,
    cotacao,
    cotacoes,
    alertas,
    painel,
    painelSafra,
    vinculos,
    entregas,
    carregando,
    carregandoCotacao,
    salvando,
    carregar,
    obter,
    criar,
    editar,
    liquidar,
    entregar,
    criarEntrega,
    cancelar,
    carregarCotacaoMercado,
    carregarAlertas,
    carregarPainel,
    carregarPainelSafra,
    carregarVinculos,
    carregarEntregas,
    calcularEquivalente,
    recalcularEquivalenteBarter,
  };
}
