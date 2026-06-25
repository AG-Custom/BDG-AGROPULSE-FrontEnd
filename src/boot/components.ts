import type { App } from 'vue';

import AppPageHeader from 'components/shared/AppPageHeader.vue';

export function registerGlobalComponents(app: App): void {
  app.component('AppPageHeader', AppPageHeader);
}
