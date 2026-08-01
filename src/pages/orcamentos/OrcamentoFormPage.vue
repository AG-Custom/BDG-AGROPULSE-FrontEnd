<template>
  <q-page class="agro-page agro-page--form-wide">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="6" />

        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="formulario.clienteId"
                entidade="cliente"
                label="Cliente"
                class="field-required"
                :options="clienteOpcoes"
                :rules="[obrigatorio]"
                :loading="carregandoClientes"
                @atualizar="carregarClientes()"
                @update:model-value="onClienteChange"
              />
            </div>
            <div class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="formulario.vendedorUsuarioId"
                entidade="usuario"
                label="Vendedor"
                clearable
                :options="vendedorOpcoes"
                :loading="carregandoUsuarios"
                @atualizar="carregarUsuarios()"
              />
            </div>
            <div class="col-12 col-md-6">
              <agro-select-cadastro
                v-model="formulario.tabelaPrecoId"
                entidade="tabelaPreco"
                label="Tabela de preço"
                clearable
                :options="tabelaOpcoes"
                :loading="carregandoTabelas"
                @atualizar="carregarTabelasPermitidas({ clienteId: formulario.clienteId || null })"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.observacao"
                outlined
                label="Observação"
                type="textarea"
                autogrow
              />
            </div>
          </div>

          <div class="orcamento-form__itens-header">
            <h3 class="orcamento-form__titulo">Itens</h3>
            <agro-btn
              flat
              icon="add"
              label="Item"
              descricao="Adicionar item ao orçamento"
              @click="adicionarItem"
            />
          </div>

          <div
            v-for="(item, index) in formulario.itens"
            :key="item.chave"
            class="row q-col-gutter-md orcamento-form__item"
          >
            <div class="col-12 col-md-5">
              <agro-select-cadastro
                v-model="item.produtoId"
                entidade="produto"
                dense
                label="Produto"
                :options="produtoOpcoes"
                :loading="carregandoItensTabela"
                :rules="[obrigatorio]"
                @atualizar="carregarProdutos()"
                @update:model-value="(id: unknown) => void onProdutoItem(index, String(id ?? ''))"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input
                v-model="item.quantidade"
                outlined
                dense
                label="Qtd"
                type="number"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <AgroMoneyInput
                v-model="item.precoUnitario"
                dense
                label="Preço unitário"
                :loading="resolvendoPreco"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-2 orcamento-form__item-acoes">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover item"
                :disable="formulario.itens.length <= 1"
                @click="removerItem(index)"
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn
              flat
              label="Cancelar"
              descricao="Voltar sem salvar"
              :to="{ name: 'orcamentos' }"
            />
            <agro-btn
              color="primary"
              unelevated
              :label="modo === 'criar' ? 'Criar' : 'Salvar'"
              descricao="Salvar orçamento"
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
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useClientes } from 'composables/useClientes';
import { useOrcamento } from 'composables/useOrcamento';
import { useOrcamentos } from 'composables/useOrcamentos';
import { usePrecificacao } from 'composables/usePrecificacao';
import { useProdutos } from 'composables/useProdutos';
import { useProdutosPorTabelaPreco } from 'composables/useProdutosPorTabelaPreco';
import { useUsuarios } from 'composables/useUsuarios';
import { isPerfilCarteiraVendedor, UsuarioStatus } from 'constants/enums';
import type { OrcamentoFormModel, OrcamentoItemFormModel } from 'types/dtos/orcamento.dto';
import { formatarMoedaParaInput } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

function novoItem(): OrcamentoItemFormModel {
  return {
    chave: crypto.randomUUID(),
    produtoId: '',
    quantidade: '1',
    precoUnitario: '',
  };
}

const route = useRoute();
const router = useRouter();
const { salvando, criar, editar } = useOrcamentos();
const { orcamento, obter } = useOrcamento();
const { clientes, carregando: carregandoClientes, carregar: carregarClientes } = useClientes();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { usuarios, carregando: carregandoUsuarios, carregar: carregarUsuarios, nomeCompleto } =
  useUsuarios();
const {
  tabelaOpcoes,
  tabelaPadraoId,
  carregandoTabelas,
  resolvendoPreco,
  carregarTabelasPermitidas,
  resolverPreco,
} = usePrecificacao();

const formulario = ref<OrcamentoFormModel>({
  clienteId: '',
  vendedorUsuarioId: '',
  tabelaPrecoId: '',
  observacao: '',
  itens: [novoItem()],
});
const carregandoPagina = ref(false);

const {
  produtoOpcoes,
  carregandoItensTabela,
  produtoIdsPermitidos,
} = useProdutosPorTabelaPreco(
  () => formulario.value.tabelaPrecoId,
  () => produtos.value,
);

const reResolverPrecosPendente = ref(false);

