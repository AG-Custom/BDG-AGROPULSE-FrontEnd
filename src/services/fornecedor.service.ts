import { api } from 'services/api';
import type { ExportacaoFormatoValor } from 'constants/enums';
import type {
  AvaliacaoFornecedorDto,
  AvaliacaoFornecedorPayload,
  ContatoFornecedorDto,
  ContatoFornecedorPayload,
  CriarFornecedorPayload,
  EditarFornecedorPayload,
  FornecedorAvaliacoesResumoDto,
  FornecedorDto,
  FornecedorResumoDto,
  ListarFornecedoresParams,
} from 'types/dtos/fornecedor.dto';

export const fornecedorService = {
  listar(params?: ListarFornecedoresParams): Promise<FornecedorResumoDto[]> {
    return api
      .get<FornecedorResumoDto[]>('/fornecedores', { params })
      .then((r) => r.data);
  },

  exportar(
    formato: ExportacaoFormatoValor,
    params?: Omit<ListarFornecedoresParams, 'exportar'>,
  ): Promise<Blob> {
    return api
      .get<Blob>('/fornecedores', {
        params: { ...params, exportar: formato },
        responseType: 'blob',
      })
      .then((r) => r.data);
  },

  obter(fornecedorId: string): Promise<FornecedorDto> {
    return api.get<FornecedorDto>(`/fornecedores/${fornecedorId}`).then((r) => r.data);
  },

  obterResumoAvaliacoes(fornecedorId: string): Promise<FornecedorAvaliacoesResumoDto> {
    return api
      .get<FornecedorAvaliacoesResumoDto>(`/fornecedores/${fornecedorId}/resumo`)
      .then((r) => r.data);
  },

  criar(payload: CriarFornecedorPayload): Promise<FornecedorDto> {
    return api.post<FornecedorDto>('/fornecedores', payload).then((r) => r.data);
  },

  editar(fornecedorId: string, payload: EditarFornecedorPayload): Promise<FornecedorDto> {
    return api.put<FornecedorDto>(`/fornecedores/${fornecedorId}`, payload).then((r) => r.data);
  },

  inativar(fornecedorId: string, justificativa: string): Promise<void> {
    return api.post(`/fornecedores/${fornecedorId}/inativar`, { justificativa });
  },

  ativar(fornecedorId: string): Promise<void> {
    return api.post(`/fornecedores/${fornecedorId}/ativar`);
  },

  adicionarContato(
    fornecedorId: string,
    payload: ContatoFornecedorPayload,
  ): Promise<ContatoFornecedorDto> {
    return api
      .post<ContatoFornecedorDto>(`/fornecedores/${fornecedorId}/contatos`, payload)
      .then((r) => r.data);
  },

  editarContato(
    fornecedorId: string,
    contatoId: string,
    payload: ContatoFornecedorPayload,
  ): Promise<ContatoFornecedorDto> {
    return api
      .put<ContatoFornecedorDto>(
        `/fornecedores/${fornecedorId}/contatos/${contatoId}`,
        payload,
      )
      .then((r) => r.data);
  },

  removerContato(fornecedorId: string, contatoId: string): Promise<void> {
    return api.delete(`/fornecedores/${fornecedorId}/contatos/${contatoId}`);
  },

  listarAvaliacoes(fornecedorId: string): Promise<AvaliacaoFornecedorDto[]> {
    return api
      .get<AvaliacaoFornecedorDto[]>(`/fornecedores/${fornecedorId}/avaliacoes`)
      .then((r) => r.data);
  },

  adicionarAvaliacao(
    fornecedorId: string,
    payload: AvaliacaoFornecedorPayload,
  ): Promise<AvaliacaoFornecedorDto> {
    return api
      .post<AvaliacaoFornecedorDto>(`/fornecedores/${fornecedorId}/avaliacoes`, payload)
      .then((r) => r.data);
  },

  editarAvaliacao(
    fornecedorId: string,
    avaliacaoId: string,
    payload: AvaliacaoFornecedorPayload,
  ): Promise<AvaliacaoFornecedorDto> {
    return api
      .put<AvaliacaoFornecedorDto>(
        `/fornecedores/${fornecedorId}/avaliacoes/${avaliacaoId}`,
        payload,
      )
      .then((r) => r.data);
  },

  removerAvaliacao(fornecedorId: string, avaliacaoId: string): Promise<void> {
    return api.delete(`/fornecedores/${fornecedorId}/avaliacoes/${avaliacaoId}`);
  },
};
