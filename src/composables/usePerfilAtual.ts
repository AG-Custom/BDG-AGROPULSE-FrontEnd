import { useAuth } from 'composables/useAuth';
import { PerfilUsuario } from 'constants/enums';
import { computed } from 'vue';

export function usePerfilAtual() {
  const { usuario } = useAuth();

  const perfil = computed(() => usuario.value?.perfil ?? null);

  const ehVendedor = computed(() => perfil.value === PerfilUsuario.Vendedor);

  return {
    usuario,
    perfil,
    ehVendedor,
  };
}
