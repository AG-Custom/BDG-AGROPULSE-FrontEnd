import type { App } from 'vue';

import AppPageHeader from 'components/shared/AppPageHeader.vue';
import AgroBtn from 'components/ui/AgroBtn.vue';

export function registerGlobalComponents(app: App): void {
  app.component('AppPageHeader', AppPageHeader);
  app.component('AgroBtn', AgroBtn);
}
