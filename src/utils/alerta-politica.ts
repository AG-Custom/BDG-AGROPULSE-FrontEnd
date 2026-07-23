import { AreaAcesso, type AreaAcessoValor } from 'constants/areas-acesso';
import {
  NotificacaoTipo,
  PerfilUsuario,
  type PerfilUsuarioValor,
} from 'constants/enums';
import {
  areaDoAlerta,
  perfilPodeReceberAlerta,
} from 'constants/matriz-alertas';
import { nivelAreaDoPerfil } from 'constants/matriz-permissoes';
import { NivelAcesso } from 'constants/niveis-acesso';
import type { NotificacaoDto } from 'types/dtos/notificacao.dto';

const AREA_ALERTA_GERENCIAL: Record<string, AreaAcessoValor> = {
  MetaDesvio: AreaAcesso.Bi,
  MargemBaixa: AreaAcesso.Bi,
  InadimplenciaCritica: AreaAcesso.Financeiro,
  [NotificacaoTipo.EstoqueMinimo]: AreaAcesso.Estoque,
  [NotificacaoTipo.MetasLoja]: AreaAcesso.Bi,
  [NotificacaoTipo.ContasVencidas]: AreaAcesso.Financeiro,
};

const PERFIS_FINANCEIROS: readonly PerfilUsuarioValor[] = [
  PerfilUsuario.Diretor,
  PerfilUsuario.Administrador,
  PerfilUsuario.Gerente,
  PerfilUsuario.Administrativo,
];

const PERFIS_BI: readonly PerfilUsuarioValor[] = [
  PerfilUsuario.Diretor,
  PerfilUsuario.Administrador,
  PerfilUsuario.Gerente,
  PerfilUsuario.Administrativo,
];

const PERFIS_ESTOQUE: readonly PerfilUsuarioValor[] = [
  PerfilUsuario.Diretor,
  PerfilUsuario.Administrador,
  PerfilUsuario.Gerente,
  PerfilUsuario.Administrativo,
  PerfilUsuario.Operacional,
];

const PERFIS_GESTAO: readonly PerfilUsuarioValor[] = [
  PerfilUsuario.Diretor,
  PerfilUsuario.Administrador,
  PerfilUsuario.Gerente,
];

function areaEfetivaDoAlerta(tipo: string): AreaAcessoValor | null {
  return areaDoAlerta(tipo) ?? AREA_ALERTA_GERENCIAL[tipo] ?? null;
}

export function usuarioPodeVerAlerta(
  tipo: string,
  perfil: PerfilUsuarioValor | null | undefined,
): boolean {
  if (!perfil) {
    return false;
  }

  const area = areaEfetivaDoAlerta(tipo);

  if (areaDoAlerta(tipo)) {
    if (!perfilPodeReceberAlerta(tipo, perfil)) {
      return false;
    }
  } else if (area === AreaAcesso.Financeiro) {
    if (!PERFIS_FINANCEIROS.includes(perfil)) {
      return false;
    }
  } else if (area === AreaAcesso.Bi) {
    if (!PERFIS_BI.includes(perfil)) {
      return false;
    }
  } else if (area === AreaAcesso.Estoque) {
    if (!PERFIS_ESTOQUE.includes(perfil)) {
      return false;
    }
  } else if (!PERFIS_GESTAO.includes(perfil)) {
    return false;
  }

  if (!area) {
    return true;
  }

  return nivelAreaDoPerfil(perfil, area) !== NivelAcesso.SemAcesso;
}

export function filtrarNotificacoesPorPolitica(
  notificacoes: NotificacaoDto[],
  perfil: PerfilUsuarioValor | null | undefined,
): NotificacaoDto[] {
  return notificacoes.filter((item) =>
    usuarioPodeVerAlerta(item.tipo, perfil),
  );
}

export function filtrarAlertasGerenciaisPorPolitica<
  T extends { tipo: string },
>(alertas: T[], perfil: PerfilUsuarioValor | null | undefined): T[] {
  return alertas.filter((item) => usuarioPodeVerAlerta(item.tipo, perfil));
}

export function temAcessoArea(
  perfil: PerfilUsuarioValor | null | undefined,
  area: AreaAcessoValor,
): boolean {
  return nivelAreaDoPerfil(perfil, area) !== NivelAcesso.SemAcesso;
}
