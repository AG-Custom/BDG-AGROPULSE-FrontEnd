import { api } from 'boot/axios';
import type { NfeEmpresaDto, SalvarNfeEmpresaPayload } from 'types/dtos/nfe-empresa.dto';

// O ID explícito é exclusivo da administração da plataforma. No tenant, a API resolve a sessão.
const caminho = (empresaId?: string) => empresaId
  ? `/plataforma/empresas/${empresaId}/nfe`
  : '/fiscal/nfe/configuracao';

export const nfeEmpresaService = {
  async obter(empresaId?: string, unidadeId?: string): Promise<NfeEmpresaDto> {
    return (await api.get<NfeEmpresaDto>(caminho(empresaId), { params: { unidadeId } })).data;
  },
  async salvarTokenPrincipal(token: string): Promise<void> {
    await api.put('/plataforma/focus/token', { token });
  },
  async sincronizar(unidadeId: string, certificado: File | null, senha: string, empresaId?: string): Promise<NfeEmpresaDto> {
    const form = new FormData();
    if (certificado) { form.append('certificado', certificado); form.append('senha', senha); }
    return (await api.post<NfeEmpresaDto>(`${caminho(empresaId)}/${unidadeId}/sincronizar`, form)).data;
  },
  async salvar(payload: SalvarNfeEmpresaPayload, empresaId?: string): Promise<NfeEmpresaDto> {
    return (await api.put<NfeEmpresaDto>(caminho(empresaId), payload)).data;
  },
};
