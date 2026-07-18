import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { relatorioService } from 'services/relatorio.service';
import type {
  AlertaGerencialDto,
  DashboardKpisDto,
  DashboardParams,
  RankingUnidadeItemDto,
} from 'types/dtos/relatorio.dto';
import { ref } from 'vue';

export function useDashboard() {
  const kpis = ref<DashboardKpisDto | null>(null);
  const ranking = ref<RankingUnidadeItemDto[]>([]);
  const alertas = ref<AlertaGerencialDto[]>([]);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: DashboardParams): Promise<void> {
    carregando.value = true;
    try {
      const [dashboard, rankingUnidades, listaAlertas] = await Promise.all([
        relatorioService.dashboard(params),
        relatorioService.rankingUnidades(params),
        relatorioService.alertas(),
      ]);
      kpis.value = dashboard;
      ranking.value = rankingUnidades;
      alertas.value = listaAlertas;
    } catch (e) {
      kpis.value = null;
      ranking.value = [];
      alertas.value = [];
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  return {
    kpis,
    ranking,
    alertas,
    carregando,
    carregar,
  };
}
