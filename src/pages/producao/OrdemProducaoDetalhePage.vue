<template>
  <q-page class="agro-page">
    <app-page-header titulo="Ordem de produção" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="ordem?.status === OrdemProducaoStatus.Aberta"
          flat
          icon="edit"
          label="Editar"
          descricao="Editar ordem"
          :to="{ name: 'ordem-producao-editar', params: { id } }"
        />
        <agro-btn
          v-if="ordem?.status === OrdemProducaoStatus.Aberta"
          color="primary"
          unelevated
          label="Iniciar"
          descricao="Iniciar ordem"
          :loading="salvando"
          @click="iniciarOrdem(id)"
        />
        <agro-btn
          v-if="ordem?.status === OrdemProducaoStatus.EmAndamento"
          color="primary"
          unelevated
          label="Concluir"
          descricao="Concluir ordem"
          :loading="salvando"
          @click="abrirConcluir"
        />
        <agro-btn
          v-if="ordem?.status === OrdemProducaoStatus.Aberta || ordem?.status === OrdemProducaoStatus.EmAndamento"
          color="negative"
          unelevated
          label="Cancelar"
          descricao="Cancelar ordem"
          :loading="salvando"
          @click="cancelarOrdem(id)"
        />
      </div>
    </app-page-header>

    <section class="agro-section detalhe">
      <agro-form-skeleton v-if="carregando && !ordem" :campos="5" />
      <template v-else-if="ordem">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-md-3">
              <div class="text-caption">Status</div>
              <agro-badge :label="ordem.status" variant="default" />
            </div>
            <div class="col-md-4">
              <div class="text-caption">Produto saída</div>
              <div>{{ rotuloProduto(ordem.produtoSaidaId) }}</div>
            </div>
            <div class="col-md-2">
              <div class="text-caption">Planejada</div>
              <div class="text-metric">{{ formatarDecimal(ordem.quantidadePlanejada) }}</div>
            </div>
            <div class="col-md-2">
              <div class="text-caption">Produzida</div>
              <div class="text-metric">
                {{ ordem.quantidadeProduzida != null ? formatarDecimal(ordem.quantidadeProduzida) : '—' }}
              </div>
            </div>
          </div>
        </agro-card>
        <agro-card>
          <q-table
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="ordem.itens"
            :columns="colunas"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-produtoInsumoId="props">
              <q-td :props="props">{{ rotuloProduto(props.row.produtoInsumoId) }}</q-td>
            </template>
            <template #body-cell-quantidade="props">
              <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</q-td>
            </template>
          </q-table>
        </agro-card>
      </template>
      <div class="agro-form-actions">
        <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'ordens-producao' }" />
      </div>
    </section>

    <q-dialog v-model="dialogConcluir" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Concluir ordem</h4></q-card-section>
        <q-card-section>
          <q-input v-model="qtdProduzida" outlined label="Quantidade produzida" type="number" />
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogConcluir = false" />
          <agro-btn
            color="primary"
            unelevated
            label="Concluir"
            descricao="Confirmar conclusão"
            :loading="salvando"
            @click="confirmarConcluir"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useProducao } from 'composables/useProducao';
import { useProdutos } from 'composables/useProdutos';
import { OrdemProducaoStatus } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { ItemOrdemProducaoDto } from 'types/dtos/producao.dto';
import { formatarDecimal } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const {
  ordem,
  carregando,
  salvando,
  obterOrdem,
  iniciarOrdem,
  concluirOrdem,
  cancelarOrdem,
} = useProducao();
const { produtos, carregar: carregarProdutos } = useProdutos();

const id = computed(() => route.params.id as string);
const dialogConcluir = ref(false);
const qtdProduzida = ref('');
const subtitulo = computed(() =>
  ordem.value ? `Status: ${ordem.value.status}` : 'Carregando...',
);

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.codigo} — ${p.descricao}`);
  return m;
});

const colunas: QTableColumn<ItemOrdemProducaoDto>[] = [
  { name: 'produtoInsumoId', label: 'Insumo', field: 'produtoInsumoId', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
];

function rotuloProduto(pid: string): string {
  return mapa.value.get(pid) ?? pid;
}

function abrirConcluir(): void {
  qtdProduzida.value = String(ordem.value?.quantidadePlanejada ?? '');
  dialogConcluir.value = true;
}

async function confirmarConcluir(): Promise<void> {
  const ok = await concluirOrdem(id.value, Number(qtdProduzida.value));
  if (ok) dialogConcluir.value = false;
}

onMounted(async () => {
  void carregarProdutos();
  const ok = await obterOrdem(id.value);
  if (!ok) await router.replace({ name: 'ordens-producao' });
});
</script>

<style scoped>
.detalhe {
  display: grid;
  gap: var(--spacing-6);
}
.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
.dialog {
  min-width: min(360px, 90vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
}
</style>
