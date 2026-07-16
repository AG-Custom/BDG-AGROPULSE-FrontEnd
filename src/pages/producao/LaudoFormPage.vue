<template>
  <q-page class="agro-page">
    <app-page-header :titulo="titulo" subtitulo="Parâmetros analisados e decisão de qualidade.">
      <div v-if="modo === 'detalhe' && laudo?.status === LaudoQualidadeStatus.Pendente" class="acoes">
        <agro-btn
          color="primary"
          unelevated
          label="Aprovar"
          descricao="Aprovar laudo"
          :loading="salvando"
          @click="aprovar(id)"
        />
        <agro-btn
          color="negative"
          unelevated
          label="Reprovar"
          descricao="Reprovar laudo"
          :loading="salvando"
          @click="abrirReprovar"
        />
      </div>
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-form-skeleton v-if="carregandoPagina" :campos="5" />
        <template v-else-if="modo === 'detalhe' && laudo">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-md-3">
              <div class="text-caption">Status</div>
              <agro-badge :label="laudo.status" variant="default" />
            </div>
            <div class="col-md-4">
              <div class="text-caption">Produto</div>
              <div>{{ rotuloProduto(laudo.produtoId) }}</div>
            </div>
            <div class="col-md-3">
              <div class="text-caption">Data análise</div>
              <div>{{ formatarData(laudo.dataAnalise) }}</div>
            </div>
            <div class="col-12" v-if="laudo.resultado">
              <div class="text-caption">Resultado</div>
              <div>{{ laudo.resultado }}</div>
            </div>
          </div>
          <q-table
            flat
            bordered
            row-key="id"
            hide-pagination
            :rows="laudo.parametros"
            :columns="colunasParam"
            :pagination="{ rowsPerPage: 0 }"
          />
          <div class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'laudos' }" />
          </div>
        </template>
        <q-form v-else greedy class="agro-formulario" @submit.prevent="salvar">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.produtoId"
                outlined
                label="Produto"
                class="field-required"
                emit-value
                map-options
                :options="produtoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.loteId"
                outlined
                label="Lote"
                class="field-required"
                emit-value
                map-options
                :options="loteOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-6 col-md-3">
              <q-input
                v-model="formulario.dataAnalise"
                outlined
                label="Data análise"
                type="date"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.ordemProducaoId"
                outlined
                label="Ordem de produção (opcional)"
                emit-value
                map-options
                clearable
                :options="ordemOpcoes"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="formulario.resultado"
                outlined
                label="Resultado / observação"
                type="textarea"
                autogrow
              />
            </div>
          </div>

          <div class="header">
            <h3 class="titulo-sec">Parâmetros</h3>
            <agro-btn
              flat
              icon="add"
              label="Parâmetro"
              descricao="Adicionar parâmetro"
              @click="adicionarParam"
            />
          </div>

          <div
            v-for="(p, index) in formulario.parametros"
            :key="p.chave"
            class="row q-col-gutter-md q-mb-sm"
          >
            <div class="col-12 col-md-3">
              <q-input v-model="p.nome" outlined dense label="Nome" :rules="[obrigatorio]" />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="p.valor" outlined dense label="Valor" :rules="[obrigatorio]" />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="p.unidade" outlined dense label="Unidade" />
            </div>
            <div class="col-5 col-md-2">
              <q-input v-model="p.minimo" outlined dense label="Mín." />
            </div>
            <div class="col-5 col-md-2">
              <q-input v-model="p.maximo" outlined dense label="Máx." />
            </div>
            <div class="col-2 col-md-1">
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover"
                @click="formulario.parametros.splice(index, 1)"
              />
            </div>
          </div>

          <div class="agro-form-actions">
            <agro-btn flat label="Cancelar" descricao="Voltar" :to="{ name: 'laudos' }" />
            <agro-btn
              color="primary"
              unelevated
              label="Salvar"
              descricao="Salvar laudo"
              type="submit"
              :loading="salvando"
            />
          </div>
        </q-form>
      </agro-card>
    </section>

    <q-dialog v-model="dialogReprovar" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Reprovar laudo</h4></q-card-section>
        <q-card-section>
          <q-input v-model="motivoReprovar" outlined label="Motivo / resultado" type="textarea" />
        </q-card-section>
        <q-card-actions align="right">
          <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogReprovar = false" />
          <agro-btn
            color="negative"
            unelevated
            label="Reprovar"
            descricao="Confirmar reprovação"
            :loading="salvando"
            @click="confirmarReprovar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { useEstoqueLotes } from 'composables/useEstoqueLotes';
