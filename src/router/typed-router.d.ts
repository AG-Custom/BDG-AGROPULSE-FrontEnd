import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    publica?: boolean;
    convidado?: boolean;
    requerAuth?: boolean;
    requerEmpresa?: boolean;
    requerUnidade?: boolean;
    requerSuperHost?: boolean;
    plataforma?: boolean;
    selecaoUnidade?: boolean;
    layout?: 'auth' | 'main' | 'onboarding';
    breadcrumb?: string;
    breadcrumbPais?: string[];
    permissao?: string;
    requerIndustria?: boolean;
  }
}
