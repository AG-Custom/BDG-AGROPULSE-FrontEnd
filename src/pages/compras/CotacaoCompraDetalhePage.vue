<template>
  <q-page class="agro-page">
    <app-page-header titulo="Cotação de compra" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="podeEnviar"
          color="primary"
          unelevated
          label="Enviar cotação"
          descricao="Registrar envio interno aos fornecedores"
          @click="abrirEnvio"
        />
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
            <div v-if="cotacao.enviadoEm" class="col-md-4">
              <div class="text-caption">Enviado em</div>
              <div>{{ formatarData(cotacao.enviadoEm) }}</div>
            </div>
            <div v-if="cotacao.observacao" class="col-12">
              <div class="text-caption">Observação</div>
              <div>{{ cotacao.observacao }}</div>
            </div>
          </div>
        </agro-card>

        <agro-card v-if="(cotacao.envios ?? []).length > 0">
          <h3 class="titulo">Envios</h3>
          <q-table
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="cotacao.envios ?? []"
            :columns="colunasEnvios"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-fornecedorId="props">
              <q-td :props="props">{{ rotuloFornecedor(props.row.fornecedorId) }}</q-td>
            </template>
            <template #body-cell-enviadoEm="props">
              <q-td :props="props">{{ formatarData(props.row.enviadoEm) }}</q-td>
            </template>
          </q-table>
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
            <template #body-cell-validadeProposta="props">
              <q-td :props="props">
                {{ props.row.validadeProposta ? formatarData(props.row.validadeProposta) : '—' }}
              </q-td>
            </template>
          </q-table>
        </agro-card>

        <agro-card>
          <h3 class="titulo">Comparativo</h3>
          <empty-state
            v-if="!comparativo || comparativo.itens.length === 0"
            titulo="Sem comparativo"
            descricao="Registre respostas para comparar propostas lado a lado."
            icon="compare"
          />
          <div v-else class="comparativo-lista">
            <div v-for="item in comparativo.itens" :key="item.itemCotacaoId" class="comparativo-item">
              <div class="comparativo-item__titulo">
                {{ rotuloProduto(item.produtoId) }}
                <span class="text-metric"> — qtd {{ formatarDecimal(item.quantidade) }}</span>
              </div>
              <q-table
                flat
                bordered
                hide-pagination
                row-key="fornecedorId"
                :rows="item.propostas"
                :columns="colunasComparativo"
                :pagination="{ rowsPerPage: 0 }"
              >
                <template #body-cell-fornecedorId="props">
                  <q-td :props="props">{{ rotuloFornecedor(props.row.fornecedorId) }}</q-td>
                </template>
                <template #body-cell-precoUnitario="props">
                  <q-td :props="props" class="text-metric">
                    {{ formatarMoeda(props.row.precoUnitario) }}
                  </q-td>
                </template>
                <template #body-cell-total="props">
                  <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.total) }}</q-td>
                </template>
                <template #body-cell-validadeProposta="props">
                  <q-td :props="props">
                    {{ props.row.validadeProposta ? formatarData(props.row.validadeProposta) : '—' }}
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>
        </agro-card>
      </template>

      <div class="agro-form-actions">
        <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'cotacoes-compra' }" />
      </div>
    </section>

    <q-dialog v-model="dialogEnvio" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Enviar cotação</h4></q-card-section>
        <q-card-section>
          <q-select
            v-model="fornecedoresEnvio"
            outlined
            label="Fornecedores"
            multiple
            emit-value
            map-options
            use-chips
            :options="fornecedorOpcoes"
          />
          <div class="text-caption q-mt-sm">
            Registra fila interna de envio (sem e-mail real / SendGrid).
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogEnvio = false" />
          <agro-btn
            color="primary"
            unelevated
            label="Enviar"
            descricao="Confirmar envio"
            :loading="salvando"
            :disable="fornecedoresEnvio.length === 0"
            @click="enviar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
          <div class="col-12">
            <q-input
              v-model="resposta.condicoesComerciais"
              outlined
              label="Condições comerciais"
              type="textarea"
              autogrow
            />
          </div>
          <div class="col-12">
            <q-input
              v-model="resposta.validadeProposta"
              outlined
              label="Validade da proposta"
              type="date"
            />
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
import type {
  ComparativoCotacaoPropostaDto,
  EnvioCotacaoDto,
  ItemCotacaoDto,
  RespostaCotacaoDto,
} from 'types/dtos/compras.dto';
import { formatarData, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const {
  cotacao,
  comparativo,
  carregando,
  salvando,
  obterCotacao,
  carregarComparativo,
  responderCotacao,
  encerrarCotacao,
  enviarCotacao,
} = useCompras();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();

const dialogResposta = ref(false);
const dialogEnvio = ref(false);
const fornecedoresEnvio = ref<string[]>([]);
const resposta = reactive({
  fornecedorId: '',
  itemCotacaoId: '',
  precoUnitario: '',
  prazoEntregaDias: '7',
  condicoesComerciais: '',
  validadeProposta: '',
});

const id = computed(() => route.params.id as string);
const podeEnviar = computed(
  () => cotacao.value?.status === 'Aberta' || cotacao.value?.status === 'Enviada',
);
const podeResponder = computed(
  () =>
    cotacao.value?.status === 'Aberta' ||
    cotacao.value?.status === 'Enviada' ||
    cotacao.value?.status === 'EmResposta',
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
const colunasEnvios: QTableColumn<EnvioCotacaoDto>[] = [
  { name: 'fornecedorId', label: 'Fornecedor', field: 'fornecedorId', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'enviadoEm', label: 'Enviado em', field: 'enviadoEm', align: 'left' },
];
const colunasRespostas: QTableColumn<RespostaCotacaoDto>[] = [
  { name: 'fornecedorId', label: 'Fornecedor', field: 'fornecedorId', align: 'left' },
  { name: 'precoUnitario', label: 'Preço', field: 'precoUnitario', align: 'right' },
  { name: 'prazoEntregaDias', label: 'Prazo', field: 'prazoEntregaDias', align: 'right' },
  { name: 'condicoesComerciais', label: 'Condições', field: 'condicoesComerciais', align: 'left' },
  { name: 'validadeProposta', label: 'Validade', field: 'validadeProposta', align: 'left' },
];
const colunasComparativo: QTableColumn<ComparativoCotacaoPropostaDto>[] = [
  { name: 'fornecedorId', label: 'Fornecedor', field: 'fornecedorId', align: 'left' },
  { name: 'precoUnitario', label: 'Preço', field: 'precoUnitario', align: 'right' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
  { name: 'prazoEntregaDias', label: 'Prazo', field: 'prazoEntregaDias', align: 'right' },
  { name: 'condicoesComerciais', label: 'Condições', field: 'condicoesComerciais', align: 'left' },
  { name: 'validadeProposta', label: 'Validade', field: 'validadeProposta', align: 'left' },
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
    condicoesComerciais: resposta.condicoesComerciais.trim() || null,
    validadeProposta: resposta.validadeProposta || null,
  });
  if (ok) dialogResposta.value = false;
}

async function encerrar(): Promise<void> {
  await encerrarCotacao(id.value);
}

function abrirEnvio(): void {
  fornecedoresEnvio.value = (cotacao.value?.envios ?? []).map((e) => e.fornecedorId);
  dialogEnvio.value = true;
}

async function enviar(): Promise<void> {
  const ok = await enviarCotacao(id.value, { fornecedorIds: fornecedoresEnvio.value });
  if (ok) dialogEnvio.value = false;
}

onMounted(async () => {
  void carregarProdutos();
  void carregarFornecedores();
  const ok = await obterCotacao(id.value);
  if (!ok) {
    await router.replace({ name: 'cotacoes-compra' });
    return;
  }
  await carregarComparativo(id.value);
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
.comparativo-lista {
  display: grid;
  gap: var(--spacing-4);
}
.comparativo-item__titulo {
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-medium);
}
</style>
