import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import 'css/app.scss';

import { Notify, Quasar } from 'quasar';
import { createApp } from 'vue';

import App from './App.vue';
import { registerBoot } from './boot';
import { router } from './router';
import { pinia } from './stores';

const app = createApp(App);

app.use(Quasar, {
  plugins: {
    Notify,
  },
  config: {
    notify: {
      position: 'top-right',
      timeout: 4000,
    },
  },
});
app.use(pinia);
app.use(router);

registerBoot(app);

app.mount('#app');
