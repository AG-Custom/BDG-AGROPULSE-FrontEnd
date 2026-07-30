import { AreaAcesso, type AreaAcessoValor } from 'constants/areas-acesso';
import { PerfilUsuario, type PerfilUsuarioValor } from 'constants/enums';
import { NivelAcesso, type NivelAcessoValor } from 'constants/niveis-acesso';
import { Permissoes } from 'constants/permissoes';

type MatrizPerfil = Record<AreaAcessoValor, NivelAcessoValor>;

const CONFIGURAR_TUDO: MatrizPerfil = {
  [AreaAcesso.Cadastros]: NivelAcesso.Configurar,
  [AreaAcesso.Estoque]: NivelAcesso.Configurar,
  [AreaAcesso.Compras]: NivelAcesso.Configurar,
  [AreaAcesso.Vendas]: NivelAcesso.Configurar,
  [AreaAcesso.Producao]: NivelAcesso.Configurar,
  [AreaAcesso.Financeiro]: NivelAcesso.Configurar,
  [AreaAcesso.Fiscal]: NivelAcesso.Configurar,
  [AreaAcesso.Safras]: NivelAcesso.Configurar,
  [AreaAcesso.Logistica]: NivelAcesso.Configurar,
  [AreaAcesso.Rh]: NivelAcesso.Configurar,
  [AreaAcesso.Manutencao]: NivelAcesso.Configurar,
  [AreaAcesso.Crm]: NivelAcesso.Configurar,
  [AreaAcesso.Bi]: NivelAcesso.Configurar,
  [AreaAcesso.Configuracoes]: NivelAcesso.Configurar,
};

const MATRIZ_GERENTE: MatrizPerfil = {
  [AreaAcesso.Cadastros]: NivelAcesso.Editar,
  [AreaAcesso.Estoque]: NivelAcesso.Editar,
  [AreaAcesso.Compras]: NivelAcesso.Aprovar,
  [AreaAcesso.Vendas]: NivelAcesso.Aprovar,
  [AreaAcesso.Producao]: NivelAcesso.Editar,
  [AreaAcesso.Financeiro]: NivelAcesso.Visualizar,
  [AreaAcesso.Fiscal]: NivelAcesso.Visualizar,
  [AreaAcesso.Safras]: NivelAcesso.Editar,
  [AreaAcesso.Logistica]: NivelAcesso.Editar,
  [AreaAcesso.Rh]: NivelAcesso.Visualizar,
  [AreaAcesso.Manutencao]: NivelAcesso.Editar,
  [AreaAcesso.Crm]: NivelAcesso.Editar,
  [AreaAcesso.Bi]: NivelAcesso.Editar,
  [AreaAcesso.Configuracoes]: NivelAcesso.SemAcesso,
};

const MATRIZ_ADMINISTRATIVO: MatrizPerfil = {
  [AreaAcesso.Cadastros]: NivelAcesso.Visualizar,
  [AreaAcesso.Estoque]: NivelAcesso.Visualizar,
  [AreaAcesso.Compras]: NivelAcesso.Visualizar,
  [AreaAcesso.Vendas]: NivelAcesso.Visualizar,
  [AreaAcesso.Producao]: NivelAcesso.SemAcesso,
  [AreaAcesso.Financeiro]: NivelAcesso.Editar,
  [AreaAcesso.Fiscal]: NivelAcesso.Editar,
  [AreaAcesso.Safras]: NivelAcesso.SemAcesso,
  [AreaAcesso.Logistica]: NivelAcesso.SemAcesso,
  [AreaAcesso.Rh]: NivelAcesso.SemAcesso,
  [AreaAcesso.Manutencao]: NivelAcesso.SemAcesso,
  [AreaAcesso.Crm]: NivelAcesso.SemAcesso,
  [AreaAcesso.Bi]: NivelAcesso.Editar,
  [AreaAcesso.Configuracoes]: NivelAcesso.SemAcesso,
};

const MATRIZ_OPERACIONAL: MatrizPerfil = {
  [AreaAcesso.Cadastros]: NivelAcesso.Editar,
  [AreaAcesso.Estoque]: NivelAcesso.Editar,
  [AreaAcesso.Compras]: NivelAcesso.Editar,
  [AreaAcesso.Vendas]: NivelAcesso.Editar,
  [AreaAcesso.Producao]: NivelAcesso.Editar,
  [AreaAcesso.Financeiro]: NivelAcesso.Visualizar,
  [AreaAcesso.Fiscal]: NivelAcesso.Editar,
  [AreaAcesso.Safras]: NivelAcesso.Visualizar,
  [AreaAcesso.Logistica]: NivelAcesso.Editar,
  [AreaAcesso.Rh]: NivelAcesso.SemAcesso,
  [AreaAcesso.Manutencao]: NivelAcesso.Visualizar,
  [AreaAcesso.Crm]: NivelAcesso.Visualizar,
  [AreaAcesso.Bi]: NivelAcesso.SemAcesso,
  [AreaAcesso.Configuracoes]: NivelAcesso.SemAcesso,
};

