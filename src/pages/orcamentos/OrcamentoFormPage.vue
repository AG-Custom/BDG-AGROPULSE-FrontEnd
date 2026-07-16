<template>
  <q-page class="agro-page">
    <app-page-header :titulo="tituloPagina" :subtitulo="subtituloPagina" />

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="6" />

        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.clienteId"
                outlined
                label="Cliente"
                class="field-required"
                emit-value
                map-options
                :options="clienteOpcoes"
                :rules="[obrigatorio]"
                :loading="carregandoClientes"
                @update:model-value="onClienteChange"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.vendedorUsuarioId"
                outlined
                label="Vendedor"
                emit-value
                map-options
                clearable
                :options="vendedorOpcoes"
                :loading="carregandoUsuarios"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.tabelaPrecoId"
                outlined
                label="Tabela de preço"
                emit-value
                map-options
                clearable
                :options="tabelaOpcoes"
                :loading="carregandoTabelas"
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
              <q-select
                v-model="item.produtoId"
                outlined
                dense
                label="Produto"
                emit-value
                map-options
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
                @update:model-value="(id: string) => void onProdutoItem(index, id)"
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
              <q-input
                v-model="item.precoUnitario"
                outlined
                dense
                label="Preço unitário"
                type="number"
                step="0.01"
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
import { useClientes } from 'composables/useClientes';
import { useOrcamento } from 'composables/useOrcamento';
import { useOrcamentos } from 'composables/useOrcamentos';
import { usePrecificacao } from 'composables/usePrecificacao';
import { useProdutos } from 'composables/useProdutos';
import { useUsuarios } from 'composables/useUsuarios';
import { PerfilUsuario, UsuarioStatus } from 'constants/enums';
import type { OrcamentoFormModel, OrcamentoItemFormModel } from 'types/dtos/orcamento.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';
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
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);
const vendedorOpcoes = computed(() =>
  usuarios.value
    .filter(
      (u) =>
        u.status === UsuarioStatus.Ativo &&
        (u.perfil === PerfilUsuario.Vendedor ||
          u.perfil === PerfilUsuario.Gerente ||
          u.perfil === PerfilUsuario.Diretor),
    )
    .map((u) => ({ label: nomeCompleto(u), value: u.id })),
);

async function onClienteChange(clienteId: string): Promise<void> {
  await carregarTabelasPermitidas({ clienteId: clienteId || null });
  if (!formulario.value.tabelaPrecoId && tabelaPadraoId.value) {
    formulario.value.tabelaPrecoId = tabelaPadraoId.value;
  }
}

async function onProdutoItem(index: number, produtoId: string): Promise<void> {
  if (!produtoId) {
    return;
  }

  const resolvido = await resolverPreco(
    {
      produtoId,
      clienteId: formulario.value.clienteId || null,
      tabelaPrecoId: formulario.value.tabelaPrecoId || null,
    },
    true,
  );

  if (resolvido) {
    formulario.value.itens[index].precoUnitario = String(resolvido.preco);
    return;
  }

  const produto = produtos.value.find((item) => item.id === produtoId);
  if (produto) {
    formulario.value.itens[index].precoUnitario = String(produto.precoVenda);
  }
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
        precoUnitario: String(item.precoUnitario),
      })),
    };
    await carregarTabelasPermitidas({ clienteId: orcamento.value.clienteId });
    carregandoPagina.value = false;
  } else if (tabelaPadraoId.value) {
    formulario.value.tabelaPrecoId = tabelaPadraoId.value;
  }
});
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
