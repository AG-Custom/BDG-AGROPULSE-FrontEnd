<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Cálculo de impostos"
      subtitulo="Simulação de ICMS ST, DIFAL, FCP e diferimento."
    />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="onCalcular">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <agro-select-cadastro
                v-model="form.produtoId"
                entidade="produto"
                label="Produto"
                class="field-required"
                :options="produtoOpcoes"
                :loading="carregandoProdutos"
                :rules="[obrigatorio]"
                @atualizar="carregarProdutos()"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model="form.quantidade"
                outlined
                label="Quantidade"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-2">
              <AgroMoneyInput
                v-model="form.valor"
                label="Valor"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model="form.ufDestino"
                outlined
                label="UF destino"
                maxlength="2"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-select
                v-model="form.tipoDestinatario"
                outlined
                emit-value
                map-options
                label="Destinatário"
                class="field-required"
                :options="TipoDestinatarioFiscalOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn
              color="primary"
              unelevated
              label="Calcular"
              type="submit"
              :loading="calculando"
            />
          </div>
        </q-form>

        <div v-if="resultado" class="resultado q-mt-lg">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6 col-md-2">
              <span class="label">Total base ST</span>
              <p class="text-metric">{{ formatarMoeda(resultado.totalBaseSt) }}</p>
            </div>
            <div class="col-6 col-md-2">
              <span class="label">Total ST</span>
              <p class="text-metric">{{ formatarMoeda(resultado.totalSt) }}</p>
            </div>
            <div class="col-6 col-md-2">
              <span class="label">Total DIFAL</span>
              <p class="text-metric">{{ formatarMoeda(resultado.totalDifal) }}</p>
            </div>
            <div class="col-6 col-md-2">
              <span class="label">Total FCP</span>
              <p class="text-metric">{{ formatarMoeda(resultado.totalFcp) }}</p>
            </div>
            <div class="col-6 col-md-2">
              <span class="label">Diferimento</span>
              <p class="text-metric">{{ formatarMoeda(resultado.totalDiferimento) }}</p>
            </div>
          </div>
          <q-table
            flat
            bordered
            row-key="produtoId"
            :rows="resultado.itens"
            :columns="colunas"
            :rows-per-page-options="[10, 25]"
          >
            <template #body-cell-produtoId="props">
              <q-td :props="props">
                {{ mapaProdutos.get(props.row.produtoId) ?? props.row.produtoId }}
              </q-td>
            </template>
            <template #body-cell-baseSt="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.baseSt) }}</q-td>
            </template>
            <template #body-cell-valorSt="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorSt) }}</q-td>
            </template>
            <template #body-cell-difal="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.difal) }}</q-td>
            </template>
            <template #body-cell-fcp="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.fcp) }}</q-td>
            </template>
            <template #body-cell-diferimento="props">
              <q-td :props="props" class="text-metric">
                {{ formatarMoeda(props.row.diferimento) }}
              </q-td>
            </template>
          </q-table>
        </div>
      </agro-card>

      <agro-card class="q-mt-md">
        <h3 class="titulo">Sugestão tributária completa</h3>
        <q-form greedy class="agro-formulario" @submit.prevent="onSugerir">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <agro-select-cadastro
                v-model="sugestaoForm.produtoId"
                entidade="produto"
                label="Produto"
                class="field-required"
                :options="produtoOpcoes"
                :loading="carregandoProdutos"
                :rules="[obrigatorio]"
                @atualizar="carregarProdutos()"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="sugestaoForm.ufDestino" outlined label="UF destino" maxlength="2" />
            </div>
            <div class="col-6 col-md-3">
              <q-select
                v-model="sugestaoForm.tipoDestinatario"
                outlined
                clearable
                emit-value
                map-options
                label="Destinatário"
                :options="TipoDestinatarioFiscalOpcoes"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="sugestaoForm.naturezaOperacao" outlined label="Natureza da operação" />
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn color="primary" unelevated label="Sugerir" type="submit" :loading="sugerindo" />
          </div>
        </q-form>
        <div v-if="sugestaoCompleta" class="resultado q-mt-md">
          <p>
            CFOP: <span class="text-metric">{{ sugestaoCompleta.cfop }}</span>
            · NCM: <span class="text-metric">{{ sugestaoCompleta.ncm }}</span>
            · ICMS: <span class="text-metric">{{ sugestaoCompleta.aliquota }}%</span>
          </p>
          <p class="text-caption">
            Natureza: {{ sugestaoCompleta.natureza }} · CST: {{ sugestaoCompleta.cst }} · CSOSN:
            {{ sugestaoCompleta.csosn }} · ST: {{ sugestaoCompleta.icmsSt ? 'Sim' : 'Não' }} · DIFAL:
            {{ sugestaoCompleta.difal }} · PIS/COFINS: {{ sugestaoCompleta.pisCofinsCst }}
            ({{ sugestaoCompleta.pisCofinsAliquota }}%)
          </p>
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useCalculoImpostos } from 'composables/useCalculoImpostos';
import { useFiscal } from 'composables/useFiscal';
import { useProdutos } from 'composables/useProdutos';
import {
  TipoDestinatarioFiscalOpcoes,
  type TipoDestinatarioFiscalValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { CalculoImpostosItemDto } from 'types/dtos/fiscal-gestao.dto';
import { formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, reactive, ref } from 'vue';

const { resultado, calculando, calcular } = useCalculoImpostos();
const { sugestaoCompleta, sugerirCompleto } = useFiscal();
const {
  produtos,
  carregando: carregandoProdutos,
  carregar: carregarProdutos,
} = useProdutos();
const sugerindo = ref(false);

const form = reactive({
  produtoId: '',
  quantidade: '1',
  valor: '',
  ufDestino: '',
  tipoDestinatario: '' as TipoDestinatarioFiscalValor | '',
});

const sugestaoForm = reactive({
  produtoId: '',
  ufDestino: '',
  tipoDestinatario: null as TipoDestinatarioFiscalValor | null,
  naturezaOperacao: '',
});

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);

const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const colunas: QTableColumn<CalculoImpostosItemDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'baseSt', label: 'Base ST', field: 'baseSt', align: 'right' },
  { name: 'valorSt', label: 'Valor ST', field: 'valorSt', align: 'right' },
  { name: 'difal', label: 'DIFAL', field: 'difal', align: 'right' },
  { name: 'fcp', label: 'FCP', field: 'fcp', align: 'right' },
  { name: 'diferimento', label: 'Diferimento', field: 'diferimento', align: 'right' },
];

async function onCalcular(): Promise<void> {
  await calcular(form);
}

async function onSugerir(): Promise<void> {
  sugerindo.value = true;
  try {
    await sugerirCompleto(sugestaoForm.produtoId.trim(), {
      ufDestino: sugestaoForm.ufDestino || undefined,
      tipoDestinatario: sugestaoForm.tipoDestinatario ?? undefined,
      naturezaOperacao: sugestaoForm.naturezaOperacao || undefined,
    });
  } finally {
    sugerindo.value = false;
  }
}

onMounted(() => {
  void carregarProdutos();
});
</script>

<style scoped>
.titulo {
  margin: 0 0 var(--spacing-4);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.label {
  display: block;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.resultado {
  color: var(--color-text-secondary);
}
</style>
