<template>
  <agro-card>
    <h3>NF-e da empresa</h3>
    <p>Configure o estabelecimento emitente e as credenciais de cada ambiente.</p>
    <div v-if="empresaId" class="q-mb-lg q-gutter-sm">
      <q-input v-model="tokenPrincipal" type="password" autocomplete="new-password" outlined label="Token principal da conta Focus" hint="Uso exclusivo da administração. Não é devolvido pela API." />
      <agro-btn label="Validar e salvar token principal" descricao="Configurar integração da plataforma" :loading="salvando" :disable="!tokenPrincipal" @click="salvarPrincipal" />
    </div>
    <agro-form-skeleton v-if="carregando" :campos="8" />
    <q-banner v-else-if="falha" class="bg-red-1 text-negative">
      {{ falha }}
      <template #action><agro-btn flat label="Tentar novamente" descricao="Recarregar configuração" @click="carregar" /></template>
    </q-banner>
    <q-form v-else-if="config" class="q-gutter-md" @submit.prevent="salvar">
      <q-select v-model="dados.unidadeEmitenteId" outlined label="Estabelecimento emitente"
        :options="emitentes" emit-value map-options :rules="[obrigatorio]" @update:model-value="trocarUnidade" :disable="salvando" />
      <q-banner v-if="emitente" class="bg-grey-2">
        <strong>{{ emitente.razaoSocial }} — {{ emitente.cnpj }}</strong><br />
        {{ emitente.logradouro }}, {{ emitente.numero }} — {{ emitente.bairro }}<br />
        {{ emitente.municipio }}/{{ emitente.uf }} — CEP {{ emitente.cep }}
      </q-banner>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6"><q-input v-model="dados.inscricaoEstadual" outlined label="Inscrição estadual" maxlength="14" :rules="[obrigatorio]" /></div>
        <div class="col-12 col-md-6"><q-select v-model="dados.crt" outlined label="CRT" :options="crts" emit-value map-options :rules="[obrigatorio]" /></div>
        <div class="col-12 col-md-6"><q-input v-model="dados.codigoMunicipio" outlined label="Código IBGE do município" mask="#######" :rules="[v => /^\d{7}$/.test(v) || 'Informe 7 dígitos']" /></div>
        <div class="col-12 col-md-6"><q-input v-model="dados.cnae" outlined label="CNAE (opcional)" mask="#######" :rules="[v => !v || /^\d{7}$/.test(v) || 'Informe 7 dígitos']" /></div>
        <div class="col-12 col-md-6"><q-input v-model="dados.inscricaoMunicipal" outlined label="Inscrição municipal (obrigatória com CNAE)" maxlength="15" :rules="[v => Boolean(v) === Boolean(dados.cnae) || 'Informe CNAE e inscrição municipal juntos']" /></div>
        <div class="col-12 col-md-6"><q-input v-model.number="dados.serieHomologacao" type="number" min="1" max="999" outlined label="Série em homologação" :rules="[serieValida]" /></div>
        <div class="col-12 col-md-6"><q-input v-model.number="dados.serieProducao" type="number" min="1" max="999" outlined label="Série em produção" :rules="[serieValida]" /></div>
        <div class="col-12 col-md-6"><q-input v-model="tokenHomologacao" type="password" autocomplete="new-password" outlined label="Token de homologação" maxlength="500"
          :hint="config.possuiTokenHomologacao ? 'Cadastrado. Deixe vazio para manter.' : 'Ainda não cadastrado.'" /></div>
        <div class="col-12 col-md-6"><q-input v-model="tokenProducao" type="password" autocomplete="new-password" outlined label="Token de produção" maxlength="500"
          :hint="config.possuiTokenProducao ? 'Cadastrado. Deixe vazio para manter.' : 'Ainda não cadastrado.'" /></div>
      </div>
      <p class="text-caption">O certificado e o emitente também precisam estar habilitados na Focus. Salvar esta configuração não confirma a habilitação para emissão.</p>
      <agro-btn type="submit" color="primary" label="Salvar configuração de NF-e" descricao="Salvar dados fiscais desta empresa" :loading="salvando" :disable="!emitente" />
      <q-separator />
      <p>{{ config.sincronizadoEm ? `Sincronizado com a Focus em ${new Date(config.sincronizadoEm).toLocaleString('pt-BR')}` : 'Dados ainda não sincronizados com a Focus.' }}</p>
      <p v-if="config.certificadoValidoAte">Certificado válido até {{ new Date(config.certificadoValidoAte).toLocaleDateString('pt-BR') }}</p>
      <q-file v-model="certificado" outlined accept=".pfx,.p12" :max-file-size="2000000" label="Certificado digital A1 (PFX/P12)" clearable />
      <q-input v-if="certificado" v-model="senhaCertificado" type="password" autocomplete="new-password" outlined label="Senha do certificado" />
      <agro-btn label="Sincronizar emitente e certificado com a Focus" descricao="Cadastrar ou atualizar este CNPJ na Focus" :loading="salvando" :disable="!config.dados || !emitente" @click="sincronizar" />
    </q-form>
  </agro-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import { nfeEmpresaService } from 'services/nfe-empresa.service';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { DadosEmissaoNfe, NfeEmpresaDto } from 'types/dtos/nfe-empresa.dto';
