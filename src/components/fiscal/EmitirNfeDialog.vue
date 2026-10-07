<template>
  <q-dialog :model-value="modelValue" persistent @hide="aoFechar" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="emitir-nota-card">
      <q-card-section class="text-h6">Emitir nota do pedido</q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="confirmar">
          <q-select
            v-model="pedidoId"
            outlined
            use-input
            fill-input
            hide-selected
            input-debounce="300"
            label="Pedido aprovado ou faturado"
            hint="Busque por cliente, data, valor ou situação"
            :options="opcoesPedidosFiltradas"
            emit-value
            map-options
            :loading="carregando"
            :rules="[obrigatorio]"
            @filter="filtrarPedidos"
            @update:model-value="carregarCliente"
          >
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.cliente }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.data }} — {{ scope.opt.valor }} — {{ scope.opt.situacao }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template #no-option>
              <q-item>
                <q-item-section>Nenhum pedido encontrado.</q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-banner v-if="cliente" class="bg-grey-2">{{ cliente.nomeRazao }} — {{ cliente.documento }}</q-banner>
          <q-select v-model="form.homologacao" outlined label="Ambiente" :options="[{ label: 'Homologação (teste)', value: true }, { label: 'Produção (nota com validade fiscal)', value: false }]" emit-value map-options />
          <q-select
            v-model="form.enderecoId"
            outlined
            label="Endereço do destinatário"
            :options="opcoesEndereco"
            emit-value
            map-options
            :loading="carregandoCliente"
            :disable="!cliente"
            :hint="opcoesEndereco.length === 0 ? mensagemEndereco : undefined"
            :rules="[obrigatorio]"
            @update:model-value="aplicarMunicipio"
          >
            <template #no-option>
              <q-item>
                <q-item-section>{{ mensagemEndereco }}</q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-banner v-if="sugestao" class="sugestao-modelo">{{ sugestao.motivo }}</q-banner>
          <q-select
            v-model="documento"
            outlined
            label="Documento"
            :options="opcoesDocumento"
            emit-value
            map-options
            :loading="consultandoSugestao"
            :disable="!sugestao"
            :hint="sugestao && !sugestao.nfceDisponivel ? sugestao.motivoNfceIndisponivel ?? undefined : undefined"
            @update:model-value="aplicarModelo"
          />
          <q-input v-model="form.codigoMunicipioDestinatario" outlined label="Código IBGE do destinatário" mask="#######" :rules="[v => /^\d{7}$/.test(v) || 'Informe 7 dígitos']" />
          <q-input v-model="form.naturezaOperacao" outlined label="Natureza da operação" maxlength="60" :rules="[obrigatorio]" />
          <q-select v-if="!nfce" v-model="form.indicadorInscricaoEstadual" outlined label="Indicador de IE do destinatário" :options="opcoesIndicador" emit-value map-options @update:model-value="aoMudarIndicador" />
          <q-input v-if="!nfce && form.indicadorInscricaoEstadual === 1" v-model="form.inscricaoEstadualDestinatario" outlined label="Inscrição estadual do destinatário" :rules="[v => /^[0-9]{2,14}$/.test(v || '') || 'Informe a IE']" />
          <q-select v-model="form.presencaComprador" outlined label="Presença do comprador" :options="opcoesPresenca" emit-value map-options />
          <q-select v-model="form.formaPagamento" outlined label="Pagamento informado na nota" :options="opcoesPagamento" emit-value map-options :rules="[obrigatorio]" />
          <q-checkbox v-model="form.consumidorFinal" :disable="nfce" label="Destinatário é consumidor final" />
          <q-banner class="bg-blue-1">{{ textoDocumento }}</q-banner>
          <div v-if="mensagemErro" class="emitir-nota-erro">
            <p class="emitir-nota-erro__texto">{{ mensagemErro }}</p>
            <p v-if="caminhoParametrizacao" class="emitir-nota-erro__dica">
              Para parametrizar, abra
              <router-link class="emitir-nota-erro__caminho" :to="caminhoParametrizacao.to">
                {{ caminhoParametrizacao.rotulo }}
              </router-link>
            </p>
          </div>
          <div class="row justify-end q-gutter-sm">
            <agro-btn flat label="Fechar" descricao="Fechar emissão" :disable="salvando" @click="emit('update:modelValue', false)" />
            <agro-btn type="submit" color="primary" unelevated :label="rotuloEmitir" descricao="Enviar pedido para autorização fiscal" :loading="salvando" :disable="carregando || consultandoSugestao || !sugestao" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { useNotificacao } from 'composables/useNotificacao';
import { useEmitirNotaPedido } from 'composables/useEmitirNotaPedido';
import { obrigatorio } from 'utils/validators';
import { computed, ref } from 'vue';
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [boolean]; emitida: [] }>();
const { sucesso } = useNotificacao();
const avisarSucesso = ref(false);
const aberto = computed(() => props.modelValue);
const {
  pedidoId, cliente, sugestao, documento, form, nfce, carregando, carregandoCliente, consultandoSugestao,
  salvando, resultado, mensagemErro, caminhoParametrizacao, opcoesPedidosFiltradas, opcoesEndereco, opcoesDocumento, opcoesPresenca, opcoesIndicador,
  opcoesPagamento, mensagemEndereco, textoDocumento, rotuloEmitir, aplicarMunicipio, aplicarModelo,
  aoMudarIndicador, carregarCliente, filtrarPedidos, enviar,
} = useEmitirNotaPedido(aberto);
async function confirmar(): Promise<void> {
  await enviar();
  if (!resultado.value) return;
  emit('emitida');
  avisarSucesso.value = true;
  emit('update:modelValue', false);
}

function aoFechar(): void {
  if (!avisarSucesso.value) return;
  avisarSucesso.value = false;
  sucesso('A nota foi enviada e será processada pela SEFAZ. Se quiser acompanhar, consulte a tabela.');
}
</script>
<style scoped>
.emitir-nota-card { width: 720px; max-width: 95vw; }
.sugestao-modelo {
  background: var(--color-info-50);
  color: var(--color-info-700);
  border-radius: var(--radius-md);
}

.emitir-nota-erro {
  background: var(--color-error-50);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  user-select: text;
}

.emitir-nota-erro__texto,
.emitir-nota-erro__dica {
  margin: 0;
  overflow-wrap: anywhere;
  user-select: text;
}

.emitir-nota-erro__caminho {
  color: var(--color-primary-500);
  font-weight: var(--font-weight-semibold);
  user-select: text;
}
</style>
