import { api } from 'boot/axios';

import type {
  CriarEmpresaPlataformaPayload,
  CriarEmpresaPlataformaResponseDto,
  EmpresaPlataformaDetalheDto,
  ListarEmpresasPlataformaResponseDto,
} from 'types/dtos/plataforma.dto';

export const plataformaService = {
  listarEmpresas(): Promise<ListarEmpresasPlataformaResponseDto> {
    return api
      .get<ListarEmpresasPlataformaResponseDto>('/plataforma/empresas')
      .then((response) => response.data);
  },

  obterEmpresa(empresaId: string): Promise<EmpresaPlataformaDetalheDto> {
    return api
      .get<EmpresaPlataformaDetalheDto>(`/plataforma/empresas/${empresaId}`)
      .then((response) => response.data);
  },

  criarEmpresa(payload: CriarEmpresaPlataformaPayload): Promise<CriarEmpresaPlataformaResponseDto> {
    return api
      .post<CriarEmpresaPlataformaResponseDto>('/plataforma/empresas', payload)
      .then((response) => response.data);
  },
};
