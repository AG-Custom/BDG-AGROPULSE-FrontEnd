import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import {
  EtapaOportunidade,
  StatusAmostraCampo,
  StatusCampanha,
  TipoCanalCampanha,
} from 'constants/enums';
import type { EtapaOportunidadeValor } from 'constants/enums';
import { messageService } from 'services/message.service';
import { crmService } from 'services/crm.service';
import type {
  AmostraCampoDto,
  AmostraCampoFormModel,
  AnaliseCreditoDto,
  CampanhaDto,
  CampanhaFormModel,
  CarteiraAgronomicaDto,
  ClientePerfil360Dto,
  CriarAmostraCampoPayload,
  CriarCampanhaPayload,
  CriarOportunidadePayload,
  CrmDashboardDto,
  ListarCarteiraAgronomicaParams,
  OportunidadeDto,
  OportunidadeFormModel,
  PreferenciaClienteDto,
  PreferenciaClienteFormModel,
} from 'types/dtos/crm.dto';
import { ref } from 'vue';

function numOuZero(valor: string): number {
  if (!valor.trim()) return 0;
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

function oportunidadeFormParaPayload(form: OportunidadeFormModel): CriarOportunidadePayload {
  return {
    clienteId: form.clienteId,
    vendedorUsuarioId: form.vendedorUsuarioId.trim() || null,
    produtoId: form.produtoId.trim() || null,
    produtoNome: form.produtoNome.trim() || null,
    cultura: form.cultura.trim() || null,
    safraRef: form.safraRef.trim() || null,
    valorEstimado: Number(form.valorEstimado) || 0,
    etapa: form.etapa,
    probabilidade: numOuZero(form.probabilidade),
    dataPrevista: form.dataPrevista || null,
    observacoes: form.observacoes.trim() || null,
  };
}

function amostraFormParaPayload(form: AmostraCampoFormModel): CriarAmostraCampoPayload {
  return {
    clienteId: form.clienteId,
    vendedorUsuarioId: form.vendedorUsuarioId.trim() || null,
    produtoId: form.produtoId.trim() || null,
    produtoNome: form.produtoNome.trim() || null,
    quantidade: Number(form.quantidade) || 0,
    unidade: form.unidade.trim() || null,
    cultura: form.cultura.trim() || null,
    dataEntrega: form.dataEntrega,
    dataRetorno: form.dataRetorno || null,
    status: form.status,
    resultado: form.resultado.trim() || null,
    pedidoVendaId: form.pedidoVendaId.trim() || null,
  };
}

function campanhaFormParaPayload(form: CampanhaFormModel): CriarCampanhaPayload {
  return {
    nome: form.nome.trim(),
    tipoCanal: form.tipoCanal,
    segmento: form.segmento.trim() || null,
    status: form.status,
    dataInicio: form.dataInicio || null,
    dataFim: form.dataFim || null,
  };
}

export function oportunidadeVazia(): OportunidadeFormModel {
  return {
    clienteId: '',
    vendedorUsuarioId: '',
    produtoId: '',
    produtoNome: '',
    cultura: '',
    safraRef: '',
    valorEstimado: '',
    etapa: EtapaOportunidade.Prospeccao,
    probabilidade: '0',
    dataPrevista: '',
    observacoes: '',
  };
}

export function oportunidadeDtoParaForm(dto: OportunidadeDto): OportunidadeFormModel {
  return {
    clienteId: dto.clienteId,
    vendedorUsuarioId: dto.vendedorUsuarioId ?? '',
    produtoId: dto.produtoId ?? '',
    produtoNome: dto.produtoNome ?? '',
    cultura: dto.cultura ?? '',
    safraRef: dto.safraRef ?? '',
    valorEstimado: String(dto.valorEstimado),
    etapa: dto.etapa,
    probabilidade: String(dto.probabilidade ?? 0),
    dataPrevista: dto.dataPrevista?.slice(0, 10) ?? '',
    observacoes: dto.observacoes ?? '',
  };
}

export function amostraVazia(): AmostraCampoFormModel {
  return {
    clienteId: '',
    vendedorUsuarioId: '',
    produtoId: '',
    produtoNome: '',
    quantidade: '',
    unidade: '',
    cultura: '',
    dataEntrega: '',
    dataRetorno: '',
    status: StatusAmostraCampo.Entregue,
    resultado: '',
    pedidoVendaId: '',
  };
}

export function amostraDtoParaForm(dto: AmostraCampoDto): AmostraCampoFormModel {
  return {
    clienteId: dto.clienteId,
    vendedorUsuarioId: dto.vendedorUsuarioId ?? '',
    produtoId: dto.produtoId ?? '',
    produtoNome: dto.produtoNome ?? '',
    quantidade: String(dto.quantidade),
    unidade: dto.unidade ?? '',
    cultura: dto.cultura ?? '',
    dataEntrega: dto.dataEntrega?.slice(0, 10) ?? '',
    dataRetorno: dto.dataRetorno?.slice(0, 10) ?? '',
    status: dto.status,
    resultado: dto.resultado ?? '',
    pedidoVendaId: dto.pedidoVendaId ?? '',
  };
}

export function campanhaVazia(): CampanhaFormModel {
  return {
    nome: '',
    tipoCanal: TipoCanalCampanha.WhatsApp,
    segmento: '',
    status: StatusCampanha.Rascunho,
    dataInicio: '',
    dataFim: '',
  };
}

export function campanhaDtoParaForm(dto: CampanhaDto): CampanhaFormModel {
  return {
    nome: dto.nome,
    tipoCanal: dto.tipoCanal,
    segmento: dto.segmento ?? '',
    status: dto.status,
    dataInicio: dto.dataInicio?.slice(0, 10) ?? '',
    dataFim: dto.dataFim?.slice(0, 10) ?? '',
  };
}

export function preferenciaVazia(): PreferenciaClienteFormModel {
  return { chave: '', valor: '', observacoes: '' };
}

export function useCrm() {
  const dashboard = ref<CrmDashboardDto | null>(null);
  const carteira = ref<CarteiraAgronomicaDto | null>(null);
  const perfil360 = ref<ClientePerfil360Dto | null>(null);
  const oportunidades = ref<OportunidadeDto[]>([]);
  const oportunidade = ref<OportunidadeDto | null>(null);
  const amostras = ref<AmostraCampoDto[]>([]);
  const amostra = ref<AmostraCampoDto | null>(null);
  const campanhas = ref<CampanhaDto[]>([]);
  const campanha = ref<CampanhaDto | null>(null);
  const analises = ref<AnaliseCreditoDto[]>([]);
  const analise = ref<AnaliseCreditoDto | null>(null);
  const preferencias = ref<PreferenciaClienteDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarDashboard(): Promise<void> {
    carregando.value = true;
    try {
      dashboard.value = await crmService.dashboard();
    } catch (e) {
      dashboard.value = null;
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarCarteira(params?: ListarCarteiraAgronomicaParams): Promise<void> {
    carregando.value = true;
    try {
      carteira.value = await crmService.obterCarteira(params);
    } catch (e) {
      carteira.value = null;
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarPerfil360(clienteId: string): Promise<boolean> {
    carregando.value = true;
    try {
      perfil360.value = await crmService.obterPerfil360(clienteId);
      preferencias.value = perfil360.value.preferencias ?? [];
      return true;
    } catch (e) {
      perfil360.value = null;
      preferencias.value = [];
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function carregarOportunidades(): Promise<void> {
    carregando.value = true;
    try {
      oportunidades.value = await crmService.listarOportunidades();
    } catch (e) {
      oportunidades.value = [];
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterOportunidade(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      oportunidade.value = await crmService.obterOportunidade(id);
      return true;
    } catch (e) {
      oportunidade.value = null;
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarOportunidade(
    form: OportunidadeFormModel,
  ): Promise<OportunidadeDto | null> {
    salvando.value = true;
    try {
      const criado = await crmService.criarOportunidade(oportunidadeFormParaPayload(form));
      sucesso('Oportunidade cadastrada.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editarOportunidade(
    id: string,
    form: OportunidadeFormModel,
  ): Promise<OportunidadeDto | null> {
    salvando.value = true;
    try {
      const atualizado = await crmService.editarOportunidade(
        id,
        oportunidadeFormParaPayload(form),
      );
      sucesso('Oportunidade atualizada.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function alterarEtapaOportunidade(
    id: string,
    etapa: EtapaOportunidadeValor,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      await crmService.alterarEtapaOportunidade(id, { etapa });
      sucesso('Etapa atualizada.');
      await carregarOportunidades();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function removerOportunidade(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover oportunidade',
      mensagem: 'Deseja remover esta oportunidade?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await crmService.removerOportunidade(id);
      sucesso('Oportunidade removida.');
      await carregarOportunidades();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarAmostras(): Promise<void> {
    carregando.value = true;
    try {
      amostras.value = await crmService.listarAmostras();
    } catch (e) {
      amostras.value = [];
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterAmostra(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      amostra.value = await crmService.obterAmostra(id);
      return true;
    } catch (e) {
      amostra.value = null;
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarAmostra(form: AmostraCampoFormModel): Promise<AmostraCampoDto | null> {
    salvando.value = true;
    try {
      const criado = await crmService.criarAmostra(amostraFormParaPayload(form));
      sucesso('Amostra cadastrada.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editarAmostra(
    id: string,
    form: AmostraCampoFormModel,
  ): Promise<AmostraCampoDto | null> {
    salvando.value = true;
    try {
      const atualizado = await crmService.editarAmostra(id, amostraFormParaPayload(form));
      sucesso('Amostra atualizada.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function removerAmostra(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover amostra',
      mensagem: 'Deseja remover esta amostra?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await crmService.removerAmostra(id);
      sucesso('Amostra removida.');
      await carregarAmostras();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarCampanhas(): Promise<void> {
    carregando.value = true;
    try {
      campanhas.value = await crmService.listarCampanhas();
    } catch (e) {
      campanhas.value = [];
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterCampanha(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      campanha.value = await crmService.obterCampanha(id);
      return true;
    } catch (e) {
      campanha.value = null;
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarCampanha(form: CampanhaFormModel): Promise<CampanhaDto | null> {
    salvando.value = true;
    try {
      const criado = await crmService.criarCampanha(campanhaFormParaPayload(form));
      sucesso('Campanha cadastrada.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editarCampanha(
    id: string,
    form: CampanhaFormModel,
  ): Promise<CampanhaDto | null> {
    salvando.value = true;
    try {
      const atualizado = await crmService.editarCampanha(id, campanhaFormParaPayload(form));
      sucesso('Campanha atualizada.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function dispararCampanha(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      campanha.value = await crmService.dispararCampanha(id);
      sucesso('Campanha disparada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function removerCampanha(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover campanha',
      mensagem: 'Deseja remover esta campanha?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await crmService.removerCampanha(id);
      sucesso('Campanha removida.');
      await carregarCampanhas();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarAnalises(): Promise<void> {
    carregando.value = true;
    try {
      analises.value = await crmService.listarAnalisesCredito();
    } catch (e) {
      analises.value = [];
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterAnalise(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      analise.value = await crmService.obterAnaliseCredito(id);
      return true;
    } catch (e) {
      analise.value = null;
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarAnalise(clienteId: string): Promise<AnaliseCreditoDto | null> {
    salvando.value = true;
    try {
      const criado = await crmService.recalcularAnaliseCredito(clienteId);
      sucesso('Análise de crédito criada.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function recalcularAnalise(clienteId: string): Promise<boolean> {
    salvando.value = true;
    try {
      analise.value = await crmService.recalcularAnaliseCredito(clienteId);
      sucesso('Análise recalculada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarPreferencias(clienteId: string): Promise<void> {
    try {
      preferencias.value = await crmService.listarPreferencias(clienteId);
    } catch (e) {
      preferencias.value = [];
      erro(mensagem(e));
    }
  }

  async function criarPreferencia(
    clienteId: string,
    form: PreferenciaClienteFormModel,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      await crmService.criarPreferencia({
        clienteId,
        chave: form.chave.trim(),
        valor: form.valor.trim(),
        observacoes: form.observacoes.trim() || null,
      });
      sucesso('Preferência adicionada.');
      await carregarPreferencias(clienteId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function editarPreferencia(
    id: string,
    clienteId: string,
    form: PreferenciaClienteFormModel,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      await crmService.editarPreferencia(id, {
        clienteId,
        chave: form.chave.trim(),
        valor: form.valor.trim(),
        observacoes: form.observacoes.trim() || null,
      });
      sucesso('Preferência atualizada.');
      await carregarPreferencias(clienteId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function removerPreferencia(id: string, clienteId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover preferência',
      mensagem: 'Deseja remover esta preferência?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await crmService.removerPreferencia(id);
      sucesso('Preferência removida.');
      await carregarPreferencias(clienteId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    dashboard,
    carteira,
    perfil360,
    oportunidades,
    oportunidade,
    amostras,
    amostra,
    campanhas,
    campanha,
    analises,
    analise,
    preferencias,
    carregando,
    salvando,
    carregarDashboard,
    carregarCarteira,
    carregarPerfil360,
    carregarOportunidades,
    obterOportunidade,
    criarOportunidade,
    editarOportunidade,
    alterarEtapaOportunidade,
    removerOportunidade,
    carregarAmostras,
    obterAmostra,
    criarAmostra,
    editarAmostra,
    removerAmostra,
    carregarCampanhas,
    obterCampanha,
    criarCampanha,
    editarCampanha,
    dispararCampanha,
    removerCampanha,
    carregarAnalises,
    obterAnalise,
    criarAnalise,
    recalcularAnalise,
    carregarPreferencias,
    criarPreferencia,
    editarPreferencia,
    removerPreferencia,
  };
}
