<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <agro-btn
        color="primary"
        unelevated
        icon="refresh"
        label="Atualizar"
        descricao="Atualizar lista"
        :loading="carregando"
        @click="carregarListaDiaria"
      />
    </div>

    <div class="layout">
      <div class="lista">
        <agro-table-skeleton v-if="carregando && listaDiaria.length === 0" :colunas="3" />
        <empty-state
          v-else-if="!carregando && listaDiaria.length === 0"
          titulo="Lista vazia"
          descricao="Nenhum título vencido na lista diária."
          icon="phone_in_talk"
        />
        <agro-card
          v-for="item in listaDiaria"
          :key="item.contaReceberId"
          interactive
          class="item"
          :class="{ 'item--ativo': selecionado?.contaReceberId === item.contaReceberId }"
          @click="abrirItem(item)"
        >
          <div class="item__topo">
            <div>
              <div class="item__nome">{{ item.clienteNome }}</div>
              <div class="text-caption text-secondary">
                Prioridade {{ item.prioridade }} · {{ item.telefone || 'sem telefone' }}
              </div>
            </div>
            <div class="item__valores">
              <div class="text-metric text-negative">{{ formatarMoeda(item.saldo) }}</div>
              <div class="text-caption">{{ item.diasAtraso }}d atraso</div>
            </div>
          </div>
        </agro-card>
      </div>

      <agro-card v-if="selecionado" class="detalhe">
        <div class="detalhe__header">
          <div>
            <h3 class="secao-titulo">{{ selecionado.clienteNome }}</h3>
            <div class="text-caption text-secondary">
              Venc. {{ formatarData(selecionado.vencimento) }} ·
              {{ formatarMoeda(selecionado.saldo) }} · prioridade {{ selecionado.prioridade }}
            </div>
          </div>
          <agro-btn
            color="primary"
            unelevated
            icon="add"
            label="Registrar"
            descricao="Registrar tentativa"
            @click="dialogTentativa = true"
          />
        </div>

        <h4 class="subtitulo">Tentativas</h4>
        <agro-form-skeleton v-if="carregando && tentativas.length === 0" :campos="2" />
        <empty-state
          v-else-if="tentativas.length === 0"
          titulo="Sem tentativas"
          descricao="Registre o primeiro contato."
          icon="history"
        />
        <div v-else class="tentativas">
          <div v-for="t in tentativas" :key="t.id" class="tentativa">
            <div class="tentativa__topo">
              <agro-badge :label="String(t.canal)" variant="default" />
              <agro-badge :label="String(t.resultado)" variant="info" />
              <span class="text-caption text-secondary">{{ formatarDataHora(t.ocorridoEm) }}</span>
            </div>
            <p v-if="t.observacao" class="text-caption">{{ t.observacao }}</p>
          </div>
        </div>
      </agro-card>
    </div>

    <q-dialog v-model="dialogTentativa" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Registrar tentativa</h4>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="formTentativa.canal"
            outlined
            label="Canal"
            :options="CanalTentativaCobrancaOpcoes"
            emit-value
            map-options
            class="q-mb-md"
          />
          <q-select
            v-model="formTentativa.resultado"
            outlined
            label="Resultado"
            :options="ResultadoTentativaCobrancaOpcoes"
            emit-value
            map-options
            class="q-mb-md"
          />
          <q-input
            v-model="formTentativa.observacao"
            outlined
            label="Observação"
            type="textarea"
            autogrow
          />
          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogTentativa = false" />
            <agro-btn
              color="primary"
              unelevated
              label="Registrar"
              :loading="salvando"
              @click="salvarTentativa"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { tentativaVazia, useCobrancaCredito } from 'composables/useCobrancaCredito';
import {
  CanalTentativaCobrancaOpcoes,
  ResultadoTentativaCobrancaOpcoes,
} from 'constants/enums';
import type { ListaDiariaItemDto } from 'types/dtos/cobranca-credito.dto';
import { formatarData, formatarDataHora, formatarMoeda } from 'utils/formatters';
import { onMounted, reactive, ref } from 'vue';

const {
  listaDiaria,
  tentativas,
  carregando,
  salvando,
  carregarListaDiaria,
  carregarTentativas,
  registrarTentativa,
} = useCobrancaCredito();

const selecionado = ref<ListaDiariaItemDto | null>(null);
const dialogTentativa = ref(false);
const formTentativa = reactive(tentativaVazia());

async function abrirItem(item: ListaDiariaItemDto): Promise<void> {
  selecionado.value = item;
  await carregarTentativas(item.clienteId);
}

async function salvarTentativa(): Promise<void> {
  if (!selecionado.value) return;
  if (
    await registrarTentativa(
      selecionado.value.contaReceberId,
      selecionado.value.clienteId,
      formTentativa,
    )
  ) {
    dialogTentativa.value = false;
    Object.assign(formTentativa, tentativaVazia());
  }
}

onMounted(() => {
  void carregarListaDiaria();
});
</script>

<style scoped>
.painel {
  padding: var(--spacing-4);
}

.layout {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .layout {
    grid-template-columns: 1fr 1fr;
  }
}

.lista {
  display: grid;
  gap: var(--spacing-2);
}

.item {
  cursor: pointer;
}

.item--ativo {
  border-color: var(--color-primary-400);
}

.item__topo {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-3);
}

.item__nome {
  font-weight: var(--font-weight-semibold);
}

.item__valores {
  text-align: right;
  display: grid;
  gap: var(--spacing-1);
  justify-items: end;
}

.detalhe__header {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.subtitulo {
  margin: 0 0 var(--spacing-2);
  font-size: var(--font-size-sm);
}

.tentativas {
  display: grid;
  gap: var(--spacing-2);
}

.tentativa {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
}

.tentativa__topo {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  align-items: center;
  margin-bottom: var(--spacing-1);
}

.dialog {
  min-width: min(480px, 92vw);
}

.titulo {
  margin: 0;
}

.secao-titulo {
  margin: 0;
}
</style>
