import { Permissoes } from 'constants/permissoes';

export const AreaAcesso = {
  Cadastros: 'Cadastros',
  Estoque: 'Estoque',
  Compras: 'Compras',
  Vendas: 'Vendas',
  Producao: 'Producao',
  Financeiro: 'Financeiro',
  Fiscal: 'Fiscal',
  Safras: 'Safras',
  Logistica: 'Logistica',
  Rh: 'Rh',
  Manutencao: 'Manutencao',
  Crm: 'Crm',
  Bi: 'Bi',
  Configuracoes: 'Configuracoes',
} as const;

export type AreaAcessoValor = (typeof AreaAcesso)[keyof typeof AreaAcesso];

export type ModuloPermissao = {
  Visualizar: string;
  Editar?: string;
  Aprovar?: string;
  Configurar?: string;
};

export const ModulosPorArea: Record<AreaAcessoValor, ModuloPermissao[]> = {
  [AreaAcesso.Cadastros]: [
    Permissoes.Clientes,
    Permissoes.Fornecedores,
    Permissoes.Produtos,
    Permissoes.CategoriasProduto,
    Permissoes.UnidadesMedida,
    Permissoes.TabelasPreco,
    Permissoes.Unidades,
    Permissoes.Cnpjs,
  ],
  [AreaAcesso.Estoque]: [Permissoes.Estoque],
  [AreaAcesso.Compras]: [Permissoes.Compras],
  [AreaAcesso.Vendas]: [
    Permissoes.PedidosVenda,
    Permissoes.Aprovacoes,
    Permissoes.Orcamentos,
    Permissoes.Pdv,
    Permissoes.MetasVendedor,
    Permissoes.Representantes,
    Permissoes.RegrasComissao,
    Permissoes.DevolucoesVenda,
  ],
  [AreaAcesso.Producao]: [Permissoes.Producao, Permissoes.Contratos],
  [AreaAcesso.Financeiro]: [
    Permissoes.Financeiro,
    Permissoes.CobrancaCredito,
    Permissoes.FormasPagamentoConfig,
  ],
  [AreaAcesso.Fiscal]: [Permissoes.Fiscal],
  [AreaAcesso.Safras]: [Permissoes.Rastreabilidade],
  [AreaAcesso.Logistica]: [Permissoes.Logistica, Permissoes.Expedicao],
  [AreaAcesso.Rh]: [Permissoes.Colaboradores],
  [AreaAcesso.Manutencao]: [Permissoes.Manutencao],
  [AreaAcesso.Crm]: [Permissoes.Crm],
  [AreaAcesso.Bi]: [Permissoes.Relatorios],
  [AreaAcesso.Configuracoes]: [
    Permissoes.Usuarios,
    Permissoes.PermissoesGranulares,
    Permissoes.Auditoria,
  ],
};
