<template>
  <q-page class="agro-page">
    <app-page-header titulo="Cotação de compra" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="podeResponder"
          color="primary"
          unelevated
          label="Responder"
          descricao="Registrar resposta de fornecedor"
          @click="dialogResposta = true"
        />
        <agro-btn
          v-if="podeEncerrar"
          unelevated
          label="Encerrar"
          descricao="Encerrar cotação"
          :loading="salvando"
          @click="encerrar"
        />
      </div>
    </app-page-header>

    <section class="agro-section detalhe">
      <agro-form-skeleton v-if="carregando && !cotacao" :campos="5" />
      <template v-else-if="cotacao">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-md-4">
              <div class="text-caption">Status</div>
              <agro-badge :label="cotacao.status" variant="default" />
            </div>
            <div class="col-md-4">
              <div class="text-caption">Data limite</div>
              <div>{{ formatarData(cotacao.dataLimite) }}</div>
            </div>
            <div v-if="cotacao.observacao" class="col-12">
              <div class="text-caption">Observação</div>
              <div>{{ cotacao.observacao }}</div>
            </div>
          </div>
        </agro-card>

        <agro-card>
          <h3 class="titulo">Itens</h3>
          <q-table
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="cotacao.itens"
            :columns="colunasItens"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-produtoId="props">
              <q-td :props="props">{{ rotuloProduto(props.row.produtoId) }}</q-td>
            </template>
            <template #body-cell-quantidade="props">
              <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</q-td>
            </template>
          </q-table>
        </agro-card>

        <agro-card>
          <h3 class="titulo">Respostas</h3>
          <empty-state
            v-if="cotacao.respostas.length === 0"
            titulo="Sem respostas"
            descricao="Aguarde ou registre respostas de fornecedores."
            icon="inbox"
          />
          <q-table
            v-else
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="cotacao.respostas"
            :columns="colunasRespostas"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-fornecedorId="props">
              <q-td :props="props">{{ rotuloFornecedor(props.row.fornecedorId) }}</q-td>
            </template>
            <template #body-cell-precoUnitario="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.precoUnitario) }}</q-td>
            </template>
          </q-table>
        </agro-card>
      </template>

      <div class="agro-form-actions">
        <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'cotacoes-compra' }" />
      </div>
    </section>

    <q-dialog v-model="dialogResposta" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Responder cotação</h4></q-card-section>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12">
            <q-select
              v-model="resposta.fornecedorId"
              outlined
              label="Fornecedor"
              emit-value
              map-options
              :options="fornecedorOpcoes"
            />
          </div>
          <div class="col-12">
            <q-select
              v-model="resposta.itemCotacaoId"
              outlined
              label="Item"
              emit-value
              map-options
              :options="itemOpcoes"
            />
          </div>
          <div class="col-6">
            <q-input v-model="resposta.precoUnitario" outlined label="Preço unitário" type="number" step="0.01" />
          </div>
          <div class="col-6">
            <q-input v-model="resposta.prazoEntregaDias" outlined label="Prazo (dias)" type="number" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogResposta = false" />
          <agro-btn
            color="primary"
            unelevated
            label="Salvar"
            descricao="Salvar resposta"
            :loading="salvando"
            @click="salvarResposta"
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
import EmptyState from 'components/ui/EmptyState.vue';
import { useCompras } from 'composables/useCompras';
import { useFornecedores } from 'composables/useFornecedores';
import { useProdutos } from 'composables/useProdutos';
import type { QTableColumn } from 'quasar';
import type { ItemCotacaoDto, RespostaCotacaoDto } from 'types/dtos/compras.dto';
import { formatarData, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const {
  cotacao,
  carregando,
  salvando,
  obterCotacao,
  responderCotacao,
  encerrarCotacao,
} = useCompras();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();

const dialogResposta = ref(false);
const resposta = reactive({
  fornecedorId: '',
  itemCotacaoId: '',
  precoUnitario: '',
  prazoEntregaDias: '7',
});

const id = computed(() => route.params.id as string);
const podeResponder = computed(
  () => cotacao.value?.status === 'Aberta' || cotacao.value?.status === 'EmResposta',
);
const podeEncerrar = computed(() => podeResponder.value);
const subtitulo = computed(() =>
  cotacao.value ? `Status: ${cotacao.value.status}` : 'Carregando...',
);

const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.codigo} — ${p.descricao}`);
  return m;
});
const mapaFornecedores = computed(() => {
  const m = new Map<string, string>();
  for (const f of fornecedores.value) m.set(f.id, f.razaoSocial);
  return m;
});
const fornecedorOpcoes = computed(() =>
  fornecedores.value.map((f) => ({ label: f.razaoSocial, value: f.id })),
);
const itemOpcoes = computed(() =>
  (cotacao.value?.itens ?? []).map((i) => ({
    label: rotuloProduto(i.produtoId),
    value: i.id,
  })),
);

const colunasItens: QTableColumn<ItemCotacaoDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
];
const colunasRespostas: QTableColumn<RespostaCotacaoDto>[] = [
  { name: 'fornecedorId', label: 'Fornecedor', field: 'fornecedorId', align: 'left' },
  { name: 'precoUnitario', label: 'Preço', field: 'precoUnitario', align: 'right' },
  { name: 'prazoEntregaDias', label: 'Prazo', field: 'prazoEntregaDias', align: 'right' },
];

function rotuloProduto(pid: string): string {
  return mapaProdutos.value.get(pid) ?? pid;
}
function rotuloFornecedor(fid: string): string {
  return mapaFornecedores.value.get(fid) ?? fid;
}

async function salvarResposta(): Promise<void> {
  const ok = await responderCotacao(id.value, {
    fornecedorId: resposta.fornecedorId,
    itemCotacaoId: resposta.itemCotacaoId,
    precoUnitario: Number(resposta.precoUnitario),
    prazoEntregaDias: Number(resposta.prazoEntregaDias),
  });
  if (ok) dialogResposta.value = false;
}

async function encerrar(): Promise<void> {
  await encerrarCotacao(id.value);
}

onMounted(async () => {
  void carregarProdutos();
  void carregarFornecedores();
  const ok = await obterCotacao(id.value);
  if (!ok) await router.replace({ name: 'cotacoes-compra' });
});
</script>

<style scoped>
.detalhe {
  display: grid;
  gap: var(--spacing-6);
}
.acoes {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}
.titulo {
  margin: 0 0 var(--spacing-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.dialog {
  min-width: min(440px, 90vw);
}
</style>