const MATRIZ_VENDEDOR: MatrizPerfil = {
  [AreaAcesso.Cadastros]: NivelAcesso.Visualizar,
  [AreaAcesso.Estoque]: NivelAcesso.Visualizar,
  [AreaAcesso.Compras]: NivelAcesso.SemAcesso,
  [AreaAcesso.Vendas]: NivelAcesso.Editar,
  [AreaAcesso.Producao]: NivelAcesso.SemAcesso,
  [AreaAcesso.Financeiro]: NivelAcesso.SemAcesso,
  [AreaAcesso.Fiscal]: NivelAcesso.SemAcesso,
  [AreaAcesso.Safras]: NivelAcesso.SemAcesso,
  [AreaAcesso.Logistica]: NivelAcesso.SemAcesso,
  [AreaAcesso.Rh]: NivelAcesso.SemAcesso,
  [AreaAcesso.Manutencao]: NivelAcesso.SemAcesso,
  [AreaAcesso.Crm]: NivelAcesso.Editar,
  [AreaAcesso.Bi]: NivelAcesso.Visualizar,
  [AreaAcesso.Configuracoes]: NivelAcesso.SemAcesso,
};

const MATRIZ_CONSULTOR: MatrizPerfil = {
  [AreaAcesso.Cadastros]: NivelAcesso.Visualizar,
  [AreaAcesso.Estoque]: NivelAcesso.Visualizar,
  [AreaAcesso.Compras]: NivelAcesso.SemAcesso,
  [AreaAcesso.Vendas]: NivelAcesso.SemAcesso,
  [AreaAcesso.Producao]: NivelAcesso.Visualizar,
  [AreaAcesso.Financeiro]: NivelAcesso.SemAcesso,
  [AreaAcesso.Fiscal]: NivelAcesso.SemAcesso,
  [AreaAcesso.Safras]: NivelAcesso.Editar,
  [AreaAcesso.Logistica]: NivelAcesso.SemAcesso,
  [AreaAcesso.Rh]: NivelAcesso.SemAcesso,
  [AreaAcesso.Manutencao]: NivelAcesso.SemAcesso,
  [AreaAcesso.Crm]: NivelAcesso.Editar,
  [AreaAcesso.Bi]: NivelAcesso.Visualizar,
  [AreaAcesso.Configuracoes]: NivelAcesso.SemAcesso,
};

const MATRIZ_RH: MatrizPerfil = {
  [AreaAcesso.Cadastros]: NivelAcesso.SemAcesso,
  [AreaAcesso.Estoque]: NivelAcesso.SemAcesso,
  [AreaAcesso.Compras]: NivelAcesso.SemAcesso,
  [AreaAcesso.Vendas]: NivelAcesso.SemAcesso,
  [AreaAcesso.Producao]: NivelAcesso.SemAcesso,
  [AreaAcesso.Financeiro]: NivelAcesso.SemAcesso,
  [AreaAcesso.Fiscal]: NivelAcesso.SemAcesso,
  [AreaAcesso.Safras]: NivelAcesso.SemAcesso,
  [AreaAcesso.Logistica]: NivelAcesso.SemAcesso,
  [AreaAcesso.Rh]: NivelAcesso.Editar,
  [AreaAcesso.Manutencao]: NivelAcesso.SemAcesso,
  [AreaAcesso.Crm]: NivelAcesso.SemAcesso,
  [AreaAcesso.Bi]: NivelAcesso.Visualizar,
  [AreaAcesso.Configuracoes]: NivelAcesso.SemAcesso,
};

export const MatrizPermissoesPorPerfil: Record<PerfilUsuarioValor, MatrizPerfil> =
  {
    [PerfilUsuario.Diretor]: CONFIGURAR_TUDO,
    [PerfilUsuario.Administrador]: CONFIGURAR_TUDO,
    [PerfilUsuario.Gerente]: MATRIZ_GERENTE,
    [PerfilUsuario.Administrativo]: MATRIZ_ADMINISTRATIVO,
    [PerfilUsuario.Operacional]: MATRIZ_OPERACIONAL,
    [PerfilUsuario.Vendedor]: MATRIZ_VENDEDOR,
    [PerfilUsuario.Consultor]: MATRIZ_CONSULTOR,
    [PerfilUsuario.Rh]: MATRIZ_RH,
  };

/**
 * Slugs extras além do nível da área (ex.: Vendedor edita clientes
 * sem receber TabelasPreco.Editar via Cadastros.Editar).
 */
export const OverridesSlugPorPerfil: Partial<
  Record<PerfilUsuarioValor, readonly string[]>
> = {
  [PerfilUsuario.Vendedor]: [Permissoes.Clientes.Editar],
};

export function nivelAreaDoPerfil(
  perfil: PerfilUsuarioValor | null | undefined,
  area: AreaAcessoValor,
): NivelAcessoValor {
  if (!perfil) {
    return NivelAcesso.SemAcesso;
  }

  return MatrizPermissoesPorPerfil[perfil][area];
}
