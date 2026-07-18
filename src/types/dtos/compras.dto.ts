export type SolicitacaoCompraStatusValor = 'Aberta' | 'EmCotacao' | 'Atendida' | 'Cancelada';
export type CotacaoCompraStatusValor =
  | 'Aberta'
  | 'Enviada'
  | 'EmResposta'
  | 'Encerrada'
  | 'Cancelada';

export type ContratoFornecimentoStatusValor = 'Vigente' | 'Vencido' | 'Cancelado';
export type SeveridadeAlertaFornecimentoValor = 'Info' | 'Alerta' | 'Critico';
export type PedidoCompraStatusValor =
  | 'Rascunho'
  | 'AguardandoAprovacao'
  | 'Enviado'
  | 'RecebidoParcial'
  | 'Recebido'
  | 'Cancelado';
export type UrgenciaCompraValor = 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
export type RecebimentoCompraStatusValor = 'EmConferencia' | 'Confirmado' | 'Cancelado';
export type OrigemRecebimentoCompraValor = 'Xml' | 'Manual';

export interface SolicitacaoCompraItemDto {
  id: string;
  produtoId: string;
  quantidade: number;
}

export interface SolicitacaoCompraDto {
  id: string;
  solicitanteUsuarioId: string;
  status: SolicitacaoCompraStatusValor;
  observacao: string | null;
  urgencia: UrgenciaCompraValor;
  justificativa: string | null;
  createdAt: string;
  itens: SolicitacaoCompraItemDto[];
}

export interface ItemCotacaoDto {
  id: string;
  produtoId: string;
  quantidade: number;
}

export interface RespostaCotacaoDto {
  id: string;
  fornecedorId: string;
  itemCotacaoId: string;
  precoUnitario: number;
  prazoEntregaDias: number;
  condicoesComerciais: string | null;
  validadeProposta: string | null;
}

export interface EnvioCotacaoDto {
  id: string;
  fornecedorId: string;
  email: string | null;
  enviadoEm: string;
}

export interface CotacaoCompraDto {
  id: string;
  solicitacaoCompraId: string | null;
  dataLimite: string;
  status: CotacaoCompraStatusValor;
  observacao: string | null;
  enviadoEm: string | null;
  createdAt: string;
  itens: ItemCotacaoDto[];
  respostas: RespostaCotacaoDto[];
  envios: EnvioCotacaoDto[];
}

