import type { UnidadeMedidaResumoDto } from 'types/dtos/unidade-medida.dto';

const GRUPOS_UNIDADE: readonly (readonly string[])[] = [
  ['UN', 'UND', 'UNID', 'UNI', 'UNIDADE', 'UNIDADES'],
  ['KG', 'KGS', 'KILO', 'KILOS', 'QUILO', 'QUILOS', 'QUILOGRAMA', 'QUILOGRAMAS'],
  ['G', 'GR', 'GRS', 'GRAMA', 'GRAMAS'],
  ['T', 'TN', 'TON', 'TONS', 'TONELADA', 'TONELADAS'],
  ['L', 'LT', 'LTS', 'LITRO', 'LITROS'],
  ['ML', 'MLS', 'MILILITRO', 'MILILITROS'],
  ['CX', 'CXS', 'CAIXA', 'CAIXAS'],
  ['PCT', 'PC', 'PCS', 'PACOTE', 'PACOTES', 'PECA', 'PECAS', 'PEC'],
  ['SC', 'SCS', 'SACO', 'SACOS'],
  ['M', 'MT', 'MTS', 'METRO', 'METROS'],
  ['M2', 'M²', 'MQ', 'METROQUADRADO'],
  ['M3', 'M³', 'MC', 'METROCUBICO'],
  ['FD', 'FARDO', 'FARDOS'],
  ['BD', 'BALDE', 'BALDES'],
  ['GL', 'GLN', 'GALAO', 'GALOES'],
  ['TB', 'TAMBOR', 'TAMBORES'],
  ['PAR', 'PARES'],
  ['KIT', 'KITS'],
  ['RL', 'ROLO', 'ROLOS'],
  ['CJ', 'CONJUNTO', 'CONJUNTOS'],
  ['DZ', 'DUZIA', 'DUZIAS'],
  ['HA', 'HECTARE', 'HECTARES'],
];

function tokensUnidade(valor: string): string[] {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .split(/[^A-Z0-9²³]+/)
    .filter((token) => token.length > 0);
}

function candidatosUnidade(unidadeXml: string): Set<string> {
  const token = tokensUnidade(unidadeXml)[0] ?? '';
  if (!token) return new Set();

  const grupo = GRUPOS_UNIDADE.find((item) => item.includes(token));
  return new Set(grupo ?? [token]);
}

function pontuar(tokens: string[], tokenXml: string, candidatos: Set<string>, exato: number, grupo: number): number {
  if (tokens.includes(tokenXml)) return exato;
  if (tokens.some((token) => candidatos.has(token))) return grupo;
  return 0;
}

export function resolverUnidadeMedidaIdPorXml(
  unidadeXml: string | null | undefined,
  unidades: readonly UnidadeMedidaResumoDto[],
): string | null {
  const unXml = unidadeXml?.trim();
  if (!unXml) return null;

  const tokenXml = tokensUnidade(unXml)[0] ?? '';
  const candidatos = candidatosUnidade(unXml);
  if (!tokenXml || candidatos.size === 0) return null;

  let melhorId: string | null = null;
  let melhorScore = 0;

  for (const unidade of unidades) {
    if (!unidade.ativo) continue;

    const score = Math.max(
      pontuar(tokensUnidade(unidade.codigo), tokenXml, candidatos, 100, 80),
      pontuar(tokensUnidade(unidade.descricao), tokenXml, candidatos, 60, 40),
    );

    if (score > melhorScore) {
      melhorScore = score;
      melhorId = unidade.id;
    }
  }

  return melhorId;
}
