import { TipoOperacaoSafras, type TipoOperacaoSafrasValor } from 'constants/enums';
import { safrasService } from 'services/safras.service';
import type { PerfilSafrasDto } from 'types/dtos/safras.dto';
import { computed, ref } from 'vue';

const perfil = ref<PerfilSafrasDto | null>(null);
const carregandoPerfil = ref(false);
const perfilCarregado = ref(false);
const perfilFalhou = ref(false);

export function usePerfilSafras() {
  const tipoOperacao = computed<TipoOperacaoSafrasValor | null>(
    () => perfil.value?.tipoOperacao ?? null,
  );

  const isRevenda = computed(
    () => perfilFalhou.value || tipoOperacao.value === TipoOperacaoSafras.Revenda,
  );

  const isIndustria = computed(
    () => perfilFalhou.value || tipoOperacao.value === TipoOperacaoSafras.Industria,
  );

  async function carregarPerfil(forcar = false): Promise<void> {
    if (perfilCarregado.value && !forcar) return;
    carregandoPerfil.value = true;
    try {
      perfil.value = await safrasService.obterPerfil();
      perfilFalhou.value = false;
      perfilCarregado.value = true;
    } catch {
      perfilFalhou.value = true;
      perfilCarregado.value = true;
      perfil.value = null;
    } finally {
      carregandoPerfil.value = false;
    }
  }

  return {
    perfil,
    tipoOperacao,
    isRevenda,
    isIndustria,
    perfilFalhou,
    carregandoPerfil,
    carregarPerfil,
  };
}