export interface ItemContratoFornecimentoDto {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface ContratoFornecimentoDto {
  id: string;
  fornecedorId: string;
  numero: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  valorTotal: number | null;
  observacao: string | null;
  status: ContratoFornecimentoStatusValor;
  createdAt: string;
  itens: ItemContratoFornecimentoDto[];
}

export interface ContratoFornecimentoAlertaDto {
  contratoId: string;
  numero: string;
  fornecedorId: string;
  status: ContratoFornecimentoStatusValor;
  vigenciaFim: string;
  diasParaVencimento: number;
  severidade: SeveridadeAlertaFornecimentoValor;
  mensagem: string;
}

export interface ComparativoCotacaoPropostaDto {
  fornecedorId: string;
  precoUnitario: number;
  total: number;
  prazoEntregaDias: number;
  condicoesComerciais: string | null;
  validadeProposta: string | null;
}

export interface ComparativoCotacaoItemDto {
  itemCotacaoId: string;
  produtoId: string;
  quantidade: number;
  propostas: ComparativoCotacaoPropostaDto[];
}

export interface ComparativoCotacaoDto {
  cotacaoCompraId: string;
  itens: ComparativoCotacaoItemDto[];
}

export interface PedidoCompraItemDto {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface PedidoCompraDto {
  id: string;
  fornecedorId: string;
  cotacaoCompraId: string | null;
  status: PedidoCompraStatusValor;
  valorTotal: number;
  observacao: string | null;
  createdAt: string;
  itens: PedidoCompraItemDto[];
}

export interface AlcadaAprovacaoCompraDto {
  id: string;
  valorMinimo: number;
  valorMaximo: number;
  perfil: string;
  ordem: number;
}

export interface ComprasConfigDto {
  fluxoCompletoHabilitado: boolean;
}

export interface PreviewRecebimentoXmlItemDto {
  codigoProdutoXml: string;
  produtoId: string | null;
  produtoDescricao: string | null;
  quantidade: number;
  custoUnitario: number;
  numeroLote: string | null;
  dataValidade: string | null;
}

export interface DuplicataRecebimentoDto {
  numero: string | null;
  vencimento: string;
  valor: number;
}

export interface PreviewRecebimentoXmlDto {
  fornecedorId: string | null;
  fornecedorNome: string | null;
  chaveAcesso: string | null;
  numeroNota: string | null;
  serie: string | null;
  itens: PreviewRecebimentoXmlItemDto[];
  duplicatas: DuplicataRecebimentoDto[];
}

export interface RecebimentoCompraItemDto {
  id: string;
  produtoId: string;
  codigoProdutoXml: string | null;
  quantidadeNota: number;
  quantidadeRecebida: number;
  custoUnitario: number;
  numeroLote: string | null;
  dataValidade: string | null;
}

export interface RecebimentoCompraDivergenciaDto {
  id: string;
  tipo: string;
  descricao: string;
  itemId: string | null;
  quantidadeEsperada: number | null;
  quantidadeInformada: number | null;
}

export interface RecebimentoCompraDto {
  id: string;
  fornecedorId: string;
  pedidoCompraId: string | null;
  notaFiscalId: string | null;
  chaveAcesso: string | null;
  numeroNota: string | null;
  serie: string | null;
  origem: OrigemRecebimentoCompraValor;
  status: RecebimentoCompraStatusValor;
  createdAt: string;
  itens: RecebimentoCompraItemDto[];
  divergencias: RecebimentoCompraDivergenciaDto[];
}

export interface HistoricoCompraDto {
  id: string;
  fornecedorId: string;
  produtoId: string;
  recebimentoCompraId: string | null;
  pedidoCompraId: string | null;
  quantidade: number;
  precoUnitario: number;
  dataOcorrencia: string;
}

export interface EvolucaoPrecoCompraDto {
  data: string;
  precoUnitario: number;
  fornecedorId: string;
}

export interface ItemQuantidadePayload {
  produtoId: string;
  quantidade: number;
}

export interface ItemPedidoCompraPayload {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface CriarSolicitacaoCompraPayload {
  itens: ItemQuantidadePayload[];
  observacao?: string | null;
  urgencia?: UrgenciaCompraValor;
  justificativa?: string | null;
}

export interface CriarCotacaoCompraPayload {
  dataLimite: string;
  itens: ItemQuantidadePayload[];
  solicitacaoCompraId?: string | null;
  observacao?: string | null;
}

export interface ResponderCotacaoPayload {
  fornecedorId: string;
  itemCotacaoId: string;
  precoUnitario: number;
  prazoEntregaDias: number;
  condicoesComerciais?: string | null;
  validadeProposta?: string | null;
}

export interface EnviarCotacaoPayload {
  fornecedorIds: string[];
}

export interface ItemContratoFornecimentoPayload {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface CriarContratoFornecimentoPayload {
  fornecedorId: string;
  numero: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  itens: ItemContratoFornecimentoPayload[];
  valorTotal?: number | null;
  observacao?: string | null;
}

export interface AtualizarContratoFornecimentoPayload {
  numero: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  itens: ItemContratoFornecimentoPayload[];
  valorTotal?: number | null;
  observacao?: string | null;
}

export interface ListarContratosFornecimentoParams {
  status?: ContratoFornecimentoStatusValor;
}

export interface CriarPedidoCompraPayload {
  fornecedorId: string;
  itens: ItemPedidoCompraPayload[];
  cotacaoCompraId?: string | null;
  observacao?: string | null;
}

export interface DefinirAlcadaAprovacaoPayload {
  valorMinimo: number;
  valorMaximo: number;
  perfil: string;
  ordem: number;
}

export interface DefinirAlcadasAprovacaoPayload {
  alcadas: DefinirAlcadaAprovacaoPayload[];
}

export interface SalvarComprasConfigPayload {
  fluxoCompletoHabilitado: boolean;
}

export interface PreviewXmlRecebimentoPayload {
  xmlConteudo: string;
}

export interface ItemRecebimentoPayload {
  produtoId: string;
  codigoProdutoXml?: string | null;
  quantidadeNota: number;
  quantidadeRecebida: number;
  custoUnitario: number;
  numeroLote?: string | null;
  dataValidade?: string | null;
}

export interface CriarRecebimentoPayload {
  fornecedorId: string;
  pedidoCompraId?: string | null;
  xmlConteudo?: string | null;
  chaveAcesso?: string | null;
  numeroNota?: string | null;
  serie?: string | null;
  itens: ItemRecebimentoPayload[];
}

export interface AtualizarItemRecebimentoPayload {
  itemId: string;
  quantidadeRecebida: number;
  numeroLote?: string | null;
  dataValidade?: string | null;
  custoUnitario?: number | null;
}

export interface AtualizarItensRecebimentoPayload {
  itens: AtualizarItemRecebimentoPayload[];
}

export interface RegistrarDivergenciaRecebimentoPayload {
  tipo: string;
  descricao: string;
  itemId?: string | null;
  quantidadeEsperada?: number | null;
  quantidadeInformada?: number | null;
}

export interface DuplicataRecebimentoPayload {
  numero?: string | null;
  vencimento: string;
  valor: number;
}

export interface ConfirmarRecebimentoPayload {
  duplicatas?: DuplicataRecebimentoPayload[] | null;
}

export interface ListarSolicitacoesCompraParams {
  status?: SolicitacaoCompraStatusValor;
}

export interface ListarCotacoesCompraParams {
  status?: CotacaoCompraStatusValor;
}

export interface ListarPedidosCompraParams {
  status?: PedidoCompraStatusValor;
}

export interface ListarRecebimentosCompraParams {
  status?: RecebimentoCompraStatusValor;
  pedidoCompraId?: string;
}

export interface ListarHistoricoComprasParams {
  fornecedorId?: string;
  produtoId?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface ListarEvolucaoPrecoComprasParams {
  produtoId: string;
  fornecedorId?: string;
}
