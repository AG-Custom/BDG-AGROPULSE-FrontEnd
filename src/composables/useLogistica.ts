import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import {
  StatusVeiculoLogistica,
  TipoCombustivelLogistica,
  TipoDocTransporteLogistica,
  TipoVeiculoLogistica,
} from 'constants/enums';
import type {
  StatusVeiculoLogisticaValor,
  TipoCombustivelLogisticaValor,
  TipoDocTransporteLogisticaValor,
  TipoOcorrenciaEntregaValor,
  TipoVeiculoLogisticaValor,
} from 'constants/enums';
import { messageService } from 'services/message.service';
import { logisticaService } from 'services/logistica.service';
import type {
  AbastecimentoLogisticaDto,
  AbastecimentoLogisticaFormModel,
  CargaLogisticaDto,
  CargaLogisticaFormModel,
  CriarAbastecimentoLogisticaPayload,
  CriarCargaLogisticaPayload,
  CriarDocTransporteLogisticaPayload,
  CriarTransportadoraLogisticaPayload,
  CriarVeiculoLogisticaPayload,
  DocTransporteLogisticaDto,
  DocTransporteLogisticaFormModel,
  FreteTransportadoraFormModel,
  FreteTransportadoraPayload,
  ListarAbastecimentosParams,
  ListarCargasLogisticaParams,
  ListarCustoLogisticaParams,
  ListarDocsTransporteParams,
  ListarRomaneiosLogisticaParams,
  LogisticaDashboardDto,
  RegistrarOcorrenciaFormModel,
  RelatorioCustoLogisticaDto,
  RomaneioLogisticaDto,
  TransportadoraLogisticaDto,
  TransportadoraLogisticaFormModel,
  VeiculoLogisticaDto,
  VeiculoLogisticaFormModel,
} from 'types/dtos/logistica.dto';
import { ref } from 'vue';