const modo = computed(() => (route.name === 'orcamento-editar' ? 'editar' : 'criar'));
const orcamentoId = computed(() => route.params.id as string | undefined);
const tituloPagina = computed(() =>
  modo.value === 'criar' ? 'Novo orçamento' : 'Editar orçamento',
);
const subtituloPagina = computed(() =>
  modo.value === 'criar'
    ? 'Informe cliente, tabela e itens.'
    : 'Atualize os dados do orçamento.',
);

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({ label: c.nomeRazao, value: c.id })),
);
const vendedorOpcoes = computed(() =>
  usuarios.value
    .filter(
      (u) =>
        u.status === UsuarioStatus.Ativo && isPerfilCarteiraVendedor(u.perfil),
    )
    .map((u) => ({ label: nomeCompleto(u), value: u.id })),
);

async function onClienteChange(clienteId: unknown): Promise<void> {
  const id = typeof clienteId === 'string' ? clienteId : '';
  await carregarTabelasPermitidas({ clienteId: id || null });
  if (!formulario.value.tabelaPrecoId && tabelaPadraoId.value) {
    formulario.value.tabelaPrecoId = tabelaPadraoId.value;
  }
}

async function onProdutoItem(index: number, produtoId: string): Promise<void> {
  if (!produtoId) {
    return;
  }

  formulario.value.itens[index].precoUnitario = '';

  const resolvido = await resolverPreco({
    produtoId,
    clienteId: formulario.value.clienteId || null,
    tabelaPrecoId: formulario.value.tabelaPrecoId || null,
  });

  if (resolvido) {
    formulario.value.itens[index].precoUnitario = formatarMoedaParaInput(resolvido.preco);
  }
}

async function sincronizarItensComTabela(): Promise<void> {
  if (carregandoItensTabela.value || carregandoPagina.value) {
    return;
  }

  const deveReResolver = reResolverPrecosPendente.value;
  reResolverPrecosPendente.value = false;

  const ids = produtoIdsPermitidos.value;
  const tarefas: Promise<void>[] = [];

  for (let index = 0; index < formulario.value.itens.length; index++) {
    const item = formulario.value.itens[index];

    if (!item.produtoId) {
      continue;
    }

    if (ids && !ids.has(item.produtoId)) {
      item.produtoId = '';
      item.precoUnitario = '';
      continue;
    }

    if (deveReResolver) {
      tarefas.push(onProdutoItem(index, item.produtoId));
    }
  }

  await Promise.all(tarefas);
}

function adicionarItem(): void {
  formulario.value.itens.push(novoItem());
}

function removerItem(index: number): void {
  if (formulario.value.itens.length > 1) {
    formulario.value.itens.splice(index, 1);
  }
}

async function salvar(): Promise<void> {
  if (modo.value === 'criar') {
    const criado = await criar(formulario.value);
    if (criado) await router.push({ name: 'orcamento-detalhe', params: { id: criado.id } });
    return;
  }

  if (!orcamentoId.value) return;
  const atualizado = await editar(orcamentoId.value, formulario.value);
  if (atualizado) {
    await router.push({ name: 'orcamento-detalhe', params: { id: atualizado.id } });
  }
}

onMounted(async () => {
  void carregarClientes();
  void carregarProdutos();
  void carregarUsuarios();
  await carregarTabelasPermitidas();

  if (modo.value === 'editar' && orcamentoId.value) {
    carregandoPagina.value = true;
    const ok = await obter(orcamentoId.value);
    if (!ok || !orcamento.value) {
      await router.replace({ name: 'orcamentos' });
      return;
    }

    formulario.value = {
      clienteId: orcamento.value.clienteId,
      vendedorUsuarioId: orcamento.value.vendedorUsuarioId,
      tabelaPrecoId: orcamento.value.tabelaPrecoId ?? '',
      observacao: orcamento.value.observacao ?? '',
      itens: orcamento.value.itens.map((item) => ({
        chave: item.id,
        produtoId: item.produtoId,
        quantidade: String(item.quantidade),
        precoUnitario: formatarMoedaParaInput(item.precoUnitario),
      })),
    };
    await carregarTabelasPermitidas({ clienteId: orcamento.value.clienteId });
    reResolverPrecosPendente.value = false;
    carregandoPagina.value = false;
  } else if (tabelaPadraoId.value) {
    formulario.value.tabelaPrecoId = tabelaPadraoId.value;
  }
});

watch(
  [() => formulario.value.tabelaPrecoId, produtoIdsPermitidos, carregandoItensTabela, carregandoPagina],
  (atual, anterior) => {
    const tabelaAtual = String(atual[0] ?? '');
    const tabelaAnterior = String(anterior?.[0] ?? '');

    if (anterior != null && tabelaAtual !== tabelaAnterior) {
      reResolverPrecosPendente.value = true;
    }

    void sincronizarItensComTabela();
  },
);
</script>

<style scoped>
.orcamento-form__itens-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: var(--spacing-6) 0 var(--spacing-3);
}
.orcamento-form__titulo {
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  margin: 0;
}
.orcamento-form__item {
  margin-bottom: var(--spacing-2);
}
.orcamento-form__item-acoes {
  display: flex;
  align-items: center;
}
</style>
