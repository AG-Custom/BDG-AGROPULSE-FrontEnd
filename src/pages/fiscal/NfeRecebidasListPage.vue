<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="NF-e recebidas"
      subtitulo="Notas destinadas à empresa e a manifestação do destinatário."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="sync"
        label="Atualizar da Focus"
        descricao="Sincronizar as NF-e recebidas na Focus"
        :loading="sincronizando"
        @click="sincronizar"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar nfe-recebidas__barra">
          <q-select
            v-model="filtro"
            class="nfe-recebidas__campo"
            outlined
            emit-value
            map-options
            label="Manifestação"
            :options="filtros"
            @update:model-value="aplicarFiltro"
          />
          <q-select
            v-model="acao"
            class="nfe-recebidas__campo"
            outlined
            emit-value
            map-options
            clearable
            label="Ação nas selecionadas"
            :options="acoes"
            :disable="manifestando"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Registrar"
            descricao="Registrar a manifestação nas notas selecionadas"
            :disable="!podeRegistrar"
            :loading="manifestando"
            @click="registrar"
          />
          <span v-if="selecionados.length > 0" class="nfe-recebidas__contagem">
            {{ rotuloSelecao }}
          </span>
        </div>

        <agro-table-skeleton v-if="carregando && notas.length === 0" :colunas="8" />
        <nfe-recebidas-table
          v-else
          v-model:selecionados="selecionados"
          :notas="notas"
          :manifestando="manifestando"
          :carregando="carregando"
        />
      </agro-card>
    </section>

    <nfe-recebida-nao-realizada-dialog
      v-model="dialogNaoRealizada"
      :loading="manifestando"
      :quantidade="quantidadeNaoRealizada"
      @confirm="confirmarNaoRealizada"
    />
  </q-page>
</template>

<script setup lang="ts">
import NfeRecebidaNaoRealizadaDialog from 'components/fiscal/NfeRecebidaNaoRealizadaDialog.vue';
import NfeRecebidasTable from 'components/fiscal/NfeRecebidasTable.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import { useNfesRecebidas } from 'composables/useNfesRecebidas';
import { TipoManifestacaoSefaz, type TipoManifestacaoSefazValor } from 'constants/enums';
import type { FiltroNfeRecebida, NfeRecebidaDto } from 'types/dtos/fiscal-gestao.dto';
import { computed, onMounted, ref } from 'vue';

const {
  notas,
  filtro,
  carregando,
  sincronizando,
  manifestando,
  carregar,
  sincronizar,
  manifestarSelecionadas,
} = useNfesRecebidas();

const selecionados = ref<NfeRecebidaDto[]>([]);
const acao = ref<TipoManifestacaoSefazValor | null>(null);
const dialogNaoRealizada = ref(false);
const quantidadeNaoRealizada = ref(1);

const filtros: { label: string; value: FiltroNfeRecebida }[] = [
  { label: 'Todas', value: 'Todas' },
  { label: 'Pendentes de manifestação', value: 'Pendente' },
  { label: 'Sem ciência', value: 'SemCiencia' },
];

const acoes: { label: string; value: TipoManifestacaoSefazValor }[] = [
  { label: 'Ciência da operação', value: TipoManifestacaoSefaz.Ciencia },
  { label: 'Confirmar operação', value: TipoManifestacaoSefaz.Confirmacao },
  { label: 'Desconhecer operação', value: TipoManifestacaoSefaz.Desconhecimento },
  { label: 'Operação não realizada', value: TipoManifestacaoSefaz.NaoRealizada },
];

const podeRegistrar = computed(
  () => selecionados.value.length > 0 && acao.value != null && !manifestando.value,
);

const rotuloSelecao = computed(() =>
  selecionados.value.length === 1
    ? '1 nota selecionada'
    : `${selecionados.value.length} notas selecionadas`,
);

function aplicarFiltro(): void {
  selecionados.value = [];
  void carregar();
}

function registrar(): void {
  if (!acao.value || selecionados.value.length === 0) return;
  if (acao.value === TipoManifestacaoSefaz.NaoRealizada) {
    quantidadeNaoRealizada.value = selecionados.value.length;
    dialogNaoRealizada.value = true;
    return;
  }
  void executar(acao.value);
}

async function executar(tipo: TipoManifestacaoSefazValor, justificativa?: string): Promise<void> {
  const notasAcao = [...selecionados.value];
  const ok = await manifestarSelecionadas(notasAcao, tipo, justificativa);
  if (!ok) return;
  selecionados.value = [];
  acao.value = null;
  dialogNaoRealizada.value = false;
}

async function confirmarNaoRealizada(justificativa: string): Promise<void> {
  await executar(TipoManifestacaoSefaz.NaoRealizada, justificativa);
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.nfe-recebidas__barra {
  align-items: flex-end;
}

.nfe-recebidas__campo {
  flex: 1 1 16rem;
  max-width: 22rem;
}

.nfe-recebidas__contagem {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  padding-bottom: var(--spacing-3);
}
</style>
