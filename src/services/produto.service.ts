import { api } from 'services/api';

import type { ExportacaoFormatoValor, TipoDocumentoProdutoValor } from 'constants/enums';
import type {
  CriarProdutoPayload,
  EditarProdutoConversaoPayload,
  EditarProdutoPayload,
  ListarProdutosParams,
  ProdutoCodigoDto,
  ProdutoCodigoPayload,
  ProdutoConversaoUnidadeDto,
  ProdutoDocumentoDto,
  ProdutoDto,
  ProdutoFiscalDto,
  ProdutoFiscalPayload,
  ProdutoResumoDto,
  ProdutoConversaoPayload,
  SincronizarLimitesEstoquePayload,
} from 'types/dtos/produto.dto';

export const produtoService = {
  listar(params?: ListarProdutosParams): Promise<ProdutoResumoDto[]> {
    return api.get<ProdutoResumoDto[]>('/produtos', { params }).then((r) => r.data);
  },

  exportar(
    formato: ExportacaoFormatoValor,
    params?: Omit<ListarProdutosParams, 'exportar'>,
  ): Promise<Blob> {
    return api
      .get<Blob>('/produtos', {
        params: { ...params, exportar: formato },
        responseType: 'blob',
      })
      .then((r) => r.data);
  },

  obter(produtoId: string): Promise<ProdutoDto> {
    return api.get<ProdutoDto>(`/produtos/${produtoId}`).then((r) => r.data);
  },

  criar(payload: CriarProdutoPayload): Promise<ProdutoDto> {
    return api.post<ProdutoDto>('/produtos', payload).then((r) => r.data);
  },

  editar(produtoId: string, payload: EditarProdutoPayload): Promise<ProdutoDto> {
    return api.put<ProdutoDto>(`/produtos/${produtoId}`, payload).then((r) => r.data);
  },

  inativar(produtoId: string): Promise<void> {
    return api.patch(`/produtos/${produtoId}/inativar`);
  },

  ativar(produtoId: string): Promise<void> {
    return api.patch(`/produtos/${produtoId}/ativar`);
  },

  salvarFiscal(produtoId: string, payload: ProdutoFiscalPayload): Promise<ProdutoFiscalDto> {
    return api.put<ProdutoFiscalDto>(`/produtos/${produtoId}/fiscal`, payload).then((r) => r.data);
  },

  listarCodigos(produtoId: string): Promise<ProdutoCodigoDto[]> {
    return api.get<ProdutoCodigoDto[]>(`/produtos/${produtoId}/codigos`).then((r) => r.data);
  },

  adicionarCodigo(produtoId: string, payload: ProdutoCodigoPayload): Promise<ProdutoCodigoDto> {
    return api
      .post<ProdutoCodigoDto>(`/produtos/${produtoId}/codigos`, payload)
      .then((r) => r.data);
  },

  editarCodigo(
    produtoId: string,
    codigoId: string,
    payload: ProdutoCodigoPayload,
  ): Promise<ProdutoCodigoDto> {
    return api
      .put<ProdutoCodigoDto>(`/produtos/${produtoId}/codigos/${codigoId}`, payload)
      .then((r) => r.data);
  },

  removerCodigo(produtoId: string, codigoId: string): Promise<void> {
    return api.delete(`/produtos/${produtoId}/codigos/${codigoId}`);
  },

  listarDocumentos(produtoId: string): Promise<ProdutoDocumentoDto[]> {
    return api.get<ProdutoDocumentoDto[]>(`/produtos/${produtoId}/documentos`).then((r) => r.data);
  },

  adicionarDocumento(
    produtoId: string,
    tipo: TipoDocumentoProdutoValor,
    arquivo: File,
  ): Promise<ProdutoDocumentoDto> {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('arquivo', arquivo);

    return api
      .post<ProdutoDocumentoDto>(`/produtos/${produtoId}/documentos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  removerDocumento(produtoId: string, documentoId: string): Promise<void> {
    return api.delete(`/produtos/${produtoId}/documentos/${documentoId}`);
  },

  sincronizarLimitesEstoque(
    produtoId: string,
    payload: SincronizarLimitesEstoquePayload,
  ): Promise<ProdutoDto> {
    return api
      .put<ProdutoDto>(`/produtos/${produtoId}/limites-estoque`, payload)
      .then((r) => r.data);
  },

  listarConversoes(produtoId: string): Promise<ProdutoConversaoUnidadeDto[]> {
    return api
      .get<ProdutoConversaoUnidadeDto[]>(`/produtos/${produtoId}/conversoes-unidade`)
      .then((r) => r.data);
  },

  adicionarConversao(
    produtoId: string,
    payload: ProdutoConversaoPayload,
  ): Promise<ProdutoConversaoUnidadeDto> {
    return api
      .post<ProdutoConversaoUnidadeDto>(`/produtos/${produtoId}/conversoes-unidade`, payload)
      .then((r) => r.data);
  },

  editarConversao(
    produtoId: string,
    conversaoId: string,
    payload: EditarProdutoConversaoPayload,
  ): Promise<ProdutoConversaoUnidadeDto> {
    return api
      .put<ProdutoConversaoUnidadeDto>(
        `/produtos/${produtoId}/conversoes-unidade/${conversaoId}`,
        payload,
      )
      .then((r) => r.data);
  },

  removerConversao(produtoId: string, conversaoId: string): Promise<void> {
    return api.delete(`/produtos/${produtoId}/conversoes-unidade/${conversaoId}`);
  },
};
