export const TipoUnidade = {
  Filial: 'Filial',
  Loja: 'Loja',
  Deposito: 'Deposito',
  Industria: 'Industria',
  OperacaoFisica: 'OperacaoFisica',
} as const;

export type TipoUnidadeValor = (typeof TipoUnidade)[keyof typeof TipoUnidade];

export const TipoUnidadeOpcoes = [
  { label: 'Filial', value: TipoUnidade.Filial },
  { label: 'Loja', value: TipoUnidade.Loja },
  { label: 'Depósito', value: TipoUnidade.Deposito },
  { label: 'Indústria', value: TipoUnidade.Industria },
  { label: 'Operação física', value: TipoUnidade.OperacaoFisica },
];

export const UnidadeStatus = {
  Ativa: 'Ativa',
  Inativa: 'Inativa',
} as const;

export type UnidadeStatusValor = (typeof UnidadeStatus)[keyof typeof UnidadeStatus];

export const UnidadeStatusOpcoes = [
  { label: 'Ativa', value: UnidadeStatus.Ativa },
  { label: 'Inativa', value: UnidadeStatus.Inativa },
];

export const TIMEZONE_PADRAO = 'America/Sao_Paulo';

export const TimeZoneOpcoes = [
  { label: 'Brasília (UTC-3)', value: 'America/Sao_Paulo' },
  { label: 'Manaus (UTC-4)', value: 'America/Manaus' },
  { label: 'Fernando de Noronha (UTC-2)', value: 'America/Noronha' },
  { label: 'Rio Branco (UTC-5)', value: 'America/Rio_Branco' },
];

export const PAIS_PADRAO = 'Brasil';

export const TipoPessoaFornecedor = {
  PessoaJuridica: 'PessoaJuridica',
  PessoaFisica: 'PessoaFisica',
} as const;

export type TipoPessoaFornecedorValor =
  (typeof TipoPessoaFornecedor)[keyof typeof TipoPessoaFornecedor];

export const TipoPessoaFornecedorOpcoes = [
  { label: 'Pessoa jurídica (CNPJ)', value: TipoPessoaFornecedor.PessoaJuridica },
  { label: 'Pessoa física (CPF)', value: TipoPessoaFornecedor.PessoaFisica },
];

export const UsuarioStatus = {
  PendenteConfirmacao: 'PendenteConfirmacao',
  Ativo: 'Ativo',
  Inativo: 'Inativo',
} as const;

export type UsuarioStatusValor = (typeof UsuarioStatus)[keyof typeof UsuarioStatus];

export const UsuarioStatusOpcoes = [
  { label: 'Pendente de confirmação', value: UsuarioStatus.PendenteConfirmacao },
  { label: 'Ativo', value: UsuarioStatus.Ativo },
  { label: 'Inativo', value: UsuarioStatus.Inativo },
];

export const PerfilUsuario = {
  Diretor: 'Diretor',
  Gerente: 'Gerente',
  Vendedor: 'Vendedor',
  Administrativo: 'Administrativo',
  Operacional: 'Operacional',
  Rh: 'Rh',
  Administrador: 'Administrador',
} as const;

export type PerfilUsuarioValor = (typeof PerfilUsuario)[keyof typeof PerfilUsuario];

export const PerfilUsuarioOpcoes = [
  { label: 'Diretor', value: PerfilUsuario.Diretor },
  { label: 'Gerente', value: PerfilUsuario.Gerente },
  { label: 'Vendedor', value: PerfilUsuario.Vendedor },
  { label: 'Administrativo', value: PerfilUsuario.Administrativo },
  { label: 'Operacional', value: PerfilUsuario.Operacional },
  { label: 'RH', value: PerfilUsuario.Rh },
  { label: 'Administrador (legado)', value: PerfilUsuario.Administrador },
];

export const PerfilUsuarioCadastroOpcoes = PerfilUsuarioOpcoes.filter(
  (opcao) => opcao.value !== PerfilUsuario.Administrador,
);

export function isPerfilUsuarioGlobal(perfil: PerfilUsuarioValor): boolean {
  return perfil === PerfilUsuario.Administrador;
}

export const ColaboradorStatus = {
  Ativo: 'Ativo',
  Inativo: 'Inativo',
} as const;

export type ColaboradorStatusValor = (typeof ColaboradorStatus)[keyof typeof ColaboradorStatus];

