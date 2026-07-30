import { api } from 'services/api';

import type {
  CategoriaProdutoDto,
  CategoriaProdutoResumoDto,
  ListarCategoriasProdutoParams,
  SalvarCategoriaProdutoPayload,
} from 'types/dtos/categoria-produto.dto';

export const categoriaProdutoService = {
  listar(params?: ListarCategoriasProdutoParams): Promise<CategoriaProdutoResumoDto[]> {
    return api
      .get<CategoriaProdutoResumoDto[]>('/categorias-produto', { params })
      .then((r) => r.data);
  },

  obter(categoriaProdutoId: string): Promise<CategoriaProdutoDto> {
    return api
      .get<CategoriaProdutoDto>(`/categorias-produto/${categoriaProdutoId}`)
      .then((r) => r.data);
  },

  criar(payload: SalvarCategoriaProdutoPayload): Promise<CategoriaProdutoDto> {
    return api.post<CategoriaProdutoDto>('/categorias-produto', payload).then((r) => r.data);
  },

  editar(
    categoriaProdutoId: string,
    payload: SalvarCategoriaProdutoPayload,
  ): Promise<CategoriaProdutoDto> {
    return api
      .put<CategoriaProdutoDto>(`/categorias-produto/${categoriaProdutoId}`, payload)
      .then((r) => r.data);
  },

  inativar(categoriaProdutoId: string, justificativa: string): Promise<void> {
    return api.patch(`/categorias-produto/${categoriaProdutoId}/inativar`, { justificativa });
  },

  ativar(categoriaProdutoId: string): Promise<void> {
    return api.patch(`/categorias-produto/${categoriaProdutoId}/ativar`);
  },
};
