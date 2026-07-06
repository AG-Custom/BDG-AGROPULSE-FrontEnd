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
