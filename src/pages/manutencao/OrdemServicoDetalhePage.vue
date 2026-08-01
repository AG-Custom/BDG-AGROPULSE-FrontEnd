<template>
  <q-page class="agro-page">
    <app-page-header titulo="Ordem de serviço" :subtitulo="subtitulo">
      <div class="acoes">
        <agro-btn
          v-if="ordem?.status === StatusOrdemServicoManutencao.Aberta"
          color="primary"
          unelevated
          label="Iniciar"
          descricao="Iniciar OS"
          :loading="salvando"
          @click="iniciarOrdem(id)"
        />
        <agro-btn
          v-if="ordem?.status === StatusOrdemServicoManutencao.EmAndamento"
          flat
          label="Aguardar peça"
          descricao="Marcar aguardando peça"
          :loading="salvando"
          @click="aguardarPeca(id)"
        />
        <agro-btn
          v-if="
            ordem?.status === StatusOrdemServicoManutencao.EmAndamento ||
            ordem?.status === StatusOrdemServicoManutencao.AguardandoPeca
          "
          color="primary"
          unelevated
          label="Concluir"
          descricao="Concluir OS"
          :loading="salvando"
          @click="concluirOrdem(id)"
        />
        <agro-btn
          v-if="podeCancelar"
          color="negative"
          unelevated
          label="Cancelar"
          descricao="Cancelar OS"
          :loading="salvando"
          @click="cancelarOrdem(id)"
        />
      </div>
    </app-page-header>

    <section class="agro-section detalhe">
      <agro-form-skeleton v-if="carregando && !ordem" :campos="5" />
      <template v-else-if="ordem">
        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-3">
              <div class="text-caption">Número</div>
              <div class="text-metric">{{ ordem.numero }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Status</div>
              <manutencao-status-badge :valor="ordem.status" tipo="os" />
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Prioridade</div>
              <manutencao-status-badge :valor="ordem.prioridade" tipo="prioridade" />
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Tipo</div>
              <div>{{ ordem.tipo }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Ativo</div>
              <div>{{ nomeAtivo }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Abertura</div>
              <div>{{ formatarData(ordem.dataAbertura) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Previsão</div>
              <div>{{ formatarData(ordem.dataPrevisao) || '—' }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Conclusão</div>
              <div>{{ formatarData(ordem.dataConclusao) || '—' }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Responsável</div>
              <div>{{ ordem.responsavelNome ?? '—' }}</div>
            </div>
            <div class="col-12">
              <div class="text-caption">Descrição</div>
              <div>{{ ordem.descricao }}</div>
            </div>
            <div v-if="ordem.causaRaiz" class="col-12">
              <div class="text-caption">Causa raiz</div>
              <div>{{ ordem.causaRaiz }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Custo peças</div>
              <div class="text-metric">{{ moeda(ordem.custoPecas) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Custo mão de obra</div>
              <div class="text-metric">{{ moeda(ordem.custoMaoObra) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Custo total</div>
              <div class="text-metric">{{ moeda(ordem.custoTotal) }}</div>
            </div>
          </div>
        </agro-card>

        <agro-card>
          <div class="header">
            <h3 class="titulo-sec">Peças</h3>
          </div>
          <pecas-os-table
            :pecas="ordem.pecas ?? []"
            :editavel="podeEditarPecas"
            :salvando="salvando"
            @remover="(pecaId) => removerPeca(id, pecaId)"
          />

          <div v-if="podeEditarPecas" class="add-peca q-mt-md">
            <h4 class="subtitulo">Adicionar peça</h4>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <agro-select-cadastro
                  v-model="formPeca.produtoId"
                  entidade="produto"
                  dense
                  label="Produto (estoque)"
                  clearable
                  use-input
                  input-debounce="200"
                  :options="produtoOpcoes"
                  @atualizar="carregarProdutos()"
                  @update:model-value="(produtoId: unknown) => onProduto(typeof produtoId === 'string' ? produtoId : null)"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="formPeca.descricao" outlined dense label="Descrição" />
              </div>
              <div class="col-6 col-md-1">
                <q-input v-model="formPeca.quantidade" outlined dense label="Qtd" type="number" />
              </div>
              <div class="col-6 col-md-2">
                <AgroMoneyInput v-model="formPeca.valorUnitario" dense label="Unitário" />
              </div>
              <div class="col-12 col-md-3">
                <q-toggle
                  v-model="formPeca.baixarAgora"
                  label="Baixar agora"
                  color="primary"
                  dense
                />
              </div>
              <div class="col-12 col-md-2">
                <agro-btn
                  color="primary"
                  unelevated
                  label="Adicionar"
                  descricao="Adicionar peça"
                  :loading="salvando"
                  @click="salvarPeca"
                />
              </div>
            </div>
          </div>
        </agro-card>
      </template>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import ManutencaoStatusBadge from 'components/manutencao/ManutencaoStatusBadge.vue';
import PecasOsTable from 'components/manutencao/PecasOsTable.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import { useManutencao } from 'composables/useManutencao';
import { useProdutos } from 'composables/useProdutos';
import { StatusOrdemServicoManutencao } from 'constants/enums';
import type { AdicionarPecaOsFormModel } from 'types/dtos/manutencao.dto';
import { formatarData, formatarMoeda, formatarMoedaParaInput } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = computed(() => String(route.params.id));
const {
  ordem,
  ativos,
  carregando,
  salvando,
  obterOrdem,
  carregarAtivos,
  iniciarOrdem,
  aguardarPeca,
  concluirOrdem,
  cancelarOrdem,
  adicionarPeca,
  removerPeca,
} = useManutencao();
const { produtos, carregar: carregarProdutos } = useProdutos();

const formPeca = ref<AdicionarPecaOsFormModel>({
  produtoId: '',
  descricao: '',
  quantidade: '1',
  valorUnitario: formatarMoedaParaInput(0),
  baixarAgora: false,
});

const nomeAtivo = computed(() => {
  if (!ordem.value) return '';
  return ativos.value.find((a) => a.id === ordem.value!.ativoId)?.nome ?? ordem.value.ativoId;
});

const subtitulo = computed(() =>
  ordem.value ? `${ordem.value.numero} · ${ordem.value.tipo} · ${nomeAtivo.value}` : '',
);

const podeCancelar = computed(() => {
  const s = ordem.value?.status;
  return (
    s === StatusOrdemServicoManutencao.Aberta ||
    s === StatusOrdemServicoManutencao.EmAndamento ||
    s === StatusOrdemServicoManutencao.AguardandoPeca
  );
});

const podeEditarPecas = computed(() => {
  const s = ordem.value?.status;
  return (
    s === StatusOrdemServicoManutencao.Aberta ||
    s === StatusOrdemServicoManutencao.EmAndamento ||
    s === StatusOrdemServicoManutencao.AguardandoPeca
  );
});

const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({
    label: `${p.descricao}`,
    value: p.id,
  })),
);

function moeda(valor: number | null | undefined): string {
  return valor != null ? formatarMoeda(valor) : '—';
}

function onProduto(produtoId: string | null): void {
  if (!produtoId) return;
  const p = produtos.value.find((x) => x.id === produtoId);
  if (p && !formPeca.value.descricao) {
    formPeca.value.descricao = p.descricao;
  }
}

async function salvarPeca(): Promise<void> {
  if (!formPeca.value.descricao.trim()) return;
  const ok = await adicionarPeca(id.value, formPeca.value);
  if (ok) {
    formPeca.value = {
      produtoId: '',
      descricao: '',
      quantidade: '1',
      valorUnitario: formatarMoedaParaInput(0),
      baixarAgora: false,
    };
  }
}

onMounted(() => {
  void carregarAtivos();
  void carregarProdutos();
  void obterOrdem(id.value);
});
</script>

<style scoped>
.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}
.detalhe {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}
.titulo-sec {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
.subtitulo {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-3);
}
.header {
  margin-bottom: var(--spacing-3);
}
</style>
