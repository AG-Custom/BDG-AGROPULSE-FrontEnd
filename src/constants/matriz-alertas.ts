import { AreaAcesso, type AreaAcessoValor } from 'constants/areas-acesso';
import {
  NotificacaoTipo,
  PerfilUsuario,
  type NotificacaoTipoValor,
  type PerfilUsuarioValor,
} from 'constants/enums';

export type PoliticaAlerta = {
  area: AreaAcessoValor;
  perfisPermitidos: readonly PerfilUsuarioValor[];
};

const PERFIS_GESTAO = [
  PerfilUsuario.Diretor,
  PerfilUsuario.Administrador,
  PerfilUsuario.Gerente,
] as const;

const PERFIS_FINANCEIROS = [
  PerfilUsuario.Diretor,
  PerfilUsuario.Administrador,
  PerfilUsuario.Gerente,
  PerfilUsuario.Administrativo,
] as const;

const PERFIS_COMERCIAIS = [
  PerfilUsuario.Diretor,
  PerfilUsuario.Administrador,
  PerfilUsuario.Gerente,
  PerfilUsuario.Vendedor,
] as const;

const PERFIS_ESTOQUE = [
  PerfilUsuario.Diretor,
  PerfilUsuario.Administrador,
  PerfilUsuario.Gerente,
  PerfilUsuario.Administrativo,
  PerfilUsuario.Operacional,
] as const;

const PERFIS_APROVACAO = [
  PerfilUsuario.Diretor,
  PerfilUsuario.Administrador,
  PerfilUsuario.Gerente,
  PerfilUsuario.Administrativo,
] as const;

const PERFIS_CARTEIRA = [
  PerfilUsuario.Diretor,
  PerfilUsuario.Administrador,
  PerfilUsuario.Gerente,
  PerfilUsuario.Vendedor,
  PerfilUsuario.Consultor,
] as const;

