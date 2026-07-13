import type { PerfilUsuarioValor } from 'constants/enums';

export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuarioValor | null;
  permissoes: string[];
}