export const ColaboradorStatusOpcoes = [
  { label: 'Ativo', value: ColaboradorStatus.Ativo },
  { label: 'Inativo', value: ColaboradorStatus.Inativo },
];

export const CargoColaborador = {
  Diretor: 'Diretor',
  Gerente: 'Gerente',
  Vendedor: 'Vendedor',
  Administrativo: 'Administrativo',
  Operacional: 'Operacional',
  Rh: 'Rh',
  Personalizado: 'Personalizado',
} as const;

export type CargoColaboradorValor = (typeof CargoColaborador)[keyof typeof CargoColaborador];

export const CargoColaboradorOpcoes = [
  { label: 'Diretor', value: CargoColaborador.Diretor },
  { label: 'Gerente', value: CargoColaborador.Gerente },
  { label: 'Vendedor', value: CargoColaborador.Vendedor },
  { label: 'Administrativo', value: CargoColaborador.Administrativo },
  { label: 'Operacional', value: CargoColaborador.Operacional },
  { label: 'RH', value: CargoColaborador.Rh },
  { label: 'Personalizado', value: CargoColaborador.Personalizado },
];

export const TipoPessoaCliente = {
  PessoaJuridica: 'PessoaJuridica',
  PessoaFisica: 'PessoaFisica',
} as const;

export type TipoPessoaClienteValor = (typeof TipoPessoaCliente)[keyof typeof TipoPessoaCliente];

export const TipoPessoaClienteOpcoes = [
  { label: 'Pessoa jurídica (CNPJ)', value: TipoPessoaCliente.PessoaJuridica },
  { label: 'Pessoa física (CPF)', value: TipoPessoaCliente.PessoaFisica },
];

export const TipoCliente = {
  Balcao: 'Balcao',
  ProdutorRural: 'ProdutorRural',
  Revenda: 'Revenda',
  Cooperativa: 'Cooperativa',
  Industria: 'Industria',
  Outro: 'Outro',
} as const;

export type TipoClienteValor = (typeof TipoCliente)[keyof typeof TipoCliente];

export const TipoClienteOpcoes = [
  { label: 'Balcão', value: TipoCliente.Balcao },
  { label: 'Produtor rural', value: TipoCliente.ProdutorRural },
  { label: 'Revenda', value: TipoCliente.Revenda },
  { label: 'Cooperativa', value: TipoCliente.Cooperativa },
  { label: 'Indústria', value: TipoCliente.Industria },
  { label: 'Outro', value: TipoCliente.Outro },
];

export const GrupoComercial = {
  Premium: 'Premium',
  Standard: 'Standard',
  Varejo: 'Varejo',
  Rural: 'Rural',
  Outro: 'Outro',
} as const;

export type GrupoComercialValor = (typeof GrupoComercial)[keyof typeof GrupoComercial];

export const GrupoComercialOpcoes = [
  { label: 'Premium', value: GrupoComercial.Premium },
  { label: 'Standard', value: GrupoComercial.Standard },
  { label: 'Varejo', value: GrupoComercial.Varejo },
  { label: 'Rural', value: GrupoComercial.Rural },
  { label: 'Outro', value: GrupoComercial.Outro },
];

export const TipoEnderecoCliente = {
  Cobranca: 'Cobranca',
  Entrega: 'Entrega',
  Propriedade: 'Propriedade',
} as const;

export type TipoEnderecoClienteValor = (typeof TipoEnderecoCliente)[keyof typeof TipoEnderecoCliente];

export const TipoEnderecoClienteOpcoes = [
  { label: 'Cobrança', value: TipoEnderecoCliente.Cobranca },
  { label: 'Entrega', value: TipoEnderecoCliente.Entrega },
  { label: 'Propriedade', value: TipoEnderecoCliente.Propriedade },
];

export const TipoProduto = {
  InsumoAgricola: 'InsumoAgricola',
  Defensivo: 'Defensivo',
  Semente: 'Semente',
  Fertilizante: 'Fertilizante',
  ProdutoAcabado: 'ProdutoAcabado',
  Colheita: 'Colheita',
  Servico: 'Servico',
  Outro: 'Outro',
} as const;

export type TipoProdutoValor = (typeof TipoProduto)[keyof typeof TipoProduto];

