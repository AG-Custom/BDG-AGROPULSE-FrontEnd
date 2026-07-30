import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { CanalTentativaCobranca, ResultadoTentativaCobranca, TipoGarantiaCredito } from 'constants/enums';
import type {
  BureauCreditoValor,
  CanalTentativaCobrancaValor,
  TipoGarantiaCreditoValor,
} from 'constants/enums';
import { cobrancaCreditoService } from 'services/cobranca-credito.service';
import { baixarArquivo } from 'utils/download';
import { formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import type {
  AcordoJudicialDto,
  AcordoJudicialFormModel,
  AgingCarteiraDto,
  BureauConsultaDto,
  CarteiraCreditoDto,
  CobrancaCreditoConfigDto,
  CobrancaCreditoConfigFormModel,
  CobrancaCreditoConfigPayload,
  ConcentracaoItemDto,
  CreditoBancarioStubDto,
  CriarAcordoJudicialPayload,
  CriarDisputaTituloPayload,
  CriarEncaminhamentoJuridicoPayload,
  CriarFichaCreditoRuralPayload,
  CriarGarantiaCreditoPayload,
  CriarTentativaCobrancaPayload,
  DisputaTituloDto,
  EncaminhamentoJuridicoDto,
  FichaCreditoRuralDto,
  FichaCreditoRuralFormModel,
  GarantiaCreditoDto,
  GarantiaCreditoFormModel,
  InadimplenciaIndiceDto,
  ListaDiariaItemDto,
  PddCarteiraDto,
  RevisaoLimiteItemDto,
  TentativaCobrancaDto,
  TentativaCobrancaFormModel,
} from 'types/dtos/cobranca-credito.dto';
import { ref } from 'vue';

function numOuZero(valor: string): number {
  if (!valor.trim()) return 0;
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

function numOuNulo(valor: string): number | null {
  if (!valor.trim()) return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

export function configVazia(): CobrancaCreditoConfigFormModel {
  return {
    pesoHistoricoPagamento: '40',
    pesoTempoRelacionamento: '20',
    pesoVolumeCompras: '20',
    pesoDadosCadastrais: '20',
    maxConcentracaoPct: '20',
    pddFaixa1a15: '0.5',
    pddFaixa16a30: '2',
    pddFaixa31a60: '10',
    pddFaixa61a90: '30',
    pddFaixa91a180: '50',
    pddFaixaAcima180: '100',
    diasAtrasoBloqueioPorPerfil: '{"Gerente":60,"Diretor":90,"Ceo":120}',
    bloqueioEfetivo: false,
    limiteGerente: formatarMoedaParaInput(10000),
    limiteDiretor: formatarMoedaParaInput(100000),
    limiteCeo: formatarMoedaParaInput(500000),
    scoreMinimoRevisao: '400',
  };
}

export function configDtoParaForm(dto: CobrancaCreditoConfigDto): CobrancaCreditoConfigFormModel {
  return {
    pesoHistoricoPagamento: String(dto.pesoHistoricoPagamento),
    pesoTempoRelacionamento: String(dto.pesoTempoRelacionamento),
    pesoVolumeCompras: String(dto.pesoVolumeCompras),
    pesoDadosCadastrais: String(dto.pesoDadosCadastrais),
    maxConcentracaoPct: String(dto.maxConcentracaoPct),
    pddFaixa1a15: String(dto.pddFaixa1a15),
    pddFaixa16a30: String(dto.pddFaixa16a30),
    pddFaixa31a60: String(dto.pddFaixa31a60),
    pddFaixa61a90: String(dto.pddFaixa61a90),
    pddFaixa91a180: String(dto.pddFaixa91a180),
    pddFaixaAcima180: String(dto.pddFaixaAcima180),
    diasAtrasoBloqueioPorPerfil: dto.diasAtrasoBloqueioPorPerfil ?? '',
    bloqueioEfetivo: dto.bloqueioEfetivo,
    limiteGerente: formatarMoedaParaInput(dto.limiteGerente),
    limiteDiretor: formatarMoedaParaInput(dto.limiteDiretor),
    limiteCeo: formatarMoedaParaInput(dto.limiteCeo),
    scoreMinimoRevisao: String(dto.scoreMinimoRevisao),
  };
}

function configFormParaPayload(form: CobrancaCreditoConfigFormModel): CobrancaCreditoConfigPayload {
  return {
    pesoHistoricoPagamento: numOuZero(form.pesoHistoricoPagamento),
    pesoTempoRelacionamento: numOuZero(form.pesoTempoRelacionamento),
    pesoVolumeCompras: numOuZero(form.pesoVolumeCompras),
    pesoDadosCadastrais: numOuZero(form.pesoDadosCadastrais),
    maxConcentracaoPct: numOuZero(form.maxConcentracaoPct),
    pddFaixa1a15: numOuZero(form.pddFaixa1a15),
    pddFaixa16a30: numOuZero(form.pddFaixa16a30),
    pddFaixa31a60: numOuZero(form.pddFaixa31a60),
    pddFaixa61a90: numOuZero(form.pddFaixa61a90),
    pddFaixa91a180: numOuZero(form.pddFaixa91a180),
    pddFaixaAcima180: numOuZero(form.pddFaixaAcima180),
    diasAtrasoBloqueioPorPerfil: form.diasAtrasoBloqueioPorPerfil.trim() || null,
    bloqueioEfetivo: form.bloqueioEfetivo,
    limiteGerente: parseMascaraMoeda(form.limiteGerente) ?? 0,
    limiteDiretor: parseMascaraMoeda(form.limiteDiretor) ?? 0,
    limiteCeo: parseMascaraMoeda(form.limiteCeo) ?? 0,
    scoreMinimoRevisao: numOuZero(form.scoreMinimoRevisao),
  };
}

export function fichaVazia(): FichaCreditoRuralFormModel {
  return {
    clienteId: '',
    analiseCreditoId: '',
    areaPlantadaHa: '',
    culturaPrincipal: '',
    produtividadeEsperada: '',
    rendaEstimada: '',
    endividamentoTotal: '',
    observacoesGarantias: '',
  };
}

function fichaFormParaPayload(form: FichaCreditoRuralFormModel): CriarFichaCreditoRuralPayload {
  return {
    clienteId: form.clienteId.trim(),
    analiseCreditoId: form.analiseCreditoId?.trim() || null,
    areaPlantadaHa: numOuNulo(form.areaPlantadaHa),
    culturaPrincipal: form.culturaPrincipal.trim() || null,
    produtividadeEsperada: numOuNulo(form.produtividadeEsperada),
    rendaEstimada: parseMascaraMoeda(form.rendaEstimada),
    endividamentoTotal: parseMascaraMoeda(form.endividamentoTotal),
    observacoesGarantias: form.observacoesGarantias.trim() || null,
  };
}

export function tentativaVazia(): TentativaCobrancaFormModel {
  return {
    canal: CanalTentativaCobranca.Telefone,
    resultado: ResultadoTentativaCobranca.ContatoRealizado,
    observacao: '',
  };
}

export function acordoVazio(): AcordoJudicialFormModel {
  return {
    clienteId: '',
    valorOriginal: '',
    valorAcordado: '',
    parcelas: '1',
    inicio: '',
    observacoes: '',
  };
}

export function garantiaVazia(): GarantiaCreditoFormModel {
  return {
    clienteId: '',
    tipo: '',
    descricao: '',
    valor: '',
    vigenciaInicio: '',
    vigenciaFim: '',
    ativo: true,
  };
}

export function useCobrancaCredito() {
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const carregando = ref(false);
  const salvando = ref(false);

  const config = ref<CobrancaCreditoConfigDto | null>(null);
  const carteira = ref<CarteiraCreditoDto | null>(null);
  const aging = ref<AgingCarteiraDto | null>(null);
  const concentracao = ref<ConcentracaoItemDto[]>([]);
  const inadimplenciaIndice = ref<InadimplenciaIndiceDto | null>(null);
  const pdd = ref<PddCarteiraDto | null>(null);

  const fichas = ref<FichaCreditoRuralDto[]>([]);
  const listaDiaria = ref<ListaDiariaItemDto[]>([]);
  const tentativas = ref<TentativaCobrancaDto[]>([]);
  const disputas = ref<DisputaTituloDto[]>([]);
  const encaminhamentos = ref<EncaminhamentoJuridicoDto[]>([]);
  const acordos = ref<AcordoJudicialDto[]>([]);
  const garantias = ref<GarantiaCreditoDto[]>([]);

  const bureauResultado = ref<BureauConsultaDto | null>(null);
  const creditoBancario = ref<CreditoBancarioStubDto[]>([]);
  const revisaoLimites = ref<RevisaoLimiteItemDto[]>([]);

  async function carregarPainel(): Promise<void> {
    carregando.value = true;
    try {
      const [c, a, conc, ind, p] = await Promise.all([
        cobrancaCreditoService.obterCarteira(),
        cobrancaCreditoService.obterAging(),
        cobrancaCreditoService.obterConcentracao(),
        cobrancaCreditoService.obterInadimplenciaIndice(),
        cobrancaCreditoService.obterPdd(),
      ]);
      carteira.value = c;
      aging.value = a;
      concentracao.value = conc;
      inadimplenciaIndice.value = ind;
      pdd.value = p;
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarConfig(): Promise<void> {
    carregando.value = true;
    try {
      config.value = await cobrancaCreditoService.obterConfig();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function salvarConfig(form: CobrancaCreditoConfigFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      config.value = await cobrancaCreditoService.salvarConfig(configFormParaPayload(form));
      sucesso('Configuração salva.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarFichas(): Promise<void> {
    carregando.value = true;
    try {
      fichas.value = await cobrancaCreditoService.listarFichas();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criarFicha(form: FichaCreditoRuralFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await cobrancaCreditoService.criarFicha(fichaFormParaPayload(form));
      sucesso('Ficha de crédito criada.');
      await carregarFichas();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function aplicarLimite(
    analiseId: string,
    limiteAprovado: number,
    aprovar = true,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      await cobrancaCreditoService.aplicarLimite(analiseId, { limiteAprovado, aprovar });
      sucesso(aprovar ? 'Limite aplicado.' : 'Limite recusado.');
      await carregarFichas();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarListaDiaria(): Promise<void> {
    carregando.value = true;
    try {
      listaDiaria.value = await cobrancaCreditoService.listaDiaria();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarTentativas(clienteId: string): Promise<void> {
    carregando.value = true;
    try {
      tentativas.value = await cobrancaCreditoService.listarTentativas(clienteId);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function registrarTentativa(
    contaReceberId: string,
    clienteId: string,
    form: TentativaCobrancaFormModel,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      const payload: CriarTentativaCobrancaPayload = {
        contaReceberId,
        clienteId,
        canal: form.canal as CanalTentativaCobrancaValor,
        resultado: form.resultado.trim(),
        observacao: form.observacao.trim() || null,
      };
      await cobrancaCreditoService.criarTentativa(payload);
      sucesso('Tentativa registrada.');
      await carregarTentativas(clienteId);
      await carregarListaDiaria();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarDisputas(): Promise<void> {
    carregando.value = true;
    try {
      disputas.value = await cobrancaCreditoService.listarDisputas();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criarDisputa(payload: CriarDisputaTituloPayload): Promise<boolean> {
    salvando.value = true;
    try {
      await cobrancaCreditoService.criarDisputa(payload);
      sucesso('Disputa registrada.');
      await carregarDisputas();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function resolverDisputa(
    id: string,
    resolucao?: string | null,
    encerrar = true,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      await cobrancaCreditoService.resolverDisputa(id, {
        resolucao: resolucao?.trim() || null,
        encerrar,
      });
      sucesso(encerrar ? 'Disputa encerrada.' : 'Disputa resolvida.');
      await carregarDisputas();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarJuridico(): Promise<void> {
    carregando.value = true;
    try {
      const [enc, ac] = await Promise.all([
        cobrancaCreditoService.listarEncaminhamentos(),
        cobrancaCreditoService.listarAcordos(),
      ]);
      encaminhamentos.value = enc;
      acordos.value = ac;
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criarEncaminhamento(
    payload: CriarEncaminhamentoJuridicoPayload,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      await cobrancaCreditoService.criarEncaminhamento(payload);
      sucesso('Encaminhamento criado.');
      await carregarJuridico();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function encaminharJuridico(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      await cobrancaCreditoService.encaminharJuridico(id);
      sucesso('Encaminhado ao jurídico.');
      await carregarJuridico();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function baixarPacoteJuridico(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      const blob = await cobrancaCreditoService.baixarPacoteJuridico(id);
      baixarArquivo(blob, `pacote-juridico-${id}.html`);
      sucesso('Pacote jurídico baixado.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function criarAcordo(form: AcordoJudicialFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      const payload: CriarAcordoJudicialPayload = {
        clienteId: form.clienteId.trim(),
        valorOriginal: parseMascaraMoeda(form.valorOriginal) ?? 0,
        valorAcordado: parseMascaraMoeda(form.valorAcordado) ?? 0,
        parcelas: numOuZero(form.parcelas) || 1,
        inicio: form.inicio,
        observacoes: form.observacoes.trim() || null,
      };
      await cobrancaCreditoService.criarAcordo(payload);
      sucesso('Acordo judicial criado.');
      await carregarJuridico();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarGarantias(clienteId?: string): Promise<void> {
    carregando.value = true;
    try {
      garantias.value = await cobrancaCreditoService.listarGarantias(clienteId);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criarGarantia(form: GarantiaCreditoFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      const payload: CriarGarantiaCreditoPayload = {
        clienteId: form.clienteId.trim(),
        tipo: (form.tipo || TipoGarantiaCredito.Outros) as TipoGarantiaCreditoValor,
        descricao: form.descricao.trim(),
        valor: numOuZero(form.valor),
        vigenciaInicio: form.vigenciaInicio || null,
        vigenciaFim: form.vigenciaFim || null,
        ativo: form.ativo,
      };
      await cobrancaCreditoService.criarGarantia(payload);
      sucesso('Garantia cadastrada.');
      await carregarGarantias();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function consultarBureau(clienteId: string, bureau: BureauCreditoValor): Promise<void> {
    salvando.value = true;
    try {
      bureauResultado.value = await cobrancaCreditoService.consultarBureau({
        clienteId,
        bureau,
      });
      sucesso('Consulta bureau (stub) concluída.');
    } catch (e) {
      erro(mensagem(e));
    } finally {
      salvando.value = false;
    }
  }

  async function solicitarCreditoBancario(
    clienteId: string,
    instituicao: string,
    tipoOperacao: string,
    valor: number,
  ): Promise<void> {
    salvando.value = true;
    try {
      const r = await cobrancaCreditoService.solicitarCreditoBancario({
        clienteId,
        instituicao,
        tipoOperacao,
        valor,
      });
      creditoBancario.value = [r, ...creditoBancario.value];
      sucesso('Solicitação bancária (stub) registrada.');
    } catch (e) {
      erro(mensagem(e));
    } finally {
      salvando.value = false;
    }
  }

  async function revisarLimites(): Promise<void> {
    salvando.value = true;
    try {
      revisaoLimites.value = await cobrancaCreditoService.revisarLimites();
      sucesso(
        revisaoLimites.value.length
          ? `${revisaoLimites.value.length} cliente(s) para revisão.`
          : 'Nenhum cliente para revisão de limite.',
      );
    } catch (e) {
      erro(mensagem(e));
    } finally {
      salvando.value = false;
    }
  }

  return {
    carregando,
    salvando,
    config,
    carteira,
    aging,
    concentracao,
    inadimplenciaIndice,
    pdd,
    fichas,
    listaDiaria,
    tentativas,
    disputas,
    encaminhamentos,
    acordos,
    garantias,
    bureauResultado,
    creditoBancario,
    revisaoLimites,
    carregarPainel,
    carregarConfig,
    salvarConfig,
    carregarFichas,
    criarFicha,
    aplicarLimite,
    carregarListaDiaria,
    carregarTentativas,
    registrarTentativa,
    carregarDisputas,
    criarDisputa,
    resolverDisputa,
    carregarJuridico,
    criarEncaminhamento,
    encaminharJuridico,
    baixarPacoteJuridico,
    criarAcordo,
    carregarGarantias,
    criarGarantia,
    consultarBureau,
    solicitarCreditoBancario,
    revisarLimites,
  };
}
