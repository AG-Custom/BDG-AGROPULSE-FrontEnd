import type { TipoCodigoIcms } from 'types/dtos/fiscal-gestao.dto';

export interface RelacaoIcmsSaida {
  codigo: string;
  entrada: string;
}

interface ItemCatalogoIcms {
  tipo: TipoCodigoIcms;
  codigo: string;
  icmsSaida: string | null;
}

export function resolverIcmsSaidaDaNota(
  codigoNota: string | null | undefined,
  tipo: TipoCodigoIcms,
  catalogo: readonly ItemCatalogoIcms[],
): RelacaoIcmsSaida {
  const valorNota = codigoNota?.trim() ?? '';
  const entrada = valorNota.replace(/\D/g, '');
  if (!entrada) return { codigo: valorNota, entrada: '' };

  const saida = catalogo.find((item) => item.tipo === tipo && item.codigo === entrada)?.icmsSaida;
  if (!saida) return { codigo: valorNota, entrada: '' };

  return { codigo: saida, entrada };
}
