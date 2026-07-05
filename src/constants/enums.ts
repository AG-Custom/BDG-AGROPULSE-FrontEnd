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
