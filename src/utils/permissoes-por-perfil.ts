import {
  ModulosPorArea,
  type AreaAcessoValor,
  type ModuloPermissao,
} from 'constants/areas-acesso';
import {
  PerfilUsuario,
  type PerfilUsuarioValor,
} from 'constants/enums';
import {
  MatrizPermissoesPorPerfil,
  OverridesSlugPorPerfil,
} from 'constants/matriz-permissoes';
import {
  NivelAcesso,
  niveisIncluidos,
  ordemNivel,
  type NivelAcessoValor,
} from 'constants/niveis-acesso';
import { Permissoes } from 'constants/permissoes';

function slugsDoModulo(
  modulo: ModuloPermissao,
  nivel: NivelAcessoValor,
): string[] {
  const incluidos = niveisIncluidos(nivel);
  const slugs: string[] = [];

  for (const nivelIncluido of incluidos) {
    if (nivelIncluido === NivelAcesso.Visualizar) {
      slugs.push(modulo.Visualizar);
      continue;
    }

    if (nivelIncluido === NivelAcesso.Editar && modulo.Editar) {
      slugs.push(modulo.Editar);
      continue;
    }

    if (nivelIncluido === NivelAcesso.Aprovar && modulo.Aprovar) {
      slugs.push(modulo.Aprovar);
      continue;
    }

    if (nivelIncluido === NivelAcesso.Configurar && modulo.Configurar) {
      slugs.push(modulo.Configurar);
    }
  }

  return slugs;
}

function ehModuloAprovacoes(modulo: ModuloPermissao): boolean {
  return modulo.Visualizar === Permissoes.Aprovacoes.Visualizar;
}

function nivelEfetivoAprovacoes(
  perfil: PerfilUsuarioValor,
  nivelArea: NivelAcessoValor,
): NivelAcessoValor {
  if (ordemNivel(nivelArea) >= ordemNivel(NivelAcesso.Aprovar)) {
    return nivelArea;
  }

  if (
    perfil === PerfilUsuario.Administrativo ||
    perfil === PerfilUsuario.Diretor ||
    perfil === PerfilUsuario.Administrador ||
    perfil === PerfilUsuario.Gerente
  ) {
    return NivelAcesso.Visualizar;
  }

  return NivelAcesso.SemAcesso;
}

const PERMISSOES_BASE = [
  Permissoes.Dashboard.Visualizar,
  Permissoes.Notificacoes.Visualizar,
] as const;

export function resolverPermissoesPorPerfil(
  perfil: PerfilUsuarioValor | null | undefined,
): string[] {
  if (!perfil) {
    return [...PERMISSOES_BASE];
  }

  const matriz = MatrizPermissoesPorPerfil[perfil];
  const permissoes = new Set<string>(PERMISSOES_BASE);

  for (const area of Object.keys(matriz) as AreaAcessoValor[]) {
    const nivel = matriz[area];
    if (nivel === NivelAcesso.SemAcesso) {
      continue;
    }

    for (const modulo of ModulosPorArea[area]) {
      const nivelModulo = ehModuloAprovacoes(modulo)
        ? nivelEfetivoAprovacoes(perfil, nivel)
        : nivel;

      if (nivelModulo === NivelAcesso.SemAcesso) {
        continue;
      }

      for (const slug of slugsDoModulo(modulo, nivelModulo)) {
        permissoes.add(slug);
      }
    }
  }

  for (const slug of OverridesSlugPorPerfil[perfil] ?? []) {
    permissoes.add(slug);
  }

  return Array.from(permissoes);
}