export const TipoProdutoOpcoes = [
  { label: 'Insumo agrícola', value: TipoProduto.InsumoAgricola },
  { label: 'Defensivo', value: TipoProduto.Defensivo },
  { label: 'Semente', value: TipoProduto.Semente },
  { label: 'Fertilizante', value: TipoProduto.Fertilizante },
  { label: 'Produto acabado', value: TipoProduto.ProdutoAcabado },
  { label: 'Colheita', value: TipoProduto.Colheita },
  { label: 'Serviço', value: TipoProduto.Servico },
  { label: 'Outro', value: TipoProduto.Outro },
];

export const TipoCodigoProduto = {
  SKU: 'SKU',
  EAN: 'EAN',
  Alternativo: 'Alternativo',
} as const;

export type TipoCodigoProdutoValor = (typeof TipoCodigoProduto)[keyof typeof TipoCodigoProduto];

export const TipoCodigoProdutoOpcoes = [
  { label: 'SKU', value: TipoCodigoProduto.SKU },
  { label: 'EAN', value: TipoCodigoProduto.EAN },
  { label: 'Alternativo', value: TipoCodigoProduto.Alternativo },
];

export const TipoDocumentoProduto = {
  Fispq: 'Fispq',
  FichaTecnica: 'FichaTecnica',
  Outro: 'Outro',
} as const;

export type TipoDocumentoProdutoValor =
  (typeof TipoDocumentoProduto)[keyof typeof TipoDocumentoProduto];

export const TipoDocumentoProdutoOpcoes = [
  { label: 'FISPQ', value: TipoDocumentoProduto.Fispq },
  { label: 'Ficha técnica', value: TipoDocumentoProduto.FichaTecnica },
  { label: 'Outro', value: TipoDocumentoProduto.Outro },
];

export const OrigemMercadoria = {
  Nacional: 'Nacional',
  EstrangeiraImportacaoDireta: 'EstrangeiraImportacaoDireta',
  EstrangeiraAdquiridaMercadoInterno: 'EstrangeiraAdquiridaMercadoInterno',
  NacionalConteudoImportacaoSuperior40: 'NacionalConteudoImportacaoSuperior40',
  NacionalProcessosBasicos: 'NacionalProcessosBasicos',
  NacionalConteudoImportacaoInferior40: 'NacionalConteudoImportacaoInferior40',
  EstrangeiraImportacaoDiretaSemSimilar: 'EstrangeiraImportacaoDiretaSemSimilar',
  EstrangeiraAdquiridaMercadoInternoSemSimilar: 'EstrangeiraAdquiridaMercadoInternoSemSimilar',
  NacionalConteudoImportacaoSuperior70: 'NacionalConteudoImportacaoSuperior70',
} as const;

export type OrigemMercadoriaValor = (typeof OrigemMercadoria)[keyof typeof OrigemMercadoria];

export const OrigemMercadoriaOpcoes = [
  { label: 'Nacional', value: OrigemMercadoria.Nacional },
  {
    label: 'Estrangeira — importação direta',
    value: OrigemMercadoria.EstrangeiraImportacaoDireta,
  },
  {
    label: 'Estrangeira — mercado interno',
    value: OrigemMercadoria.EstrangeiraAdquiridaMercadoInterno,
  },
  {
    label: 'Nacional — importação > 40%',
    value: OrigemMercadoria.NacionalConteudoImportacaoSuperior40,
  },
  { label: 'Nacional — processos básicos', value: OrigemMercadoria.NacionalProcessosBasicos },
  {
    label: 'Nacional — importação ≤ 40%',
    value: OrigemMercadoria.NacionalConteudoImportacaoInferior40,
  },
  {
    label: 'Estrangeira — importação sem similar',
    value: OrigemMercadoria.EstrangeiraImportacaoDiretaSemSimilar,
  },
  {
    label: 'Estrangeira — mercado interno sem similar',
    value: OrigemMercadoria.EstrangeiraAdquiridaMercadoInternoSemSimilar,
  },
  {
    label: 'Nacional — importação > 70%',
    value: OrigemMercadoria.NacionalConteudoImportacaoSuperior70,
  },
];

export const MetodoCusteio = {
  CMP: 'CMP',
  FIFO: 'FIFO',
  FEFO: 'FEFO',
} as const;

export type MetodoCusteioValor = (typeof MetodoCusteio)[keyof typeof MetodoCusteio];

