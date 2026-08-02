import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import {
  MetodoDepreciacao,
  StatusAtivoManutencao,
  StatusChecklistInspecao,
  TipoOrdemServicoManutencao,
  PrioridadeOrdemServicoManutencao,
} from 'constants/enums';
import type {
  MetodoDepreciacaoValor,
  TipoAtivoManutencaoValor,
  GatilhoPlanoManutencaoValor,
} from 'constants/enums';
import { messageService } from 'services/message.service';
import { manutencaoService } from 'services/manutencao.service';
import type {
  AdicionarPecaOsFormModel,
  AdicionarPecaOsPayload,
  AtivoManutencaoDto,
  AtivoManutencaoFormModel,
  ChecklistManutencaoDto,
  ChecklistManutencaoFormModel,
  CriarAtivoManutencaoPayload,
  CriarChecklistManutencaoPayload,
  CriarOrdemServicoManutencaoPayload,
  CriarPlanoManutencaoPayload,
  DepreciacaoAtivoDto,
  LeituraHorimetroFormModel,
  ListarCustosManutencaoParams,
  ManutencaoDashboardDto,
  OrdemServicoManutencaoDto,
  OrdemServicoManutencaoFormModel,
  PlanoManutencaoDto,
  PlanoManutencaoFormModel,
  RegistrarExecucaoPlanoFormModel,
  RelatorioCustosManutencaoDto,
} from 'types/dtos/manutencao.dto';
import { formatarMoedaParaInput, parseMascaraMoeda, parseMascaraMoedaObrigatorio } from 'utils/formatters';
import { ref } from 'vue';

