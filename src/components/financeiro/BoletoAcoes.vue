<template>
  <div class="boleto-acoes">
    <agro-btn
      v-if="registrado && podeEditar"
      flat
      dense
      icon="sync"
      label="Atualizar"
      descricao="Consultar situação no banco"
      :disable="salvando"
      @click="emit('sincronizar')"
    />
    <agro-btn
      v-if="boleto.pixCopiaECola"
      flat
      dense
      icon="pix"
      label="Pix"
      descricao="Copiar Pix copia e cola"
      @click="emit('copiar', boleto.pixCopiaECola, 'Pix copia e cola')"
    />
    <agro-btn
      v-if="boleto.linhaDigitavel"
      flat
      dense
      icon="content_copy"
      label="Linha"
      descricao="Copiar linha digitável"
      @click="emit('copiar', boleto.linhaDigitavel, 'Linha digitável')"
    />
    <agro-btn
      v-if="registrado && podeEditar"
      flat
      dense
      color="negative"
      icon="block"
      label="Baixar"
      descricao="Baixar boleto no banco"
      :disable="salvando"
      @click="emit('baixar')"
    />
  </div>
</template>

<script setup lang="ts">
import { StatusBoleto } from 'constants/enums';
import type { BoletoDto } from 'types/dtos/financeiro-gestao.dto';
import { computed } from 'vue';

const props = defineProps<{ boleto: BoletoDto; salvando: boolean; podeEditar: boolean }>();
const emit = defineEmits<{
  sincronizar: [];
  baixar: [];
  copiar: [texto: string, descricao: string];
}>();

const registrado = computed(
  () =>
    props.boleto.status === StatusBoleto.Registrado || props.boleto.status === StatusBoleto.Gerado,
);
</script>

<style scoped>
.boleto-acoes {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--spacing-1);
}
</style>
