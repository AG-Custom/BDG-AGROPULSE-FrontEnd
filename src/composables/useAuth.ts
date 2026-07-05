import { storeToRefs } from 'pinia';

import { useAuthStore } from 'stores/auth.store';

export function useAuth() {
  const store = useAuthStore();
  const { autenticado, usuario, permissoes, empresaId, unidadeId, precisaOnboarding, temEmpresa } =
    storeToRefs(store);

  return {
    autenticado,
    usuario,
    permissoes,
    empresaId,
    unidadeId,
    precisaOnboarding,
    temEmpresa,
    entrar: store.entrar,
    cadastrar: store.cadastrar,
    confirmarEmail: store.confirmarEmail,
    renovarTokens: store.renovarTokens,
    possuiPermissao: store.possuiPermissao,
    sair: store.sair,
    verificar: store.verificar,
  };
}
