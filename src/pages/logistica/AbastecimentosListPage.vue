<template>
  <q-page class="agro-page">
    <app-page-header titulo="Abastecimentos" subtitulo="Registro de combustível por veículo.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Registrar"
        descricao="Novo abastecimento"
        @click="abrirCriar"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroVeiculoId"
            outlined
            dense
            label="Veículo"
            emit-value
            map-options
            clearable
            :options="veiculoOpcoes"
            class="filtro"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Filtrar"
            descricao="Aplicar filtros"
            :loading="carregando"
            @click="aplicar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && abastecimentos.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && abastecimentos.length === 0"
          titulo="Nenhum abastecimento"
          descricao="Registre o primeiro abastecimento."
          icon="local_gas_station"
        >
          <agro-btn color="primary" unelevated label="Registrar" descricao="Novo" @click="abrirCriar" />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="abastecimentos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-data="props">
            <q-td :props="props">{{ formatarData(props.row.data) }}</q-td>
          </template>
          <template #body-cell-litros="props">
            <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.litros) }}</q-td>
          </template>
          <template #body-cell-precoLitro="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.precoLitro) }}</q-td>
          </template>
          <template #body-cell-valorTotal="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorTotal) }}</q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
                :mostrar-excluir="true"
                :loading-excluir="salvando"
                @excluir="onRemover(props.row.id)"
               @visualizar="abrirDialogVisualizar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogCriar" persistent>
      <q-card class="dialog-card">
        <q-card-section>
          <div class="text-h6">{{ somenteLeitura ? 'Visualizar abastecimento' : 'Registrar abastecimento' }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
            <agro-select-cadastro
              v-model="formulario.veiculoId"
              entidade="veiculo"
              label="Veículo"
              class="field-required q-mb-md"
              :options="veiculoOpcoes"
              :rules="[obrigatorio]"
              :readonly="somenteLeitura"
              :desabilitar-cadastro="somenteLeitura"
              @atualizar="carregarVeiculos()" />
            <q-input
              v-model="formulario.data"
              outlined
              label="Data"
              type="date"
              class="field-required q-mb-md"
              :rules="[obrigatorio]" :readonly="somenteLeitura" />
            <q-input
              v-model="formulario.kmHodometro"
              outlined
              label="Km hodômetro"
              type="number"
              class="field-required q-mb-md"
              :rules="[obrigatorio]" :readonly="somenteLeitura" />
            <q-input
              v-model="formulario.litros"
              outlined
              label="Litros"
              type="number"
              step="0.01"
              class="field-required q-mb-md"
              :rules="[obrigatorio]" :readonly="somenteLeitura" />
            <AgroMoneyInput
              v-model="formulario.precoLitro"
              label="Preço/litro"
              class="field-required q-mb-md"
              :rules="[obrigatorio]" :readonly="somenteLeitura" />
            <q-select
              v-model="formulario.combustivel"
              outlined
              label="Combustível"
              emit-value
              map-options
              class="field-required q-mb-md"
              :options="TipoCombustivelLogisticaOpcoes"
              :rules="[obrigatorio]" :readonly="somenteLeitura" />
            <q-input v-model="formulario.posto" outlined label="Posto" class="q-mb-md" :readonly="somenteLeitura" />
            <q-input v-model="formulario.motoristaNome" outlined label="Motorista" class="q-mb-md" :readonly="somenteLeitura" />
            <div class="agro-form-actions">
              <template v-if="somenteLeitura">
                <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogCriar = false" />
              </template>
              <template v-else>
                <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogCriar = false" />
                <agro-btn color="primary" unelevated label="Registrar" type="submit" :loading="salvando" />
              </template>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { abastecimentoVazio, useLogistica } from 'composables/useLogistica';
import { TipoCombustivelLogisticaOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  AbastecimentoLogisticaDto,
  AbastecimentoLogisticaFormModel,
} from 'types/dtos/logistica.dto';
import { formatarData, formatarDecimal, formatarMoeda, formatarMoedaParaInput } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';


const {
  abastecimentos,
  veiculos,
  carregando,
  salvando,
  carregarAbastecimentos,
  carregarVeiculos,
  criarAbastecimento,
  removerAbastecimento,
} = useLogistica();

const filtroVeiculoId = ref<string | null>(null);
const dialogCriar = ref(false);
const somenteLeitura = ref(false);
const formulario = ref<AbastecimentoLogisticaFormModel>(abastecimentoVazio());

const veiculoOpcoes = computed(() =>
  veiculos.value.map((v) => ({ label: v.placa, value: v.id })),
);

function placaVeiculo(veiculoId: string): string {
  return veiculos.value.find((v) => v.id === veiculoId)?.placa ?? veiculoId;
}

const colunas: QTableColumn<AbastecimentoLogisticaDto>[] = [
  { name: 'data', label: 'Data', field: 'data', align: 'left', sortable: true },
  { name: 'veiculoId', label: 'Veículo', field: (r) => placaVeiculo(r.veiculoId), align: 'left' },
  { name: 'combustivel', label: 'Combustível', field: 'combustivel', align: 'left' },
  { name: 'litros', label: 'Litros', field: 'litros', align: 'right' },
  { name: 'precoLitro', label: 'Preço/L', field: 'precoLitro', align: 'right' },
  { name: 'valorTotal', label: 'Total', field: 'valorTotal', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function aplicar(): void {
  void carregarAbastecimentos({
    veiculoId: filtroVeiculoId.value || undefined,
  });
}

function abrirCriar(): void {
  somenteLeitura.value = false;
  formulario.value = abastecimentoVazio();
  dialogCriar.value = true;
}

function abrirDialogVisualizar(item: AbastecimentoLogisticaDto): void {
  somenteLeitura.value = true;
  formulario.value = {
    veiculoId: item.veiculoId,
    data: item.data.slice(0, 10),
    kmHodometro: String(item.kmHodometro),
    litros: String(item.litros),
    precoLitro: formatarMoedaParaInput(item.precoLitro),
    combustivel: item.combustivel,
    posto: item.posto ?? '',
    motoristaNome: item.motoristaNome ?? '',
  };
  dialogCriar.value = true;
}

async function salvar(): Promise<void> {
  const criado = await criarAbastecimento(formulario.value);
  if (criado) {
    dialogCriar.value = false;
    aplicar();
  }
}

async function onRemover(id: string): Promise<void> {
  if (await removerAbastecimento(id)) aplicar();
}

onMounted(async () => {
  await carregarVeiculos();
  aplicar();
});
</script>

<style scoped>
.filtro {
  min-width: 180px;
}
.dialog-card {
  min-width: min(480px, 92vw);
  background: var(--color-surface-default);
}
</style>