export const MetodoCusteioOpcoes = [
  { label: 'Custo médio ponderado (CMP)', value: MetodoCusteio.CMP },
  { label: 'FIFO', value: MetodoCusteio.FIFO },
  { label: 'FEFO', value: MetodoCusteio.FEFO },
];

export const CanalVenda = {
  Balcao: 'Balcao',
  Varejo: 'Varejo',
  Atacado: 'Atacado',
  Ecommerce: 'Ecommerce',
  Representante: 'Representante',
  Outro: 'Outro',
} as const;

export type CanalVendaValor = (typeof CanalVenda)[keyof typeof CanalVenda];

export const CanalVendaOpcoes = [
  { label: 'Balcão', value: CanalVenda.Balcao },
  { label: 'Varejo', value: CanalVenda.Varejo },
  { label: 'Atacado', value: CanalVenda.Atacado },
  { label: 'E-commerce', value: CanalVenda.Ecommerce },
  { label: 'Representante', value: CanalVenda.Representante },
  { label: 'Outro', value: CanalVenda.Outro },
];

export const TipoMovimentacaoEstoque = {
  Entrada: 'Entrada',
  Saida: 'Saida',
  Ajuste: 'Ajuste',
} as const;

export type TipoMovimentacaoEstoqueValor =
  (typeof TipoMovimentacaoEstoque)[keyof typeof TipoMovimentacaoEstoque];

export const TipoMovimentacaoEstoqueOpcoes = [
  { label: 'Entrada', value: TipoMovimentacaoEstoque.Entrada },
  { label: 'Saída', value: TipoMovimentacaoEstoque.Saida },
  { label: 'Ajuste', value: TipoMovimentacaoEstoque.Ajuste },
];

export const OrigemMovimentacaoEstoque = {
  Manual: 'Manual',
  EstoqueInicial: 'EstoqueInicial',
  Inventario: 'Inventario',
  ReservaPedido: 'ReservaPedido',
  DevolucaoPedido: 'DevolucaoPedido',
  Pdv: 'Pdv',
} as const;

export type OrigemMovimentacaoEstoqueValor =
  (typeof OrigemMovimentacaoEstoque)[keyof typeof OrigemMovimentacaoEstoque];

export const OrigemMovimentacaoEstoqueOpcoes = [
  { label: 'Manual', value: OrigemMovimentacaoEstoque.Manual },
  { label: 'Estoque inicial', value: OrigemMovimentacaoEstoque.EstoqueInicial },
  { label: 'Inventário', value: OrigemMovimentacaoEstoque.Inventario },
  { label: 'Reserva de pedido', value: OrigemMovimentacaoEstoque.ReservaPedido },
  { label: 'Devolução de pedido', value: OrigemMovimentacaoEstoque.DevolucaoPedido },
  { label: 'PDV', value: OrigemMovimentacaoEstoque.Pdv },
];

export const InventarioStatus = {
  Aberto: 'Aberto',
  Concluido: 'Concluido',
} as const;

export type InventarioStatusValor = (typeof InventarioStatus)[keyof typeof InventarioStatus];

export const InventarioStatusOpcoes = [
  { label: 'Aberto', value: InventarioStatus.Aberto },
  { label: 'Concluído', value: InventarioStatus.Concluido },
];

export const AtalhoPeriodoEstoque = {
  Hoje: 'hoje',
  SeteDias: '7d',
  TrintaDias: '30d',
} as const;

export type AtalhoPeriodoEstoqueValor =
  (typeof AtalhoPeriodoEstoque)[keyof typeof AtalhoPeriodoEstoque];

export const AtalhoPeriodoEstoqueOpcoes = [
  { label: 'Hoje', value: AtalhoPeriodoEstoque.Hoje },
  { label: 'Últimos 7 dias', value: AtalhoPeriodoEstoque.SeteDias },
  { label: 'Últimos 30 dias', value: AtalhoPeriodoEstoque.TrintaDias },
];

export const FormaPagamento = {
  Dinheiro: 'Dinheiro',
  Pix: 'Pix',
  Boleto: 'Boleto',
  Cartao: 'Cartao',
  Transferencia: 'Transferencia',
  Outros: 'Outros',
} as const;

export type FormaPagamentoValor = (typeof FormaPagamento)[keyof typeof FormaPagamento];