import { useLaudos } from 'composables/useLaudos';
import { useProducao } from 'composables/useProducao';
import { useProdutos } from 'composables/useProdutos';
import { LaudoQualidadeStatus } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  LaudoQualidadeFormModel,
  ParametroLaudoDto,
  ParametroLaudoFormModel,
} from 'types/dtos/producao.dto';
import { formatarData } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

function novoParam(): ParametroLaudoFormModel {
  return {
    chave: crypto.randomUUID(),
    nome: '',
    valor: '',
    unidade: '',
    minimo: '',
    maximo: '',
  };
}

const route = useRoute();
const router = useRouter();
const { laudo, salvando, obter, criar, aprovar, reprovar } = useLaudos();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { lotes, carregar: carregarLotes } = useEstoqueLotes();
const { ordens, carregarOrdens } = useProducao();

const modo = computed(() => (route.name === 'laudo-detalhe' ? 'detalhe' : 'criar'));
const id = computed(() => route.params.id as string);
const titulo = computed(() => (modo.value === 'criar' ? 'Novo laudo' : 'Detalhe do laudo'));

const carregandoPagina = ref(false);
const dialogReprovar = ref(false);
const motivoReprovar = ref('');
const formulario = ref<LaudoQualidadeFormModel>({
  loteId: '',
  produtoId: '',
  ordemProducaoId: '',
  dataAnalise: new Date().toISOString().slice(0, 10),
  resultado: '',
  parametros: [novoParam()],
});

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);

const loteOpcoes = computed(() =>
  lotes.value
    .filter((l) => !formulario.value.produtoId || l.produtoId === formulario.value.produtoId)
    .map((l) => ({ label: l.numeroLote, value: l.id })),
);

const ordemOpcoes = computed(() =>
  ordens.value.map((o) => ({
    label: `${o.id.slice(0, 8)}… — ${rotuloProduto(o.produtoSaidaId)}`,
    value: o.id,
  })),
);

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.codigo} — ${p.descricao}`);
  return m;
});

const colunasParam: QTableColumn<ParametroLaudoDto>[] = [
  { name: 'nome', label: 'Parâmetro', field: 'nome', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'left' },
  { name: 'unidade', label: 'Unidade', field: 'unidade', align: 'left' },
  { name: 'minimo', label: 'Mín.', field: 'minimo', align: 'left' },
  { name: 'maximo', label: 'Máx.', field: 'maximo', align: 'left' },
];

function rotuloProduto(pid: string): string {
  return mapa.value.get(pid) ?? pid;
}

function adicionarParam(): void {
  formulario.value.parametros.push(novoParam());
}

function abrirReprovar(): void {
  motivoReprovar.value = laudo.value?.resultado ?? '';
  dialogReprovar.value = true;
}

async function confirmarReprovar(): Promise<void> {
  const ok = await reprovar(id.value, motivoReprovar.value);
  if (ok) dialogReprovar.value = false;
}

async function salvar(): Promise<void> {
  const criado = await criar(formulario.value);
  if (criado) await router.push({ name: 'laudo-detalhe', params: { id: criado.id } });
}

watch(
  () => formulario.value.produtoId,
  () => {
    void carregarLotes({
      produtoId: formulario.value.produtoId || undefined,
      apenasComSaldo: false,
    });
  },
);

onMounted(async () => {
  void carregarProdutos();
  void carregarOrdens();
  void carregarLotes({ apenasComSaldo: false });
  if (modo.value === 'detalhe') {
    carregandoPagina.value = true;
    const ok = await obter(id.value);
    if (!ok) await router.replace({ name: 'laudos' });
    carregandoPagina.value = false;
  }
});
</script>

<style scoped>
.acoes {
  display: flex;
  gap: var(--spacing-2);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-6) 0 var(--spacing-3);
}
.titulo-sec {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.dialog {
  min-width: min(400px, 90vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
}
</style>
