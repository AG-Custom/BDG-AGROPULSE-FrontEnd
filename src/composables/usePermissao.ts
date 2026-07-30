import { useAuth } from 'composables/useAuth';
import type { AreaAcessoValor } from 'constants/areas-acesso';
import { nivelAreaDoPerfil } from 'constants/matriz-permissoes';
import {
  NivelAcesso,
  nivelSuficiente,
  type NivelAcessoValor,
} from 'constants/niveis-acesso';
import { computed } from 'vue';

export function usePermissao() {
  const { possuiPermissao, usuario } = useAuth();

  const perfil = computed(() => usuario.value?.perfil ?? null);

  function nivelArea(area: AreaAcessoValor): NivelAcessoValor {
    return nivelAreaDoPerfil(perfil.value, area);
  }

  function pode(area: AreaAcessoValor, nivelMinimo: NivelAcessoValor): boolean {
    return nivelSuficiente(nivelArea(area), nivelMinimo);
  }

  function temAcessoModulo(area: AreaAcessoValor): boolean {
    return nivelArea(area) !== NivelAcesso.SemAcesso;
  }

  return {
    possuiPermissao,
    nivelArea,
    pode,
    temAcessoModulo,
  };
}
