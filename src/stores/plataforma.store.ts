import { defineStore } from 'pinia';

import { plataformaService } from 'services/plataforma.service';
import type { TipoCertificadoDigitalValor } from 'constants/enums';
import type {
  AtualizarEmpresaPlataformaPayload,
  CriarEmpresaPlataformaPayload,
  EmpresaPlataformaDetalheDto,
  EmpresaPlataformaListItemDto,
} from 'types/dtos/plataforma.dto';

interface PlataformaState {
  empresas: EmpresaPlataformaListItemDto[];
  detalhe: EmpresaPlataformaDetalheDto | null;
  carregando: boolean;
}

export const usePlataformaStore = defineStore('plataforma', {
  state: (): PlataformaState => ({
    empresas: [],
    detalhe: null,
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

    async obterEmpresa(empresaId: string) {
      this.carregando = true;

      try {
        this.detalhe = await plataformaService.obterEmpresa(empresaId);
        return this.detalhe;
      } finally {
        this.carregando = false;
      }
    },

    async criarEmpresa(payload: CriarEmpresaPlataformaPayload) {
      return plataformaService.criarEmpresa(payload);
    },

    async atualizarEmpresa(empresaId: string, payload: AtualizarEmpresaPlataformaPayload) {
      this.detalhe = await plataformaService.atualizarEmpresa(empresaId, payload);
      return this.detalhe;
    },

    async enviarCertificado(
      empresaId: string,
      tipo: TipoCertificadoDigitalValor,
      arquivo: File,
      senha?: string,
    ) {
      return plataformaService.enviarCertificado(empresaId, tipo, arquivo, senha);
    },

    async enviarFichaCliente(empresaId: string, arquivo: File) {
      return plataformaService.enviarFichaCliente(empresaId, arquivo);
    },
  },
});