import { obrigatorio } from 'utils/validators';

const props = defineProps<{ empresaId?: string }>();
const { sucesso, erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();
const config = ref<NfeEmpresaDto | null>(null);
const dados = ref<DadosEmissaoNfe>(vazio());
const tokenHomologacao = ref('');
const tokenProducao = ref('');
const tokenPrincipal = ref('');
const certificado = ref<File | null>(null);
const senhaCertificado = ref('');
const carregando = ref(false);
const salvando = ref(false);
const falha = ref('');
let requisicao = 0;
const emitentes = computed(() => config.value?.emitentes.map(e => ({ label: `${e.unidade} — ${e.cnpj}`, value: e.unidadeId })) ?? []);
const emitente = computed(() => config.value?.emitentes.find(e => e.unidadeId === dados.value.unidadeEmitenteId));
const crts = [
  { label: '1 — Simples Nacional', value: 1 },
  { label: '2 — Simples Nacional, excesso de sublimite', value: 2 },
  { label: '3 — Regime normal', value: 3 },
  { label: '4 — MEI', value: 4 },
];
function vazio(): DadosEmissaoNfe {
  return { unidadeEmitenteId: '', inscricaoEstadual: '', crt: 1, codigoMunicipio: '', cnae: null, serieHomologacao: 1, serieProducao: 1 };
}
function serieValida(v: unknown): boolean | string {
  return Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 999 || 'Informe uma série de 1 a 999';
}
async function carregar(unidadeId?: string): Promise<void> {
  const atual = ++requisicao;
  carregando.value = true;
  config.value = null;
  dados.value = vazio();
  tokenHomologacao.value = tokenProducao.value = '';
  falha.value = '';
  try {
    const resposta = await nfeEmpresaService.obter(props.empresaId, unidadeId);
    if (atual !== requisicao) return;
    config.value = resposta;
    dados.value = resposta.dados ?? { ...vazio(), unidadeEmitenteId: unidadeId ?? resposta.emitentes[0]?.unidadeId ?? '' };
  } catch (e) { if (atual === requisicao) falha.value = mensagem(e); }
  finally { if (atual === requisicao) carregando.value = false; }
}
async function trocarUnidade(id: string): Promise<void> {
  certificado.value = null; senhaCertificado.value = '';
  await carregar(id);
}
async function salvarPrincipal(): Promise<void> {
  salvando.value = true;
  try { await nfeEmpresaService.salvarTokenPrincipal(tokenPrincipal.value); tokenPrincipal.value = ''; sucesso('Token principal validado e salvo.'); }
  catch (e) { erro(mensagem(e)); }
  finally { salvando.value = false; }
}
async function sincronizar(): Promise<void> {
  salvando.value = true;
  try {
    config.value = await nfeEmpresaService.sincronizar(dados.value.unidadeEmitenteId, certificado.value, senhaCertificado.value, props.empresaId);
    certificado.value = null; senhaCertificado.value = '';
    sucesso('Emitente sincronizado com a Focus.');
  } catch (e) { erro(mensagem(e)); }
  finally { salvando.value = false; }
}
async function salvar(): Promise<void> {
  const atual = requisicao;
  salvando.value = true;
  try {
    const resposta = await nfeEmpresaService.salvar({
      dados: { ...dados.value, cnae: dados.value.cnae?.trim() || null },
      tokenHomologacao: tokenHomologacao.value.trim() || undefined,
      tokenProducao: tokenProducao.value.trim() || undefined,
    }, props.empresaId);
    if (atual !== requisicao) return;
    config.value = resposta;
    tokenHomologacao.value = tokenProducao.value = '';
    sucesso('Configuração de NF-e salva para esta empresa.');
  } catch (e) { if (atual === requisicao) erro(mensagem(e)); }
  finally { salvando.value = false; }
}
watch(() => props.empresaId, () => { void carregar(); }, { immediate: true });
</script>
