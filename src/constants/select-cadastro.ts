export const SelectCadastroEntidade = {
  Cliente: 'cliente',
  Produto: 'produto',
  Safra: 'safra',
  Unidade: 'unidade',
  Fornecedor: 'fornecedor',
  Lote: 'lote',
  Talhao: 'talhao',
  Cnpj: 'cnpj',
  TabelaPreco: 'tabelaPreco',
  CondicaoPagamento: 'condicaoPagamento',
  Usuario: 'usuario',
  Colaborador: 'colaborador',
  Fazenda: 'fazenda',
  Gleba: 'gleba',
  CategoriaProduto: 'categoriaProduto',
  Veiculo: 'veiculo',
  Ativo: 'ativo',
  ReceitaProducao: 'receitaProducao',
  ContaBancaria: 'contaBancaria',
  Caixa: 'caixa',
} as const;

export type SelectCadastroEntidadeValor =
  (typeof SelectCadastroEntidade)[keyof typeof SelectCadastroEntidade];

export interface SelectCadastroEntidadeConfig {
  rotulo: string;
  routeName: string;
}

export const SelectCadastroEntidadeConfig: Record<
  SelectCadastroEntidadeValor,
  SelectCadastroEntidadeConfig
> = {
  [SelectCadastroEntidade.Cliente]: {
    rotulo: 'cliente',
    routeName: 'cliente-novo',
  },
  [SelectCadastroEntidade.Produto]: {
    rotulo: 'produto',
    routeName: 'produto-novo',
  },
  [SelectCadastroEntidade.Safra]: {
    rotulo: 'safra',
    routeName: 'safra-nova',
  },
  [SelectCadastroEntidade.Unidade]: {
    rotulo: 'unidade',
    routeName: 'unidade-nova',
  },
  [SelectCadastroEntidade.Fornecedor]: {
    rotulo: 'fornecedor',
    routeName: 'fornecedor-novo',
  },
  [SelectCadastroEntidade.Lote]: {
    rotulo: 'lote',
    routeName: 'estoque-lotes',
  },
  [SelectCadastroEntidade.Talhao]: {
    rotulo: 'talhão',
    routeName: 'talhoes',
  },
  [SelectCadastroEntidade.Cnpj]: {
    rotulo: 'CNPJ',
    routeName: 'cnpj-novo',
  },
  [SelectCadastroEntidade.TabelaPreco]: {
    rotulo: 'tabela de preço',
    routeName: 'tabela-preco-novo',
  },
  [SelectCadastroEntidade.CondicaoPagamento]: {
    rotulo: 'condição de pagamento',
    routeName: 'condicoes-pagamento',
  },
  [SelectCadastroEntidade.Usuario]: {
    rotulo: 'usuário',
    routeName: 'usuario-novo',
  },
  [SelectCadastroEntidade.Colaborador]: {
    rotulo: 'colaborador',
    routeName: 'colaborador-novo',
  },
  [SelectCadastroEntidade.Fazenda]: {
    rotulo: 'fazenda',
    routeName: 'safras-fazendas',
  },
  [SelectCadastroEntidade.Gleba]: {
    rotulo: 'gleba',
    routeName: 'safras-glebas',
  },
  [SelectCadastroEntidade.CategoriaProduto]: {
    rotulo: 'categoria',
    routeName: 'categorias-produto',
  },
  [SelectCadastroEntidade.Veiculo]: {
    rotulo: 'veículo',
    routeName: 'logistica-veiculo-novo',
  },
  [SelectCadastroEntidade.Ativo]: {
    rotulo: 'ativo',
    routeName: 'manutencao-ativo-novo',
  },
  [SelectCadastroEntidade.ReceitaProducao]: {
    rotulo: 'receita',
    routeName: 'receita-producao-nova',
  },
  [SelectCadastroEntidade.ContaBancaria]: {
    rotulo: 'conta bancária',
    routeName: 'contas-bancarias',
  },
  [SelectCadastroEntidade.Caixa]: {
    rotulo: 'caixa',
    routeName: 'caixas',
  },
};
