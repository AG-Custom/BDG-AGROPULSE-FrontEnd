<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Locais de estoque"
      subtitulo="Cadastre a hierarquia galpão → depósito → corredor → prateleira."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo galpão"
        descricao="Cadastrar galpão raiz"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroAtivo"
            outlined
            dense
            emit-value
            map-options
            label="Status"
            :options="opcoesStatus"
            @update:model-value="recarregar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && nosFlat.length === 0" :colunas="5" />

        <empty-state
          v-else-if="!carregando && nosFlat.length === 0"
          titulo="Nenhum local cadastrado"
          descricao="Comece criando um galpão e, em seguida, os depósitos, corredores e prateleiras."
          icon="warehouse"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo galpão"
            descricao="Cadastrar galpão raiz"
            @click="abrirDialog()"
          />
        </empty-state>

        <q-markup-table v-else flat bordered class="locais-estoque__tabela">
          <thead>
            <tr>
              <th class="text-left">Local</th>
              <th class="text-left">Nível</th>
              <th class="text-left">Código</th>
              <th class="text-left">Status</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="no in nosFlat" :key="no.id">
              <td>
                <span class="locais-estoque__nome" :style="{ paddingLeft: `${no.profundidade * 20}px` }">
                  {{ no.nome }}
                </span>
              </td>
              <td>{{ NivelLocalEstoqueLabels[no.nivel] }}</td>
              <td class="text-metric">{{ no.codigo }}</td>
              <td>
                <agro-badge
                  :label="no.ativo ? 'Ativo' : 'Inativo'"
                  :variant="no.ativo ? 'success' : 'default'"
                />
              </td>
              <td class="text-right">
                <agro-acoes-menu
                  :ativo="no.ativo"
                  :pode-editar="no.ativo"
                  :loading-status="salvando"
                  @editar="abrirDialog(no)"
                  @visualizar="abrirDialog(no, true)"
                  @desabilitar="inativarNo(no)"
                  @ativar="ativarNo(no)"
                >
                  <q-item
                    v-if="no.ativo && podeAdicionarFilho(no.nivel)"
                    v-close-popup
                    clickable
                    dense
                    class="agro-acoes-menu__item"
                    @click="abrirDialogFilho(no)"
                  >
                    <q-item-section avatar>
                      <span class="agro-acoes-menu__icon agro-acoes-menu__icon--view">
                        <q-icon name="subdirectory_arrow_right" size="16px" />
                      </span>
                    </q-item-section>
                    <q-item-section>Adicionar filho</q-item-section>
                  </q-item>
                </agro-acoes-menu>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="locais-estoque__dialog">
        <q-card-section>
          <h3 class="locais-estoque__dialog-titulo">{{ tituloDialog }}</h3>
        </q-card-section>

        <q-card-section class="locais-estoque__form">
          <q-input
            v-model="form.nivelLabel"
            outlined
            label="Nível"
            readonly
          />
          <q-input
            v-if="form.parentCaminho"
            :model-value="form.parentCaminho"
            outlined
            label="Local pai"
            readonly
          />
          <q-input
            v-model="form.codigo"
            outlined
            label="Código"
            class="field-required"
            maxlength="50"
            :readonly="somenteLeitura"
            :rules="[obrigatorio]"
          />
          <q-input
            v-model="form.nome"
            outlined
            label="Nome"
            class="field-required"
            maxlength="200"
            :readonly="somenteLeitura"
            :rules="[obrigatorio]"
          />
        </q-card-section>

        <q-card-actions align="right" class="agro-form-actions">
          <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogAberto = false" />
          <agro-btn
            v-if="!somenteLeitura"
            color="primary"
            unelevated
            label="Salvar"
            descricao="Salvar local de estoque"
            :loading="salvando"
            @click="salvar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useLocaisEstoque } from 'composables/useLocaisEstoque';
import {
  NivelLocalEstoque,
  NivelLocalEstoqueLabels,
  NivelLocalEstoqueOrdem,
  type NivelLocalEstoqueValor,
} from 'constants/enums';
import type { LocalEstoqueDto, LocalEstoqueNoDto } from 'types/dtos/estoque.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, reactive, ref } from 'vue';

interface NoFlat extends LocalEstoqueDto {
  profundidade: number;
}

const {
  arvore,
  carregando,
  salvando,
  carregarArvore,
  criar,
  editar,
  solicitarInativacao,
  ativar,
} = useLocaisEstoque();