export const MatrizAlertas: Record<NotificacaoTipoValor, PoliticaAlerta> = {
  [NotificacaoTipo.PosVenda]: {
    area: AreaAcesso.Vendas,
    perfisPermitidos: PERFIS_COMERCIAIS,
  },
  [NotificacaoTipo.AniversarioCliente]: {
    area: AreaAcesso.Crm,
    perfisPermitidos: [
      PerfilUsuario.Diretor,
      PerfilUsuario.Administrador,
      PerfilUsuario.Gerente,
      PerfilUsuario.Vendedor,
      PerfilUsuario.Consultor,
    ],
  },
  [NotificacaoTipo.DataComemorativa]: {
    area: AreaAcesso.Crm,
    perfisPermitidos: [...PERFIS_COMERCIAIS, PerfilUsuario.Consultor],
  },
  [NotificacaoTipo.ClienteSemComprar]: {
    area: AreaAcesso.Crm,
    perfisPermitidos: [
      PerfilUsuario.Diretor,
      PerfilUsuario.Administrador,
      PerfilUsuario.Gerente,
      PerfilUsuario.Vendedor,
      PerfilUsuario.Consultor,
    ],
  },
  [NotificacaoTipo.AniversariantesCarteira]: {
    area: AreaAcesso.Crm,
    perfisPermitidos: [
      PerfilUsuario.Vendedor,
      PerfilUsuario.Consultor,
      PerfilUsuario.Diretor,
      PerfilUsuario.Administrador,
      PerfilUsuario.Gerente,
    ],
  },
  [NotificacaoTipo.ComissoesMes]: {
    area: AreaAcesso.Vendas,
    perfisPermitidos: [
      PerfilUsuario.Vendedor,
      PerfilUsuario.Diretor,
      PerfilUsuario.Administrador,
      PerfilUsuario.Gerente,
    ],
  },
  [NotificacaoTipo.EstoqueMinimo]: {
    area: AreaAcesso.Estoque,
    perfisPermitidos: PERFIS_ESTOQUE,
  },
  [NotificacaoTipo.ValidadeProxima]: {
    area: AreaAcesso.Estoque,
    perfisPermitidos: [
      PerfilUsuario.Diretor,
      PerfilUsuario.Administrador,
      PerfilUsuario.Gerente,
      PerfilUsuario.Administrativo,
    ],
  },
  [NotificacaoTipo.BoletoCliente]: {
    area: AreaAcesso.Financeiro,
    perfisPermitidos: PERFIS_FINANCEIROS,
  },
  [NotificacaoTipo.BoletoFornecedor]: {
    area: AreaAcesso.Financeiro,
    perfisPermitidos: PERFIS_FINANCEIROS,
  },
  [NotificacaoTipo.ContasVencer3Dias]: {
    area: AreaAcesso.Financeiro,
    perfisPermitidos: PERFIS_FINANCEIROS,
  },
  [NotificacaoTipo.ContasVencer7Dias]: {
    area: AreaAcesso.Financeiro,
    perfisPermitidos: PERFIS_FINANCEIROS,
  },
  [NotificacaoTipo.ContasVencer15Dias]: {
    area: AreaAcesso.Financeiro,
    perfisPermitidos: PERFIS_FINANCEIROS,
  },
  [NotificacaoTipo.ContasVencidas]: {
    area: AreaAcesso.Financeiro,
    perfisPermitidos: PERFIS_FINANCEIROS,
  },
  [NotificacaoTipo.MetasLoja]: {
    area: AreaAcesso.Bi,
    perfisPermitidos: [
      PerfilUsuario.Gerente,
      PerfilUsuario.Diretor,
      PerfilUsuario.Administrador,
    ],
  },
  [NotificacaoTipo.PedidoAguardandoAprovacao]: {
    area: AreaAcesso.Vendas,
    perfisPermitidos: PERFIS_APROVACAO,
  },
  [NotificacaoTipo.PedidoRetido]: {
    area: AreaAcesso.Vendas,
    perfisPermitidos: PERFIS_APROVACAO,
  },
  [NotificacaoTipo.PedidoAprovado]: {
    area: AreaAcesso.Vendas,
    perfisPermitidos: [
      ...PERFIS_COMERCIAIS,
      PerfilUsuario.Operacional,
      PerfilUsuario.Administrativo,
    ],
  },
  [NotificacaoTipo.PedidoRecusado]: {
    area: AreaAcesso.Vendas,
    perfisPermitidos: [
      ...PERFIS_COMERCIAIS,
      PerfilUsuario.Operacional,
      PerfilUsuario.Administrativo,
    ],
  },
  [NotificacaoTipo.PedidoExpirado]: {
    area: AreaAcesso.Vendas,
    perfisPermitidos: [
      ...PERFIS_COMERCIAIS,
      PerfilUsuario.Operacional,
      PerfilUsuario.Administrativo,
    ],
  },
  [NotificacaoTipo.RevisaoLimiteCredito]: {
    area: AreaAcesso.Financeiro,
    perfisPermitidos: PERFIS_FINANCEIROS,
  },
};

export function politicaDoAlerta(
  tipo: string,
): PoliticaAlerta | null {
  if (tipo in MatrizAlertas) {
    return MatrizAlertas[tipo as NotificacaoTipoValor];
  }

  return null;
}

export function perfilPodeReceberAlerta(
  tipo: string,
  perfil: PerfilUsuarioValor | null | undefined,
): boolean {
  if (!perfil) {
    return false;
  }

  const politica = politicaDoAlerta(tipo);
  if (!politica) {
    return (
      perfil === PerfilUsuario.Diretor ||
      perfil === PerfilUsuario.Administrador ||
      perfil === PerfilUsuario.Gerente
    );
  }

  return (politica.perfisPermitidos as readonly PerfilUsuarioValor[]).includes(
    perfil,
  );
}

export function areaDoAlerta(tipo: string): AreaAcessoValor | null {
  return politicaDoAlerta(tipo)?.area ?? null;
}

export { PERFIS_CARTEIRA };
