<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header
      titulo="Nova devolução"
      subtitulo="Busque a NF de origem e informe destino do estoque e crédito."
    />

    <section class="agro-section">
      <agro-card>
        <q-form greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.buscaNf"
                outlined
                label="Número ou chave da NF-e"
                hint="Busca o pedido de origem"
              >
                <template #append>
                  <agro-btn
                    flat
                    dense
                    icon="search"
                    descricao="Buscar origem pela NF"
                    :loading="buscandoOrigem"
                    @click="buscarOrigem"
                  />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.pedidoVendaId"
                outlined
                label="Pedido de venda"
                emit-value
                map-options
                class="field-required"
                :options="pedidoOpcoes"
                :loading="carregandoPedidos"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.destinoCredito"
                outlined
                label="Destino do crédito"
                class="field-required"
                emit-value
                map-options
                :options="DestinoCreditoDevolucaoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="formulario.observacao" outlined label="Observação" />
            </div>
          </div>

          <q-banner v-if="origem" rounded class="devolucao-form__origem">
            Origem: {{ origem.clienteNome ?? origem.clienteId }} · NF
            {{ origem.notaFiscalNumero ?? '—' }} ·
            {{ formatarMoeda(origem.valorTotal) }}
          </q-banner>

          <div class="header">
            <h3 class="titulo">Itens</h3>
            <agro-btn flat icon="add" label="Item" descricao="Adicionar item" @click="adicionar" />
          </div>

          <div
            v-for="(item, index) in formulario.itens"
            :key="item.chave"
            class="row q-col-gutter-md q-mb-sm"
          >
            <div class="col-12 col-md-4">
              <agro-select-cadastro
                v-model="item.produtoId"
                entidade="produto"
                dense
                label="Produto"
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
                @atualizar="carregarProdutos()"
              />
            </div>
            <div class="col-4 col-md-1">
              <q-input
                v-model="item.quantidade"
                outlined
                dense
                label="Qtd"
                type="number"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-8 col-md-2">
              <q-input v-model="item.numeroLote" outlined dense label="Nº lote" />
            </div>
            <div class="col-12 col-md-2">
              <q-select
                v-model="item.destino"
                outlined
                dense
                label="Destino"
                emit-value
                map-options
                :options="DestinoDevolucaoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-10 col-md-2">
              <q-input
                v-if="item.destino === DestinoDevolucao.Descarte"
                v-model="item.justificativaDescarte"
                outlined
                dense
                label="Justificativa"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-2 col-md-1">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover"
                :disable="formulario.itens.length <= 1"
                @click="formulario.itens.splice(index, 1)"
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'devolucoes-venda' }" />
            <agro-btn
              color="primary"
              unelevated
              label="Criar"
              descricao="Criar devolução"
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
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useDevolucoesVenda } from 'composables/useDevolucoesVenda';
import { usePedidosVenda } from 'composables/usePedidosVenda';
import { useProdutos } from 'composables/useProdutos';
import {
  DestinoCreditoDevolucaoOpcoes,
  DestinoDevolucao,
  DestinoDevolucaoOpcoes,
} from 'constants/enums';
import type { DevolucaoItemFormModel, DevolucaoVendaFormModel } from 'types/dtos/devolucao-venda.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

function novoItem(): DevolucaoItemFormModel {
  return {
    chave: crypto.randomUUID(),
    produtoId: '',
    quantidade: '1',
    destino: '',
    loteId: '',
    numeroLote: '',
    justificativaDescarte: '',
  };
}

const router = useRouter();
const { salvando, buscandoOrigem, origem, criar, buscarOrigemPorNf } = useDevolucoesVenda();
const { produtos, carregar: carregarProdutos } = useProdutos();
const {
  pedidos,
  carregando: carregandoPedidos,
  carregar: carregarPedidos,
} = usePedidosVenda();

const formulario = ref<DevolucaoVendaFormModel>({
  pedidoVendaId: '',
  buscaNf: '',
  destinoCredito: '',
  observacao: '',
  itens: [novoItem()],
});

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);

const pedidoOpcoes = computed(() =>
  pedidos.value.map((p) => ({
    label: `${p.id.slice(0, 8)}… · ${formatarMoeda(p.valorTotal)} · ${formatarData(p.createdAt)}`,
    value: p.id,
  })),
);

function adicionar(): void {
  formulario.value.itens.push(novoItem());
}

async function buscarOrigem(): Promise<void> {
  const encontrada = await buscarOrigemPorNf(formulario.value.buscaNf);
  if (!encontrada) {
    return;
  }

  formulario.value.pedidoVendaId = encontrada.pedidoVendaId;
  if (encontrada.itens.length > 0) {
    formulario.value.itens = encontrada.itens.map((item) => ({
      chave: crypto.randomUUID(),
      produtoId: item.produtoId,
      quantidade: String(item.quantidade),
      destino: DestinoDevolucao.Reposicao,
      loteId: item.loteId ?? '',
      numeroLote: item.numeroLote ?? '',
      justificativaDescarte: '',
    }));
  }
}

async function salvar(): Promise<void> {
  const criada = await criar(formulario.value);
  if (criada) await router.push({ name: 'devolucao-venda-detalhe', params: { id: criada.id } });
}

onMounted(() => {
  void carregarProdutos();
  void carregarPedidos();
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-4) 0 var(--spacing-3);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.devolucao-form__origem {
  background: var(--color-surface-muted, var(--color-surface-default));
  margin-bottom: var(--spacing-4);
}
</style>
