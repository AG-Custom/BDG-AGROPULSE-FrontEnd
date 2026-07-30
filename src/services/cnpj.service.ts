import { api } from 'services/api';

import type { CnpjEmpresaDto, CriarCnpjPayload, EditarCnpjPayload } from 'types/dtos/cnpj.dto';

export const cnpjService = {
  listar(): Promise<CnpjEmpresaDto[]> {
    return api.get<CnpjEmpresaDto[]>('/empresas/cnpjs').then((r) => r.data);
  },

  criar(payload: CriarCnpjPayload): Promise<CnpjEmpresaDto> {
    return api.post<CnpjEmpresaDto>('/empresas/cnpjs', payload).then((r) => r.data);
  },

  editar(cnpjId: string, payload: EditarCnpjPayload): Promise<CnpjEmpresaDto> {
    return api.put<CnpjEmpresaDto>(`/empresas/cnpjs/${cnpjId}`, payload).then((r) => r.data);
  },

  inativar(cnpjId: string, justificativa: string): Promise<void> {
    return api.post(`/empresas/cnpjs/${cnpjId}/inativar`, { justificativa });
  },

  ativar(cnpjId: string): Promise<void> {
    return api.post(`/empresas/cnpjs/${cnpjId}/ativar`);
  },
};
