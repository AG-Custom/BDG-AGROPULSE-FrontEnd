import { defineStore } from 'pinia';

import { plataformaService } from 'services/plataforma.service';
import type {
  CriarEmpresaPlataformaPayload,
  EmpresaPlataformaListItemDto,
} from 'types/dtos/plataforma.dto';

interface PlataformaState {
  empresas: EmpresaPlataformaListItemDto[];
  carregando: boolean;
}

export const usePlataformaStore = defineStore('plataforma', {
  state: (): PlataformaState => ({
    empresas: [],
    carregando: false,
  }),
  actions: {
    async listarEmpresas() {
      this.carregando = true;

      try {
        const resposta = await plataformaService.listarEmpresas();
        this.empresas = resposta.items;
        return resposta.items;
      } finally {
        this.carregando = false;
      }
    },

    async criarEmpresa(payload: CriarEmpresaPlataformaPayload) {
      return plataformaService.criarEmpresa(payload);
    },
  },
});
