<template>
  <q-dialog :model-value="detalhe != null" @update:model-value="emit('fechar')">
    <q-card v-if="detalhe" class="documento-dialog">
      <q-card-section>
        <h4 class="documento-dialog__titulo">
          Documento {{ detalhe.documento.numero ?? 's/n' }}
          <span v-if="detalhe.documento.serie">/ série {{ detalhe.documento.serie }}</span>
        </h4>
        <p class="documento-dialog__chave text-metric">{{ detalhe.documento.chaveAcesso ?? 'Sem chave de acesso' }}</p>
      </q-card-section>

      <q-card-section v-if="detalhe.pendencias.length > 0">
        <h5 class="documento-dialog__secao">Pendências</h5>
        <ul class="documento-dialog__pendencias">
          <li v-for="pendencia in detalhe.pendencias" :key="pendencia.id" class="documento-dialog__pendencia">
            <agro-badge
              :label="pendencia.gravidade"
              :variant="pendencia.gravidade === 'Bloqueante' ? 'error' : 'warning'"
            />
            <span>
              <template v-if="pendencia.numeroItem != null">Item {{ pendencia.numeroItem }}: </template>
              {{ pendencia.descricao }}
            </span>
          </li>
        </ul>
      </q-card-section>

      <q-card-section>
        <h5 class="documento-dialog__secao">Itens</h5>
        <q-table
          flat
          bordered
          dense
          row-key="id"
          :rows="detalhe.itens"
          :columns="colunas"
          :pagination="{ rowsPerPage: 0 }"
          hide-pagination
          no-data-label="Documento sem itens escriturados"
        />
      </q-card-section>

      <q-card-actions align="right">
        <agro-btn flat label="Fechar" descricao="Fechar" @click="emit('fechar')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import type { QTableColumn } from 'quasar';
import type { DocumentoEscrituradoDetalheDto, ItemEscrituradoDto } from 'types/dtos/escrituracao.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';

defineProps<{ detalhe: DocumentoEscrituradoDetalheDto | null }>();

const emit = defineEmits<{ fechar: [] }>();

const vazio = '—';

function texto(valor: string | null): string {
  return valor && valor.length > 0 ? valor : vazio;
}

function moeda(valor: number | null): string {
  return valor == null ? vazio : formatarMoeda(valor);
}

function cst(item: ItemEscrituradoDto): string {
  return texto(item.cstIcms ?? item.csosn);
}

const colunas: QTableColumn<ItemEscrituradoDto>[] = [
  { name: 'numeroItem', label: '#', field: 'numeroItem', align: 'left' },
  { name: 'descricao', label: 'Item', field: (i) => `${i.codigoProduto} ${i.descricao ?? ''}`, align: 'left' },
  { name: 'ncm', label: 'NCM', field: (i) => texto(i.ncm), align: 'left' },
  { name: 'cfop', label: 'CFOP', field: (i) => texto(i.cfop), align: 'left' },
  { name: 'quantidade', label: 'Qtd.', field: (i) => formatarDecimal(i.quantidade, 4), align: 'right' },
  { name: 'valorTotal', label: 'Valor', field: (i) => moeda(i.valorTotal), align: 'right' },
  { name: 'cstIcms', label: 'CST ICMS', field: cst, align: 'left' },
  { name: 'valorIcms', label: 'ICMS', field: (i) => moeda(i.valorIcms), align: 'right' },
  { name: 'cstIpi', label: 'CST IPI', field: (i) => texto(i.cstIpi), align: 'left' },
  { name: 'valorIpi', label: 'IPI', field: (i) => moeda(i.valorIpi), align: 'right' },
  { name: 'cstPis', label: 'CST PIS', field: (i) => texto(i.cstPis), align: 'left' },
  { name: 'valorPis', label: 'PIS', field: (i) => moeda(i.valorPis), align: 'right' },
  { name: 'cstCofins', label: 'CST COFINS', field: (i) => texto(i.cstCofins), align: 'left' },
  { name: 'valorCofins', label: 'COFINS', field: (i) => moeda(i.valorCofins), align: 'right' },
];
</script>

<style scoped>
.documento-dialog {
  max-width: 96vw;
  width: 72rem;
}

.documento-dialog__titulo {
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  margin: 0;
}

.documento-dialog__chave {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  margin: var(--spacing-1) 0 0;
}

.documento-dialog__secao {
  font-size: var(--font-size-md);
  margin: 0 0 var(--spacing-2);
}

.documento-dialog__pendencias {
  display: grid;
  gap: var(--spacing-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.documento-dialog__pendencia {
  align-items: center;
  display: flex;
  gap: var(--spacing-3);
}
</style>