function numOuNulo(valor: string): number | null {
  if (!valor.trim()) return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

function ativoFormParaPayload(form: AtivoManutencaoFormModel): CriarAtivoManutencaoPayload {
  return {
    nome: form.nome.trim(),
    tipo: form.tipo as TipoAtivoManutencaoValor,
    fabricante: form.fabricante.trim() || null,
    modelo: form.modelo.trim() || null,
    numeroSerie: form.numeroSerie.trim() || null,
    ano: numOuNulo(form.ano),
    valorAquisicao: parseMascaraMoeda(form.valorAquisicao),
    dataAquisicao: form.dataAquisicao || null,
    vidaUtilAnos: numOuNulo(form.vidaUtilAnos),
    valorResidual: parseMascaraMoeda(form.valorResidual),
    metodoDepreciacao: (form.metodoDepreciacao || MetodoDepreciacao.Linear) as MetodoDepreciacaoValor,
    horimetroAtual: numOuNulo(form.horimetroAtual),
    kmAtual: numOuNulo(form.kmAtual),
    status: form.status,
    localizacao: form.localizacao.trim() || null,
  };
}

function planoFormParaPayload(form: PlanoManutencaoFormModel): CriarPlanoManutencaoPayload {
  return {
    ativoId: form.ativoId,
    descricao: form.descricao.trim(),
    tipoGatilho: form.tipoGatilho as GatilhoPlanoManutencaoValor,
    intervalo: Number(form.intervalo),
  };
}

function osFormParaPayload(
  form: OrdemServicoManutencaoFormModel,
): CriarOrdemServicoManutencaoPayload {
  return {
    ativoId: form.ativoId,
    tipo: form.tipo,
    prioridade: form.prioridade,
    descricao: form.descricao.trim(),
    dataAbertura: form.dataAbertura,
    planoId: form.planoId.trim() || null,
    causaRaiz: form.causaRaiz.trim() || null,
    responsavelNome: form.responsavelNome.trim() || null,
    colaboradorId: form.colaboradorId.trim() || null,
    dataPrevisao: form.dataPrevisao || null,
    horasTrabalhadas: numOuNulo(form.horasTrabalhadas),
    custoMaoObra: parseMascaraMoedaObrigatorio(form.custoMaoObra),
  };
}

function checklistFormParaPayload(
  form: ChecklistManutencaoFormModel,
): CriarChecklistManutencaoPayload {
  return {
    ativoId: form.ativoId,
    data: form.data,
    operadorNome: form.operadorNome.trim(),
    horimetro: Number(form.horimetro),
    status: form.status,
    itens: form.itens.map((item) => ({
      descricao: item.descricao.trim(),
      ok: item.ok,
      observacao: item.observacao.trim() || null,
    })),
  };
}

function pecaFormParaPayload(form: AdicionarPecaOsFormModel): AdicionarPecaOsPayload {
  return {
    produtoId: form.produtoId.trim() || null,
    descricao: form.descricao.trim(),
    quantidade: Number(form.quantidade),
    valorUnitario: parseMascaraMoedaObrigatorio(form.valorUnitario),
    baixarAgora: form.baixarAgora,
  };
}

export function ativoVazio(): AtivoManutencaoFormModel {
  return {
    nome: '',
    tipo: '',
    fabricante: '',
    modelo: '',
    numeroSerie: '',
    ano: '',
    valorAquisicao: formatarMoedaParaInput(0),
    dataAquisicao: '',
    vidaUtilAnos: '',
    valorResidual: formatarMoedaParaInput(0),
    metodoDepreciacao: MetodoDepreciacao.Linear,
    horimetroAtual: '',
    kmAtual: '',
    status: StatusAtivoManutencao.Operacional,
    localizacao: '',
  };
}

export function ativoDtoParaForm(dto: AtivoManutencaoDto): AtivoManutencaoFormModel {
  return {
    nome: dto.nome,
    tipo: dto.tipo,
    fabricante: dto.fabricante ?? '',
    modelo: dto.modelo ?? '',
    numeroSerie: dto.numeroSerie ?? '',
    ano: dto.ano != null ? String(dto.ano) : '',
    valorAquisicao: formatarMoedaParaInput(dto.valorAquisicao),
    dataAquisicao: dto.dataAquisicao?.slice(0, 10) ?? '',
    vidaUtilAnos: dto.vidaUtilAnos != null ? String(dto.vidaUtilAnos) : '',
    valorResidual: formatarMoedaParaInput(dto.valorResidual),
    metodoDepreciacao: dto.metodoDepreciacao ?? MetodoDepreciacao.Linear,
    horimetroAtual: dto.horimetroAtual != null ? String(dto.horimetroAtual) : '',
    kmAtual: dto.kmAtual != null ? String(dto.kmAtual) : '',
    status: dto.status,
    localizacao: dto.localizacao ?? '',
  };
}

export function planoVazio(): PlanoManutencaoFormModel {
  return {
    ativoId: '',
    descricao: '',
    tipoGatilho: '',
    intervalo: '',
  };
}

export function planoDtoParaForm(dto: PlanoManutencaoDto): PlanoManutencaoFormModel {
  return {
    ativoId: dto.ativoId,
    descricao: dto.descricao,
    tipoGatilho: dto.tipoGatilho,
    intervalo: String(dto.intervalo),
  };
}

export function osVazia(): OrdemServicoManutencaoFormModel {
  return {
    ativoId: '',
    tipo: TipoOrdemServicoManutencao.Corretiva,
    prioridade: PrioridadeOrdemServicoManutencao.Media,
    descricao: '',
    dataAbertura: new Date().toISOString().slice(0, 10),
    planoId: '',
    causaRaiz: '',
    responsavelNome: '',
    colaboradorId: '',
    dataPrevisao: '',
    horasTrabalhadas: '',
    custoMaoObra: formatarMoedaParaInput(0),
  };
}

export function checklistVazio(): ChecklistManutencaoFormModel {
  return {
    ativoId: '',
    data: new Date().toISOString().slice(0, 10),
    operadorNome: '',
    horimetro: '',
    status: StatusChecklistInspecao.Aprovado,
    itens: [
      {
        chave: crypto.randomUUID(),
        descricao: 'Nível de óleo',
        ok: true,
        observacao: '',
      },
      {
        chave: crypto.randomUUID(),
        descricao: 'Pressão dos pneus',
        ok: true,
        observacao: '',
      },
      {
        chave: crypto.randomUUID(),
        descricao: 'Vazamentos visíveis',
        ok: true,
        observacao: '',
      },
    ],
  };
}

export function useManutencao() {
  const ativos = ref<AtivoManutencaoDto[]>([]);
  const ativo = ref<AtivoManutencaoDto | null>(null);
  const depreciacao = ref<DepreciacaoAtivoDto | null>(null);
  const planos = ref<PlanoManutencaoDto[]>([]);
  const plano = ref<PlanoManutencaoDto | null>(null);
  const alertas = ref<PlanoManutencaoDto[]>([]);
  const ordens = ref<OrdemServicoManutencaoDto[]>([]);
  const ordem = ref<OrdemServicoManutencaoDto | null>(null);
  const checklists = ref<ChecklistManutencaoDto[]>([]);
  const checklist = ref<ChecklistManutencaoDto | null>(null);
  const custos = ref<RelatorioCustosManutencaoDto | null>(null);
  const dashboard = ref<ManutencaoDashboardDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarAtivos(): Promise<void> {
    carregando.value = true;
    try {
      ativos.value = await manutencaoService.listarAtivos();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterAtivo(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      ativo.value = await manutencaoService.obterAtivo(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarAtivo(form: AtivoManutencaoFormModel): Promise<AtivoManutencaoDto | null> {
    salvando.value = true;
    try {
      const criado = await manutencaoService.criarAtivo(ativoFormParaPayload(form));
      sucesso('Ativo cadastrado.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editarAtivo(
    id: string,
    form: AtivoManutencaoFormModel,
  ): Promise<AtivoManutencaoDto | null> {
    salvando.value = true;
    try {
      const atualizado = await manutencaoService.editarAtivo(id, ativoFormParaPayload(form));
      sucesso('Ativo atualizado.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function removerAtivo(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover ativo',
      mensagem: 'Deseja remover este ativo?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await manutencaoService.removerAtivo(id);
      sucesso('Ativo removido.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarDepreciacao(ativoId: string): Promise<void> {
    try {
      depreciacao.value = await manutencaoService.obterDepreciacao(ativoId);
    } catch (e) {
      depreciacao.value = null;
      erro(mensagem(e));
    }
  }

  async function registrarLeituraHorimetro(
    ativoId: string,
    form: LeituraHorimetroFormModel,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      await manutencaoService.registrarLeituraHorimetro(ativoId, {
        horimetro: Number(form.horimetro),
        km: numOuNulo(form.km),
        lidoEm: form.lidoEm || null,
      });
      ativo.value = await manutencaoService.obterAtivo(ativoId);
      sucesso('Leitura de horímetro registrada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarPlanos(): Promise<void> {
    carregando.value = true;
    try {
      planos.value = await manutencaoService.listarPlanos();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterPlano(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      plano.value = await manutencaoService.obterPlano(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarPlano(form: PlanoManutencaoFormModel): Promise<PlanoManutencaoDto | null> {
    salvando.value = true;
    try {
      const criado = await manutencaoService.criarPlano(planoFormParaPayload(form));
      sucesso('Plano de manutenção criado.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editarPlano(
    id: string,
    form: PlanoManutencaoFormModel,
  ): Promise<PlanoManutencaoDto | null> {
    salvando.value = true;
    try {
      const atualizado = await manutencaoService.editarPlano(id, planoFormParaPayload(form));
      sucesso('Plano atualizado.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function removerPlano(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover plano',
      mensagem: 'Deseja remover este plano preventivo?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await manutencaoService.removerPlano(id);
      sucesso('Plano removido.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function registrarExecucaoPlano(
    id: string,
    form: RegistrarExecucaoPlanoFormModel,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      await manutencaoService.registrarExecucaoPlano(id, {
        dataExecucao: form.dataExecucao,
        valorMedidor: numOuNulo(form.valorMedidor),
      });
      sucesso('Execução registrada.');
      await carregarPlanos();
      await carregarAlertas();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarAlertas(): Promise<void> {
    try {
      alertas.value = await manutencaoService.listarAlertasPreventiva();
    } catch (e) {
      erro(mensagem(e));
    }
  }

  async function carregarOrdens(): Promise<void> {
    carregando.value = true;
    try {
      ordens.value = await manutencaoService.listarOrdensServico();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterOrdem(id: string): Promise<boolean> {
    carregando.value = true;
    try {
      ordem.value = await manutencaoService.obterOrdemServico(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarOrdem(
    form: OrdemServicoManutencaoFormModel,
  ): Promise<OrdemServicoManutencaoDto | null> {
    salvando.value = true;
    try {
      const criada = await manutencaoService.criarOrdemServico(osFormParaPayload(form));
      sucesso('Ordem de serviço aberta.');
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function iniciarOrdem(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Iniciar OS',
      mensagem: 'Deseja iniciar esta ordem de serviço?',
      textoConfirmar: 'Iniciar',
      icone: 'info',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      ordem.value = await manutencaoService.iniciarOrdemServico(id);
      sucesso('OS iniciada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function aguardarPeca(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      ordem.value = await manutencaoService.aguardarPecaOrdemServico(id);
      sucesso('OS marcada como aguardando peça.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function concluirOrdem(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Concluir OS',
      mensagem: 'Deseja concluir esta ordem de serviço?',
      textoConfirmar: 'Concluir',
      icone: 'info',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      ordem.value = await manutencaoService.concluirOrdemServico(id, {});
      sucesso('OS concluída.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelarOrdem(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar OS',
      mensagem: 'Deseja cancelar esta ordem de serviço?',
      textoConfirmar: 'Cancelar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      ordem.value = await manutencaoService.cancelarOrdemServico(id);
      sucesso('OS cancelada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function adicionarPeca(
    ordemId: string,
    form: AdicionarPecaOsFormModel,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      ordem.value = await manutencaoService.adicionarPeca(ordemId, pecaFormParaPayload(form));
      sucesso('Peça adicionada.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function removerPeca(ordemId: string, pecaId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Remover peça',
      mensagem: 'Deseja remover esta peça da OS?',
      textoConfirmar: 'Remover',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await manutencaoService.removerPeca(ordemId, pecaId);
      sucesso('Peça removida.');
      ordem.value = await manutencaoService.obterOrdemServico(ordemId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarChecklists(): Promise<void> {
    carregando.value = true;
    try {
      checklists.value = await manutencaoService.listarChecklists();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criarChecklist(
    form: ChecklistManutencaoFormModel,
  ): Promise<ChecklistManutencaoDto | null> {
    salvando.value = true;
    try {
      const criado = await manutencaoService.criarChecklist(checklistFormParaPayload(form));
      sucesso('Checklist registrado.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarCustos(params?: ListarCustosManutencaoParams): Promise<void> {
    carregando.value = true;
    try {
      custos.value = await manutencaoService.relatorioCustos(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function carregarDashboard(): Promise<void> {
    carregando.value = true;
    try {
      dashboard.value = await manutencaoService.dashboard();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  return {
    ativos,
    ativo,
    depreciacao,
    planos,
    plano,
    alertas,
    ordens,
    ordem,
    checklists,
    checklist,
    custos,
    dashboard,
    carregando,
    salvando,
    carregarAtivos,
    obterAtivo,
    criarAtivo,
    editarAtivo,
    removerAtivo,
    carregarDepreciacao,
    registrarLeituraHorimetro,
    carregarPlanos,
    obterPlano,
    criarPlano,
    editarPlano,
    removerPlano,
    registrarExecucaoPlano,
    carregarAlertas,
    carregarOrdens,
    obterOrdem,
    criarOrdem,
    iniciarOrdem,
    aguardarPeca,
    concluirOrdem,
    cancelarOrdem,
    adicionarPeca,
    removerPeca,
    carregarChecklists,
    criarChecklist,
    carregarCustos,
    carregarDashboard,
  };
}
