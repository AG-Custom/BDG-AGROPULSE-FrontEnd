import type { TributoApuracaoValor } from 'constants/enums';
import { api } from 'services/api';
import type {
  AdicionarAjusteApuracaoPayload,
  ApuracaoFiscalDto,
  DecidirDocumentoApuracaoPayload,
  ResumoApuracaoFiscalDto,
} from 'types/dtos/apuracao-fiscal.dto';

function base(tributo: TributoApuracaoValor, competencia: string): string {
  return `/fiscal/apuracoes/${tributo}/${competencia}`;
}

export const apuracaoFiscalService = {
  listarFechadas(tributo: TributoApuracaoValor): Promise<ResumoApuracaoFiscalDto[]> {
    return api
      .get<ResumoApuracaoFiscalDto[]>(`/fiscal/apuracoes/${tributo}/fechadas`)
      .then((r) => r.data);
  },

  obter(tributo: TributoApuracaoValor, competencia: string): Promise<ApuracaoFiscalDto> {
    return api.get<ApuracaoFiscalDto>(base(tributo, competencia)).then((r) => r.data);
  },

  fechar(tributo: TributoApuracaoValor, competencia: string): Promise<ApuracaoFiscalDto> {
    return api.post<ApuracaoFiscalDto>(`${base(tributo, competencia)}/fechar`).then((r) => r.data);
  },

  reabrir(tributo: TributoApuracaoValor, competencia: string): Promise<ApuracaoFiscalDto> {
    return api.post<ApuracaoFiscalDto>(`${base(tributo, competencia)}/reabrir`).then((r) => r.data);
  },

  decidir(
    tributo: TributoApuracaoValor,
    competencia: string,
    documentoId: string,
    payload: DecidirDocumentoApuracaoPayload,
  ): Promise<ApuracaoFiscalDto> {
    return api
      .put<ApuracaoFiscalDto>(`${base(tributo, competencia)}/documentos/${documentoId}/decisao`, payload)
      .then((r) => r.data);
  },

  adicionarAjuste(
    tributo: TributoApuracaoValor,
    competencia: string,
    payload: AdicionarAjusteApuracaoPayload,
  ): Promise<ApuracaoFiscalDto> {
    return api
      .post<ApuracaoFiscalDto>(`${base(tributo, competencia)}/ajustes`, payload)
      .then((r) => r.data);
  },

  removerAjuste(
    tributo: TributoApuracaoValor,
    competencia: string,
    ajusteId: string,
  ): Promise<ApuracaoFiscalDto> {
    return api
      .delete<ApuracaoFiscalDto>(`${base(tributo, competencia)}/ajustes/${ajusteId}`)
      .then((r) => r.data);
  },
};
