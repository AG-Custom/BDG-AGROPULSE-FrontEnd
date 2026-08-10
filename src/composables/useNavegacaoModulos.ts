import { useComprasConfig } from 'composables/useComprasConfig';
import { usePerfilSafras } from 'composables/usePerfilSafras';
import { usePermissao } from 'composables/usePermissao';
import {
  NAVEGACAO_DASHBOARD,
  NAVEGACAO_GRUPOS,
  NAVEGACAO_MODULOS,
  type FlagNavegacao,
  type GrupoNavegacao,
  type ItemNavegacao,
  type ModuloNavegacao,
} from 'constants/navegacao-modulos';
import { Permissoes } from 'constants/permissoes';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export interface ModuloNavegacaoVisivel extends ModuloNavegacao {
  filhosVisiveis: ItemNavegacao[];
  routeNameDestino: string;
}

export interface GrupoNavegacaoVisivel {
  id: string;
  label: string;
  modulos: ModuloNavegacaoVisivel[];
}

export type BadgeTipoNegocio = 'revenda' | 'industria' | null;

const moduloPreferidoId = ref<string | null>(null);

function pathCorresponde(path: string, prefixo: string): boolean {
  if (prefixo === '/') {
    return path === '/' || path === '';
  }

  return path === prefixo || path.startsWith(`${prefixo}/`);
}

function melhorPrefixo(modulo: ModuloNavegacaoVisivel, path: string): string | null {
  let melhor: string | null = null;

  for (const prefixo of modulo.pathPrefixes) {
    if (!pathCorresponde(path, prefixo)) {
      continue;
    }

    if (!melhor || prefixo.length > melhor.length) {
      melhor = prefixo;
    }
  }

  return melhor;
}

export function useNavegacaoModulos() {
  const route = useRoute();
  const router = useRouter();
  const { possuiPermissao } = usePermissao();
  const { config, carregar: carregarComprasConfig } = useComprasConfig();
  const { isRevenda, isIndustria, carregarPerfil, perfilCarregado } =
    usePerfilSafras();

  const fluxoCompletoHabilitado = computed(
    () => config.value?.fluxoCompletoHabilitado === true,
  );

  const badgeTipoNegocio = computed<BadgeTipoNegocio>(() => {
    if (!perfilCarregado.value) {
      return null;
    }
    if (isIndustria.value) {
      return 'industria';
    }
    if (isRevenda.value) {
      return 'revenda';
    }
    return null;
  });

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

  function moduloParaVisivel(
    modulo: ModuloNavegacao,
  ): ModuloNavegacaoVisivel | null {
    if (!flagOk(modulo.flag)) {
      return null;
    }

    const filhosVisiveis = modulo.filhos.filter(itemVisivel);
    if (filhosVisiveis.length === 0) {
      return null;
    }

    return {
      ...modulo,
      filhosVisiveis,
      routeNameDestino: filhosVisiveis[0]?.routeName ?? '',
    };
  }

  const dashboardVisivel = computed(() =>
    moduloParaVisivel(NAVEGACAO_DASHBOARD),
  );

  const gruposVisiveis = computed<GrupoNavegacaoVisivel[]>(() =>
    NAVEGACAO_GRUPOS.map((grupo: GrupoNavegacao) => ({
      id: grupo.id,
      label: grupo.label,
      modulos: grupo.modulos
        .map(moduloParaVisivel)
        .filter((m): m is ModuloNavegacaoVisivel => m !== null),
    })).filter((grupo) => grupo.modulos.length > 0),
  );

  const modulosVisiveis = computed<ModuloNavegacaoVisivel[]>(() => {
    const lista: ModuloNavegacaoVisivel[] = [];
    if (dashboardVisivel.value) {
      lista.push(dashboardVisivel.value);
    }
    for (const grupo of gruposVisiveis.value) {
      lista.push(...grupo.modulos);
    }
    return lista;
  });

  function definirModuloPreferido(id: string): void {
    moduloPreferidoId.value = id;
  }

  const moduloAtivo = computed<ModuloNavegacaoVisivel | null>(() => {
    const path = route.path;
    const routeName = typeof route.name === 'string' ? route.name : null;

    const candidatos = modulosVisiveis.value.filter((modulo) => {
      const porPrefixo = modulo.pathPrefixes.some((prefixo) =>
        pathCorresponde(path, prefixo),
      );
      const porFilho =
        routeName != null &&
        modulo.filhosVisiveis.some((filho) => filho.routeName === routeName);

      return porPrefixo || porFilho;
    });

    if (candidatos.length === 0) {
      return null;
    }

    const preferido = candidatos.find(
      (modulo) => modulo.id === moduloPreferidoId.value,
    );
    if (preferido) {
      return preferido;
    }

    const semCadastros = candidatos.filter((modulo) => modulo.id !== 'cadastros');
    const pool = semCadastros.length > 0 ? semCadastros : candidatos;

    let escolhido: ModuloNavegacaoVisivel | null = null;
    let tamanhoPrefixo = -1;

    for (const modulo of pool) {
      const prefixo = melhorPrefixo(modulo, path);
      if (!prefixo) {
        continue;
      }

      if (prefixo.length > tamanhoPrefixo) {
        tamanhoPrefixo = prefixo.length;
        escolhido = modulo;
      }
    }

    return escolhido ?? pool[0] ?? null;
  });

  const filhosVisiveis = computed(() => moduloAtivo.value?.filhosVisiveis ?? []);

  const mostrarSubnav = computed(() => filhosVisiveis.value.length > 1);

  function queryBate(item: ItemNavegacao): boolean {
    if (!item.query) {
      return true;
    }

    return Object.entries(item.query).every(
      ([chave, valor]) => String(route.query[chave] ?? '') === valor,
    );
  }

  function filhoAtivo(item: ItemNavegacao): boolean {
    const mesmoNome = route.name === item.routeName;
    let pathOk = false;

    try {
      const resolved = router.resolve({
        name: item.routeName,
        query: item.query,
      });
      pathOk = pathCorresponde(route.path, resolved.path);
    } catch {
      pathOk = mesmoNome;
    }

    if (!pathOk && !mesmoNome) {
      return false;
    }

    if (item.query) {
      return queryBate(item);
    }

    const irmaosComQuery = filhosVisiveis.value.some(
      (f) => f.routeName === item.routeName && f.query,
    );
    if (irmaosComQuery) {
      return Object.keys(route.query).length === 0;
    }

    return true;
  }

  onMounted(() => {
    if (possuiPermissao(Permissoes.Compras.Visualizar)) {
      void carregarComprasConfig();
    }
    void carregarPerfil();
  });

  return {
    badgeTipoNegocio,
    dashboardVisivel,
    gruposVisiveis,
    modulosVisiveis,
    moduloAtivo,
    filhosVisiveis,
    mostrarSubnav,
    filhoAtivo,
    definirModuloPreferido,
    todosModulos: NAVEGACAO_MODULOS,
  };
}
