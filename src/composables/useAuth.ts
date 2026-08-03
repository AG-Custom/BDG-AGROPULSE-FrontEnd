import { storeToRefs } from 'pinia';

import { useAuthStore } from 'stores/auth.store';

export function useAuth() {
  const store = useAuthStore();
  const {
    autenticado,
    usuario,
    permissoes,
    empresaId,
    unidadeId,
    requiresUnidadeSelection,
    requiresEmpresaSelection,
    isSuperHost,
    unidadesDisponiveis,
    precisaOnboarding,
    precisaConsolePlataforma,
    precisaSelecionarUnidade,
    temEmpresa,
    temUnidade,
  } = storeToRefs(store);

  return {
    autenticado,
    usuario,
    permissoes,
    empresaId,
    unidadeId,
    requiresUnidadeSelection,
    requiresEmpresaSelection,
    isSuperHost,
    unidadesDisponiveis,
    precisaOnboarding,
    precisaConsolePlataforma,
    precisaSelecionarUnidade,
    temEmpresa,
    temUnidade,
    entrar: store.entrar,
    confirmarEmail: store.confirmarEmail,
    definirSenhaPrimeiroAcesso: store.definirSenhaPrimeiroAcesso,
    renovarTokens: store.renovarTokens,
    listarUnidades: store.listarUnidades,
    selecionarUnidade: store.selecionarUnidade,
    selecionarEmpresa: store.selecionarEmpresa,
    possuiPermissao: store.possuiPermissao,
    sair: store.sair,
    verificar: store.verificar,
  };
}
