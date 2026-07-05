import { defineStore } from 'pinia';

import { onboardingService } from 'services/onboarding.service';
import { useAuthStore } from 'stores/auth.store';
import type { CriarEmpresaPayload, EmpresaFormModel, UnidadeFormModel } from 'types/dtos/onboarding.dto';
import { criarUnidadeVazia } from 'types/dtos/onboarding.dto';
import { apenasDigitos } from 'utils/formatters';

interface OnboardingState {
  empresa: EmpresaFormModel;
  unidades: UnidadeFormModel[];
}

export const useOnboardingStore = defineStore('onboarding', {
  state: (): OnboardingState => ({
    empresa: {
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
    },
    unidades: [criarUnidadeVazia(true)],
  }),
  actions: {
    adicionarUnidade() {
      this.unidades.push(criarUnidadeVazia(false));
    },

    removerUnidade(id: string) {
      if (this.unidades.length <= 1) {
        return;
      }

      this.unidades = this.unidades.filter((u) => u.id !== id);
      this.garantirMatrizUnica();
    },

    definirMatriz(id: string) {
      this.unidades = this.unidades.map((u) => ({
        ...u,
        matriz: u.id === id,
      }));
    },

    garantirMatrizUnica() {
      const temMatriz = this.unidades.some((u) => u.matriz);
      if (!temMatriz && this.unidades[0]) {
        this.unidades[0].matriz = true;
      }
    },

    montarPayload(): CriarEmpresaPayload {
      return {
        razaoSocial: this.empresa.razaoSocial.trim(),
        nomeFantasia: this.empresa.nomeFantasia.trim(),
        cnpj: apenasDigitos(this.empresa.cnpj),
        unidades: this.unidades.map(({ id: _id, ...unidade }) => ({
          ...unidade,
          telefone: apenasDigitos(unidade.telefone),
          cep: apenasDigitos(unidade.cep),
          numero: apenasDigitos(unidade.numero),
          estado: unidade.estado.trim().toUpperCase(),
          complemento: unidade.complemento?.trim() || null,
        })),
      };
    },

    async salvarEmpresa() {
      const payload = this.montarPayload();
      const resposta = await onboardingService.criarEmpresa(payload);

      const authStore = useAuthStore();
      await authStore.renovarTokens();

      return resposta;
    },
  },
});
