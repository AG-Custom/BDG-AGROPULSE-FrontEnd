import { useComprasConfig } from 'composables/useComprasConfig';
import { usePerfilSafras } from 'composables/usePerfilSafras';
import { usePermissao } from 'composables/usePermissao';
import {
  NAVEGACAO_MODULOS,
  type FlagNavegacao,
  type ItemNavegacao,
  type ModuloNavegacao,
} from 'constants/navegacao-modulos';
import { Permissoes } from 'constants/permissoes';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export interface ModuloNavegacaoVisivel extends ModuloNavegacao {
  filhosVisiveis: ItemNavegacao[];
  /** Rota do primeiro filho visível (destino ao clicar no módulo). */
  routeNameDestino: string;
}

function pathCorresponde(path: string, prefixo: string): boolean {
  if (prefixo === '/') {
    return path === '/' || path === '';
  }

  return path === prefixo || path.startsWith(`${prefixo}/`);
}

export function useNavegacaoModulos() {
  const route = useRoute();
  const router = useRouter();
  const { possuiPermissao } = usePermissao();
  const { config, carregar: carregarComprasConfig } = useComprasConfig();
  const { isRevenda, isIndustria, carregarPerfil } = usePerfilSafras();

  const fluxoCompletoHabilitado = computed(
    () => config.value?.fluxoCompletoHabilitado === true,
  );

  function flagOk(flag: FlagNavegacao | undefined): boolean {
    if (!flag) {
      return true;
    }

    switch (flag) {
      case 'fluxoCompleto':
        return fluxoCompletoHabilitado.value;
      case 'revenda':
        return isRevenda.value;
      case 'industria':
        return isIndustria.value;
      case 'industriaProducao':
        return isIndustria.value;
      default:
        return true;
    }
  }

  function itemVisivel(item: ItemNavegacao): boolean {
    if (item.permissao && !possuiPermissao(item.permissao)) {
      return false;
    }

    return flagOk(item.flag);
  }

  const modulosVisiveis = computed<ModuloNavegacaoVisivel[]>(() =>
    NAVEGACAO_MODULOS.map((modulo) => {
      const filhosVisiveis = modulo.filhos.filter(itemVisivel);
      return {
        ...modulo,
        filhosVisiveis,
        routeNameDestino: filhosVisiveis[0]?.routeName ?? '',
      };
    }).filter((modulo) => modulo.filhosVisiveis.length > 0),
  );

  function filhoAtivo(item: ItemNavegacao): boolean {
    try {
      const resolved = router.resolve({ name: item.routeName });
      return pathCorresponde(route.path, resolved.path);
    } catch {
      return route.name === item.routeName;
    }
  }

  /**
   * Prefixo mais longo vence (ex.: `/financeiro/contas-receber` antes de `/financeiro`).
   * `/` só casa path exato.
   */
  const moduloAtivo = computed<ModuloNavegacaoVisivel | null>(() => {
    const candidatos = modulosVisiveis.value.flatMap((modulo) =>
      modulo.pathPrefixes.map((prefixo) => ({ modulo, prefixo })),
    );

    candidatos.sort((a, b) => b.prefixo.length - a.prefixo.length);

    for (const { modulo, prefixo } of candidatos) {
      if (pathCorresponde(route.path, prefixo)) {
        return modulo;
      }
    }

    return null;
  });

  const filhosVisiveis = computed(() => moduloAtivo.value?.filhosVisiveis ?? []);

  const mostrarSubnav = computed(() => filhosVisiveis.value.length > 1);

  onMounted(() => {
    if (possuiPermissao(Permissoes.Compras.Visualizar)) {
      void carregarComprasConfig();
    }
    void carregarPerfil();
  });

  return {
    modulosVisiveis,
    moduloAtivo,
    filhosVisiveis,
    mostrarSubnav,
    filhoAtivo,
  };
}
