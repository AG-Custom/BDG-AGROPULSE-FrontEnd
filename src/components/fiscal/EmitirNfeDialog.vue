<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card style="width: 720px; max-width: 95vw">
      <q-card-section class="text-h6">Emitir NFC-e do pedido</q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="enviar">
          <q-select v-model="pedidoId" outlined label="Pedido aprovado ou faturado" :options="opcoesPedidos" emit-value map-options :loading="carregando" :rules="[obrigatorio]" @update:model-value="carregarCliente" />
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
          <q-input v-model="form.codigoMunicipioDestinatario" outlined label="Código IBGE do destinatário" mask="#######" :rules="[v => /^\d{7}$/.test(v) || 'Informe 7 dígitos']" />
          <q-input v-model="form.naturezaOperacao" outlined label="Natureza da operação" maxlength="60" :rules="[obrigatorio]" />
          <q-select v-model="form.presencaComprador" outlined label="Presença do comprador" :options="[{label:'Presencial',value:1},{label:'Entrega a domicílio',value:4}]" emit-value map-options />
          <q-select v-model="form.formaPagamento" outlined label="Pagamento informado na nota" :options="[{label:'Dinheiro',value:'01'},{label:'Cheque',value:'02'},{label:'Duplicata mercantil',value:'14'},{label:'Boleto',value:'15'},{label:'Depósito bancário',value:'16'},{label:'PIX dinâmico',value:'17'},{label:'Transferência bancária / carteira digital',value:'18'},{label:'PIX estático',value:'20'},{label:'Pagamento posterior',value:'91'}]" emit-value map-options :rules="[obrigatorio]" />
          <q-checkbox v-model="form.consumidorFinal" disable label="Destinatário é consumidor final" />
          <q-banner class="bg-blue-1">Os itens e valores vêm do pedido. A NFC-e vale só para venda na mesma UF, com presença presencial ou entrega. Confira CFOP, ICMS e PIS/COFINS cadastrados com sua contabilidade.</q-banner>
          <q-banner v-if="resultado" :class="resultado.status === 'Emitida' ? 'bg-green-1' : 'bg-orange-1'">
            {{ resultado.status === 'Emitida' ? 'NFC-e autorizada pela Focus.' : `Situação: ${resultado.status}.` }}
            {{ resultado.codigoSefaz }} {{ resultado.mensagemErro }}
          </q-banner>
          <div class="row justify-end q-gutter-sm">
            <agro-btn flat label="Fechar" descricao="Fechar emissão" :disable="salvando" @click="emit('update:modelValue', false)" />
            <agro-btn type="submit" color="primary" :label="form.homologacao ? 'Emitir NFC-e em homologação' : 'Emitir NFC-e em produção'" descricao="Enviar pedido para autorização fiscal" :loading="salvando" :disable="carregando || !cliente || Boolean(resultado)" />
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
import type { ClienteDto, ClienteEnderecoDto } from 'types/dtos/cliente.dto';
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
const listaEnderecos = ref<ClienteEnderecoDto[]>([]);
const carregando = ref(false);
const carregandoCliente = ref(false);
const salvando = ref(false);
const resultado = ref<NotaFiscalGestaoDto | null>(null);
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();
const form = reactive<EmitirNfePayload>({ homologacao: true, enderecoId: '', indicadorInscricaoEstadual: 9, codigoMunicipioDestinatario: '', inscricaoEstadualDestinatario: '', consumidorFinal: true, presencaComprador: 1, naturezaOperacao: 'Venda de mercadoria', formaPagamento: '' });
const opcoesPedidos = computed(() => pedidos.value.map(p => ({label:`${p.id.slice(0,8)} — ${formatarMoeda(p.valorTotal)} — ${p.status}`,value:p.id})));
const opcoesEndereco = computed(() => listaEnderecos.value.flatMap((item) => {
  const endereco = item.endereco;
  if (!item.id || !endereco) return [];
  return [{ value: item.id, label: `${endereco.logradouro}, ${endereco.numero} — ${endereco.cidade}/${endereco.estado}` }];
}));
const mensagemEndereco = computed(() => {
  if (!pedidoId.value) return 'Selecione o pedido para carregar os endereços do cliente.';
  if (carregandoCliente.value) return 'Carregando endereços do cliente...';
  return 'Este cliente não tem endereço cadastrado. Inclua um endereço no cadastro do cliente.';
});
let versao = 0;
function aplicarMunicipio(enderecoId: string | null): void {
  const endereco = listaEnderecos.value.find((item) => item.id === enderecoId);
  if (endereco?.codigoMunicipio) form.codigoMunicipioDestinatario = endereco.codigoMunicipio;
}
function limparDestinatario(): void {
  cliente.value = null;
  listaEnderecos.value = [];
  form.enderecoId = '';
  form.codigoMunicipioDestinatario = '';
  form.inscricaoEstadualDestinatario = '';
  form.indicadorInscricaoEstadual = 9;
  resultado.value = null;
}
async function carregarCliente(id?: string): Promise<void> {
  const selecionado = typeof id === 'string' ? id : pedidoId.value;
  const atual = ++versao;
  limparDestinatario();
  const pedido = pedidos.value.find((item) => item.id === selecionado);
  if (!pedido?.clienteId) {
    carregandoCliente.value = false;
    return;
  }
  carregandoCliente.value = true;
  try {
    const [c, enderecosCliente] = await Promise.all([
      clienteService.obter(pedido.clienteId),
      clienteService.listarEnderecos(pedido.clienteId),
    ]);
    if (atual !== versao) return;
    cliente.value = c;
    listaEnderecos.value = enderecosCliente.length > 0 ? enderecosCliente : (c.enderecos ?? []);
    const primeiro = listaEnderecos.value[0];
    form.enderecoId = primeiro?.id ?? '';
    if (primeiro?.codigoMunicipio) form.codigoMunicipioDestinatario = primeiro.codigoMunicipio;
    if (c.indicadorInscricaoEstadual) form.indicadorInscricaoEstadual = c.indicadorInscricaoEstadual;
    if (c.inscricaoEstadual) form.inscricaoEstadualDestinatario = c.inscricaoEstadual;
  } catch (e) { erro(mensagem(e)); }
  finally { if (atual === versao) carregandoCliente.value = false; }
}
async function enviar(): Promise<void> {
  salvando.value = true;
  try {
    resultado.value = await fiscalGestaoService.emitirNfcePedido(pedidoId.value, {...form, consumidorFinal: true, indicadorInscricaoEstadual: 9, inscricaoEstadualDestinatario: null});
    emit('emitida');
  } catch (e) { erro(mensagem(e)); }
  finally { salvando.value = false; }
}
watch(() => props.modelValue, async aberto => {
  if (!aberto) return;
  resultado.value = null; pedidoId.value = ''; limparDestinatario(); form.homologacao = true; form.consumidorFinal = true; form.presencaComprador = 1;
  carregando.value = true;
  try { pedidos.value = (await pedidoVendaService.listar()).filter(p => ['Aprovado','Faturado'].includes(p.status)); }
  catch (e) { erro(mensagem(e)); }
  finally { carregando.value = false; }
});
</script>
