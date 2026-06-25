import { useAuth } from './useAuth';

export function usePermissao() {
  const { possuiPermissao } = useAuth();

  return { possuiPermissao };
}
