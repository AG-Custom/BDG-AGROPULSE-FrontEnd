import { api } from 'services/api';

import type { CnpjEmpresaDto, CriarCnpjPayload } from 'types/dtos/cnpj.dto';

export const cnpjService = {
  listar(): Promise<CnpjEmpresaDto[]> {
    return api.get<CnpjEmpresaDto[]>('/empresas/cnpjs').then((r) => r.data);
  },

  criar(payload: CriarCnpjPayload): Promise<CnpjEmpresaDto> {
    return api.post<CnpjEmpresaDto>('/empresas/cnpjs', payload).then((r) => r.data);
  },
};
