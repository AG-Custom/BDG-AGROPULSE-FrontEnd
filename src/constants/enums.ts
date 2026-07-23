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
  Representante: 'Representante',
  Varejo: 'Varejo',
} as const;

export type CanalVendaValor = (typeof CanalVenda)[keyof typeof CanalVenda];

export const CanalVendaOpcoes = [
  { label: 'Balcão', value: CanalVenda.Balcao },
  { label: 'Representante', value: CanalVenda.Representante },
  { label: 'Varejo', value: CanalVenda.Varejo },
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
  Producao: 'Producao',
  RequisicaoInterna: 'RequisicaoInterna',
  Descarte: 'Descarte',
  Transferencia: 'Transferencia',
  NfeEntrada: 'NfeEntrada',
  Manutencao: 'Manutencao',
  Contrato: 'Contrato',
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
  { label: 'Produção', value: OrigemMovimentacaoEstoque.Producao },
  { label: 'Requisição interna', value: OrigemMovimentacaoEstoque.RequisicaoInterna },
  { label: 'Descarte', value: OrigemMovimentacaoEstoque.Descarte },
  { label: 'Transferência', value: OrigemMovimentacaoEstoque.Transferencia },
  { label: 'NF-e entrada', value: OrigemMovimentacaoEstoque.NfeEntrada },
  { label: 'Manutenção', value: OrigemMovimentacaoEstoque.Manutencao },
  { label: 'Contrato', value: OrigemMovimentacaoEstoque.Contrato },
];

export const MotivoSaidaEstoqueOpcoes = [
  { label: 'Manual', value: OrigemMovimentacaoEstoque.Manual },
  { label: 'Requisição interna', value: OrigemMovimentacaoEstoque.RequisicaoInterna },
  { label: 'Descarte', value: OrigemMovimentacaoEstoque.Descarte },
];

export const TransferenciaEstoqueStatus = {
  Pendente: 'Pendente',
  Concluida: 'Concluida',
  Cancelada: 'Cancelada',
} as const;

export type TransferenciaEstoqueStatusValor =
  (typeof TransferenciaEstoqueStatus)[keyof typeof TransferenciaEstoqueStatus];

export const TransferenciaEstoqueStatusOpcoes = [
  { label: 'Pendente', value: TransferenciaEstoqueStatus.Pendente },
  { label: 'Concluída', value: TransferenciaEstoqueStatus.Concluida },
  { label: 'Cancelada', value: TransferenciaEstoqueStatus.Cancelada },
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
  Debito: 'Debito',
  Credito: 'Credito',
  Cheque: 'Cheque',
} as const;

export type FormaPagamentoValor = (typeof FormaPagamento)[keyof typeof FormaPagamento];

export const FormaPagamentoOpcoes = [
  { label: 'Dinheiro', value: FormaPagamento.Dinheiro },
  { label: 'PIX', value: FormaPagamento.Pix },
  { label: 'Boleto', value: FormaPagamento.Boleto },
  { label: 'Cartão', value: FormaPagamento.Cartao },
  { label: 'Cartão débito', value: FormaPagamento.Debito },
  { label: 'Cartão crédito', value: FormaPagamento.Credito },
  { label: 'Cheque', value: FormaPagamento.Cheque },
  { label: 'Transferência', value: FormaPagamento.Transferencia },
  { label: 'Outros', value: FormaPagamento.Outros },
];

export const FormaPagamentoPdvOpcoes = [
  { label: 'Dinheiro', value: FormaPagamento.Dinheiro },
  { label: 'PIX', value: FormaPagamento.Pix },
  { label: 'Cartão débito', value: FormaPagamento.Debito },
  { label: 'Cartão crédito', value: FormaPagamento.Credito },
  { label: 'Cheque', value: FormaPagamento.Cheque },
  { label: 'Transferência', value: FormaPagamento.Transferencia },
  { label: 'Outros', value: FormaPagamento.Outros },
];

export const PedidoVendaStatus = {
  Orcamento: 'Orcamento',
  Aguardando: 'Aguardando',
  PendenteEstoque: 'PendenteEstoque',
  Aprovado: 'Aprovado',
  Faturado: 'Faturado',
  Recusado: 'Recusado',
  Expirado: 'Expirado',
} as const;

export type PedidoVendaStatusValor =
  (typeof PedidoVendaStatus)[keyof typeof PedidoVendaStatus];

export const PedidoVendaStatusOpcoes = [
  { label: 'Orçamento', value: PedidoVendaStatus.Orcamento },
  { label: 'Aguardando aprovação', value: PedidoVendaStatus.Aguardando },
  { label: 'Pendente de estoque', value: PedidoVendaStatus.PendenteEstoque },
  { label: 'Aprovado', value: PedidoVendaStatus.Aprovado },
  { label: 'Faturado', value: PedidoVendaStatus.Faturado },
  { label: 'Recusado', value: PedidoVendaStatus.Recusado },
  { label: 'Expirado', value: PedidoVendaStatus.Expirado },
];

export const ContaReceberStatus = {
  Aberta: 'Aberta',
  ParcialmentePaga: 'ParcialmentePaga',
  Paga: 'Paga',
  Cancelada: 'Cancelada',
} as const;

export type ContaReceberStatusValor =
  (typeof ContaReceberStatus)[keyof typeof ContaReceberStatus];

export const ContaReceberStatusOpcoes = [
  { label: 'Aberta', value: ContaReceberStatus.Aberta },
  { label: 'Parcialmente paga', value: ContaReceberStatus.ParcialmentePaga },
  { label: 'Paga', value: ContaReceberStatus.Paga },
  { label: 'Cancelada', value: ContaReceberStatus.Cancelada },
];

export const ContaPagarStatus = {
  Aberta: 'Aberta',
  ParcialmentePaga: 'ParcialmentePaga',
  Paga: 'Paga',
  Cancelada: 'Cancelada',
} as const;

export type ContaPagarStatusValor =
  (typeof ContaPagarStatus)[keyof typeof ContaPagarStatus];

export const ContaPagarStatusOpcoes = [
  { label: 'Aberta', value: ContaPagarStatus.Aberta },
  { label: 'Parcialmente paga', value: ContaPagarStatus.ParcialmentePaga },
  { label: 'Paga', value: ContaPagarStatus.Paga },
  { label: 'Cancelada', value: ContaPagarStatus.Cancelada },
];

export const EscopoFinanceiro = {
  Unidade: 'Unidade',
  Cnpj: 'Cnpj',
  Grupo: 'Grupo',
} as const;

export type EscopoFinanceiroValor =
  (typeof EscopoFinanceiro)[keyof typeof EscopoFinanceiro];

export const EscopoFinanceiroOpcoes = [
  { label: 'Unidade', value: EscopoFinanceiro.Unidade },
  { label: 'CNPJ', value: EscopoFinanceiro.Cnpj },
  { label: 'Grupo', value: EscopoFinanceiro.Grupo },
];

export const TipoContaBancaria = {
  Corrente: 'Corrente',
  Poupanca: 'Poupanca',
  Pagamento: 'Pagamento',
  Investimento: 'Investimento',
} as const;

export type TipoContaBancariaValor =
  (typeof TipoContaBancaria)[keyof typeof TipoContaBancaria];

export const TipoContaBancariaOpcoes = [
  { label: 'Corrente', value: TipoContaBancaria.Corrente },
  { label: 'Poupança', value: TipoContaBancaria.Poupanca },
  { label: 'Pagamento', value: TipoContaBancaria.Pagamento },
  { label: 'Investimento', value: TipoContaBancaria.Investimento },
];

