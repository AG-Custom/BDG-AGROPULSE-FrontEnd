import { api } from 'services/api';
import type {
  CompetenciaEscrituracaoDto,
  DirecaoEscrituracao,
  DocumentoEscrituradoDetalheDto,
  LivroFiscalDto,
  ReprocessamentoEscrituracaoDto,
} from 'types/dtos/escrituracao.dto';

export const escrituracaoService = {
  listarCompetencias(): Promise<CompetenciaEscrituracaoDto[]> {
    return api
      .get<CompetenciaEscrituracaoDto[]>('/fiscal/escrituracao/competencias')
      .then((r) => r.data);
  },

  obterLivro(competencia: string, direcao?: DirecaoEscrituracao): Promise<LivroFiscalDto> {
    return api
      .get<LivroFiscalDto>(`/fiscal/escrituracao/${competencia}`, { params: { direcao } })
      .then((r) => r.data);
  },

  obterDocumento(documentoId: string): Promise<DocumentoEscrituradoDetalheDto> {
    return api
      .get<DocumentoEscrituradoDetalheDto>(`/fiscal/escrituracao/documentos/${documentoId}`)
      .then((r) => r.data);
  },

  reprocessar(competencia: string): Promise<ReprocessamentoEscrituracaoDto> {
    return api
      .post<ReprocessamentoEscrituracaoDto>(`/fiscal/escrituracao/${competencia}/reprocessar`)
      .then((r) => r.data);
  },
};
