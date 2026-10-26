import { api } from 'services/api';
import type {
  ArquivoFiscalDto,
  GerarArquivoFiscalPayload,
  GeracaoArquivoFiscalDto,
  ListarArquivosFiscaisParams,
  PerfilContribuicoesDto,
  PerfilEfdDto,
} from 'types/dtos/obrigacao-fiscal.dto';

export const obrigacaoFiscalService = {
  gerarSintegra(payload: GerarArquivoFiscalPayload): Promise<GeracaoArquivoFiscalDto> {
    return api
      .post<GeracaoArquivoFiscalDto>('/fiscal/obrigacoes/sintegra', payload)
      .then((r) => r.data);
  },

  gerarEfdIcmsIpi(payload: GerarArquivoFiscalPayload): Promise<GeracaoArquivoFiscalDto> {
    return api
      .post<GeracaoArquivoFiscalDto>('/fiscal/obrigacoes/efd-icms-ipi', payload)
      .then((r) => r.data);
  },

  obterPerfilEfd(): Promise<PerfilEfdDto | null> {
    return api
      .get<PerfilEfdDto | null>('/fiscal/obrigacoes/efd-icms-ipi/perfil')
      .then((r) => r.data ?? null);
  },

  salvarPerfilEfd(payload: PerfilEfdDto): Promise<PerfilEfdDto> {
    return api
      .put<PerfilEfdDto>('/fiscal/obrigacoes/efd-icms-ipi/perfil', payload)
      .then((r) => r.data);
  },

  gerarEfdContribuicoes(payload: GerarArquivoFiscalPayload): Promise<GeracaoArquivoFiscalDto> {
    return api
      .post<GeracaoArquivoFiscalDto>('/fiscal/obrigacoes/efd-contribuicoes', payload)
      .then((r) => r.data);
  },

  obterPerfilContribuicoes(): Promise<PerfilContribuicoesDto | null> {
    return api
      .get<PerfilContribuicoesDto | null>('/fiscal/obrigacoes/efd-contribuicoes/perfil')
      .then((r) => r.data ?? null);
  },

  salvarPerfilContribuicoes(payload: PerfilContribuicoesDto): Promise<PerfilContribuicoesDto> {
    return api
      .put<PerfilContribuicoesDto>('/fiscal/obrigacoes/efd-contribuicoes/perfil', payload)
      .then((r) => r.data);
  },

  listarArquivos(params?: ListarArquivosFiscaisParams): Promise<ArquivoFiscalDto[]> {
    return api
      .get<ArquivoFiscalDto[]>('/fiscal/obrigacoes/arquivos', { params })
      .then((r) => r.data);
  },

  baixarArquivo(id: string): Promise<Blob> {
    return api
      .get<Blob>(`/fiscal/obrigacoes/arquivos/${id}/download`, { responseType: 'blob' })
      .then((r) => r.data);
  },
};