export const FormaPagamentoOpcoes = [
  { label: 'Dinheiro', value: FormaPagamento.Dinheiro },
  { label: 'PIX', value: FormaPagamento.Pix },
  { label: 'Boleto', value: FormaPagamento.Boleto },
  { label: 'Cartão', value: FormaPagamento.Cartao },
  { label: 'Transferência', value: FormaPagamento.Transferencia },
  { label: 'Outros', value: FormaPagamento.Outros },
];

export const PedidoVendaStatus = {
  Orcamento: 'Orcamento',
  Aguardando: 'Aguardando',
  Aprovado: 'Aprovado',
  Faturado: 'Faturado',
  Recusado: 'Recusado',
  Expirado: 'Expirado',
} as const;

export type PedidoVendaStatusValor =
  (typeof PedidoVendaStatus)[keyof typeof PedidoVendaStatus];

export const PedidoVendaStatusOpcoes = [
  { label: 'Orçamento', value: PedidoVendaStatus.Orcamento },
  { label: 'Aguardando', value: PedidoVendaStatus.Aguardando },
  { label: 'Aprovado', value: PedidoVendaStatus.Aprovado },
  { label: 'Faturado', value: PedidoVendaStatus.Faturado },
  { label: 'Recusado', value: PedidoVendaStatus.Recusado },
  { label: 'Expirado', value: PedidoVendaStatus.Expirado },
];

export const ContaReceberStatus = {
  Aberta: 'Aberta',
  Paga: 'Paga',
  Cancelada: 'Cancelada',
} as const;

export type ContaReceberStatusValor =
  (typeof ContaReceberStatus)[keyof typeof ContaReceberStatus];

export const ContaReceberStatusOpcoes = [
  { label: 'Aberta', value: ContaReceberStatus.Aberta },
  { label: 'Paga', value: ContaReceberStatus.Paga },
  { label: 'Cancelada', value: ContaReceberStatus.Cancelada },
];

export const TravaAprovacaoTipo = {
  MargemMinima: 'MargemMinima',
  LimiteCredito: 'LimiteCredito',
  EstoqueInsuficiente: 'EstoqueInsuficiente',
  AtrasoCliente: 'AtrasoCliente',
} as const;

export type TravaAprovacaoTipoValor =
  (typeof TravaAprovacaoTipo)[keyof typeof TravaAprovacaoTipo];

export const TravaAprovacaoTipoOpcoes = [
  { label: 'Margem mínima', value: TravaAprovacaoTipo.MargemMinima },
  { label: 'Limite de crédito', value: TravaAprovacaoTipo.LimiteCredito },
  { label: 'Estoque insuficiente', value: TravaAprovacaoTipo.EstoqueInsuficiente },
  { label: 'Atraso do cliente', value: TravaAprovacaoTipo.AtrasoCliente },
];

export const NotificacaoTipo = {
  PedidoRetido: 'PedidoRetido',
  PedidoAprovado: 'PedidoAprovado',
  PedidoRecusado: 'PedidoRecusado',
  PedidoExpirado: 'PedidoExpirado',
} as const;

export type NotificacaoTipoValor =
  (typeof NotificacaoTipo)[keyof typeof NotificacaoTipo];

export const NotificacaoTipoOpcoes = [
  { label: 'Pedido retido', value: NotificacaoTipo.PedidoRetido },
  { label: 'Pedido aprovado', value: NotificacaoTipo.PedidoAprovado },
  { label: 'Pedido recusado', value: NotificacaoTipo.PedidoRecusado },
  { label: 'Pedido expirado', value: NotificacaoTipo.PedidoExpirado },
];

export const NotificacaoPrioridade = {
  Baixa: 'Baixa',
  Media: 'Media',
  Alta: 'Alta',
} as const;

export type NotificacaoPrioridadeValor =
  (typeof NotificacaoPrioridade)[keyof typeof NotificacaoPrioridade];

export const NotificacaoPrioridadeOpcoes = [
  { label: 'Baixa', value: NotificacaoPrioridade.Baixa },
  { label: 'Média', value: NotificacaoPrioridade.Media },
  { label: 'Alta', value: NotificacaoPrioridade.Alta },
];

export const ExportacaoPedidoFormato = {
  Excel: 'excel',
  Pdf: 'pdf',
} as const;

export type ExportacaoPedidoFormatoValor =
  (typeof ExportacaoPedidoFormato)[keyof typeof ExportacaoPedidoFormato];

