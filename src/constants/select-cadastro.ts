export const SelectCadastroEntidade = {
  Cliente: 'cliente',
  Produto: 'produto',
  Safra: 'safra',
  Unidade: 'unidade',
  Fornecedor: 'fornecedor',
  Lote: 'lote',
  Talhao: 'talhao',
  Cnpj: 'cnpj',
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
};
