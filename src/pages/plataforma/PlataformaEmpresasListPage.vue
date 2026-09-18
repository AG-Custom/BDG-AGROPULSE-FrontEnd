<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Console da plataforma"
      subtitulo="Empresas contratadas. Acesse qualquer operação ou cadastre um novo contrato."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova empresa"
        descricao="Cadastrar nova empresa na plataforma"
        :to="{ name: 'plataforma-empresa-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && empresas.length === 0" :colunas="6" />

        <empty-state
          v-else-if="!carregando && empresas.length === 0"
          titulo="Nenhuma empresa cadastrada"
          descricao="Cadastre a primeira empresa do contrato para liberar o acesso ao sistema."
          icon="business"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova empresa"
            descricao="Ir para o cadastro de empresa"
            :to="{ name: 'plataforma-empresa-nova' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="empresas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-cnpj="props">
            <q-td :props="props" class="text-metric">
              {{ formatarCnpj(props.row.cnpj) }}
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.status"
                :variant="variantStatus(props.row.status)"
              />
            </q-td>
          </template>

          <template #body-cell-qtdUnidades="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.qtdUnidades }}
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props">
              <div class="plataforma-lista__acoes">
                <agro-btn flat label="NF-e" descricao="Configurar a emissão de NF-e desta empresa" @click="empresaFiscalId = props.row.id" />
                <agro-btn flat color="negative" icon="delete" label="Excluir" descricao="Excluir empresa da plataforma" :loading="excluindoId === props.row.id" @click="excluir(props.row.id, props.row.nomeFantasia)" />
                <agro-btn
                  flat
                  label="Editar"
                  descricao="Editar dados fiscais e documentos da empresa"
                  :to="{ name: 'plataforma-empresa-editar', params: { id: props.row.id } }"
                />
                <agro-btn
                  color="primary"
                  unelevated
                  dense
                  label="Acessar"
                  descricao="Entrar na empresa selecionada"
                  :loading="acessandoId === props.row.id"
                  @click="acessar(props.row.id)"
                />
              </div>
            </q-td>
          </template>

          <template #no-data>
            <empty-state
              titulo="Nenhuma empresa cadastrada"
              descricao="Cadastre a primeira empresa do contrato."
              icon="business"
            />
          </template>
        </q-table>
      </agro-card>
    </section>
    <q-dialog :model-value="!!empresaFiscalId" @update:model-value="valor => { if (!valor) empresaFiscalId = null; }">
      <q-card style="width: 850px; max-width: 95vw">
        <q-card-actions align="right"><agro-btn v-close-popup flat icon="close" label="Fechar" descricao="Fechar configuração fiscal" /></q-card-actions>
        <configuracao-nfe-empresa v-if="empresaFiscalId" :key="empresaFiscalId" :empresa-id="empresaFiscalId" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AppPageHeader from 'components/shared/AppPageHeader.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import { usePlataforma } from 'composables/usePlataforma';
import type { EmpresaStatusPlataforma } from 'types/dtos/plataforma.dto';
import { onMounted, ref } from 'vue';
import ConfiguracaoNfeEmpresa from 'components/plataforma/ConfiguracaoNfeEmpresa.vue';
import { plataformaService } from 'services/plataforma.service';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import type { QTableColumn } from 'quasar';

const { empresas, carregando, acessandoId, carregar, acessar } = usePlataforma();
const empresaFiscalId = ref<string | null>(null);
const excluindoId = ref<string | null>(null);
const { sucesso, erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();
async function excluir(id: string, nome: string): Promise<void> {
  const confirmou = await messageService.confirmar({ titulo: 'Excluir empresa', mensagem: `Excluir ${nome}? O acesso será bloqueado e o histórico fiscal será preservado.`, textoConfirmar: 'Excluir' });
  if (confirmou) await executarExclusao(id);
}
async function executarExclusao(id: string): Promise<void> {
  excluindoId.value = id;
  try {
    await plataformaService.excluirEmpresa(id);
    sucesso('Empresa excluída.');
    await carregar();
  } catch (e) { erro(mensagem(e)); }
  finally { excluindoId.value = null; }
}

const colunas: QTableColumn[] = [
  { name: 'nomeFantasia', label: 'Nome fantasia', field: 'nomeFantasia', align: 'left', sortable: true },
  { name: 'razaoSocial', label: 'Razão social', field: 'razaoSocial', align: 'left', sortable: true },
  { name: 'cnpj', label: 'CNPJ', field: 'cnpj', align: 'left' },
  { name: 'tipoOperacao', label: 'Operação', field: 'tipoOperacao', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'qtdUnidades', label: 'Unidades', field: 'qtdUnidades', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function formatarCnpj(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) {
    return cnpj;
  }

  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function variantStatus(status: EmpresaStatusPlataforma): 'success' | 'warning' | 'default' {
  if (status === 'Ativo') {
    return 'success';
  }

  if (status === 'Suspenso') {
    return 'warning';
  }

  return 'default';
}

onMounted(() => {
  void carregar();
});
</script>

<style scoped>
.plataforma-lista__acoes {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}
</style>
