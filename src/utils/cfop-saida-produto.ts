export interface RelacaoCfopSaida {
  interno: string;
  externo: string;
  entrada: string;
  saida: string;
}

const relacaoVazia: RelacaoCfopSaida = {
  interno: '',
  externo: '',
  entrada: '',
  saida: '',
};

function digitos(valor: string | null | undefined): string {
  return (valor ?? '').replace(/\D/g, '');
}

function posicionar(codigo: string): Pick<RelacaoCfopSaida, 'interno' | 'externo'> {
  if (codigo.startsWith('5')) return { interno: codigo, externo: '' };
  return { interno: '', externo: codigo };
}

function saidaDe(
  catalogo: readonly { codigo: string; cfopSaida: string | null }[],
  codigo: string,
): string {
  return digitos(catalogo.find((item) => digitos(item.codigo) === codigo)?.cfopSaida);
}

function par(codigo: string, trocas: Record<string, string>): string {
  const outro = trocas[codigo[0] ?? ''];
  if (!outro || codigo.length !== 4) return '';
  return outro + codigo.slice(1);
}

function aplicar(
  destino: { interno: string; externo: string },
  codigo: string,
): void {
  if (codigo.length !== 4) return;
  if (codigo.startsWith('5')) {
    if (!destino.interno) destino.interno = codigo;
    return;
  }
  if (codigo.startsWith('6') && !destino.externo) destino.externo = codigo;
}

export function resolverCfopSaidaDaNota(
  cfopNota: string | null | undefined,
  catalogo: readonly { codigo: string; cfopSaida: string | null }[],
): RelacaoCfopSaida {
  const entrada = digitos(cfopNota);
  if (entrada.length !== 4) return relacaoVazia;

  const saida = saidaDe(catalogo, entrada);
  if (saida.length !== 4) {
    return { ...posicionar(entrada), entrada: '', saida: '' };
  }

  const destino = { interno: '', externo: '' };
  const outraEntrada = par(entrada, { '1': '2', '2': '1', '5': '6', '6': '5' });
  aplicar(destino, saida);
  aplicar(destino, saidaDe(catalogo, outraEntrada));
  aplicar(destino, par(saida, { '5': '6', '6': '5' }));

  return { ...destino, entrada, saida };
}
