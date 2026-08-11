import { useAuth } from 'composables/useAuth';
import { permissaoGranularService } from 'services/permissao-granular.service';
import { computed, onMounted, ref } from 'vue';

const cacheVerCustos = ref<boolean | null>(null);
const cacheCarregando = ref(false);

export function useVerCustos() {
  const { usuario, isSuperHost } = useAuth();
  const carregando = cacheCarregando;
  const verCustos = computed(
    () => isSuperHost.value || cacheVerCustos.value === true,
  );

  async function carregar(): Promise<boolean> {
    if (isSuperHost.value) {
      cacheVerCustos.value = true;
      return true;
    }

    const usuarioId = usuario.value?.id;

    if (!usuarioId) {
      cacheVerCustos.value = false;
      return false;
    }

    if (cacheVerCustos.value !== null) {
      return cacheVerCustos.value;
    }

    carregando.value = true;

    try {
      const permissao = await permissaoGranularService.obter(usuarioId);
      cacheVerCustos.value = permissao.verCustos;
      return permissao.verCustos;
    } catch {
      cacheVerCustos.value = false;
      return false;
    } finally {
      carregando.value = false;
    }
  }

  function invalidarCache(): void {
    cacheVerCustos.value = null;
  }

  onMounted(() => {
    if (isSuperHost.value) {
      cacheVerCustos.value = true;
      return;
    }

    if (cacheVerCustos.value === null) {
      void carregar();
    }
  });

  return {
    verCustos,
    carregando,
    carregar,
    invalidarCache,
  };
}
