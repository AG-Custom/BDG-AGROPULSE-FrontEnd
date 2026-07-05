import { api } from 'boot/axios';

import type { CriarEmpresaPayload, CriarEmpresaResponseDto, OnboardingDashboardDto } from 'types/dtos/onboarding.dto';

export const onboardingService = {
  criarEmpresa(payload: CriarEmpresaPayload): Promise<CriarEmpresaResponseDto> {
    return api.post<CriarEmpresaResponseDto>('/onboarding/company', payload).then((r) => r.data);
  },

  obterDashboard(): Promise<OnboardingDashboardDto> {
    return api.get<OnboardingDashboardDto>('/onboarding/dashboard').then((r) => r.data);
  },
};
