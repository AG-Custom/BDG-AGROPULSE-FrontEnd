import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { clienteService } from 'services/cliente.service';
import { fiscalGestaoService, type EmitirNfePayload } from 'services/fiscal-gestao.service';
import { pedidoVendaService } from 'services/pedido-venda.service';
import type { ClienteDto, ClienteEnderecoDto, ClienteResumoDto } from 'types/dtos/cliente.dto';
import type { NotaFiscalGestaoDto, SugestaoModeloDocumentoDto } from 'types/dtos/fiscal-gestao.dto';
import type { PedidoVendaResumoDto } from 'types/dtos/pedido-venda.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { rotuloPedidoVendaStatus } from 'utils/pedido-venda.helpers';
import { computed, reactive, ref, watch, type Ref } from 'vue';

export function useEmitirNotaPedido(aberto: Ref<boolean>) {
  const pedidos = ref<PedidoVendaResumoDto[]>([]);
  const clientes = ref<ClienteResumoDto[]>([]);
  const filtroPedido = ref('');
  const pedidoId = ref('');
  const cliente = ref<ClienteDto | null>(null);
  const listaEnderecos = ref<ClienteEnderecoDto[]>([]);
  const sugestao = ref<SugestaoModeloDocumentoDto | null>(null);
  const documento = ref<'NFe' | 'NFCe'>('NFCe');
  const carregando = ref(false);
  const carregandoCliente = ref(false);
  const consultandoSugestao = ref(false);
  const salvando = ref(false);
  const resultado = ref<NotaFiscalGestaoDto | null>(null);
  const mensagemErro = ref('');
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();
  const form = reactive<EmitirNfePayload>({
    homologacao: true,
    enderecoId: '',
    indicadorInscricaoEstadual: 9,
    codigoMunicipioDestinatario: '',
    inscricaoEstadualDestinatario: '',
    consumidorFinal: true,
    presencaComprador: 1,
    naturezaOperacao: 'Venda de mercadoria',
    formaPagamento: '',
  });
  const nfce = computed(() => documento.value === 'NFCe');
  const mapaClientes = computed(() => {
    const mapa = new Map<string, string>();
    for (const item of clientes.value) {
      mapa.set(item.id, item.nomeRazao);
    }
    return mapa;
  });
  const opcoesPedidos = computed(() => pedidos.value.map((p) => {
    const nome = mapaClientes.value.get(p.clienteId) ?? 'Cliente não identificado';
    const data = formatarData(p.createdAt);
    const valor = formatarMoeda(p.valorTotal);
    const situacao = rotuloPedidoVendaStatus(p.status);
    return {
      label: `${nome} — ${data} — ${valor} — ${situacao}`,
      value: p.id,
      cliente: nome,
      data,
      valor,
      situacao,
    };
  }));
  const opcoesPedidosFiltradas = computed(() => {
    const termo = filtroPedido.value.trim().toLowerCase();
    if (!termo) {
      return opcoesPedidos.value;
    }
    return opcoesPedidos.value.filter((opcao) => opcao.label.toLowerCase().includes(termo));
  });
  const opcoesEndereco = computed(() => listaEnderecos.value.flatMap((item) => {
    const endereco = item.endereco;
    if (!item.id || !endereco) return [];
    return [{ value: item.id, label: `${endereco.logradouro}, ${endereco.numero} — ${endereco.cidade}/${endereco.estado}` }];
  }));
  const opcoesDocumento = computed(() => [
    { label: 'NFC-e', value: 'NFCe', disable: !sugestao.value?.nfceDisponivel },
    { label: 'NF-e', value: 'NFe' },
  ]);
  const opcoesPresenca = computed(() => (nfce.value
    ? [{ label: 'Presencial', value: 1 }, { label: 'Entrega a domicílio', value: 4 }]
    : [
        { label: 'Não se aplica', value: 0 },
        { label: 'Presencial', value: 1 },
        { label: 'Internet', value: 2 },
        { label: 'Teleatendimento', value: 3 },
        { label: 'Entrega a domicílio', value: 4 },
        { label: 'Fora do estabelecimento', value: 5 },
        { label: 'Outros', value: 9 },
      ]));
  const mensagemEndereco = computed(() => {
    if (!pedidoId.value) return 'Selecione o pedido para carregar os endereços do cliente.';
    if (carregandoCliente.value) return 'Carregando endereços do cliente...';
    return 'Este cliente não tem endereço cadastrado. Inclua um endereço no cadastro do cliente.';
  });
  const textoDocumento = computed(() => (nfce.value
    ? 'Os itens e valores vêm do pedido. A NFC-e vale só para venda na mesma UF, com presença presencial ou entrega. Confira CFOP, ICMS e PIS/COFINS cadastrados com sua contabilidade.'
    : 'Os itens e valores vêm do pedido. A NF-e aceita contribuinte, outra UF e as presenças do modelo 55. Confira CFOP, ICMS e PIS/COFINS cadastrados com sua contabilidade.'));
  const caminhoParametrizacao = computed(() => {
    const normalizado = mensagemErro.value
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase();

    if (
      normalizado.includes('cst/csosn')
      || normalizado.includes('cfop de venda')
      || normalizado.includes('dados fiscais do produto')
      || normalizado.includes('aliquota de icms')
      || normalizado.includes('conversao de unidade fiscal')
    ) {
      return {
        to: { name: 'produtos' },
        rotulo: 'Cadastros Gerais → Produtos → abra o produto → Configuração fiscal (CSOSN ou CST ICMS)',
      };
    }

    if (normalizado.includes('pis/cofins') && normalizado.includes('ncm')) {
      return {
        to: { name: 'fiscal-ncm-pis-cofins' },
        rotulo: 'Fiscal e Tributário → PIS/COFINS NCM',
      };
    }

    return null;
  });
  const rotuloEmitir = computed(() => {
    const nome = nfce.value ? 'NFC-e' : 'NF-e';
    return form.homologacao ? `Emitir ${nome} em homologação` : `Emitir ${nome} em produção`;
  });
  let versao = 0;
  let sugestaoVersao = 0;

  function filtrarPedidos(valor: string, update: (fn: () => void) => void): void {
    update(() => {
      filtroPedido.value = valor;
    });
  }

  function aplicarMunicipio(enderecoId: string | null): void {
    const endereco = listaEnderecos.value.find((item) => item.id === enderecoId);
    if (endereco?.codigoMunicipio) form.codigoMunicipioDestinatario = endereco.codigoMunicipio;
  }

  function aplicarModelo(modelo: 'NFe' | 'NFCe'): void {
    if (modelo === 'NFCe') {
      form.consumidorFinal = true;
      form.indicadorInscricaoEstadual = 9;
      form.inscricaoEstadualDestinatario = null;
      if (form.presencaComprador !== 1 && form.presencaComprador !== 4) form.presencaComprador = 1;
      return;
    }
    const indicador = cliente.value?.indicadorInscricaoEstadual;
    form.indicadorInscricaoEstadual = indicador === 1 || indicador === 2 || indicador === 9 ? indicador : 9;
    form.inscricaoEstadualDestinatario = form.indicadorInscricaoEstadual === 1 ? (cliente.value?.inscricaoEstadual ?? '') : null;
    if (form.indicadorInscricaoEstadual === 1) form.consumidorFinal = false;
  }

  function aoMudarIndicador(indicador: number): void {
    if (indicador !== 1) form.inscricaoEstadualDestinatario = null;
    else if (!form.inscricaoEstadualDestinatario) form.inscricaoEstadualDestinatario = cliente.value?.inscricaoEstadual ?? '';
  }

  function limparDestinatario(): void {
    cliente.value = null;
    listaEnderecos.value = [];
    sugestao.value = null;
    documento.value = 'NFCe';
    form.enderecoId = '';
    form.codigoMunicipioDestinatario = '';
    form.inscricaoEstadualDestinatario = '';
    form.indicadorInscricaoEstadual = 9;
    form.consumidorFinal = true;
    form.presencaComprador = 1;
    resultado.value = null;
    mensagemErro.value = '';
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
    } catch (e) {
      erro(mensagem(e));
    } finally {
      if (atual === versao) carregandoCliente.value = false;
    }
  }

  async function consultarSugestao(enderecoId: string): Promise<void> {
    const atual = ++sugestaoVersao;
    sugestao.value = null;
    if (!pedidoId.value || !enderecoId) {
      consultandoSugestao.value = false;
      return;
    }
    consultandoSugestao.value = true;
    try {
      const resposta = await fiscalGestaoService.sugerirModelo(pedidoId.value, enderecoId);
      if (atual !== sugestaoVersao) return;
      sugestao.value = resposta;
      documento.value = resposta.modeloSugerido === 'NFe' ? 'NFe' : 'NFCe';
      aplicarModelo(documento.value);
    } catch (e) {
      if (atual === sugestaoVersao) erro(mensagem(e));
    } finally {
      if (atual === sugestaoVersao) consultandoSugestao.value = false;
    }
  }

  async function enviar(): Promise<void> {
    salvando.value = true;
    mensagemErro.value = '';
    try {
      resultado.value = nfce.value
        ? await fiscalGestaoService.emitirNfcePedido(pedidoId.value, {
            ...form,
            consumidorFinal: true,
            indicadorInscricaoEstadual: 9,
            inscricaoEstadualDestinatario: null,
          })
        : await fiscalGestaoService.emitirNfe(pedidoId.value, {
            ...form,
            inscricaoEstadualDestinatario: form.indicadorInscricaoEstadual === 1 ? form.inscricaoEstadualDestinatario : null,
          });
    } catch (e) {
      mensagemErro.value = mensagem(e);
      const caminho = caminhoParametrizacao.value;
      erro(caminho
        ? `${mensagemErro.value}\n\nPara parametrizar, abra ${caminho.rotulo}.`
        : mensagemErro.value);
    } finally {
      salvando.value = false;
    }
  }

  watch(() => form.enderecoId, (enderecoId) => { void consultarSugestao(enderecoId); });
  watch(aberto, async (estaAberto) => {
    if (!estaAberto) return;
    resultado.value = null;
    mensagemErro.value = '';
    pedidoId.value = '';
    filtroPedido.value = '';
    limparDestinatario();
    form.homologacao = true;
    carregando.value = true;
    try {
      pedidos.value = (await pedidoVendaService.listar()).filter((p) =>
        ['Aprovado', 'Faturado'].includes(p.status),
      );
      try {
        clientes.value = await clienteService.listar();
      } catch (erroClientes) {
        clientes.value = [];
        erro(mensagem(erroClientes));
      }
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  });

  return {
    pedidoId,
    cliente,
    sugestao,
    documento,
    form,
    nfce,
    carregando,
    carregandoCliente,
    consultandoSugestao,
    salvando,
    resultado,
    mensagemErro,
    caminhoParametrizacao,
    opcoesPedidos,
    opcoesPedidosFiltradas,
    filtrarPedidos,
    opcoesEndereco,
    opcoesDocumento,
    opcoesPresenca,
    opcoesIndicador: [
      { label: 'Contribuinte', value: 1 },
      { label: 'Isento', value: 2 },
      { label: 'Não contribuinte', value: 9 },
    ],
    opcoesPagamento: [
      { label: 'Dinheiro', value: '01' },
      { label: 'Cheque', value: '02' },
      { label: 'Duplicata mercantil', value: '14' },
      { label: 'Boleto', value: '15' },
      { label: 'Depósito bancário', value: '16' },
      { label: 'PIX dinâmico', value: '17' },
      { label: 'Transferência bancária / carteira digital', value: '18' },
      { label: 'PIX estático', value: '20' },
      { label: 'Pagamento posterior', value: '91' },
    ],
    mensagemEndereco,
    textoDocumento,
    rotuloEmitir,
    aplicarMunicipio,
    aplicarModelo,
    aoMudarIndicador,
    carregarCliente,
    enviar,
  };
}
