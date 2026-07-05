import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    publica?: boolean;
    convidado?: boolean;
    requerAuth?: boolean;
    requerEmpresa?: boolean;
    onboarding?: boolean;
    layout?: 'auth' | 'main' | 'onboarding';
    breadcrumb?: string;
    breadcrumbPais?: string[];
    permissao?: string;
  }
}