function numOuNulo(valor: string): number | null {
  if (!valor.trim()) return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

function veiculoPayload(form: VeiculoLogisticaFormModel): CriarVeiculoLogisticaPayload {
  return {
    tipo: form.tipo as TipoVeiculoLogisticaValor,
    placa: form.placa.trim().toUpperCase(),
    marca: form.marca.trim() || null,
    modelo: form.modelo.trim() || null,
    ano: numOuNulo(form.ano),
    descricao: form.descricao.trim() || null,
    capacidadeKg: numOuNulo(form.capacidadeKg),
    capacidadeM3: numOuNulo(form.capacidadeM3),
    vencimentoCrlv: form.vencimentoCrlv || null,
    vencimentoTacografo: form.vencimentoTacografo || null,
    motoristaNome: form.motoristaNome.trim() || null,
    motoristaCnh: form.motoristaCnh.trim() || null,
    motoristaCategoria: form.motoristaCategoria.trim() || null,
    kmAtual: numOuNulo(form.kmAtual),
    status: form.status,
  };
}

function cargaPayload(form: CargaLogisticaFormModel): CriarCargaLogisticaPayload {
  return {
    motoristaNome: form.motoristaNome.trim(),
    dataHoraSaida: form.dataHoraSaida,
    regiao: form.regiao.trim(),
    veiculoId: form.veiculoId.trim() || null,
    distanciaKm: numOuNulo(form.distanciaKm),
    pesoKg: numOuNulo(form.pesoKg),
    pedagio: numOuNulo(form.pedagio),
    custoMotorista: numOuNulo(form.custoMotorista),
    paradas: form.paradas.map((p, i) => ({
      ordem: Number(p.ordem) || i + 1,
      clienteNome: p.clienteNome.trim(),
      cidade: p.cidade.trim(),
      uf: p.uf.trim().toUpperCase(),
      kmParcial: numOuNulo(p.kmParcial),
      pedidoVendaId: p.pedidoVendaId.trim() || null,
    })),
  };
}

function transportadoraPayload(
  form: TransportadoraLogisticaFormModel,
): CriarTransportadoraLogisticaPayload {
  return {
    nome: form.nome.trim(),
    cnpj: form.cnpj.trim(),
    rntrc: form.rntrc.trim() || null,
    telefone: form.telefone.trim() || null,
    email: form.email.trim() || null,
  };
}

function fretePayload(form: FreteTransportadoraFormModel): FreteTransportadoraPayload {
  return {
    regiao: form.regiao.trim(),
    valorPorKg: Number(form.valorPorKg),
    valorMinimo: Number(form.valorMinimo),
    prazoDias: Number(form.prazoDias),
  };
}

function abastecimentoPayload(
  form: AbastecimentoLogisticaFormModel,
): CriarAbastecimentoLogisticaPayload {
  return {
    veiculoId: form.veiculoId,
    data: form.data,
    kmHodometro: Number(form.kmHodometro),
    litros: Number(form.litros),
    precoLitro: Number(form.precoLitro),
    combustivel: form.combustivel as TipoCombustivelLogisticaValor,
    posto: form.posto.trim() || null,
    motoristaNome: form.motoristaNome.trim() || null,
  };
}

function docPayload(form: DocTransporteLogisticaFormModel): CriarDocTransporteLogisticaPayload {
  return {
    tipo: form.tipo as TipoDocTransporteLogisticaValor,
    numero: form.numero.trim(),
    serie: form.serie.trim(),
    tomador: form.tomador.trim(),
    ufIni: form.ufIni.trim().toUpperCase(),
    ufFim: form.ufFim.trim().toUpperCase(),
    valor: Number(form.valor),
    dataEmissao: form.dataEmissao,
    chave: form.chave.trim() || null,
    pesoKg: numOuNulo(form.pesoKg),
    cargaId: form.cargaId.trim() || null,
  };
}

export function veiculoVazio(): VeiculoLogisticaFormModel {
  return {
    tipo: TipoVeiculoLogistica.Caminhao,
    placa: '',
    marca: '',
    modelo: '',
    ano: '',
    descricao: '',
    capacidadeKg: '',
    capacidadeM3: '',
    vencimentoCrlv: '',
    vencimentoTacografo: '',
    motoristaNome: '',
    motoristaCnh: '',
    motoristaCategoria: '',
    kmAtual: '',
    status: StatusVeiculoLogistica.Disponivel,
  };
}

export function veiculoDtoParaForm(dto: VeiculoLogisticaDto): VeiculoLogisticaFormModel {
  return {
    tipo: dto.tipo,
    placa: dto.placa,
    marca: dto.marca ?? '',
    modelo: dto.modelo ?? '',
    ano: dto.ano != null ? String(dto.ano) : '',
    descricao: dto.descricao ?? '',
    capacidadeKg: dto.capacidadeKg != null ? String(dto.capacidadeKg) : '',
    capacidadeM3: dto.capacidadeM3 != null ? String(dto.capacidadeM3) : '',
    vencimentoCrlv: dto.vencimentoCrlv?.slice(0, 10) ?? '',
    vencimentoTacografo: dto.vencimentoTacografo?.slice(0, 10) ?? '',
    motoristaNome: dto.motoristaNome ?? '',
    motoristaCnh: dto.motoristaCnh ?? '',
    motoristaCategoria: dto.motoristaCategoria ?? '',
    kmAtual: dto.kmAtual != null ? String(dto.kmAtual) : '',
    status: dto.status,
  };
}

export function cargaVazia(): CargaLogisticaFormModel {
  return {
    motoristaNome: '',
    dataHoraSaida: new Date().toISOString().slice(0, 16),
    regiao: '',
    veiculoId: '',
    distanciaKm: '',
    pesoKg: '',
    pedagio: '',
    custoMotorista: '',
    paradas: [],
  };
}

export function cargaDtoParaForm(dto: CargaLogisticaDto): CargaLogisticaFormModel {
  return {
    motoristaNome: dto.motoristaNome,
    dataHoraSaida: dto.dataHoraSaida?.slice(0, 16) ?? '',
    regiao: dto.regiao,
    veiculoId: dto.veiculoId ?? '',
    distanciaKm: dto.distanciaKm != null ? String(dto.distanciaKm) : '',
    pesoKg: dto.pesoKg != null ? String(dto.pesoKg) : '',
    pedagio: dto.pedagio != null ? String(dto.pedagio) : '',
    custoMotorista: dto.custoMotorista != null ? String(dto.custoMotorista) : '',
    paradas: (dto.paradas ?? []).map((p) => ({
      chave: p.id,
      ordem: String(p.ordem),
      clienteNome: p.clienteNome,
      cidade: p.cidade,
      uf: p.uf,
      kmParcial: p.kmParcial != null ? String(p.kmParcial) : '',
      pedidoVendaId: p.pedidoVendaId ?? '',
    })),
  };
}

export function transportadoraVazia(): TransportadoraLogisticaFormModel {
  return { nome: '', cnpj: '', rntrc: '', telefone: '', email: '' };
}

export function freteVazio(): FreteTransportadoraFormModel {
  return { regiao: '', valorPorKg: '', valorMinimo: '', prazoDias: '' };
}

export function abastecimentoVazio(): AbastecimentoLogisticaFormModel {
  return {
    veiculoId: '',
    data: new Date().toISOString().slice(0, 10),
    kmHodometro: '',
    litros: '',
    precoLitro: '',
    combustivel: TipoCombustivelLogistica.Diesel,
    posto: '',
    motoristaNome: '',
  };
}

export function docTransporteVazio(): DocTransporteLogisticaFormModel {
  return {
    tipo: TipoDocTransporteLogistica.CTe,
    numero: '',
    serie: '1',
    tomador: '',
    ufIni: '',
    ufFim: '',
    valor: '',
    dataEmissao: new Date().toISOString().slice(0, 10),
    chave: '',
    pesoKg: '',
    cargaId: '',
  };
}

export function ocorrenciaVazia(): RegistrarOcorrenciaFormModel {
  return { tipo: '', descricao: '', temFoto: false, temGeolocalizacao: false };
}

async function confirmar(titulo: string, mensagem: string, texto = 'Confirmar'): Promise<boolean> {
  return messageService.confirmar({ titulo, mensagem, textoConfirmar: texto, icone: 'warning' });
}

export function useLogistica() {
  const veiculos = ref<VeiculoLogisticaDto[]>([]);
  const veiculo = ref<VeiculoLogisticaDto | null>(null);
  const alertasDocs = ref<VeiculoLogisticaDto[]>([]);
  const cargas = ref<CargaLogisticaDto[]>([]);
  const carga = ref<CargaLogisticaDto | null>(null);
  const romaneios = ref<RomaneioLogisticaDto[]>([]);
  const romaneio = ref<RomaneioLogisticaDto | null>(null);
  const transportadoras = ref<TransportadoraLogisticaDto[]>([]);
  const transportadora = ref<TransportadoraLogisticaDto | null>(null);
  const abastecimentos = ref<AbastecimentoLogisticaDto[]>([]);
  const docsTransporte = ref<DocTransporteLogisticaDto[]>([]);
  const custos = ref<RelatorioCustoLogisticaDto | null>(null);
  const dashboard = ref<LogisticaDashboardDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function wrapLoad<T>(fn: () => Promise<T>, assign: (v: T) => void): Promise<void> {
    carregando.value = true;
    try {
      assign(await fn());
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function wrapSave<T>(fn: () => Promise<T>, okMsg: string): Promise<T | null> {
    salvando.value = true;
    try {
      const r = await fn();
      sucesso(okMsg);
      return r;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function wrapAction(fn: () => Promise<void>, okMsg: string): Promise<boolean> {
    salvando.value = true;
    try {
      await fn();
      sucesso(okMsg);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  const carregarVeiculos = (status?: StatusVeiculoLogisticaValor) =>
    wrapLoad(() => logisticaService.listarVeiculos(status), (v) => (veiculos.value = v));
  async function carregarAlertasDocs(): Promise<void> {
    try {
      alertasDocs.value = await logisticaService.alertasDocumentos();
    } catch (e) {
      erro(mensagem(e));
    }
  }
  const carregarCargas = (params?: ListarCargasLogisticaParams) =>
    wrapLoad(() => logisticaService.listarCargas(params), (v) => (cargas.value = v));
  const carregarRomaneios = (params?: ListarRomaneiosLogisticaParams) =>
    wrapLoad(() => logisticaService.listarRomaneios(params), (v) => (romaneios.value = v));
  const carregarTransportadoras = () =>
    wrapLoad(() => logisticaService.listarTransportadoras(), (v) => (transportadoras.value = v));
  const carregarAbastecimentos = (params?: ListarAbastecimentosParams) =>
    wrapLoad(() => logisticaService.listarAbastecimentos(params), (v) => (abastecimentos.value = v));
  const carregarDocsTransporte = (params?: ListarDocsTransporteParams) =>
    wrapLoad(() => logisticaService.listarDocsTransporte(params), (v) => (docsTransporte.value = v));
  const carregarCustos = (params?: ListarCustoLogisticaParams) =>
    wrapLoad(() => logisticaService.relatorioCusto(params), (v) => (custos.value = v));
  const carregarDashboard = () =>
    wrapLoad(() => logisticaService.dashboard(), (v) => (dashboard.value = v));

  async function obterVeiculo(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      veiculo.value = await logisticaService.obterVeiculo(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function obterCarga(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      carga.value = await logisticaService.obterCarga(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function obterRomaneio(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      romaneio.value = await logisticaService.obterRomaneio(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function obterTransportadora(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      transportadora.value = await logisticaService.obterTransportadora(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  const criarVeiculo = (f: VeiculoLogisticaFormModel) =>
    wrapSave(() => logisticaService.criarVeiculo(veiculoPayload(f)), 'Veículo cadastrado.');
  const editarVeiculo = (id: string, f: VeiculoLogisticaFormModel) =>
    wrapSave(() => logisticaService.editarVeiculo(id, veiculoPayload(f)), 'Veículo atualizado.');
  async function removerVeiculo(id: string): Promise<boolean> {
    if (!(await confirmar('Remover veículo', 'Deseja remover este veículo?', 'Remover')))
      return false;
    return wrapAction(() => logisticaService.removerVeiculo(id), 'Veículo removido.');
  }

  const criarCarga = (f: CargaLogisticaFormModel) =>
    wrapSave(() => logisticaService.criarCarga(cargaPayload(f)), 'Carga programada.');
  const editarCarga = (id: string, f: CargaLogisticaFormModel) =>
    wrapSave(() => logisticaService.editarCarga(id, cargaPayload(f)), 'Carga atualizada.');
  async function removerCarga(id: string): Promise<boolean> {
    if (!(await confirmar('Remover carga', 'Deseja remover esta carga?', 'Remover'))) return false;
    return wrapAction(() => logisticaService.removerCarga(id), 'Carga removida.');
  }
  async function iniciarCarga(id: string): Promise<boolean> {
    if (!(await confirmar('Iniciar carga', 'Iniciar rota desta carga?', 'Iniciar'))) return false;
    const r = await wrapSave(() => logisticaService.iniciarCarga(id), 'Carga iniciada.');
    if (r) carga.value = r;
    return !!r;
  }
  async function concluirCarga(id: string): Promise<boolean> {
    if (!(await confirmar('Concluir carga', 'Concluir esta carga?', 'Concluir'))) return false;
    const r = await wrapSave(() => logisticaService.concluirCarga(id), 'Carga concluída.');
    if (r) carga.value = r;
    return !!r;
  }
  async function cancelarCarga(id: string): Promise<boolean> {
    if (!(await confirmar('Cancelar carga', 'Cancelar esta carga?', 'Cancelar'))) return false;
    const r = await wrapSave(() => logisticaService.cancelarCarga(id), 'Carga cancelada.');
    if (r) carga.value = r;
    return !!r;
  }

  async function iniciarRotaRomaneio(id: string): Promise<boolean> {
    if (!(await confirmar('Iniciar rota', 'Iniciar rota deste romaneio?', 'Iniciar'))) return false;
    const r = await wrapSave(() => logisticaService.iniciarRotaRomaneio(id), 'Rota iniciada.');
    if (r) romaneio.value = r;
    return !!r;
  }
  async function entregarRomaneio(id: string): Promise<boolean> {
    if (!(await confirmar('Entregar', 'Marcar romaneio como entregue?', 'Entregar'))) return false;
    const r = await wrapSave(() => logisticaService.entregarRomaneio(id), 'Romaneio entregue.');
    if (r) romaneio.value = r;
    return !!r;
  }
  async function registrarOcorrencia(
    id: string,
    form: RegistrarOcorrenciaFormModel,
  ): Promise<boolean> {
    const r = await wrapSave(
      () =>
        logisticaService.registrarOcorrencia(id, {
          tipo: form.tipo as TipoOcorrenciaEntregaValor,
          descricao: form.descricao.trim(),
          temFoto: form.temFoto,
          temGeolocalizacao: form.temGeolocalizacao,
        }),
      'Ocorrência registrada.',
    );
    if (r) romaneio.value = r;
    return !!r;
  }

  const criarTransportadora = (f: TransportadoraLogisticaFormModel) =>
    wrapSave(
      () => logisticaService.criarTransportadora(transportadoraPayload(f)),
      'Transportadora cadastrada.',
    );
  const editarTransportadora = (id: string, f: TransportadoraLogisticaFormModel) =>
    wrapSave(
      () => logisticaService.editarTransportadora(id, transportadoraPayload(f)),
      'Transportadora atualizada.',
    );
  async function removerTransportadora(id: string): Promise<boolean> {
    if (!(await confirmar('Remover', 'Remover esta transportadora?', 'Remover'))) return false;
    return wrapAction(() => logisticaService.removerTransportadora(id), 'Transportadora removida.');
  }
  async function adicionarFrete(
    transportadoraId: string,
    form: FreteTransportadoraFormModel,
  ): Promise<boolean> {
    const r = await wrapSave(
      () => logisticaService.adicionarFrete(transportadoraId, fretePayload(form)),
      'Frete adicionado.',
    );
    if (r) transportadora.value = r;
    return !!r;
  }
  async function removerFrete(transportadoraId: string, freteId: string): Promise<boolean> {
    if (!(await confirmar('Remover frete', 'Remover este frete?', 'Remover'))) return false;
    const ok = await wrapAction(
      () => logisticaService.removerFrete(transportadoraId, freteId),
      'Frete removido.',
    );
    if (ok) await obterTransportadora(transportadoraId);
    return ok;
  }

  const criarAbastecimento = (f: AbastecimentoLogisticaFormModel) =>
    wrapSave(
      () => logisticaService.criarAbastecimento(abastecimentoPayload(f)),
      'Abastecimento registrado.',
    );
  async function removerAbastecimento(id: string): Promise<boolean> {
    if (!(await confirmar('Remover', 'Remover este abastecimento?', 'Remover'))) return false;
    return wrapAction(() => logisticaService.removerAbastecimento(id), 'Abastecimento removido.');
  }

  const criarDocTransporte = (f: DocTransporteLogisticaFormModel) =>
    wrapSave(() => logisticaService.criarDocTransporte(docPayload(f)), 'Documento criado.');
  async function autorizarDocTransporte(id: string): Promise<boolean> {
    if (!(await confirmar('Autorizar', 'Autorizar documento (stub SEFAZ)?', 'Autorizar')))
      return false;
    const r = await wrapSave(
      () => logisticaService.autorizarDocTransporte(id),
      'Documento autorizado.',
    );
    if (r) await carregarDocsTransporte();
    return !!r;
  }
  async function cancelarDocTransporte(id: string): Promise<boolean> {
    if (!(await confirmar('Cancelar', 'Cancelar este documento?', 'Cancelar'))) return false;
    const r = await wrapSave(
      () => logisticaService.cancelarDocTransporte(id),
      'Documento cancelado.',
    );
    if (r) await carregarDocsTransporte();
    return !!r;
  }

  return {
    veiculos,
    veiculo,
    alertasDocs,
    cargas,
    carga,
    romaneios,
    romaneio,
    transportadoras,
    transportadora,
    abastecimentos,
    docsTransporte,
    custos,
    dashboard,
    carregando,
    salvando,
    carregarVeiculos,
    carregarAlertasDocs,
    obterVeiculo,
    criarVeiculo,
    editarVeiculo,
    removerVeiculo,
    carregarCargas,
    obterCarga,
    criarCarga,
    editarCarga,
    removerCarga,
    iniciarCarga,
    concluirCarga,
    cancelarCarga,
    carregarRomaneios,
    obterRomaneio,
    iniciarRotaRomaneio,
    entregarRomaneio,
    registrarOcorrencia,
    carregarTransportadoras,
    obterTransportadora,
    criarTransportadora,
    editarTransportadora,
    removerTransportadora,
    adicionarFrete,
    removerFrete,
    carregarAbastecimentos,
    criarAbastecimento,
    removerAbastecimento,
    carregarDocsTransporte,
    criarDocTransporte,
    autorizarDocTransporte,
    cancelarDocTransporte,
    carregarCustos,
    carregarDashboard,
  };
}
