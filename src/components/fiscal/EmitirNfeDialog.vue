<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card style="width: 720px; max-width: 95vw">
      <q-card-section class="text-h6">Emitir NF-e do pedido</q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="enviar">
          <q-select v-model="pedidoId" outlined label="Pedido aprovado ou faturado" :options="opcoesPedidos" emit-value map-options :loading="carregando" :rules="[obrigatorio]" @update:model-value="carregarCliente" />
          <q-banner v-if="cliente" class="bg-grey-2">{{ cliente.nomeRazao }} — {{ cliente.documento }}</q-banner>
          <q-select v-model="form.homologacao" outlined label="Ambiente" :options="[{ label: 'Homologação (teste)', value: true }, { label: 'Produção (nota com validade fiscal)', value: false }]" emit-value map-options />
          <q-select v-model="form.enderecoId" outlined label="Endereço do destinatário" :options="enderecos" emit-value map-options :rules="[obrigatorio]" />
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6"><q-input v-model="form.codigoMunicipioDestinatario" outlined label="Código IBGE do destinatário" mask="#######" :rules="[v => /^\d{7}$/.test(v) || 'Informe 7 dígitos']" /></div>
            <div class="col-12 col-md-6"><q-select v-model="form.indicadorInscricaoEstadual" outlined label="Contribuição ao ICMS" :options="[{label:'Contribuinte',value:1},{label:'Isento de inscrição',value:2},{label:'Não contribuinte',value:9}]" emit-value map-options /></div>
            <div v-if="form.indicadorInscricaoEstadual === 1" class="col-12"><q-input v-model="form.inscricaoEstadualDestinatario" outlined label="Inscrição estadual do destinatário" maxlength="14" :rules="[obrigatorio]" /></div>
          </div>
          <q-input v-model="form.naturezaOperacao" outlined label="Natureza da operação" maxlength="60" :rules="[obrigatorio]" />
          <q-select v-model="form.presencaComprador" outlined label="Presença do comprador" :options="[{label:'Presencial',value:1},{label:'Internet',value:2},{label:'Teleatendimento',value:3},{label:'Outros, não presencial',value:9}]" emit-value map-options />
          <q-select v-model="form.formaPagamento" outlined label="Pagamento informado na nota" :options="[{label:'Dinheiro',value:'01'},{label:'Cheque',value:'02'},{label:'Duplicata mercantil',value:'14'},{label:'Boleto',value:'15'},{label:'Depósito bancário',value:'16'},{label:'PIX dinâmico',value:'17'},{label:'Transferência / PIX estático',value:'18'}]" emit-value map-options :rules="[obrigatorio]" />
          <q-checkbox v-model="form.consumidorFinal" label="Destinatário é consumidor final" />
          <q-banner class="bg-blue-1">Os itens e valores vêm do pedido. Confira CFOP, ICMS e PIS/COFINS cadastrados com sua contabilidade. Este fluxo usa operação sem transporte; regras sem parametrização serão apontadas antes do envio.</q-banner>
          <q-banner v-if="resultado" :class="resultado.status === 'Emitida' ? 'bg-green-1' : 'bg-orange-1'">
            {{ resultado.status === 'Emitida' ? 'NF-e autorizada pela Focus.' : `Situação: ${resultado.status}.` }}
            {{ resultado.codigoSefaz }} {{ resultado.mensagemErro }}
          </q-banner>
          <div class="row justify-end q-gutter-sm">
            <agro-btn flat label="Fechar" descricao="Fechar emissão" :disable="salvando" @click="emit('update:modelValue', false)" />
            <agro-btn type="submit" color="primary" :label="form.homologacao ? 'Emitir em homologação' : 'Emitir em produção'" descricao="Enviar pedido para autorização fiscal" :loading="salvando" :disable="carregando || !cliente || Boolean(resultado)" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { pedidoVendaService } from 'services/pedido-venda.service';
import { clienteService } from 'services/cliente.service';
import { fiscalGestaoService, type EmitirNfePayload } from 'services/fiscal-gestao.service';
import type { ClienteDto } from 'types/dtos/cliente.dto';
import type { PedidoVendaResumoDto } from 'types/dtos/pedido-venda.dto';
import type { NotaFiscalGestaoDto } from 'types/dtos/fiscal-gestao.dto';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [boolean]; emitida: [] }>();
const pedidos = ref<PedidoVendaResumoDto[]>([]);
const pedidoId = ref('');
const cliente = ref<ClienteDto | null>(null);
const carregando = ref(false);
const salvando = ref(false);
const resultado = ref<NotaFiscalGestaoDto | null>(null);
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();
const form = reactive<EmitirNfePayload>({ homologacao: true, enderecoId: '', indicadorInscricaoEstadual: 9, codigoMunicipioDestinatario: '', inscricaoEstadualDestinatario: '', consumidorFinal: false, presencaComprador: 1, naturezaOperacao: 'Venda de mercadoria', formaPagamento: '' });
const opcoesPedidos = computed(() => pedidos.value.map(p => ({label:`${p.id.slice(0,8)} — ${formatarMoeda(p.valorTotal)} — ${p.status}`,value:p.id})));
const enderecos = computed(() => cliente.value?.enderecos.map(e => ({value:e.id,label:`${e.endereco.logradouro}, ${e.endereco.numero} — ${e.endereco.cidade}/${e.endereco.estado}`})) ?? []);
let versao = 0;
async function carregarCliente(): Promise<void> {
  const atual = ++versao;
  cliente.value = null; form.enderecoId = ''; form.codigoMunicipioDestinatario = ''; form.inscricaoEstadualDestinatario = ''; resultado.value = null;
  const pedido = pedidos.value.find(p => p.id === pedidoId.value);
  if (!pedido) return;
  carregando.value = true;
  try { const c = await clienteService.obter(pedido.clienteId); if (atual === versao) { cliente.value = c; form.enderecoId = c.enderecos[0]?.id ?? ''; } }
  catch (e) { erro(mensagem(e)); }
  finally { if (atual === versao) carregando.value = false; }
}
async function enviar(): Promise<void> {
  salvando.value = true;
  try {
    resultado.value = await fiscalGestaoService.emitirNfe(pedidoId.value, {...form, inscricaoEstadualDestinatario: form.indicadorInscricaoEstadual === 1 ? form.inscricaoEstadualDestinatario : null});
    emit('emitida');
  } catch (e) { erro(mensagem(e)); }
  finally { salvando.value = false; }
}
watch(() => props.modelValue, async aberto => {
  if (!aberto) return;
  resultado.value = null; pedidoId.value = ''; cliente.value = null; form.homologacao = true;
  carregando.value = true;
  try { pedidos.value = (await pedidoVendaService.listar()).filter(p => ['Aprovado','Faturado'].includes(p.status)); }
  catch (e) { erro(mensagem(e)); }
  finally { carregando.value = false; }
});
</script>
