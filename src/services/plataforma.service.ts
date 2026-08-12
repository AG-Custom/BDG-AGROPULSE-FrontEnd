import { api } from 'boot/axios';

import type {
  AtualizarEmpresaPlataformaPayload,
  CertificadoDigitalPlataformaDto,
  CriarEmpresaPlataformaPayload,
  CriarEmpresaPlataformaResponseDto,
  EmpresaPlataformaDetalheDto,
  FichaClientePlataformaDto,
  ListarEmpresasPlataformaResponseDto,
} from 'types/dtos/plataforma.dto';
import type { TipoCertificadoDigitalValor } from 'constants/enums';

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

  atualizarEmpresa(
    empresaId: string,
    payload: AtualizarEmpresaPlataformaPayload,
  ): Promise<EmpresaPlataformaDetalheDto> {
    return api
      .put<EmpresaPlataformaDetalheDto>(`/plataforma/empresas/${empresaId}`, payload)
      .then((response) => response.data);
  },

  enviarCertificado(
    empresaId: string,
    tipo: TipoCertificadoDigitalValor,
    arquivo: File,
    senha?: string,
  ): Promise<CertificadoDigitalPlataformaDto> {
    const formData = new FormData();
    formData.append('tipo', tipo);
    formData.append('arquivo', arquivo);
    if (senha?.trim()) {
      formData.append('senha', senha.trim());
    }

    return api
      .post<CertificadoDigitalPlataformaDto>(`/plataforma/empresas/${empresaId}/certificado`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data);
  },

  enviarFichaCliente(empresaId: string, arquivo: File): Promise<FichaClientePlataformaDto> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return api
      .post<FichaClientePlataformaDto>(`/plataforma/empresas/${empresaId}/ficha-cliente`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => response.data);
  },
};
