<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Novo recebimento"
      subtitulo="Importe o XML da NF-e ou registre manualmente."
    />

    <section class="agro-section form-grid">
      <agro-card>
        <h3 class="titulo">XML da NF-e</h3>
        <q-input
          v-model="xmlConteudo"
          outlined
          label="Conteúdo XML"
          type="textarea"
          autogrow
          class="q-mb-md"
        />
        <div class="acoes-xml">
          <agro-btn
            color="primary"
            unelevated
            label="Pré-visualizar XML"
            descricao="Analisar XML da NF-e"
            :loading="salvando"
            :disable="!xmlConteudo.trim()"
            @click="analisarXml"
          />
          <agro-btn
            flat
            label="Consultar SEFAZ (stub)"
            descricao="Consultar documentos destinados"
            :loading="consultandoSefaz"
            @click="consultarSefaz"
          />
        </div>
        <p v-if="mensagemSefaz" class="texto-sefaz">{{ mensagemSefaz }}</p>
      </agro-card>

      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="fornecedorId"
                outlined
                label="Fornecedor"
                emit-value
                map-options
                :options="fornecedorOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="pedidoCompraId"
                outlined
                label="Pedido de compra (opcional)"
                readonly
                hint="Preenchido quando originado de um pedido"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="chaveAcesso" outlined label="Chave de acesso" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="numeroNota" outlined label="Número da nota" />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="serie" outlined label="Série" />
            </div>
          </div>

          <div class="itens-header">
            <h3 class="titulo">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionarItem" />
          </div>

          <div v-for="(item, index) in itens" :key="item.chave" class="item-row row q-col-gutter-sm q-mb-sm">
            <div class="col-12 col-md-4">
              <q-select
                v-model="item.produtoId"
                outlined
                dense
                label="Produto"
                emit-value
                map-options
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="item.quantidadeNota" outlined dense label="Qtd NF" type="number" />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="item.quantidadeRecebida" outlined dense label="Qtd recebida" type="number" />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="item.custoUnitario" outlined dense label="Custo" type="number" step="0.01" />
            </div>
            <div class="col-5 col-md-1">
              <q-input v-model="item.numeroLote" outlined dense label="Lote" />
            </div>
            <div class="col-5 col-md-1">
              <q-input v-model="item.dataValidade" outlined dense label="Validade" type="date" />
            </div>
            <div class="col-2 col-md-auto">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover item"
                :disable="itens.length <= 1"
                @click="itens.splice(index, 1)"
              />
            </div>
          </div>

          <div v-if="duplicatasPreview.length > 0" class="q-mt-md">
            <h3 class="titulo">Duplicatas do XML</h3>
            <q-table
              flat
              bordered
              row-key="chave"
              hide-pagination
              :rows="duplicatasPreview"
              :columns="colunasDuplicatas"
              :pagination="{ rowsPerPage: 0 }"
            >
              <template #body-cell-valor="props">
                <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
              </template>
            </q-table>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'recebimentos-compra' }" />
            <agro-btn
              color="primary"
              unelevated
              label="Criar recebimento"
              descricao="Criar recebimento"
              type="submit"
              :loading="salvando"
            />
          </div>
        </q-form>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import { useCompras } from 'composables/useCompras';
import { useFiscal } from 'composables/useFiscal';
import { useFornecedores } from 'composables/useFornecedores';
import { useProdutos } from 'composables/useProdutos';
import { useRecebimentosCompra } from 'composables/useRecebimentosCompra';
import type { QTableColumn } from 'quasar';
import { formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface ItemForm {
  chave: string;
  produtoId: string;
  codigoProdutoXml: string;
  quantidadeNota: string;
  quantidadeRecebida: string;
  custoUnitario: string;
  numeroLote: string;
  dataValidade: string;
}

interface DuplicataPreviewRow {
  chave: string;
  numero: string;
  vencimento: string;
  valor: number;
}

const route = useRoute();
const router = useRouter();
const { salvando, previewXmlConteudo, criar, limparPreview } = useRecebimentosCompra();
const { receberPedido } = useCompras();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();
const { produtos, carregar: carregarProdutos } = useProdutos();
const {
  consultandoSefaz,
  documentosSefaz,
  listarDocumentosSefaz,
} = useFiscal();

const xmlConteudo = ref('');
const fornecedorId = ref('');
const pedidoCompraId = ref('');
const chaveAcesso = ref('');
const numeroNota = ref('');
const serie = ref('');
const mensagemSefaz = ref('');
const duplicatasPreview = ref<DuplicataPreviewRow[]>([]);
const itens = ref<ItemForm[]>([criarItemVazio()]);

const fornecedorOpcoes = computed(() =>
  fornecedores.value.map((f) => ({ label: f.razaoSocial, value: f.id })),
);
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);

