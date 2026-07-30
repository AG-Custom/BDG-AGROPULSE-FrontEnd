export const NivelAcesso = {
  SemAcesso: 'SemAcesso',
  Visualizar: 'Visualizar',
  Editar: 'Editar',
  Aprovar: 'Aprovar',
  Configurar: 'Configurar',
} as const;

export type NivelAcessoValor = (typeof NivelAcesso)[keyof typeof NivelAcesso];

const ORDEM_NIVEL: Record<NivelAcessoValor, number> = {
  [NivelAcesso.SemAcesso]: 0,
  [NivelAcesso.Visualizar]: 1,
  [NivelAcesso.Editar]: 2,
  [NivelAcesso.Aprovar]: 3,
  [NivelAcesso.Configurar]: 4,
};

export function ordemNivel(nivel: NivelAcessoValor): number {
  return ORDEM_NIVEL[nivel];
}

export function nivelSuficiente(
  atual: NivelAcessoValor,
  minimo: NivelAcessoValor,
): boolean {
  return ORDEM_NIVEL[atual] >= ORDEM_NIVEL[minimo];
}

export function niveisIncluidos(nivel: NivelAcessoValor): NivelAcessoValor[] {
  const ordem = ORDEM_NIVEL[nivel];
  if (ordem <= 0) {
    return [];
  }

  return (
    Object.entries(ORDEM_NIVEL) as [NivelAcessoValor, number][]
  )
    .filter(([, valor]) => valor > 0 && valor <= ordem)
    .map(([chave]) => chave);
}