export const StatusTransferencia = {
  Pendente: 'Pendente',
  Confirmada: 'Confirmada',
  Cancelada: 'Cancelada',
} as const;

export type StatusTransferenciaValor =
  (typeof StatusTransferencia)[keyof typeof StatusTransferencia];

export const StatusTransferenciaOpcoes = [
  { label: 'Pendente', value: StatusTransferencia.Pendente },
  { label: 'Confirmada', value: StatusTransferencia.Confirmada },
  { label: 'Cancelada', value: StatusTransferencia.Cancelada },
];

export const StatusCheque = {
  EmCarteira: 'EmCarteira',
  Depositado: 'Depositado',
  Compensado: 'Compensado',
  Devolvido: 'Devolvido',
} as const;

export type StatusChequeValor = (typeof StatusCheque)[keyof typeof StatusCheque];

export const StatusChequeOpcoes = [
  { label: 'Em carteira', value: StatusCheque.EmCarteira },
  { label: 'Depositado', value: StatusCheque.Depositado },
  { label: 'Compensado', value: StatusCheque.Compensado },
  { label: 'Devolvido', value: StatusCheque.Devolvido },
];

export const TipoCheque = {
  Recebido: 'Recebido',
  Emitido: 'Emitido',
} as const;

export type TipoChequeValor = (typeof TipoCheque)[keyof typeof TipoCheque];

export const TipoChequeOpcoes = [
  { label: 'Recebido', value: TipoCheque.Recebido },
  { label: 'Emitido', value: TipoCheque.Emitido },
];

export const TipoAplicacao = {
  CDB: 'CDB',
  LCI: 'LCI',
  LCA: 'LCA',
  Fundo: 'Fundo',
  Tesouro: 'Tesouro',
  Outros: 'Outros',
} as const;

export type TipoAplicacaoValor = (typeof TipoAplicacao)[keyof typeof TipoAplicacao];

export const TipoAplicacaoOpcoes = [
  { label: 'CDB', value: TipoAplicacao.CDB },
  { label: 'LCI', value: TipoAplicacao.LCI },
  { label: 'LCA', value: TipoAplicacao.LCA },
  { label: 'Fundo', value: TipoAplicacao.Fundo },
  { label: 'Tesouro', value: TipoAplicacao.Tesouro },
  { label: 'Outros', value: TipoAplicacao.Outros },
];

export const StatusBoleto = {
  Pendente: 'Pendente',
  Emitido: 'Emitido',
  Registrado: 'Registrado',
  Pago: 'Pago',
  Cancelado: 'Cancelado',
  Vencido: 'Vencido',
} as const;

export type StatusBoletoValor = (typeof StatusBoleto)[keyof typeof StatusBoleto];

export const StatusBoletoOpcoes = [
  { label: 'Pendente', value: StatusBoleto.Pendente },
  { label: 'Emitido', value: StatusBoleto.Emitido },
  { label: 'Registrado', value: StatusBoleto.Registrado },
  { label: 'Pago', value: StatusBoleto.Pago },
  { label: 'Cancelado', value: StatusBoleto.Cancelado },
  { label: 'Vencido', value: StatusBoleto.Vencido },
];

export const PeriodoFluxoCaixa = {
  Diario: 'Diario',
  Semanal: 'Semanal',
  Projetado: 'Projetado',
} as const;

export type PeriodoFluxoCaixaValor =
  (typeof PeriodoFluxoCaixa)[keyof typeof PeriodoFluxoCaixa];

export const PeriodoFluxoCaixaOpcoes = [
  { label: 'Diário', value: PeriodoFluxoCaixa.Diario },
  { label: 'Semanal', value: PeriodoFluxoCaixa.Semanal },
  { label: 'Projetado', value: PeriodoFluxoCaixa.Projetado },
];

export const VersaoOrcamentoFinanceiro = {
  R0: 'R0',
  R1: 'R1',
  R2: 'R2',
} as const;

export type VersaoOrcamentoFinanceiroValor =
  (typeof VersaoOrcamentoFinanceiro)[keyof typeof VersaoOrcamentoFinanceiro];

export const VersaoOrcamentoFinanceiroOpcoes = [
  { label: 'R0', value: VersaoOrcamentoFinanceiro.R0 },
  { label: 'R1', value: VersaoOrcamentoFinanceiro.R1 },
  { label: 'R2', value: VersaoOrcamentoFinanceiro.R2 },
];

export const StatusRenegociacao = {
  Pendente: 'Pendente',
  Aprovada: 'Aprovada',
  Rejeitada: 'Rejeitada',
} as const;

export type StatusRenegociacaoValor =
  (typeof StatusRenegociacao)[keyof typeof StatusRenegociacao];

export const StatusRenegociacaoOpcoes = [
  { label: 'Pendente', value: StatusRenegociacao.Pendente },
  { label: 'Aprovada', value: StatusRenegociacao.Aprovada },
  { label: 'Rejeitada', value: StatusRenegociacao.Rejeitada },
];

export const StatusAntecipacao = {
  Simulada: 'Simulada',
  Cedida: 'Cedida',
  Cancelada: 'Cancelada',
} as const;

export type StatusAntecipacaoValor =
  (typeof StatusAntecipacao)[keyof typeof StatusAntecipacao];

export const StatusAntecipacaoOpcoes = [
  { label: 'Simulada', value: StatusAntecipacao.Simulada },
  { label: 'Cedida', value: StatusAntecipacao.Cedida },
  { label: 'Cancelada', value: StatusAntecipacao.Cancelada },
];

export const StatusAplicacao = {
  Ativa: 'Ativa',
  Resgatada: 'Resgatada',
} as const;

export type StatusAplicacaoValor =
  (typeof StatusAplicacao)[keyof typeof StatusAplicacao];

export const StatusAplicacaoOpcoes = [
  { label: 'Ativa', value: StatusAplicacao.Ativa },
  { label: 'Resgatada', value: StatusAplicacao.Resgatada },
];

export const UrgenciaCompra = {
  Baixa: 'Baixa',
  Normal: 'Normal',
  Alta: 'Alta',
  Urgente: 'Urgente',
} as const;

export type UrgenciaCompraValorEnum =
  (typeof UrgenciaCompra)[keyof typeof UrgenciaCompra];

export const UrgenciaCompraOpcoes = [
  { label: 'Baixa', value: UrgenciaCompra.Baixa },
  { label: 'Normal', value: UrgenciaCompra.Normal },
  { label: 'Alta', value: UrgenciaCompra.Alta },
  { label: 'Urgente', value: UrgenciaCompra.Urgente },
];

export const RecebimentoCompraStatus = {
  EmConferencia: 'EmConferencia',
  Confirmado: 'Confirmado',
  Cancelado: 'Cancelado',
} as const;

export type RecebimentoCompraStatusValorEnum =
  (typeof RecebimentoCompraStatus)[keyof typeof RecebimentoCompraStatus];

export const RecebimentoCompraStatusOpcoes = [
  { label: 'Em conferência', value: RecebimentoCompraStatus.EmConferencia },
  { label: 'Confirmado', value: RecebimentoCompraStatus.Confirmado },
  { label: 'Cancelado', value: RecebimentoCompraStatus.Cancelado },
];