export const ExportacaoFormato = ExportacaoPedidoFormato;
export type ExportacaoFormatoValor = ExportacaoPedidoFormatoValor;

export const OrcamentoStatus = {
  Aberto: 'Aberto',
  Convertido: 'Convertido',
  Cancelado: 'Cancelado',
} as const;

export type OrcamentoStatusValor = (typeof OrcamentoStatus)[keyof typeof OrcamentoStatus];

export const OrcamentoStatusOpcoes = [
  { label: 'Aberto', value: OrcamentoStatus.Aberto },
  { label: 'Convertido', value: OrcamentoStatus.Convertido },
  { label: 'Cancelado', value: OrcamentoStatus.Cancelado },
];

export const PdvVendaStatus = {
  Concluida: 'Concluida',
  Cancelada: 'Cancelada',
} as const;

export type PdvVendaStatusValor = (typeof PdvVendaStatus)[keyof typeof PdvVendaStatus];

export const PdvVendaStatusOpcoes = [
  { label: 'Concluída', value: PdvVendaStatus.Concluida },
  { label: 'Cancelada', value: PdvVendaStatus.Cancelada },
];

export const DestinoDevolucao = {
  Reposicao: 'Reposicao',
  Descarte: 'Descarte',
} as const;

export type DestinoDevolucaoValor = (typeof DestinoDevolucao)[keyof typeof DestinoDevolucao];

export const DestinoDevolucaoOpcoes = [
  { label: 'Reposição', value: DestinoDevolucao.Reposicao },
  { label: 'Descarte', value: DestinoDevolucao.Descarte },
];

export const RegimeTributario = {
  SimplesNacional: 'SimplesNacional',
  LucroPresumido: 'LucroPresumido',
  LucroReal: 'LucroReal',
} as const;

export type RegimeTributarioValor = (typeof RegimeTributario)[keyof typeof RegimeTributario];

export const RegimeTributarioOpcoes = [
  { label: 'Simples Nacional', value: RegimeTributario.SimplesNacional },
  { label: 'Lucro Presumido', value: RegimeTributario.LucroPresumido },
  { label: 'Lucro Real', value: RegimeTributario.LucroReal },
];

export const FontePreco = {
  Manual: 'Manual',
  Cbot: 'Cbot',
  Esalq: 'Esalq',
} as const;

export type FontePrecoValor = (typeof FontePreco)[keyof typeof FontePreco];

export const FontePrecoOpcoes = [
  { label: 'Manual', value: FontePreco.Manual },
  { label: 'CBOT', value: FontePreco.Cbot },
  { label: 'ESALQ', value: FontePreco.Esalq },
];

export const ContratoStatus = {
  Aberto: 'Aberto',
  Liquidado: 'Liquidado',
  Entregue: 'Entregue',
  Cancelado: 'Cancelado',
} as const;

export type ContratoStatusValor = (typeof ContratoStatus)[keyof typeof ContratoStatus];

export const ContratoStatusOpcoes = [
  { label: 'Aberto', value: ContratoStatus.Aberto },
  { label: 'Liquidado', value: ContratoStatus.Liquidado },
  { label: 'Entregue', value: ContratoStatus.Entregue },
  { label: 'Cancelado', value: ContratoStatus.Cancelado },
];

export const TipoContrato = {
  Cpr: 'cprs',
  Barter: 'barter',
  Termo: 'termo',
} as const;

export type TipoContratoValor = (typeof TipoContrato)[keyof typeof TipoContrato];

export const TipoContratoOpcoes = [
  { label: 'CPR', value: TipoContrato.Cpr },
  { label: 'Barter', value: TipoContrato.Barter },
  { label: 'Termo', value: TipoContrato.Termo },
];

export const OrdemProducaoStatus = {
  Aberta: 'Aberta',
  EmAndamento: 'EmAndamento',
  Concluida: 'Concluida',
  Cancelada: 'Cancelada',
} as const;

export type OrdemProducaoStatusValor =
  (typeof OrdemProducaoStatus)[keyof typeof OrdemProducaoStatus];

export const OrdemProducaoStatusOpcoes = [
  { label: 'Aberta', value: OrdemProducaoStatus.Aberta },
  { label: 'Em andamento', value: OrdemProducaoStatus.EmAndamento },
  { label: 'Concluída', value: OrdemProducaoStatus.Concluida },
  { label: 'Cancelada', value: OrdemProducaoStatus.Cancelada },
];
