<template>
  <q-page class="agro-page">
    <app-page-header titulo="Transportadora" :subtitulo="transportadora?.nome ?? ''" />

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && !transportadora" :campos="4" />
      <template v-else-if="transportadora">
        <agro-card class="q-mb-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <div class="text-caption">Nome</div>
              <div>{{ transportadora.nome }}</div>
            </div>
            <div class="col-6 col-md-4">
              <div class="text-caption">CNPJ</div>
              <div class="text-metric">{{ formatarCnpj(transportadora.cnpj) }}</div>
            </div>
            <div class="col-6 col-md-4">
              <div class="text-caption">RNTRC</div>
              <div>{{ transportadora.rntrc ?? '—' }}</div>
            </div>
            <div class="col-6 col-md-4">
              <div class="text-caption">Telefone</div>
              <div>{{ transportadora.telefone ? formatarTelefone(transportadora.telefone) : '—' }}</div>
            </div>
            <div class="col-6 col-md-4">
              <div class="text-caption">E-mail</div>
              <div>{{ transportadora.email ?? '—' }}</div>
            </div>
          </div>
        </agro-card>

        <agro-card>
          <div class="header">
            <h3 class="titulo-sec">Tabela de fretes</h3>
          </div>

          <div class="add-frete row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-3">
              <q-input v-model="formFrete.regiao" outlined dense label="Região" />
            </div>
            <div class="col-6 col-md-2">
              <AgroMoneyInput v-model="formFrete.valorPorKg" dense label="R$/kg" />
            </div>
            <div class="col-6 col-md-2">
              <AgroMoneyInput v-model="formFrete.valorMinimo" dense label="Mínimo" />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="formFrete.prazoDias" outlined dense label="Prazo (dias)" type="number" />
            </div>
            <div class="col-6 col-md-3">
              <agro-btn
                color="primary"
                unelevated
                label="Adicionar frete"
                descricao="Adicionar frete"
                :loading="salvando"
                @click="salvarFrete"
              />
            </div>
          </div>

          <empty-state
            v-if="!transportadora.fretes?.length"
            titulo="Sem fretes"
            descricao="Adicione a primeira faixa de frete."
            icon="local_shipping"
          />
          <q-table
            v-else
            flat
            bordered
            row-key="id"
            :rows="transportadora.fretes"
            :columns="colunas"
            hide-pagination
            :rows-per-page-options="[0]"
          >
            <template #body-cell-valorPorKg="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorPorKg) }}</q-td>
            </template>
            <template #body-cell-valorMinimo="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorMinimo) }}</q-td>
            </template>
            <template #body-cell-acoes="props">
              <q-td :props="props">
                <agro-acoes-menu
                  :mostrar-visualizar="false"
                  :mostrar-editar="false"
                  :mostrar-status="false"
                  mostrar-excluir
                  :loading-excluir="salvando"
                  excluir-label="Remover frete"
                  @excluir="removerFrete(id, props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </agro-card>
      </template>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { freteVazio, useLogistica } from 'composables/useLogistica';
import type { QTableColumn } from 'quasar';
import type { FreteTransportadoraDto, FreteTransportadoraFormModel } from 'types/dtos/logistica.dto';
import { formatarCnpj, formatarMoeda, formatarTelefone } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = computed(() => String(route.params.id));
const {
  transportadora,
  carregando,
  salvando,
  obterTransportadora,
  adicionarFrete,
  removerFrete,
} = useLogistica();

const formFrete = ref<FreteTransportadoraFormModel>(freteVazio());

const colunas: QTableColumn<FreteTransportadoraDto>[] = [
  { name: 'regiao', label: 'Região', field: 'regiao', align: 'left' },
  { name: 'valorPorKg', label: 'R$/kg', field: 'valorPorKg', align: 'right' },
  { name: 'valorMinimo', label: 'Mínimo', field: 'valorMinimo', align: 'right' },
  { name: 'prazoDias', label: 'Prazo (dias)', field: 'prazoDias', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

async function salvarFrete(): Promise<void> {
  const ok = await adicionarFrete(id.value, formFrete.value);
  if (ok) formFrete.value = freteVazio();
}

onMounted(() => {
  void obterTransportadora(id.value);
});
</script>

<style scoped>
.header {
  margin-bottom: var(--spacing-3);
}
.titulo-sec {
  margin: 0;
  font-size: var(--font-size-md);
  font-family: var(--font-family-display);
}
</style>