export const PedidoCompraStatus = {
  Rascunho: 'Rascunho',
  AguardandoAprovacao: 'AguardandoAprovacao',
  Enviado: 'Enviado',
  RecebidoParcial: 'RecebidoParcial',
  Recebido: 'Recebido',
  Cancelado: 'Cancelado',
} as const;

export type PedidoCompraStatusValorEnum =
  (typeof PedidoCompraStatus)[keyof typeof PedidoCompraStatus];

export const PedidoCompraStatusOpcoes = [
  { label: 'Rascunho', value: PedidoCompraStatus.Rascunho },
  { label: 'Aguardando aprovação', value: PedidoCompraStatus.AguardandoAprovacao },
  { label: 'Enviado', value: PedidoCompraStatus.Enviado },
  { label: 'Recebido parcial', value: PedidoCompraStatus.RecebidoParcial },
  { label: 'Recebido', value: PedidoCompraStatus.Recebido },
  { label: 'Cancelado', value: PedidoCompraStatus.Cancelado },
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

export const DreVisao = {
  Unidade: 'Unidade',
  Cnpj: 'Cnpj',
  Grupo: 'Grupo',
} as const;

export type DreVisaoValor = (typeof DreVisao)[keyof typeof DreVisao];

export const DreVisaoOpcoes = [
  { label: 'Unidade', value: DreVisao.Unidade },
  { label: 'CNPJ', value: DreVisao.Cnpj },
  { label: 'Grupo', value: DreVisao.Grupo },
];

export const RentabilidadeDimensao = {
  Produto: 'Produto',
  Cliente: 'Cliente',
  Canal: 'Canal',
  Regiao: 'Regiao',
} as const;

export type RentabilidadeDimensaoValor =
  (typeof RentabilidadeDimensao)[keyof typeof RentabilidadeDimensao];

export const RentabilidadeDimensaoOpcoes = [
  { label: 'Produto', value: RentabilidadeDimensao.Produto },
  { label: 'Cliente', value: RentabilidadeDimensao.Cliente },
  { label: 'Canal', value: RentabilidadeDimensao.Canal },
  { label: 'Região', value: RentabilidadeDimensao.Regiao },
];

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

export const DestinoCreditoDevolucao = {
  AbatimentoProximaCompra: 'AbatimentoProximaCompra',
  DevolucaoDinheiro: 'DevolucaoDinheiro',
  EstornoCartao: 'EstornoCartao',
} as const;

export type DestinoCreditoDevolucaoValor =
  (typeof DestinoCreditoDevolucao)[keyof typeof DestinoCreditoDevolucao];

export const DestinoCreditoDevolucaoOpcoes = [
  {
    label: 'Abatimento na próxima compra',
    value: DestinoCreditoDevolucao.AbatimentoProximaCompra,
  },
  {
    label: 'Devolução dinheiro/PIX',
    value: DestinoCreditoDevolucao.DevolucaoDinheiro,
  },
  {
    label: 'Estorno de cartão',
    value: DestinoCreditoDevolucao.EstornoCartao,
  },
];

export const RegimeTributario = {
  SimplesNacional: 'SimplesNacional',
  LucroPresumido: 'LucroPresumido',
  LucroReal: 'LucroReal',
  ProdutorRural: 'ProdutorRural',
} as const;

export type RegimeTributarioValor = (typeof RegimeTributario)[keyof typeof RegimeTributario];

export const RegimeTributarioOpcoes = [
  { label: 'Simples Nacional', value: RegimeTributario.SimplesNacional },
  { label: 'Lucro Presumido', value: RegimeTributario.LucroPresumido },
  { label: 'Lucro Real', value: RegimeTributario.LucroReal },
  { label: 'Produtor Rural', value: RegimeTributario.ProdutorRural },
];

export const StatusNotaFiscal = {
  Rascunho: 'Rascunho',
  Emitida: 'Emitida',
  Cancelada: 'Cancelada',
  Erro: 'Erro',
  Contingencia: 'Contingencia',
  Inutilizada: 'Inutilizada',
} as const;

export type StatusNotaFiscalValor = (typeof StatusNotaFiscal)[keyof typeof StatusNotaFiscal];

export const StatusNotaFiscalOpcoes = [
  { label: 'Rascunho', value: StatusNotaFiscal.Rascunho },
  { label: 'Emitida', value: StatusNotaFiscal.Emitida },
  { label: 'Cancelada', value: StatusNotaFiscal.Cancelada },
  { label: 'Erro', value: StatusNotaFiscal.Erro },
  { label: 'Contingência', value: StatusNotaFiscal.Contingencia },
  { label: 'Inutilizada', value: StatusNotaFiscal.Inutilizada },
];

export const ModeloDocumentoFiscal = {
  NFe: 'NFe',
  NFCe: 'NFCe',
  CTe: 'CTe',
  MDFe: 'MDFe',
  NFPR: 'NFPR',
  Complementar: 'Complementar',
  Devolucao: 'Devolucao',
} as const;

export type ModeloDocumentoFiscalValor =
  (typeof ModeloDocumentoFiscal)[keyof typeof ModeloDocumentoFiscal];

export const ModeloDocumentoFiscalOpcoes = [
  { label: 'NF-e', value: ModeloDocumentoFiscal.NFe },
  { label: 'NFC-e', value: ModeloDocumentoFiscal.NFCe },
  { label: 'CT-e', value: ModeloDocumentoFiscal.CTe },
  { label: 'MDF-e', value: ModeloDocumentoFiscal.MDFe },
  { label: 'NFPR', value: ModeloDocumentoFiscal.NFPR },
  { label: 'Complementar', value: ModeloDocumentoFiscal.Complementar },
  { label: 'Devolução', value: ModeloDocumentoFiscal.Devolucao },
];

export const TipoDestinatarioFiscal = {
  Contribuinte: 'Contribuinte',
  NaoContribuinte: 'NaoContribuinte',
  ProdutorRural: 'ProdutorRural',
  Exterior: 'Exterior',
} as const;

export type TipoDestinatarioFiscalValor =
  (typeof TipoDestinatarioFiscal)[keyof typeof TipoDestinatarioFiscal];

export const TipoDestinatarioFiscalOpcoes = [
  { label: 'Contribuinte', value: TipoDestinatarioFiscal.Contribuinte },
  { label: 'Não contribuinte', value: TipoDestinatarioFiscal.NaoContribuinte },
  { label: 'Produtor rural', value: TipoDestinatarioFiscal.ProdutorRural },
  { label: 'Exterior', value: TipoDestinatarioFiscal.Exterior },
];

export const ModoContingenciaFiscal = {
  Normal: 'Normal',
  Offline: 'Offline',
  SVC: 'SVC',
} as const;

export type ModoContingenciaFiscalValor =
  (typeof ModoContingenciaFiscal)[keyof typeof ModoContingenciaFiscal];

export const ModoContingenciaFiscalOpcoes = [
  { label: 'Normal', value: ModoContingenciaFiscal.Normal },
  { label: 'Offline', value: ModoContingenciaFiscal.Offline },
  { label: 'SVC', value: ModoContingenciaFiscal.SVC },
];

export const ModoContingenciaAtivarOpcoes = [
  { label: 'Offline', value: ModoContingenciaFiscal.Offline },
  { label: 'SVC', value: ModoContingenciaFiscal.SVC },
];

export const TipoManifestacaoSefaz = {
  Ciencia: 'Ciencia',
  Confirmacao: 'Confirmacao',
  Desconhecimento: 'Desconhecimento',
  NaoRealizada: 'NaoRealizada',
} as const;

export type TipoManifestacaoSefazValor =
  (typeof TipoManifestacaoSefaz)[keyof typeof TipoManifestacaoSefaz];

export const TipoManifestacaoSefazOpcoes = [
  { label: 'Ciência', value: TipoManifestacaoSefaz.Ciencia },
  { label: 'Confirmação', value: TipoManifestacaoSefaz.Confirmacao },
  { label: 'Desconhecimento', value: TipoManifestacaoSefaz.Desconhecimento },
  { label: 'Não realizada', value: TipoManifestacaoSefaz.NaoRealizada },
];

export const TipoSpedFiscal = {
  EfdIcmsIpi: 'EfdIcmsIpi',
  EfdContribuicoes: 'EfdContribuicoes',
  Contabil: 'Contabil',
} as const;

export type TipoSpedFiscalValor = (typeof TipoSpedFiscal)[keyof typeof TipoSpedFiscal];

export const TipoSpedFiscalOpcoes = [
  { label: 'EFD ICMS/IPI', value: TipoSpedFiscal.EfdIcmsIpi },
  { label: 'EFD Contribuições', value: TipoSpedFiscal.EfdContribuicoes },
  { label: 'SPED Contábil', value: TipoSpedFiscal.Contabil },
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
  ParcialmenteEntregue: 'ParcialmenteEntregue',
  Cancelado: 'Cancelado',
} as const;

export type ContratoStatusValor = (typeof ContratoStatus)[keyof typeof ContratoStatus];

export const ContratoStatusOpcoes = [
  { label: 'Aberto', value: ContratoStatus.Aberto },
  { label: 'Liquidado', value: ContratoStatus.Liquidado },
  { label: 'Entregue', value: ContratoStatus.Entregue },
  { label: 'Parcialmente entregue', value: ContratoStatus.ParcialmenteEntregue },
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

export const TipoOperacaoTermo = {
  Compra: 'Compra',
  Venda: 'Venda',
} as const;

export type TipoOperacaoTermoValor =
  (typeof TipoOperacaoTermo)[keyof typeof TipoOperacaoTermo];

export const TipoOperacaoTermoOpcoes = [
  { label: 'Compra', value: TipoOperacaoTermo.Compra },
  { label: 'Venda', value: TipoOperacaoTermo.Venda },
];

export const SeveridadeAlertaContrato = {
  Critico: 'Critico',
  Alerta: 'Alerta',
  Aviso: 'Aviso',
  Info: 'Info',
} as const;

export type SeveridadeAlertaContratoValor =
  (typeof SeveridadeAlertaContrato)[keyof typeof SeveridadeAlertaContrato];

export const SeveridadeAlertaContratoOpcoes = [
  { label: 'Crítico', value: SeveridadeAlertaContrato.Critico },
  { label: 'Alerta', value: SeveridadeAlertaContrato.Alerta },
  { label: 'Aviso', value: SeveridadeAlertaContrato.Aviso },
  { label: 'Info', value: SeveridadeAlertaContrato.Info },
];

export const UnidadeGrao = {
  Sacas: 'Sacas',
  Toneladas: 'Toneladas',
} as const;

export type UnidadeGraoValor = (typeof UnidadeGrao)[keyof typeof UnidadeGrao];

export const UnidadeGraoOpcoes = [
  { label: 'Sacas', value: UnidadeGrao.Sacas },
  { label: 'Toneladas', value: UnidadeGrao.Toneladas },
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

export const BeneficiamentoLoteStatus = {
  Rascunho: 'Rascunho',
  Confirmado: 'Confirmado',
} as const;

export type BeneficiamentoLoteStatusValor =
  (typeof BeneficiamentoLoteStatus)[keyof typeof BeneficiamentoLoteStatus];

export const BeneficiamentoLoteStatusOpcoes = [
  { label: 'Rascunho', value: BeneficiamentoLoteStatus.Rascunho },
  { label: 'Confirmado', value: BeneficiamentoLoteStatus.Confirmado },
];

export const TipoSaidaBeneficiamento = {
  Principal: 'Principal',
  Subproduto: 'Subproduto',
  Perda: 'Perda',
} as const;

export type TipoSaidaBeneficiamentoValor =
  (typeof TipoSaidaBeneficiamento)[keyof typeof TipoSaidaBeneficiamento];

export const TipoSaidaBeneficiamentoOpcoes = [
  { label: 'Principal', value: TipoSaidaBeneficiamento.Principal },
  { label: 'Subproduto', value: TipoSaidaBeneficiamento.Subproduto },
  { label: 'Perda', value: TipoSaidaBeneficiamento.Perda },
];

export const LaudoQualidadeStatus = {
  Pendente: 'Pendente',
  Aprovado: 'Aprovado',
  Reprovado: 'Reprovado',
} as const;

export type LaudoQualidadeStatusValor =
  (typeof LaudoQualidadeStatus)[keyof typeof LaudoQualidadeStatus];

export const LaudoQualidadeStatusOpcoes = [
  { label: 'Pendente', value: LaudoQualidadeStatus.Pendente },
  { label: 'Aprovado', value: LaudoQualidadeStatus.Aprovado },
  { label: 'Reprovado', value: LaudoQualidadeStatus.Reprovado },
];

export const OrigemGenealogiaLote = {
  OP: 'OP',
  Beneficiamento: 'Beneficiamento',
} as const;

export type OrigemGenealogiaLoteValor =
  (typeof OrigemGenealogiaLote)[keyof typeof OrigemGenealogiaLote];

export const TipoOperacaoSafras = {
  Revenda: 'Revenda',
  Industria: 'Industria',
} as const;

export type TipoOperacaoSafrasValor =
  (typeof TipoOperacaoSafras)[keyof typeof TipoOperacaoSafras];

export const StatusSafra = {
  Planejada: 'Planejada',
  EmAndamento: 'EmAndamento',
  Encerrada: 'Encerrada',
  Cancelada: 'Cancelada',
} as const;

export type StatusSafraValor = (typeof StatusSafra)[keyof typeof StatusSafra];

export const StatusSafraOpcoes = [
  { label: 'Planejada', value: StatusSafra.Planejada },
  { label: 'Em andamento', value: StatusSafra.EmAndamento },
  { label: 'Encerrada', value: StatusSafra.Encerrada },
  { label: 'Cancelada', value: StatusSafra.Cancelada },
];

export const TipoOrdemServicoAgricola = {
  Plantio: 'Plantio',
  TratosCulturais: 'TratosCulturais',
  Irrigacao: 'Irrigacao',
  Aplicacao: 'Aplicacao',
  Colheita: 'Colheita',
  Outro: 'Outro',
} as const;

export type TipoOrdemServicoAgricolaValor =
  (typeof TipoOrdemServicoAgricola)[keyof typeof TipoOrdemServicoAgricola];

export const TipoOrdemServicoAgricolaOpcoes = [
  { label: 'Plantio', value: TipoOrdemServicoAgricola.Plantio },
  { label: 'Tratos culturais', value: TipoOrdemServicoAgricola.TratosCulturais },
  { label: 'Irrigação', value: TipoOrdemServicoAgricola.Irrigacao },
  { label: 'Aplicação', value: TipoOrdemServicoAgricola.Aplicacao },
  { label: 'Colheita', value: TipoOrdemServicoAgricola.Colheita },
  { label: 'Outro', value: TipoOrdemServicoAgricola.Outro },
];

export const StatusOrdemServicoAgricola = {
  Aberta: 'Aberta',
  EmAndamento: 'EmAndamento',
  Concluida: 'Concluida',
  Cancelada: 'Cancelada',
} as const;

export type StatusOrdemServicoAgricolaValor =
  (typeof StatusOrdemServicoAgricola)[keyof typeof StatusOrdemServicoAgricola];

export const StatusOrdemServicoAgricolaOpcoes = [
  { label: 'Aberta', value: StatusOrdemServicoAgricola.Aberta },
  { label: 'Em andamento', value: StatusOrdemServicoAgricola.EmAndamento },
  { label: 'Concluída', value: StatusOrdemServicoAgricola.Concluida },
  { label: 'Cancelada', value: StatusOrdemServicoAgricola.Cancelada },
];

export const TipoVisitaTecnica = {
  Presencial: 'Presencial',
  Telefone: 'Telefone',
  WhatsApp: 'WhatsApp',
  Remota: 'Remota',
  Outro: 'Outro',
} as const;

export type TipoVisitaTecnicaValor =
  (typeof TipoVisitaTecnica)[keyof typeof TipoVisitaTecnica];

export const TipoVisitaTecnicaOpcoes = [
  { label: 'Presencial', value: TipoVisitaTecnica.Presencial },
  { label: 'Telefone', value: TipoVisitaTecnica.Telefone },
  { label: 'WhatsApp', value: TipoVisitaTecnica.WhatsApp },
  { label: 'Remota', value: TipoVisitaTecnica.Remota },
  { label: 'Outro', value: TipoVisitaTecnica.Outro },
];

export const StatusRecomendacao = {
  Pendente: 'Pendente',
  Aplicada: 'Aplicada',
  Cancelada: 'Cancelada',
} as const;

export type StatusRecomendacaoValor =
  (typeof StatusRecomendacao)[keyof typeof StatusRecomendacao];

export const StatusRecomendacaoOpcoes = [
  { label: 'Pendente', value: StatusRecomendacao.Pendente },
  { label: 'Aplicada', value: StatusRecomendacao.Aplicada },
  { label: 'Cancelada', value: StatusRecomendacao.Cancelada },
];

export const CategoriaCusteioSafra = {
  Insumos: 'Insumos',
  MaoDeObra: 'MaoDeObra',
  Servicos: 'Servicos',
  Maquinario: 'Maquinario',
  Outros: 'Outros',
} as const;

export type CategoriaCusteioSafraValor =
  (typeof CategoriaCusteioSafra)[keyof typeof CategoriaCusteioSafra];

export const CategoriaCusteioSafraOpcoes = [
  { label: 'Insumos', value: CategoriaCusteioSafra.Insumos },
  { label: 'Mão de obra', value: CategoriaCusteioSafra.MaoDeObra },
  { label: 'Serviços', value: CategoriaCusteioSafra.Servicos },
  { label: 'Maquinário', value: CategoriaCusteioSafra.Maquinario },
  { label: 'Outros', value: CategoriaCusteioSafra.Outros },
];

export const TipoAtividadeDiarioCampo = {
  VisitaTecnica: 'VisitaTecnica',
  Recomendacao: 'Recomendacao',
  Aplicacao: 'Aplicacao',
  Avaliacao: 'Avaliacao',
  Plantio: 'Plantio',
  Colheita: 'Colheita',
  TratosCulturais: 'TratosCulturais',
  Outro: 'Outro',
} as const;

export type TipoAtividadeDiarioCampoValor =
  (typeof TipoAtividadeDiarioCampo)[keyof typeof TipoAtividadeDiarioCampo];

export const TipoAtividadeDiarioCampoOpcoes = [
  { label: 'Visita técnica', value: TipoAtividadeDiarioCampo.VisitaTecnica },
  { label: 'Recomendação', value: TipoAtividadeDiarioCampo.Recomendacao },
  { label: 'Aplicação', value: TipoAtividadeDiarioCampo.Aplicacao },
  { label: 'Avaliação', value: TipoAtividadeDiarioCampo.Avaliacao },
  { label: 'Plantio', value: TipoAtividadeDiarioCampo.Plantio },
  { label: 'Colheita', value: TipoAtividadeDiarioCampo.Colheita },
  { label: 'Tratos culturais', value: TipoAtividadeDiarioCampo.TratosCulturais },
  { label: 'Outro', value: TipoAtividadeDiarioCampo.Outro },
];

export const TipoGeoImportacao = {
  Kml: 'Kml',
  Shapefile: 'Shapefile',
  GeoJson: 'GeoJson',
} as const;

export type TipoGeoImportacaoValor =
  (typeof TipoGeoImportacao)[keyof typeof TipoGeoImportacao];

export const TipoGeoImportacaoOpcoes = [
  { label: 'KML', value: TipoGeoImportacao.Kml },
  { label: 'Shapefile', value: TipoGeoImportacao.Shapefile },
  { label: 'GeoJSON', value: TipoGeoImportacao.GeoJson },
];

export const TipoAtivoManutencao = {
  Trator: 'Trator',
  Colheitadeira: 'Colheitadeira',
  Plantadeira: 'Plantadeira',
  Pulverizador: 'Pulverizador',
  Irrigacao: 'Irrigacao',
  Caminhao: 'Caminhao',
  Implemento: 'Implemento',
  Outro: 'Outro',
} as const;

export type TipoAtivoManutencaoValor =
  (typeof TipoAtivoManutencao)[keyof typeof TipoAtivoManutencao];

export const TipoAtivoManutencaoOpcoes = [
  { label: 'Trator', value: TipoAtivoManutencao.Trator },
  { label: 'Colheitadeira', value: TipoAtivoManutencao.Colheitadeira },
  { label: 'Plantadeira', value: TipoAtivoManutencao.Plantadeira },
  { label: 'Pulverizador', value: TipoAtivoManutencao.Pulverizador },
  { label: 'Irrigação', value: TipoAtivoManutencao.Irrigacao },
  { label: 'Caminhão', value: TipoAtivoManutencao.Caminhao },
  { label: 'Implemento', value: TipoAtivoManutencao.Implemento },
  { label: 'Outro', value: TipoAtivoManutencao.Outro },
];

export const StatusAtivoManutencao = {
  Operacional: 'Operacional',
  Manutencao: 'Manutencao',
  Parado: 'Parado',
  Sucateado: 'Sucateado',
} as const;

export type StatusAtivoManutencaoValor =
  (typeof StatusAtivoManutencao)[keyof typeof StatusAtivoManutencao];

export const StatusAtivoManutencaoOpcoes = [
  { label: 'Operacional', value: StatusAtivoManutencao.Operacional },
  { label: 'Em manutenção', value: StatusAtivoManutencao.Manutencao },
  { label: 'Parado', value: StatusAtivoManutencao.Parado },
  { label: 'Sucateado', value: StatusAtivoManutencao.Sucateado },
];

export const MetodoDepreciacao = {
  Linear: 'Linear',
  Acelerada: 'Acelerada',
} as const;

export type MetodoDepreciacaoValor =
  (typeof MetodoDepreciacao)[keyof typeof MetodoDepreciacao];

export const MetodoDepreciacaoOpcoes = [
  { label: 'Linear', value: MetodoDepreciacao.Linear },
  { label: 'Acelerada', value: MetodoDepreciacao.Acelerada },
];

export const GatilhoPlanoManutencao = {
  Horas: 'Horas',
  Km: 'Km',
  Dias: 'Dias',
} as const;

export type GatilhoPlanoManutencaoValor =
  (typeof GatilhoPlanoManutencao)[keyof typeof GatilhoPlanoManutencao];

export const GatilhoPlanoManutencaoOpcoes = [
  { label: 'Horas (horímetro)', value: GatilhoPlanoManutencao.Horas },
  { label: 'Quilometragem', value: GatilhoPlanoManutencao.Km },
  { label: 'Dias', value: GatilhoPlanoManutencao.Dias },
];

export const StatusPlanoManutencao = {
  Ok: 'Ok',
  Proximo: 'Proximo',
  Vencido: 'Vencido',
} as const;

export type StatusPlanoManutencaoValor =
  (typeof StatusPlanoManutencao)[keyof typeof StatusPlanoManutencao];

export const StatusPlanoManutencaoOpcoes = [
  { label: 'Ok', value: StatusPlanoManutencao.Ok },
  { label: 'Próximo', value: StatusPlanoManutencao.Proximo },
  { label: 'Vencido', value: StatusPlanoManutencao.Vencido },
];

export const StatusChecklistInspecao = {
  Aprovado: 'Aprovado',
  Reprovado: 'Reprovado',
  AprovadoRessalvas: 'AprovadoRessalvas',
} as const;

export type StatusChecklistInspecaoValor =
  (typeof StatusChecklistInspecao)[keyof typeof StatusChecklistInspecao];

export const StatusChecklistInspecaoOpcoes = [
  { label: 'Aprovado', value: StatusChecklistInspecao.Aprovado },
  { label: 'Reprovado', value: StatusChecklistInspecao.Reprovado },
  { label: 'Aprovado com ressalvas', value: StatusChecklistInspecao.AprovadoRessalvas },
];

export const TipoOrdemServicoManutencao = {
  Preventiva: 'Preventiva',
  Corretiva: 'Corretiva',
} as const;

export type TipoOrdemServicoManutencaoValor =
  (typeof TipoOrdemServicoManutencao)[keyof typeof TipoOrdemServicoManutencao];

export const TipoOrdemServicoManutencaoOpcoes = [
  { label: 'Preventiva', value: TipoOrdemServicoManutencao.Preventiva },
  { label: 'Corretiva', value: TipoOrdemServicoManutencao.Corretiva },
];

export const PrioridadeOrdemServicoManutencao = {
  Baixa: 'Baixa',
  Media: 'Media',
  Alta: 'Alta',
  Critica: 'Critica',
} as const;

export type PrioridadeOrdemServicoManutencaoValor =
  (typeof PrioridadeOrdemServicoManutencao)[keyof typeof PrioridadeOrdemServicoManutencao];

export const PrioridadeOrdemServicoManutencaoOpcoes = [
  { label: 'Baixa', value: PrioridadeOrdemServicoManutencao.Baixa },
  { label: 'Média', value: PrioridadeOrdemServicoManutencao.Media },
  { label: 'Alta', value: PrioridadeOrdemServicoManutencao.Alta },
  { label: 'Crítica', value: PrioridadeOrdemServicoManutencao.Critica },
];

export const StatusOrdemServicoManutencao = {
  Aberta: 'Aberta',
  EmAndamento: 'EmAndamento',
  AguardandoPeca: 'AguardandoPeca',
  Concluida: 'Concluida',
  Cancelada: 'Cancelada',
} as const;

export type StatusOrdemServicoManutencaoValor =
  (typeof StatusOrdemServicoManutencao)[keyof typeof StatusOrdemServicoManutencao];

export const StatusOrdemServicoManutencaoOpcoes = [
  { label: 'Aberta', value: StatusOrdemServicoManutencao.Aberta },
  { label: 'Em andamento', value: StatusOrdemServicoManutencao.EmAndamento },
  { label: 'Aguardando peça', value: StatusOrdemServicoManutencao.AguardandoPeca },
  { label: 'Concluída', value: StatusOrdemServicoManutencao.Concluida },
  { label: 'Cancelada', value: StatusOrdemServicoManutencao.Cancelada },
];

/** Alertas preventivas retornam planos; status alinhado a StatusPlanoManutencao. */
export const StatusAlertaPreventiva = {
  Ok: 'Ok',
  Proximo: 'Proximo',
  Vencido: 'Vencido',
} as const;

export type StatusAlertaPreventivaValor =
  (typeof StatusAlertaPreventiva)[keyof typeof StatusAlertaPreventiva];

export const EtapaOportunidade = {
  Prospeccao: 'Prospeccao',
  Qualificacao: 'Qualificacao',
  Proposta: 'Proposta',
  Negociacao: 'Negociacao',
  FechadoGanho: 'FechadoGanho',
  FechadoPerdido: 'FechadoPerdido',
} as const;

export type EtapaOportunidadeValor =
  (typeof EtapaOportunidade)[keyof typeof EtapaOportunidade];

export const EtapaOportunidadeOpcoes = [
  { label: 'Prospecção', value: EtapaOportunidade.Prospeccao },
  { label: 'Qualificação', value: EtapaOportunidade.Qualificacao },
  { label: 'Proposta', value: EtapaOportunidade.Proposta },
  { label: 'Negociação', value: EtapaOportunidade.Negociacao },
  { label: 'Fechado — ganho', value: EtapaOportunidade.FechadoGanho },
  { label: 'Fechado — perdido', value: EtapaOportunidade.FechadoPerdido },
];

export const StatusAmostraCampo = {
  Entregue: 'Entregue',
  EmAvaliacao: 'EmAvaliacao',
  Convertida: 'Convertida',
  Descartada: 'Descartada',
} as const;

export type StatusAmostraCampoValor =
  (typeof StatusAmostraCampo)[keyof typeof StatusAmostraCampo];

export const StatusAmostraCampoOpcoes = [
  { label: 'Entregue', value: StatusAmostraCampo.Entregue },
  { label: 'Em avaliação', value: StatusAmostraCampo.EmAvaliacao },
  { label: 'Convertida', value: StatusAmostraCampo.Convertida },
  { label: 'Descartada', value: StatusAmostraCampo.Descartada },
];

export const TipoCanalCampanha = {
  Email: 'Email',
  WhatsApp: 'WhatsApp',
  Ambos: 'Ambos',
} as const;

export type TipoCanalCampanhaValor =
  (typeof TipoCanalCampanha)[keyof typeof TipoCanalCampanha];

export const TipoCanalCampanhaOpcoes = [
  { label: 'E-mail', value: TipoCanalCampanha.Email },
  { label: 'WhatsApp', value: TipoCanalCampanha.WhatsApp },
  { label: 'Ambos', value: TipoCanalCampanha.Ambos },
];

export const StatusCampanha = {
  Rascunho: 'Rascunho',
  Ativa: 'Ativa',
  Pausada: 'Pausada',
  Encerrada: 'Encerrada',
} as const;

export type StatusCampanhaValor =
  (typeof StatusCampanha)[keyof typeof StatusCampanha];

export const StatusCampanhaOpcoes = [
  { label: 'Rascunho', value: StatusCampanha.Rascunho },
  { label: 'Ativa', value: StatusCampanha.Ativa },
  { label: 'Pausada', value: StatusCampanha.Pausada },
  { label: 'Encerrada', value: StatusCampanha.Encerrada },
];

export const StatusAnaliseCredito = {
  Pendente: 'Pendente',
  Aprovada: 'Aprovada',
  Recusada: 'Recusada',
} as const;

export type StatusAnaliseCreditoValor =
  (typeof StatusAnaliseCredito)[keyof typeof StatusAnaliseCredito];

export const StatusAnaliseCreditoOpcoes = [
  { label: 'Pendente', value: StatusAnaliseCredito.Pendente },
  { label: 'Aprovada', value: StatusAnaliseCredito.Aprovada },
  { label: 'Recusada', value: StatusAnaliseCredito.Recusada },
];

export const ClassificacaoCredito = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
} as const;

export type ClassificacaoCreditoValor =
  (typeof ClassificacaoCredito)[keyof typeof ClassificacaoCredito];

export const ClassificacaoCreditoOpcoes = [
  { label: 'A', value: ClassificacaoCredito.A },
  { label: 'B', value: ClassificacaoCredito.B },
  { label: 'C', value: ClassificacaoCredito.C },
  { label: 'D', value: ClassificacaoCredito.D },
  { label: 'E', value: ClassificacaoCredito.E },
];

export const StatusVisitaTecnica = {
  Agendada: 'Agendada',
  Realizada: 'Realizada',
  Cancelada: 'Cancelada',
} as const;

export type StatusVisitaTecnicaValor =
  (typeof StatusVisitaTecnica)[keyof typeof StatusVisitaTecnica];

export const StatusVisitaTecnicaOpcoes = [
  { label: 'Agendada', value: StatusVisitaTecnica.Agendada },
  { label: 'Realizada', value: StatusVisitaTecnica.Realizada },
  { label: 'Cancelada', value: StatusVisitaTecnica.Cancelada },
];

export const BureauCredito = {
  Serasa: 'Serasa',
  Spc: 'Spc',
} as const;

export type BureauCreditoValor = (typeof BureauCredito)[keyof typeof BureauCredito];

export const BureauCreditoOpcoes = [
  { label: 'Serasa', value: BureauCredito.Serasa },
  { label: 'SPC', value: BureauCredito.Spc },
];

export const InstituicaoCreditoBancario = {
  BancoDoBrasil: 'BancoDoBrasil',
  Sicredi: 'Sicredi',
} as const;

export type InstituicaoCreditoBancarioValor =
  (typeof InstituicaoCreditoBancario)[keyof typeof InstituicaoCreditoBancario];

export const InstituicaoCreditoBancarioOpcoes = [
  { label: 'Banco do Brasil', value: InstituicaoCreditoBancario.BancoDoBrasil },
  { label: 'Sicredi', value: InstituicaoCreditoBancario.Sicredi },
];

export const TipoGarantiaCredito = {
  AlienacaoFiduciaria: 'AlienacaoFiduciaria',
  Penhor: 'Penhor',
  Hipoteca: 'Hipoteca',
  Outros: 'Outros',
} as const;

export type TipoGarantiaCreditoValor =
  (typeof TipoGarantiaCredito)[keyof typeof TipoGarantiaCredito];

export const TipoGarantiaCreditoOpcoes = [
  { label: 'Alienação fiduciária', value: TipoGarantiaCredito.AlienacaoFiduciaria },
  { label: 'Penhor', value: TipoGarantiaCredito.Penhor },
  { label: 'Hipoteca', value: TipoGarantiaCredito.Hipoteca },
  { label: 'Outros', value: TipoGarantiaCredito.Outros },
];

export const CanalTentativaCobranca = {
  Telefone: 'Telefone',
  WhatsApp: 'WhatsApp',
  Email: 'Email',
  Presencial: 'Presencial',
} as const;

export type CanalTentativaCobrancaValor =
  (typeof CanalTentativaCobranca)[keyof typeof CanalTentativaCobranca];

export const CanalTentativaCobrancaOpcoes = [
  { label: 'Telefone', value: CanalTentativaCobranca.Telefone },
  { label: 'WhatsApp', value: CanalTentativaCobranca.WhatsApp },
  { label: 'E-mail', value: CanalTentativaCobranca.Email },
  { label: 'Presencial', value: CanalTentativaCobranca.Presencial },
];

export const ResultadoTentativaCobranca = {
  ContatoRealizado: 'ContatoRealizado',
  SemResposta: 'SemResposta',
  PromessaPagamento: 'PromessaPagamento',
  PagamentoEfetuado: 'PagamentoEfetuado',
  RecusouPagar: 'RecusouPagar',
  NumeroInvalido: 'NumeroInvalido',
} as const;

export type ResultadoTentativaCobrancaValor =
  (typeof ResultadoTentativaCobranca)[keyof typeof ResultadoTentativaCobranca];

export const ResultadoTentativaCobrancaOpcoes = [
  { label: 'Contato realizado', value: ResultadoTentativaCobranca.ContatoRealizado },
  { label: 'Sem resposta', value: ResultadoTentativaCobranca.SemResposta },
  { label: 'Promessa de pagamento', value: ResultadoTentativaCobranca.PromessaPagamento },
  { label: 'Pagamento efetuado', value: ResultadoTentativaCobranca.PagamentoEfetuado },
  { label: 'Recusou pagar', value: ResultadoTentativaCobranca.RecusouPagar },
  { label: 'Número inválido', value: ResultadoTentativaCobranca.NumeroInvalido },
];

export const StatusDisputaTitulo = {
  Aberta: 'Aberta',
  Resolvida: 'Resolvida',
  Encerrada: 'Encerrada',
} as const;

export type StatusDisputaTituloValor =
  (typeof StatusDisputaTitulo)[keyof typeof StatusDisputaTitulo];

export const StatusDisputaTituloOpcoes = [
  { label: 'Aberta', value: StatusDisputaTitulo.Aberta },
  { label: 'Resolvida', value: StatusDisputaTitulo.Resolvida },
  { label: 'Encerrada', value: StatusDisputaTitulo.Encerrada },
];

export const StatusFichaCreditoRural = {
  EmAnalise: 'EmAnalise',
  Aprovada: 'Aprovada',
  Recusada: 'Recusada',
  EmRevisao: 'EmRevisao',
} as const;

export type StatusFichaCreditoRuralValor =
  (typeof StatusFichaCreditoRural)[keyof typeof StatusFichaCreditoRural];

export const StatusFichaCreditoRuralOpcoes = [
  { label: 'Em análise', value: StatusFichaCreditoRural.EmAnalise },
  { label: 'Aprovada', value: StatusFichaCreditoRural.Aprovada },
  { label: 'Recusada', value: StatusFichaCreditoRural.Recusada },
  { label: 'Em revisão', value: StatusFichaCreditoRural.EmRevisao },
];

export const StatusAcordoJudicial = {
  Ativo: 'Ativo',
  Cumprido: 'Cumprido',
  Inadimplido: 'Inadimplido',
  Cancelado: 'Cancelado',
} as const;

export type StatusAcordoJudicialValor =
  (typeof StatusAcordoJudicial)[keyof typeof StatusAcordoJudicial];

export const StatusAcordoJudicialOpcoes = [
  { label: 'Ativo', value: StatusAcordoJudicial.Ativo },
  { label: 'Cumprido', value: StatusAcordoJudicial.Cumprido },
  { label: 'Inadimplido', value: StatusAcordoJudicial.Inadimplido },
  { label: 'Cancelado', value: StatusAcordoJudicial.Cancelado },
];

export const StatusEncaminhamentoJuridico = {
  Pendente: 'Pendente',
  Encaminhado: 'Encaminhado',
  EmAndamento: 'EmAndamento',
  Encerrado: 'Encerrado',
} as const;

export type StatusEncaminhamentoJuridicoValor =
  (typeof StatusEncaminhamentoJuridico)[keyof typeof StatusEncaminhamentoJuridico];

export const StatusEncaminhamentoJuridicoOpcoes = [
  { label: 'Pendente', value: StatusEncaminhamentoJuridico.Pendente },
  { label: 'Encaminhado', value: StatusEncaminhamentoJuridico.Encaminhado },
  { label: 'Em andamento', value: StatusEncaminhamentoJuridico.EmAndamento },
  { label: 'Encerrado', value: StatusEncaminhamentoJuridico.Encerrado },
];

export const StatusAdimplenciaCarteira = {
  Adimplente: 'Adimplente',
  EmAtraso: 'EmAtraso',
  Critico: 'Critico',
} as const;

export type StatusAdimplenciaCarteiraValor =
  (typeof StatusAdimplenciaCarteira)[keyof typeof StatusAdimplenciaCarteira];

export const TipoVeiculoLogistica = {
  Caminhao: 'Caminhao',
  Van: 'Van',
  Pickup: 'Pickup',
  Trator: 'Trator',
  Outro: 'Outro',
} as const;

export type TipoVeiculoLogisticaValor =
  (typeof TipoVeiculoLogistica)[keyof typeof TipoVeiculoLogistica];

export const TipoVeiculoLogisticaOpcoes = [
  { label: 'Caminhão', value: TipoVeiculoLogistica.Caminhao },
  { label: 'Van', value: TipoVeiculoLogistica.Van },
  { label: 'Pickup', value: TipoVeiculoLogistica.Pickup },
  { label: 'Trator', value: TipoVeiculoLogistica.Trator },
  { label: 'Outro', value: TipoVeiculoLogistica.Outro },
];

export const StatusVeiculoLogistica = {
  Disponivel: 'Disponivel',
  EmRota: 'EmRota',
  Manutencao: 'Manutencao',
  Inativo: 'Inativo',
} as const;

export type StatusVeiculoLogisticaValor =
  (typeof StatusVeiculoLogistica)[keyof typeof StatusVeiculoLogistica];

export const StatusVeiculoLogisticaOpcoes = [
  { label: 'Disponível', value: StatusVeiculoLogistica.Disponivel },
  { label: 'Em rota', value: StatusVeiculoLogistica.EmRota },
  { label: 'Em manutenção', value: StatusVeiculoLogistica.Manutencao },
  { label: 'Inativo', value: StatusVeiculoLogistica.Inativo },
];

export const StatusCargaLogistica = {
  Programado: 'Programado',
  EmRota: 'EmRota',
  Concluido: 'Concluido',
  Cancelado: 'Cancelado',
} as const;

export type StatusCargaLogisticaValor =
  (typeof StatusCargaLogistica)[keyof typeof StatusCargaLogistica];

export const StatusCargaLogisticaOpcoes = [
  { label: 'Programado', value: StatusCargaLogistica.Programado },
  { label: 'Em rota', value: StatusCargaLogistica.EmRota },
  { label: 'Concluído', value: StatusCargaLogistica.Concluido },
  { label: 'Cancelado', value: StatusCargaLogistica.Cancelado },
];

export const StatusRomaneioLogistica = {
  Pendente: 'Pendente',
  EmRota: 'EmRota',
  Entregue: 'Entregue',
  Ocorrencia: 'Ocorrencia',
  Devolvido: 'Devolvido',
} as const;

export type StatusRomaneioLogisticaValor =
  (typeof StatusRomaneioLogistica)[keyof typeof StatusRomaneioLogistica];

export const StatusRomaneioLogisticaOpcoes = [
  { label: 'Pendente', value: StatusRomaneioLogistica.Pendente },
  { label: 'Em rota', value: StatusRomaneioLogistica.EmRota },
  { label: 'Entregue', value: StatusRomaneioLogistica.Entregue },
  { label: 'Ocorrência', value: StatusRomaneioLogistica.Ocorrencia },
  { label: 'Devolvido', value: StatusRomaneioLogistica.Devolvido },
];

export const TipoOcorrenciaEntrega = {
  EnderecoNaoEncontrado: 'EnderecoNaoEncontrado',
  ClienteAusente: 'ClienteAusente',
  Recusa: 'Recusa',
  Avaria: 'Avaria',
  Extravio: 'Extravio',
  Outro: 'Outro',
} as const;

export type TipoOcorrenciaEntregaValor =
  (typeof TipoOcorrenciaEntrega)[keyof typeof TipoOcorrenciaEntrega];

export const TipoOcorrenciaEntregaOpcoes = [
  { label: 'Endereço não encontrado', value: TipoOcorrenciaEntrega.EnderecoNaoEncontrado },
  { label: 'Cliente ausente', value: TipoOcorrenciaEntrega.ClienteAusente },
  { label: 'Recusa', value: TipoOcorrenciaEntrega.Recusa },
  { label: 'Avaria', value: TipoOcorrenciaEntrega.Avaria },
  { label: 'Extravio', value: TipoOcorrenciaEntrega.Extravio },
  { label: 'Outro', value: TipoOcorrenciaEntrega.Outro },
];

export const StatusOcorrenciaEntrega = {
  Aberta: 'Aberta',
  Resolvida: 'Resolvida',
} as const;

export type StatusOcorrenciaEntregaValor =
  (typeof StatusOcorrenciaEntrega)[keyof typeof StatusOcorrenciaEntrega];

export const StatusOcorrenciaEntregaOpcoes = [
  { label: 'Aberta', value: StatusOcorrenciaEntrega.Aberta },
  { label: 'Resolvida', value: StatusOcorrenciaEntrega.Resolvida },
];

export const TipoCombustivelLogistica = {
  Diesel: 'Diesel',
  Gasolina: 'Gasolina',
  Etanol: 'Etanol',
} as const;

export type TipoCombustivelLogisticaValor =
  (typeof TipoCombustivelLogistica)[keyof typeof TipoCombustivelLogistica];

export const TipoCombustivelLogisticaOpcoes = [
  { label: 'Diesel', value: TipoCombustivelLogistica.Diesel },
  { label: 'Gasolina', value: TipoCombustivelLogistica.Gasolina },
  { label: 'Etanol', value: TipoCombustivelLogistica.Etanol },
];

export const TipoDocTransporteLogistica = {
  CTe: 'CTe',
  MDFe: 'MDFe',
} as const;

export type TipoDocTransporteLogisticaValor =
  (typeof TipoDocTransporteLogistica)[keyof typeof TipoDocTransporteLogistica];

export const TipoDocTransporteLogisticaOpcoes = [
  { label: 'CT-e', value: TipoDocTransporteLogistica.CTe },
  { label: 'MDF-e', value: TipoDocTransporteLogistica.MDFe },
];

export const StatusDocTransporteLogistica = {
  Rascunho: 'Rascunho',
  Autorizado: 'Autorizado',
  Cancelado: 'Cancelado',
} as const;

export type StatusDocTransporteLogisticaValor =
  (typeof StatusDocTransporteLogistica)[keyof typeof StatusDocTransporteLogistica];

export const StatusDocTransporteLogisticaOpcoes = [
  { label: 'Rascunho', value: StatusDocTransporteLogistica.Rascunho },
  { label: 'Autorizado', value: StatusDocTransporteLogistica.Autorizado },
  { label: 'Cancelado', value: StatusDocTransporteLogistica.Cancelado },
];
