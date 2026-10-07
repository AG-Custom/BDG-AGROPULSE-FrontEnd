import type { ItemNavegacao } from 'constants/navegacao-modulos';

export interface ModuloBuscaMenu {
  grupoLabel: string;
  id: string;
  label: string;
  icon: string;
  filhos: ItemNavegacao[];
}

export interface ResultadoBuscaMenu {
  moduloId: string;
  grupoLabel: string;
  moduloLabel: string;
  moduloIcon: string;
  itens: ItemNavegacao[];
}

export function normalizarBuscaMenu(valor: string): string {
  return valor.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export function buscarMenu(modulos: ModuloBuscaMenu[], termo: string): ResultadoBuscaMenu[] {
  const tokens = normalizarBuscaMenu(termo).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return [];
  }

  const resultados: ResultadoBuscaMenu[] = [];

  for (const modulo of modulos) {
    const contexto = normalizarBuscaMenu(`${modulo.grupoLabel} ${modulo.label}`);
    const itens = modulo.filhos.filter((filho) => {
      const texto = `${normalizarBuscaMenu(filho.label)} ${contexto}`;
      return tokens.every((token) => texto.includes(token));
    });

    if (itens.length === 0) {
      continue;
    }

    resultados.push({
      moduloId: modulo.id,
      grupoLabel: modulo.grupoLabel,
      moduloLabel: modulo.label,
      moduloIcon: modulo.icon,
      itens,
    });
  }

  return resultados;
}
