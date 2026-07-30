<template>
  <q-page class="agro-page">
    <app-page-header titulo="Recebimento de compra" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="podeEditar"
          color="primary"
          unelevated
          label="Salvar conferência"
          descricao="Atualizar quantidades conferidas"
          :loading="salvando"
          @click="salvarItens"
        />
        <agro-btn
          v-if="podeEditar"
          unelevated
          label="Divergência"
          descricao="Registrar divergência"
          @click="dialogDivergencia = true"
        />
        <agro-btn
          v-if="podeEditar"
          color="positive"
          unelevated
          label="Confirmar"
          descricao="Confirmar recebimento"
          :loading="salvando"
          @click="confirmarRecebimento"
        />
      </div>
    </app-page-header>

    <section class="agro-section detalhe">
      <agro-form-skeleton v-if="carregando && !recebimento" :campos="6" />
      <template v-else-if="recebimento">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-md-3">
              <div class="text-caption">Status</div>
              <agro-badge :label="rotuloStatus(recebimento.status)" variant="default" />
            </div>
            <div class="col-md-3">
              <div class="text-caption">Fornecedor</div>
              <div>{{ rotuloFornecedor(recebimento.fornecedorId) }}</div>
            </div>
            <div class="col-md-2">
              <div class="text-caption">Origem</div>
              <div>{{ recebimento.origem }}</div>
            </div>
            <div class="col-md-2">
              <div class="text-caption">NF-e</div>
              <div>{{ recebimento.numeroNota || '—' }}</div>
            </div>
            <div class="col-md-2">
              <div class="text-caption">Criado em</div>
              <div>{{ formatarDataHora(recebimento.createdAt) }}</div>
            </div>
          </div>
        </agro-card>

        <agro-card>
          <h3 class="titulo">Itens</h3>
          <div v-for="item in itensForm" :key="item.itemId" class="item-row row q-col-gutter-sm q-mb-sm">
            <div class="col-12 col-md-4">
              <div class="text-caption">Produto</div>
              <div>{{ rotuloProduto(item.produtoId) }}</div>
            </div>
            <div class="col-6 col-md-2">
              <div class="text-caption">Qtd NF</div>
              <div class="text-metric">{{ formatarDecimal(item.quantidadeNota) }}</div>
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model="item.quantidadeRecebida"
                outlined
                dense
                label="Qtd recebida"
                type="number"
                :readonly="!podeEditar"
              />
            </div>
            <div class="col-6 col-md-2">
              <AgroMoneyInput
                v-model="item.custoUnitario"
                dense
                label="Custo"
                :readonly="!podeEditar"
              />
            </div>
            <div class="col-6 col-md-1">
              <q-input
                v-model="item.numeroLote"
                outlined
                dense
                label="Lote"
                :readonly="!podeEditar"
              />
            </div>
            <div class="col-6 col-md-1">
              <q-input
                v-model="item.dataValidade"
                outlined
                dense
                label="Validade"
                type="date"
                :readonly="!podeEditar"
              />
            </div>
          </div>
        </agro-card>

        <agro-card>
          <h3 class="titulo">Divergências</h3>
          <empty-state
            v-if="recebimento.divergencias.length === 0"
            titulo="Sem divergências"
            descricao="Nenhuma divergência registrada neste recebimento."
            icon="check_circle"
          />
          <q-table
            v-else
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="recebimento.divergencias"
            :columns="colunasDivergencias"
            :pagination="{ rowsPerPage: 0 }"
          />
        </agro-card>
      </template>

      <div class="agro-form-actions">
        <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'recebimentos-compra' }" />
      </div>
    </section>

    <q-dialog v-model="dialogDivergencia" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Registrar divergência</h4></q-card-section>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12">
            <q-input v-model="divergencia.tipo" outlined label="Tipo" />
          </div>
          <div class="col-12">
            <q-input v-model="divergencia.descricao" outlined label="Descrição" type="textarea" autogrow />
          </div>
          <div class="col-6">
            <q-input v-model="divergencia.quantidadeEsperada" outlined label="Qtd esperada" type="number" />
          </div>
          <div class="col-6">
            <q-input v-model="divergencia.quantidadeInformada" outlined label="Qtd informada" type="number" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogDivergencia = false" />
          <agro-btn
            color="primary"
            unelevated
            label="Registrar"
            descricao="Registrar divergência"
            :loading="salvando"
            @click="salvarDivergencia"
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
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useFornecedores } from 'composables/useFornecedores';
import { useProdutos } from 'composables/useProdutos';
import { useRecebimentosCompra } from 'composables/useRecebimentosCompra';
import { RecebimentoCompraStatusOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { RecebimentoCompraDivergenciaDto } from 'types/dtos/compras.dto';
import { formatarDataHora, formatarDecimal, formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface ItemForm {
  itemId: string;
  produtoId: string;
  quantidadeNota: number;
  quantidadeRecebida: string;
  custoUnitario: string;
  numeroLote: string;
  dataValidade: string;
}

const route = useRoute();
const router = useRouter();
const {
  recebimento,
  carregando,
  salvando,
  obter,
  atualizarItens,
  registrarDivergencia,
  confirmar,
} = useRecebimentosCompra();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();
const { produtos, carregar: carregarProdutos } = useProdutos();

const dialogDivergencia = ref(false);
const itensForm = ref<ItemForm[]>([]);
const divergencia = reactive({
  tipo: 'Quantidade',
  descricao: '',
  quantidadeEsperada: '',
  quantidadeInformada: '',
});

const id = computed(() => route.params.id as string);
const podeEditar = computed(() => recebimento.value?.status === 'EmConferencia');
const subtitulo = computed(() =>
  recebimento.value ? `Status: ${rotuloStatus(recebimento.value.status)}` : 'Carregando...',
);

const mapaFornecedores = computed(() => {
  const m = new Map<string, string>();
  for (const f of fornecedores.value) m.set(f.id, f.razaoSocial);
  return m;
});
const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const colunasDivergencias: QTableColumn<RecebimentoCompraDivergenciaDto>[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'quantidadeEsperada', label: 'Esperada', field: 'quantidadeEsperada', align: 'right' },
  { name: 'quantidadeInformada', label: 'Informada', field: 'quantidadeInformada', align: 'right' },
];

function rotuloFornecedor(fid: string): string {
  return mapaFornecedores.value.get(fid) ?? fid;
}
function rotuloProduto(pid: string): string {
  return mapaProdutos.value.get(pid) ?? pid;
}
function rotuloStatus(status: string): string {
  return RecebimentoCompraStatusOpcoes.find((o) => o.value === status)?.label ?? status;
}

function sincronizarItens(): void {
  itensForm.value = (recebimento.value?.itens ?? []).map((item) => ({
    itemId: item.id,
    produtoId: item.produtoId,
    quantidadeNota: item.quantidadeNota,
    quantidadeRecebida: String(item.quantidadeRecebida),
    custoUnitario: formatarMoedaParaInput(item.custoUnitario),
    numeroLote: item.numeroLote ?? '',
    dataValidade: item.dataValidade ?? '',
  }));
}

watch(recebimento, sincronizarItens, { immediate: true });

async function salvarItens(): Promise<void> {
  await atualizarItens(id.value, {
    itens: itensForm.value.map((item) => ({
      itemId: item.itemId,
      quantidadeRecebida: Number(item.quantidadeRecebida),
      numeroLote: item.numeroLote.trim() || null,
      dataValidade: item.dataValidade || null,
      custoUnitario: parseMascaraMoeda(item.custoUnitario) ?? 0,
    })),
  });
}

async function salvarDivergencia(): Promise<void> {
  const ok = await registrarDivergencia(id.value, {
    tipo: divergencia.tipo.trim() || 'Quantidade',
    descricao: divergencia.descricao.trim(),
    quantidadeEsperada: divergencia.quantidadeEsperada
      ? Number(divergencia.quantidadeEsperada)
      : null,
    quantidadeInformada: divergencia.quantidadeInformada
      ? Number(divergencia.quantidadeInformada)
      : null,
  });
  if (ok) dialogDivergencia.value = false;
}

async function confirmarRecebimento(): Promise<void> {
  await salvarItens();
  await confirmar(id.value);
}

onMounted(async () => {
  void carregarFornecedores();
  void carregarProdutos();
  const ok = await obter(id.value);
  if (!ok) await router.replace({ name: 'recebimentos-compra' });
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
.titulo {
  margin: 0 0 var(--spacing-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.dialog {
  min-width: min(440px, 90vw);
}
</style>
