import type { App } from 'vue';

import { registerGlobalComponents } from './components';

export function registerBoot(app: App): void {
  registerGlobalComponents(app);
}
