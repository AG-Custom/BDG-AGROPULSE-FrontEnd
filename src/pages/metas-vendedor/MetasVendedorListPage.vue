<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Metas de vendas"
      subtitulo="Metas da unidade ou por vendedor — por valor ou produto, em um período."
    >
      <agro-btn
        v-if="podeGerenciar"
        color="primary"
        unelevated
        icon="add"
        label="Nova meta"
        descricao="Cadastrar meta de vendas"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <agro-select-cadastro
            v-model="filtroVendedorId"
            entidade="usuario"
            label="Vendedor"
            clearable
            dense
            class="filtro"
            :options="vendedorOpcoes"
            :loading="carregandoUsuarios"
            @atualizar="carregarUsuarios()"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Atualizar"
            descricao="Carregar metas"
            :loading="carregando"
            @click="recarregar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && metas.length === 0" :colunas="5" />

        <empty-state
          v-else-if="!carregando && metas.length === 0"
          titulo="Sem metas"
          descricao="Não há metas cadastradas para os filtros atuais."
          icon="flag"
        >
          <agro-btn
            v-if="podeGerenciar"
            color="primary"
            unelevated
            label="Nova meta"
            descricao="Cadastrar meta de vendas"
            @click="abrirDialog()"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="metas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-tipo="props">
            <q-td :props="props">
              {{ rotuloTipo(props.row.tipo) }}
            </q-td>
          </template>
          <template #body-cell-periodo="props">
            <q-td :props="props">
              {{ formatarData(props.row.periodoInicio) }}
              —
              {{ formatarData(props.row.periodoFim) }}
            </q-td>
          </template>
          <template #body-cell-meta="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMeta(props.row) }}
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                v-if="podeGerenciar"
                :mostrar-visualizar="false"
                :mostrar-status="false"
                :mostrar-excluir="true"
                excluir-label="Excluir"
                :loading-excluir="salvando"
                @editar="abrirDialog(props.row)"
                @excluir="onExcluir(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <meta-vendedor-form-dialog
      v-model="dialogAberto"
      v-model:formulario="formulario"
      :editando="Boolean(editandoId)"
      :salvando="salvando"
      :vendedor-opcoes="vendedorOpcoes"
      :produto-opcoes="produtoOpcoes"
      :metas-existentes="metas"
      :meta-editando-id="editandoId"
      :carregando-usuarios="carregandoUsuarios"
      :carregando-produtos="carregandoProdutos"
      @salvar="salvar"
      @atualizar-usuarios="carregarUsuarios()"
      @atualizar-produtos="carregarProdutos()"
    />
  </q-page>
</template>

<script setup lang="ts">
import MetaVendedorFormDialog from 'components/metas-vendedor/MetaVendedorFormDialog.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useAuth } from 'composables/useAuth';
import { useMetasVendedor } from 'composables/useMetasVendedor';
import { useProdutos } from 'composables/useProdutos';
import { useUsuarios } from 'composables/useUsuarios';
import {
  isPerfilCarteiraVendedor,
  isPerfilUsuarioGlobal,
  UsuarioStatus,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import {
  TipoMetaVendedor,
  type MetaVendedorDto,
  type MetaVendedorFormModel,
} from 'types/dtos/comercial-extras.dto';
import { formatarData, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { usuario } = useAuth();
const {
  metas,
  carregando,
  salvando,
  carregar,
  criar,
  editar,
  solicitarExclusao,
  formVazio,
  dtoParaForm,
} = useMetasVendedor();
const { usuarios, carregando: carregandoUsuarios, carregar: carregarUsuarios, nomeCompleto } =
  useUsuarios();
const {
  produtos,
  carregando: carregandoProdutos,
  carregar: carregarProdutos,
} = useProdutos();

const filtroVendedorId = ref<string | null>(null);
const dialogAberto = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<MetaVendedorFormModel>(formVazio());

const podeGerenciar = computed(() => {
  const perfil = usuario.value?.perfil;
  return perfil != null && isPerfilUsuarioGlobal(perfil);
});

const vendedorOpcoes = computed(() =>
  usuarios.value
    .filter(
      (u) =>
        u.status === UsuarioStatus.Ativo && isPerfilCarteiraVendedor(u.perfil),
    )
    .map((u) => ({ label: nomeCompleto(u), value: u.id })),
);

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({
    label: `${p.codigo} — ${p.descricao}`,
    value: p.id,
  })),
);

const mapaVendedores = computed(() => {
  const mapa = new Map<string, string>();
  for (const u of usuarios.value) {
    mapa.set(u.id, nomeCompleto(u));
  }
  return mapa;
});

const mapaProdutos = computed(() => {
  const mapa = new Map<string, string>();
  for (const p of produtos.value) {
    mapa.set(p.id, `${p.codigo} — ${p.descricao}`);
  }
  return mapa;
});

const colunas = computed<QTableColumn<MetaVendedorDto>[]>(() => {
  const base: QTableColumn<MetaVendedorDto>[] = [
    {
      name: 'escopo',
      label: 'Escopo',
      field: (row) =>
        row.vendedorUsuarioId
          ? (mapaVendedores.value.get(row.vendedorUsuarioId) ?? row.vendedorUsuarioId)
          : 'Unidade',
      align: 'left',
    },
    { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
    { name: 'periodo', label: 'Período', field: 'periodoInicio', align: 'left' },
    { name: 'meta', label: 'Meta', field: 'valorMeta', align: 'right' },
  ];

  if (podeGerenciar.value) {
    base.push({ name: 'acoes', label: 'Ações', field: 'id', align: 'right' });
  }

  return base;
});

function rotuloTipo(tipo: string): string {
  return tipo === TipoMetaVendedor.Produto ? 'Por produto' : 'Por valor';
}

function formatarMeta(row: MetaVendedorDto): string {
  if (row.tipo === TipoMetaVendedor.Produto) {
    const nome = row.produtoId
      ? (mapaProdutos.value.get(row.produtoId) ?? row.produtoId)
      : '—';
    const qtd =
      row.quantidadeMeta == null ? '—' : formatarDecimal(row.quantidadeMeta);
    return `${qtd} · ${nome}`;
  }

  return formatarMoeda(row.valorMeta);
}

function abrirDialog(item?: MetaVendedorDto): void {
  editandoId.value = item?.id ?? null;
  formulario.value = item ? dtoParaForm(item) : formVazio();
  dialogAberto.value = true;
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await editar(editandoId.value, formulario.value)
    : await criar(formulario.value);

  if (ok) {
    dialogAberto.value = false;
    await recarregar();
  }
}

async function onExcluir(item: MetaVendedorDto): Promise<void> {
  const ok = await solicitarExclusao(item);
  if (ok) {
    await recarregar();
  }
}

async function recarregar(): Promise<void> {
  await carregar({
    vendedorUsuarioId: filtroVendedorId.value || undefined,
  });
}

onMounted(() => {
  void carregarUsuarios();
  void carregarProdutos();
  void recarregar();
});
</script>

<style scoped>
.filtro {
  min-width: 220px;
}

.acoes {
  white-space: nowrap;
}
</style>
