<template>
  <q-page class="agro-page">
    <app-page-header titulo="Contrato" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="contrato?.status === ContratoStatus.Aberto"
          flat
          icon="edit"
          label="Editar"
          descricao="Editar contrato"
          :to="{ name: 'contrato-editar', params: { id }, query: { tipo } }"
        />
        <agro-btn
          v-if="contrato?.status === ContratoStatus.Aberto"
          color="primary"
          unelevated
          label="Liquidar"
          descricao="Liquidar contrato"
          :loading="salvando"
          @click="liquidar(id)"
        />
        <agro-btn
          v-if="contrato?.status === ContratoStatus.Liquidado"
          color="primary"
          unelevated
          label="Entregar"
          descricao="Marcar como entregue"
          :loading="salvando"
          @click="entregar(id)"
        />
        <agro-btn
          v-if="contrato?.status === ContratoStatus.Aberto"
          color="negative"
          unelevated
          label="Cancelar"
          descricao="Cancelar contrato"
          :loading="salvando"
          @click="cancelar(id)"
        />
      </div>
    </app-page-header>

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && !contrato" :campos="6" />
      <agro-card v-else-if="contrato">
        <div class="row q-col-gutter-md">
          <div class="col-md-3">
            <div class="text-caption">Status</div>
            <agro-badge :label="contrato.status" variant="default" />
          </div>
          <div class="col-md-3">
            <div class="text-caption">Cliente</div>
            <div>{{ rotuloCliente(contrato.clienteId) }}</div>
          </div>
          <div class="col-md-3">
            <div class="text-caption">Produto</div>
            <div>{{ rotuloProduto(contrato.produtoId) }}</div>
          </div>
          <div class="col-md-3">
            <div class="text-caption">Preço</div>
            <div class="text-metric">{{ formatarMoeda(contrato.preco) }}</div>
          </div>
          <div class="col-md-3">
            <div class="text-caption">Quantidade</div>
            <div class="text-metric">{{ formatarDecimal(contrato.quantidade) }}</div>
          </div>
          <div class="col-md-3">
            <div class="text-caption">Fonte</div>
            <div>{{ contrato.fontePreco }}</div>
          </div>
          <div class="col-md-3">
            <div class="text-caption">Início</div>
            <div>{{ formatarData(contrato.dataInicio) }}</div>
          </div>
          <div class="col-md-3">
            <div class="text-caption">Fim</div>
            <div>{{ formatarData(contrato.dataFim) }}</div>
          </div>
        </div>
      </agro-card>
      <div class="agro-form-actions">
        <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'contratos', query: { tipo } }" />
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useClientes } from 'composables/useClientes';
import { useContratos } from 'composables/useContratos';
import { useProdutos } from 'composables/useProdutos';
import {
  ContratoStatus,
  TipoContrato,
  type TipoContratoValor,
} from 'constants/enums';
import { formatarData, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tipo = computed(
  () => (route.query.tipo as TipoContratoValor) || TipoContrato.Cpr,
);
const id = computed(() => route.params.id as string);

const {
  contrato,
  carregando,
  salvando,
  obter,
  liquidar,
  entregar,
  cancelar,
} = useContratos(tipo);

const { clientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();

const subtitulo = computed(() =>
  contrato.value ? `Status: ${contrato.value.status}` : 'Carregando...',
);

const mapaClientes = computed(() => {
  const m = new Map<string, string>();
  for (const c of clientes.value) m.set(c.id, c.nomeRazao);
  return m;
});
const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.codigo} — ${p.descricao}`);
  return m;
});

function rotuloCliente(cid: string): string {
  return mapaClientes.value.get(cid) ?? cid;
}
function rotuloProduto(pid: string): string {
  return mapaProdutos.value.get(pid) ?? pid;
}

onMounted(async () => {
  void carregarClientes();
  void carregarProdutos();
  const ok = await obter(id.value);
  if (!ok) await router.replace({ name: 'contratos', query: { tipo: tipo.value } });
});
</script>

<style scoped>
.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
</style>