const colunasDuplicatas: QTableColumn<DuplicataPreviewRow>[] = [
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'vencimento', label: 'Vencimento', field: 'vencimento', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
];

function criarItemVazio(): ItemForm {
  return {
    chave: crypto.randomUUID(),
    produtoId: '',
    codigoProdutoXml: '',
    quantidadeNota: '1',
    quantidadeRecebida: '1',
    custoUnitario: '0',
    numeroLote: '',
    dataValidade: '',
  };
}

function adicionarItem(): void {
  itens.value.push(criarItemVazio());
}

async function analisarXml(): Promise<void> {
  const preview = await previewXmlConteudo({ xmlConteudo: xmlConteudo.value });
  if (!preview) return;

  if (preview.fornecedorId) fornecedorId.value = preview.fornecedorId;
  chaveAcesso.value = preview.chaveAcesso ?? '';
  numeroNota.value = preview.numeroNota ?? '';
  serie.value = preview.serie ?? '';

  itens.value = preview.itens.map((item) => ({
    chave: crypto.randomUUID(),
    produtoId: item.produtoId ?? '',
    codigoProdutoXml: item.codigoProdutoXml,
    quantidadeNota: String(item.quantidade),
    quantidadeRecebida: String(item.quantidade),
    custoUnitario: String(item.custoUnitario),
    numeroLote: item.numeroLote ?? '',
    dataValidade: item.dataValidade ?? '',
  }));

  if (itens.value.length === 0) {
    itens.value = [criarItemVazio()];
  }

  duplicatasPreview.value = preview.duplicatas.map((d) => ({
    chave: crypto.randomUUID(),
    numero: d.numero ?? '—',
    vencimento: d.vencimento,
    valor: d.valor,
  }));
}

async function consultarSefaz(): Promise<void> {
  const resp = await listarDocumentosSefaz();
  mensagemSefaz.value = resp?.mensagem ?? documentosSefaz.value?.mensagem ?? '';
}

async function salvar(): Promise<void> {
  const criado = await criar({
    fornecedorId: fornecedorId.value,
    pedidoCompraId: pedidoCompraId.value || null,
    xmlConteudo: xmlConteudo.value.trim() || null,
    chaveAcesso: chaveAcesso.value.trim() || null,
    numeroNota: numeroNota.value.trim() || null,
    serie: serie.value.trim() || null,
    itens: itens.value.map((i) => ({
      produtoId: i.produtoId,
      codigoProdutoXml: i.codigoProdutoXml || null,
      quantidadeNota: Number(i.quantidadeNota),
      quantidadeRecebida: Number(i.quantidadeRecebida),
      custoUnitario: Number(i.custoUnitario),
      numeroLote: i.numeroLote.trim() || null,
      dataValidade: i.dataValidade || null,
    })),
  });

  if (criado) {
    limparPreview();
    await router.push({ name: 'recebimento-compra-detalhe', params: { id: criado.id } });
  }
}

onMounted(async () => {
  void carregarFornecedores();
  void carregarProdutos();
  const pedidoId = route.query.pedidoCompraId;
  if (typeof pedidoId === 'string' && pedidoId) {
    pedidoCompraId.value = pedidoId;
    const recebimento = await receberPedido(pedidoId);
    if (recebimento) {
      await router.replace({
        name: 'recebimento-compra-detalhe',
        params: { id: recebimento.id },
      });
      return;
    }
  }
});
</script>

<style scoped>
.form-grid {
  display: grid;
  gap: var(--spacing-6);
}
.titulo {
  margin: 0 0 var(--spacing-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.acoes-xml {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
.texto-sefaz {
  margin: var(--spacing-3) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.itens-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-4) 0 var(--spacing-3);
}
</style>
