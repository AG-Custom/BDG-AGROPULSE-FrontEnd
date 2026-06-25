import { storeToRefs } from 'pinia';

import { useAuthStore } from 'stores/auth.store';

export function useAuth() {
  const store = useAuthStore();
  const { autenticado, usuario, permissoes } = storeToRefs(store);

  return {
    autenticado,
    usuario,
    permissoes,
    entrarSessaoLocal: store.entrarSessaoLocal,
    possuiPermissao: store.possuiPermissao,
    sair: store.sair,
    verificar: store.verificar,
  };
}
