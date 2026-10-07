import type { NotaFiscalEventoDto, NotaFiscalGestaoDto } from 'types/dtos/fiscal-gestao.dto';

export type TomLinhaTempo = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface LinhaTempoNota {
  id: string;
  em: string;
  titulo: string;
  detalhe: string | null;
  tom: TomLinhaTempo;
}

export function montarLinhaTempo(nota: NotaFiscalGestaoDto): LinhaTempoNota[] {
  const linhas: LinhaTempoNota[] = [
    {
      id: 'registrada',
      em: nota.createdAt,
      titulo: 'Nota registrada',
      detalhe: null,
      tom: 'default',
    },
  ];
  let envios = 0;
  for (const evento of nota.eventos ?? []) {
    if (evento.operacao === 'emissao') envios += 1;
    linhas.push({
      id: `${evento.em}-${evento.operacao}-${linhas.length}`,
      em: evento.em,
      titulo: tituloEvento(evento, envios),
      detalhe: detalheEvento(evento),
      tom: tomEvento(evento.situacao),
    });
  }
  const autorizou = (nota.eventos ?? []).some((evento) => evento.situacao === 'Autorizada');
  if (nota.emitidaEm && !autorizou) {
    linhas.push({
      id: 'autorizada',
      em: nota.emitidaEm,
      titulo: 'Autorizada',
      detalhe: nota.protocoloAutorizacao ? `Protocolo ${nota.protocoloAutorizacao}` : null,
      tom: 'success',
    });
  }
  const cancelou = (nota.eventos ?? []).some((evento) => evento.situacao === 'Cancelada');
  if (nota.canceladaEm && !cancelou) {
    linhas.push({
      id: 'cancelada',
      em: nota.canceladaEm,
      titulo: 'Cancelada',
      detalhe: nota.motivoCancelamento,
      tom: 'error',
    });
  }
  return linhas.sort((a, b) => new Date(a.em).getTime() - new Date(b.em).getTime());
}

function tituloEvento(evento: NotaFiscalEventoDto, envios: number): string {
  const reenvio = evento.operacao === 'emissao' && envios > 1;
  if (evento.operacao === 'consulta') {
    if (evento.situacao === 'Autorizada') return 'Consulta confirmou a autorização';
    if (evento.situacao === 'Rejeitada') return 'Consulta confirmou a rejeição';
    if (evento.situacao === 'Cancelada') return 'Consulta confirmou o cancelamento';
    if (evento.situacao === 'Processando') return 'Consulta: ainda em processamento';
    return 'Consultada na Focus';
  }
  if (evento.operacao === 'cancelamento') {
    return evento.situacao === 'Cancelada' ? 'Cancelada' : 'Cancelamento enviado';
  }
  if (evento.situacao === 'Autorizada') return reenvio ? 'Reenviada e autorizada' : 'Autorizada';
  if (evento.situacao === 'Rejeitada') return reenvio ? 'Reenvio rejeitado' : 'Rejeitada';
  if (evento.situacao === 'Processando') return reenvio ? 'Reenviada e em processamento' : 'Enviada e em processamento';
  if (reenvio) return 'Reenviada';
  if (evento.operacao === 'emissao') return 'Enviada para autorização';
  return 'Atualização registrada';
}

function detalheEvento(evento: NotaFiscalEventoDto): string | null {
  const partes = [
    evento.codigoSefaz ? `SEFAZ ${evento.codigoSefaz}` : null,
    evento.mensagem?.trim() || null,
  ].filter((parte): parte is string => Boolean(parte));
  return partes.length > 0 ? partes.join(' · ') : null;
}

function tomEvento(situacao: string): TomLinhaTempo {
  if (situacao === 'Autorizada') return 'success';
  if (situacao === 'Rejeitada' || situacao === 'ErroRequisicao') return 'error';
  if (situacao === 'Processando') return 'warning';
  if (situacao === 'Cancelada') return 'info';
  return 'default';
}
