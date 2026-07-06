import { messageService } from 'services/message.service';
import { Notify } from 'quasar';
import { useRoute } from 'vue-router';

function usarSwal(route: ReturnType<typeof useRoute>): boolean {
  return !route.matched.some((registro) => registro.meta.convidado || registro.meta.layout === 'auth');
}

export function useNotificacao() {
  const route = useRoute();
  const swal = usarSwal(route);

  function sucesso(message: string): void {
    if (swal) {
      messageService.sucesso(message);
      return;
    }

    Notify.create({
      type: 'positive',
      message,
      position: 'top-right',
      timeout: 4000,
    });
  }

  function erro(message: string): void {
    if (swal) {
      messageService.erro(message);
      return;
    }

    Notify.create({
      type: 'negative',
      message,
      position: 'top-right',
      timeout: 6000,
    });
  }

  return { sucesso, erro };
}
