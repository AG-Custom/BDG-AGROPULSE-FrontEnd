<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dialog">
      <q-card-section>
        <h4 class="titulo">{{ titulo }}</h4>
      </q-card-section>
      <q-card-section>
        <q-form greedy class="agro-formulario" @submit.prevent="emit('salvar')">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="formulario.escopo"
                outlined
                emit-value
                map-options
                label="Escopo"
                class="field-required"
                :options="escopoOpcoes"
                :rules="[obrigatorio]"
                @update:model-value="onEscopoChange"
              />
            </div>
            <div v-if="formulario.escopo === EscopoMetaVendedor.Vendedor" class="col-12">
              <agro-select-cadastro
                v-model="formulario.vendedorUsuarioId"
                entidade="usuario"
                label="Vendedor"
                class="field-required"
                :options="vendedorOpcoes"
                :loading="carregandoUsuarios"
                :rules="[obrigatorio]"
                @atualizar="emit('atualizar-usuarios')"
              />
              <p v-if="avisoMetaUnidade" class="aviso" role="note">
                {{ avisoMetaUnidade }}
              </p>
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="formulario.periodoInicio"
                outlined
                type="date"
                label="Início do período"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="formulario.periodoFim"
                outlined
                type="date"
                label="Fim do período"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="formulario.tipo"
                outlined
                emit-value
                map-options
                label="Tipo de meta"
                class="field-required"
                :options="tipoOpcoes"
                :rules="[obrigatorio]"
              />
            </div>
            <div v-if="formulario.tipo === TipoMetaVendedor.Valor" class="col-12">
              <AgroMoneyInput
                v-model="formulario.valorMeta"
                label="Valor da meta"
                class="field-required"
                :rules="[obrigatorio]"
              />
            </div>
            <template v-else>
              <div class="col-12">
                <agro-select-cadastro
                  v-model="formulario.produtoId"
                  entidade="produto"
                  label="Produto"
                  class="field-required"
                  :options="produtoOpcoes"
                  :loading="carregandoProdutos"
                  :rules="[obrigatorio]"
                  @atualizar="emit('atualizar-produtos')"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.quantidadeMeta"
                  outlined
                  type="number"
                  step="0.0001"
                  min="0"
                  label="Quantidade meta"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
            </template>
          </div>
          <div class="agro-form-actions">
            <agro-btn
              flat
              label="Cancelar"
              descricao="Fechar sem salvar"
              :disable="salvando"
              @click="emit('update:modelValue', false)"
            />
            <agro-btn
              color="primary"
              unelevated
              :label="editando ? 'Salvar' : 'Cadastrar'"
              type="submit"
              :loading="salvando"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import {
  EscopoMetaVendedor,
  EscopoMetaVendedorOpcoes,
  TipoMetaVendedor,
  TipoMetaVendedorOpcoes,
  type MetaVendedorDto,
  type MetaVendedorFormModel,
} from 'types/dtos/comercial-extras.dto';
import { formatarData } from 'utils/formatters';
import { metaUnidadeConflitante } from 'utils/metas-vendedor';
import { obrigatorio } from 'utils/validators';
import { computed } from 'vue';

const formulario = defineModel<MetaVendedorFormModel>('formulario', { required: true });

const props = defineProps<{
  modelValue: boolean;
  editando: boolean;
  salvando: boolean;
  vendedorOpcoes: { label: string; value: string }[];
  produtoOpcoes: { label: string; value: string }[];
  metasExistentes?: MetaVendedorDto[];
  metaEditandoId?: string | null;
  carregandoUsuarios?: boolean;
  carregandoProdutos?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  salvar: [];
  'atualizar-usuarios': [];
  'atualizar-produtos': [];
}>();

const titulo = computed(() => (props.editando ? 'Editar meta' : 'Nova meta'));

const tipoOpcoes = [...TipoMetaVendedorOpcoes];
const escopoOpcoes = [...EscopoMetaVendedorOpcoes];

const avisoMetaUnidade = computed(() => {
  const conflito = metaUnidadeConflitante(
    props.metasExistentes ?? [],
    formulario.value,
    props.metaEditandoId,
  );

  if (!conflito) {
    return null;
  }

  return (
    `Já existe meta da unidade neste período (${formatarData(conflito.periodoInicio)} — ` +
    `${formatarData(conflito.periodoFim)}). Para este vendedor, a meta individual prevalece ` +
    `sobre a da unidade.`
  );
});

function onEscopoChange(): void {
  if (formulario.value.escopo === EscopoMetaVendedor.Unidade) {
    formulario.value.vendedorUsuarioId = '';
  }
}
</script>

<style scoped>
.dialog {
  width: min(560px, 100%);
}

.titulo {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.aviso {
  margin: var(--spacing-2) 0 0;
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  border-left: var(--border-width-accent) solid var(--color-warning-500);
  background: var(--color-warning-50);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}
</style>