const filtroAtivo = ref<'todos' | 'ativos' | 'inativos'>('ativos');
const dialogAberto = ref(false);
const somenteLeitura = ref(false);
const editandoId = ref<string | null>(null);

const form = reactive({
  parentId: null as string | null,
  parentCaminho: '',
  nivel: NivelLocalEstoque.Galpao as NivelLocalEstoqueValor,
  nivelLabel: NivelLocalEstoqueLabels[NivelLocalEstoque.Galpao],
  codigo: '',
  nome: '',
});

const opcoesStatus = [
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
  { label: 'Todos', value: 'todos' },
];

const nosFlat = computed(() => {
  const resultado: NoFlat[] = [];

  function percorrer(nos: LocalEstoqueNoDto[], profundidade: number): void {
    for (const no of nos) {
      resultado.push({ ...no, profundidade });
      if (no.filhos?.length) {
        percorrer(no.filhos, profundidade + 1);
      }
    }
  }

  percorrer(arvore.value, 0);
  return resultado;
});

const tituloDialog = computed(() => {
  if (somenteLeitura.value) {
    return 'Visualizar local';
  }

  if (editandoId.value) {
    return 'Editar local';
  }

  return form.parentId ? 'Novo local filho' : 'Novo galpão';
});

function proximoNivel(nivel: NivelLocalEstoqueValor): NivelLocalEstoqueValor | null {
  const indice = NivelLocalEstoqueOrdem.indexOf(nivel);
  if (indice < 0 || indice >= NivelLocalEstoqueOrdem.length - 1) {
    return null;
  }

  return NivelLocalEstoqueOrdem[indice + 1];
}

function podeAdicionarFilho(nivel: NivelLocalEstoqueValor): boolean {
  return proximoNivel(nivel) !== null;
}

function abrirDialog(local?: LocalEstoqueDto, leitura = false): void {
  somenteLeitura.value = leitura;
  editandoId.value = local?.id ?? null;
  form.parentId = local?.parentId ?? null;
  form.parentCaminho = '';
  form.nivel = local?.nivel ?? NivelLocalEstoque.Galpao;
  form.nivelLabel = NivelLocalEstoqueLabels[form.nivel];
  form.codigo = local?.codigo ?? '';
  form.nome = local?.nome ?? '';
  dialogAberto.value = true;
}

function abrirDialogFilho(pai: LocalEstoqueDto): void {
  const nivel = proximoNivel(pai.nivel);
  if (!nivel) {
    return;
  }

  somenteLeitura.value = false;
  editandoId.value = null;
  form.parentId = pai.id;
  form.parentCaminho = pai.caminho || pai.nome;
  form.nivel = nivel;
  form.nivelLabel = NivelLocalEstoqueLabels[nivel];
  form.codigo = '';
  form.nome = '';
  dialogAberto.value = true;
}

async function salvar(): Promise<void> {
  if (!form.codigo.trim() || !form.nome.trim()) {
    return;
  }

  if (editandoId.value) {
    const ok = await editar(editandoId.value, {
      codigo: form.codigo.trim(),
      nome: form.nome.trim(),
    });
    if (ok) {
      dialogAberto.value = false;
      await recarregar();
    }
    return;
  }

  const criado = await criar({
    parentId: form.parentId,
    nivel: form.nivel,
    codigo: form.codigo.trim(),
    nome: form.nome.trim(),
  });

  if (criado) {
    dialogAberto.value = false;
    await recarregar();
  }
}

async function inativarNo(local: LocalEstoqueDto): Promise<void> {
  if (await solicitarInativacao(local)) {
    await recarregar();
  }
}

async function ativarNo(local: LocalEstoqueDto): Promise<void> {
  if (await ativar(local)) {
    await recarregar();
  }
}

async function recarregar(): Promise<void> {
  const ativo =
    filtroAtivo.value === 'ativos' ? true : filtroAtivo.value === 'inativos' ? false : undefined;
  await carregarArvore(ativo);
}

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.locais-estoque__tabela {
  width: 100%;
}

.locais-estoque__nome {
  color: var(--color-text-primary);
  display: inline-block;
}

.locais-estoque__dialog {
  background: var(--color-surface-default);
  max-width: 480px;
  width: 100%;
}

.locais-estoque__dialog-titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.locais-estoque__form {
  display: grid;
  gap: var(--spacing-4);
}
</style>
