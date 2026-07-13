import { api } from 'services/api';
import type {
  ConfiguracaoFiscalDto,
  ImportacaoXmlDto,
  ImportarXmlPayload,
  NotaFiscalDto,
  SalvarConfiguracaoFiscalPayload,
  Sped0200Dto,
  SugestaoTributacaoDto,
} from 'types/dtos/fiscal.dto';

export const fiscalService = {
  sugerir(produtoId: string, ufDestino?: string): Promise<SugestaoTributacaoDto> {
    return api
      .get<SugestaoTributacaoDto>(`/fiscal/sugerir/${produtoId}`, {
        params: ufDestino ? { ufDestino } : undefined,
      })
      .then((r) => r.data);
  },

  importarXml(payload: ImportarXmlPayload | FormData): Promise<ImportacaoXmlDto> {
    return api
      .post<ImportacaoXmlDto>('/fiscal/importacao/xml-lote', payload)
      .then((r) => r.data);
  },

  exportarSped0200(): Promise<Sped0200Dto> {
    return api.get<Sped0200Dto>('/fiscal/sped-0200').then((r) => r.data);
  },

  emitirNfe(pedidoId: string): Promise<NotaFiscalDto> {
    return api
      .post<NotaFiscalDto>(`/fiscal/emitir-nfe/${pedidoId}`)
      .then((r) => r.data);
  },

  obterConfiguracao(): Promise<ConfiguracaoFiscalDto> {
    return api.get<ConfiguracaoFiscalDto>('/fiscal/configuracao').then((r) => r.data);
  },

  salvarConfiguracao(
    payload: SalvarConfiguracaoFiscalPayload,
  ): Promise<ConfiguracaoFiscalDto> {
    return api
      .put<ConfiguracaoFiscalDto>('/fiscal/configuracao', payload)
      .then((r) => r.data);
  },
};
