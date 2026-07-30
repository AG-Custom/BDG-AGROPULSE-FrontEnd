<script setup lang="ts">
import AgroBtn from 'components/ui/AgroBtn.vue';
import { formatarDataHora, formatarMoeda } from 'utils/formatters';
import { computed } from 'vue';

type Registro = Record<string, unknown>;

interface CampoDetalhe {
  chave: string;
  label: string;
  valor: unknown;
}

const props = defineProps<{
  modelValue: boolean;
  titulo: string;
  registro: Registro | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const camposIgnorados = new Set([
  'id',
  'anexos',
  'ativo',
  'criadoEm',
  'atualizadoEm',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'isAdmin',
  'isCurrent',
  'itens',
  'links',
  'origem',
  'permissoes',
  'permissions',
  'roles',
  'status',
  'usuario',
]);

const campos = computed<CampoDetalhe[]>(() => {
  if (!props.registro) {
    return [];
  }

  return Object.entries(props.registro)
    .filter(([chave, valor]) => !deveIgnorarCampo(chave) && valor !== undefined && valor !== null && valor !== '')
    .filter(([, valor]) => !ehValorTecnico(valor))
    .slice(0, 12)
    .map(([chave, valor]) => ({
      chave,
      label: humanizarLabel(chave),
      valor,
    }));
});

const auditoria = computed(() => {
  if (!props.registro) {
    return [];
  }

  return [
    {
      label: 'Criado em',
      valor: props.registro.criadoEm ?? props.registro.createdAt,
      classe: 'agro-entity-details__audit-row--created',
      icon: 'schedule',
    },
    {
      label: 'Atualizado em',
      valor: props.registro.atualizadoEm ?? props.registro.updatedAt,
      classe: 'agro-entity-details__audit-row--updated',
      icon: 'update',
    },
  ].filter((item) => Boolean(item.valor));
});

function humanizarLabel(chave: string): string {
  const comEspacos = chave
    .replace(/Nome$/i, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase())
    .trim();

  return comEspacos
    .replace(/\bId\b/g, 'ID')
    .replace(/\bCpf\b/g, 'CPF')
    .replace(/\bCnpj\b/g, 'CNPJ')
    .replace(/\bSku\b/g, 'SKU')
    .replace(/\bNcm\b/g, 'NCM')
    .replace(/\bCfop\b/g, 'CFOP');
}

function deveIgnorarCampo(chave: string): boolean {
  const chaveNormalizada = chave.toLowerCase();

  if (camposIgnorados.has(chave) || camposIgnorados.has(chaveNormalizada)) {
    return true;
  }

  return (
    /(^|[A-Z_])ids?$/i.test(chave) ||
    chaveNormalizada.endsWith('id') ||
    chaveNormalizada.endsWith('ids') ||
    chaveNormalizada.includes('link') ||
    chaveNormalizada.includes('origem') ||
    chaveNormalizada.includes('password') ||
    chaveNormalizada.includes('senha') ||
    chaveNormalizada.includes('status') ||
    chaveNormalizada.includes('token')
  );
}

function ehValorTecnico(valor: unknown): boolean {
  if (Array.isArray(valor)) {
    return true;
  }

  if (valor && typeof valor === 'object') {
    return true;
  }

  if (typeof valor === 'string') {
    return pareceGuid(valor) || valor.includes('_');
  }

  return false;
}

function formatarValor(valor: unknown, chave = ''): string {
  if (typeof valor === 'boolean') {
    return valor ? 'Sim' : 'Não';
  }

  if (deveFormatarMoeda(chave, valor)) {
    return formatarMoeda(Number(valor));
  }

  if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
    return formatarDataHoraValor(valor);
  }

  return String(valor);
}

function deveFormatarMoeda(chave: string, valor: unknown): boolean {
  const chaveNormalizada = chave.toLowerCase();
  const ehNumero =
    typeof valor === 'number' ||
    (typeof valor === 'string' && valor.trim() !== '' && !Number.isNaN(Number(valor)));

  return (
    ehNumero &&
    (chaveNormalizada.includes('valor') ||
      chaveNormalizada.includes('preco') ||
      chaveNormalizada.includes('preço') ||
      chaveNormalizada.includes('total') ||
      chaveNormalizada.includes('salario') ||
      chaveNormalizada.includes('limite'))
  );
}

function pareceGuid(valor: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valor);
}

function formatarDataHoraValor(valor: unknown): string {
  if (!valor) {
    return '';
  }

  return formatarDataHora(String(valor));
}
</script>

