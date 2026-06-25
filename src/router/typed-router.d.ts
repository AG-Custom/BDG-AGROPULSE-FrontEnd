import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    publica?: boolean;
    breadcrumb?: string;
    breadcrumbPais?: string[];
    permissao?: string;
  }
}
