import { useAuth } from 'composables/useAuth';
import { PerfilUsuario } from 'constants/enums';
import { computed } from 'vue';

export function usePerfilAtual() {
  const { usuario } = useAuth();

  const perfil = computed(() => usuario.value?.perfil ?? null);

  const ehVendedor = computed(() => perfil.value === PerfilUsuario.Vendedor);

  const ehConsultor = computed(() => perfil.value === PerfilUsuario.Consultor);

  const carteiraRestrita = computed(
    () => ehVendedor.value || ehConsultor.value,
  );

  return {
    usuario,
    perfil,
    ehVendedor,
    ehConsultor,
    carteiraRestrita,
  };
}