<template>
  <q-dialog v-model="model">
    <q-card class="agro-entity-details">
      <q-card-section class="agro-entity-details__header">
        <div class="agro-entity-details__titulo">{{ titulo }}</div>
        <q-btn v-close-popup flat round dense icon="close" aria-label="Fechar" />
      </q-card-section>

      <q-card-section class="agro-entity-details__body">
        <section class="agro-entity-details__section">
          <div class="agro-entity-details__section-title">Dados</div>
          <div v-if="campos.length > 0" class="agro-entity-details__grid">
            <div
              v-for="campo in campos"
              :key="campo.chave"
              class="agro-entity-details__field"
            >
              <span>{{ campo.label }}</span>
              <strong>{{ formatarValor(campo.valor, campo.chave) }}</strong>
            </div>
          </div>
          <div v-else class="agro-entity-details__audit-empty">
            Nenhum dado disponível para este registro.
          </div>
        </section>

        <section class="agro-entity-details__section">
          <div class="agro-entity-details__section-title">Auditoria</div>

          <div v-if="auditoria.length > 0" class="agro-entity-details__audit">
            <div
              v-for="item in auditoria"
              :key="item.label"
              class="agro-entity-details__audit-row"
              :class="item.classe"
            >
              <strong>{{ item.label }}</strong>
              <span>
                <q-icon :name="item.icon" size="16px" />
                {{ formatarDataHoraValor(item.valor) }}
              </span>
            </div>
          </div>

          <div v-else class="agro-entity-details__audit-empty">
            Nenhum log de auditoria disponível para este registro.
          </div>
        </section>
      </q-card-section>

      <q-card-actions align="right" class="agro-entity-details__actions">
        <agro-btn v-close-popup flat label="Fechar" descricao="Fechar detalhes" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.agro-entity-details {
  max-height: 90vh;
  overflow-y: auto;
  width: min(640px, calc(100vw - 32px));
}

.agro-entity-details__header {
  align-items: center;
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
  display: flex;
  gap: var(--spacing-3);
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-5);
}

.agro-entity-details__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  overflow-wrap: anywhere;
}

.agro-entity-details__body {
  display: grid;
  gap: var(--spacing-3);
  padding: var(--spacing-4) var(--spacing-5);
}

.agro-entity-details__section {
  background: var(--color-surface-default);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
}

.agro-entity-details__section-title {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.04em;
  margin-bottom: var(--spacing-3);
  text-transform: uppercase;
}

.agro-entity-details__grid {
  display: grid;
  gap: var(--spacing-3) var(--spacing-4);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.agro-entity-details__field {
  display: grid;
  gap: var(--spacing-1);
  min-width: 0;
}

.agro-entity-details__field span {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.agro-entity-details__field strong {
  color: var(--color-text-primary);
  font-size: 0.95rem;
  font-weight: var(--font-weight-medium);
  overflow-wrap: anywhere;
}

.agro-entity-details__audit {
  display: grid;
  gap: var(--spacing-2);
}

.agro-entity-details__audit-empty {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.agro-entity-details__audit-row {
  align-items: center;
  border-radius: var(--radius-md);
  display: grid;
  gap: var(--spacing-3);
  grid-template-columns: 130px 1fr;
  padding: var(--spacing-2) var(--spacing-3);
}

.agro-entity-details__audit-row strong {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
}

.agro-entity-details__audit-row span {
  align-items: center;
  color: var(--color-text-primary);
  display: inline-flex;
  font-size: var(--font-size-sm);
  gap: var(--spacing-2);
}

.agro-entity-details__audit-row--created {
  background: var(--color-success-50);
}

.agro-entity-details__audit-row--created strong,
.agro-entity-details__audit-row--created :deep(.q-icon) {
  color: var(--color-success-700);
}

.agro-entity-details__audit-row--updated {
  background: var(--color-primary-50, var(--color-neutral-100));
}

.agro-entity-details__audit-row--updated strong,
.agro-entity-details__audit-row--updated :deep(.q-icon) {
  color: var(--color-primary-700, var(--color-text-primary));
}

.agro-entity-details__actions {
  border-top: var(--border-width-thin) solid var(--color-border-default);
  padding: var(--spacing-3) var(--spacing-5);
}

@media (max-width: 600px) {
  .agro-entity-details__grid {
    grid-template-columns: 1fr;
  }

  .agro-entity-details__audit-row {
    grid-template-columns: 1fr;
  }
}
</style>
