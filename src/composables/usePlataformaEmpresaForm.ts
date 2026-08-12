import { useNotificacao } from 'composables/useNotificacao';
import { usePlataforma } from 'composables/usePlataforma';
import { TipoOperacaoEmpresa } from 'constants/enums';
import {
  criarAdminVazio,
  criarDocumentosVazios,
  criarTributacaoVazia,
  montarPayloadFiscal,
  tributacaoDeDetalhe,
  type AdminEmpresaFormModel,
  type DocumentosEmpresaFormModel,
  type TributacaoEmpresaFormModel,
} from 'types/dtos/plataforma.dto';
import { criarUnidadeVazia, type EmpresaFormModel, type UnidadeFormModel } from 'types/dtos/onboarding.dto';
import { apenasDigitos } from 'utils/formatters';
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';

export function usePlataformaEmpresaForm(refs: {
  empresaStep: Ref<{ validar: () => Promise<boolean> } | null>;
  unidadesStep: Ref<{ validar: () => Promise<boolean> } | null>;
  tributacaoStep: Ref<{ validar: () => Promise<boolean> } | null>;
  documentosStep: Ref<{ validar: () => Promise<boolean> } | null>;
  diretorStep: Ref<{ validar: () => Promise<boolean> } | null>;
}) {
  const route = useRoute();
  const { salvando, detalhe, carregarDetalhe, criar, atualizar } = usePlataforma();
  const { erro } = useNotificacao();

  const empresaId = computed(() => {
    const id = route.params.id;
    return typeof id === 'string' ? id : null;
  });
  const editando = computed(() => Boolean(empresaId.value));
  const carregandoDetalhe = ref(false);
  const passo = ref(1);

  const empresa = ref<EmpresaFormModel>({
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    tipoOperacao: TipoOperacaoEmpresa.Revenda,
  });
  const unidades = ref<UnidadeFormModel[]>([criarUnidadeVazia(true)]);
  const tributacao = ref<TributacaoEmpresaFormModel>(criarTributacaoVazia());
  const documentos = ref<DocumentosEmpresaFormModel>(criarDocumentosVazios());
  const admin = ref<AdminEmpresaFormModel>(criarAdminVazio());

  function adicionarUnidade(): void {
    unidades.value.push(criarUnidadeVazia(false));
  }

  function removerUnidade(id: string): void {
    unidades.value = unidades.value.filter((unidade) => unidade.id !== id);
  }

  function definirMatriz(id: string): void {
    unidades.value = unidades.value.map((unidade) => ({
      ...unidade,
      matriz: unidade.id === id,
    }));
  }

  async function avancar(destino: number): Promise<void> {
    if (passo.value === 1 && !((await refs.empresaStep.value?.validar()) ?? false)) {
      return;
    }

    if (passo.value === 2) {
      if (!((await refs.unidadesStep.value?.validar()) ?? false)) {
        return;
      }

      if (unidades.value.filter((unidade) => unidade.matriz).length !== 1) {
        erro('Selecione exatamente uma unidade como matriz.');
        return;
      }
    }

    if (passo.value === 3 && !((await refs.tributacaoStep.value?.validar()) ?? false)) {
      return;
    }

    if (passo.value === 4 && !((await refs.documentosStep.value?.validar()) ?? false)) {
      return;
    }

    passo.value = destino;
  }

  async function concluir(): Promise<void> {
    if (!((await refs.diretorStep.value?.validar()) ?? false)) {
      return;
    }

    await criar(
      {
        razaoSocial: empresa.value.razaoSocial.trim(),
        nomeFantasia: empresa.value.nomeFantasia.trim(),
        cnpj: apenasDigitos(empresa.value.cnpj),
        tipoOperacao: empresa.value.tipoOperacao,
        unidades: unidades.value.map(({ id: _id, ...unidade }) => ({
          ...unidade,
          telefone: apenasDigitos(unidade.telefone),
          cep: apenasDigitos(unidade.cep),
          numero: apenasDigitos(unidade.numero),
          estado: unidade.estado.trim().toUpperCase(),
          complemento: unidade.complemento?.trim() || null,
        })),
        admin: {
          nome: admin.value.nome.trim(),
          sobrenome: admin.value.sobrenome.trim(),
          email: admin.value.email.trim(),
        },
        ...montarPayloadFiscal(tributacao.value),
      },
      documentos.value,
    );
  }

  async function salvarEdicao(): Promise<void> {
    if (!empresaId.value) {
      return;
    }

    if (!((await refs.documentosStep.value?.validar()) ?? false)) {
      return;
    }

    await atualizar(
      empresaId.value,
      {
        razaoSocial: empresa.value.razaoSocial.trim(),
        nomeFantasia: empresa.value.nomeFantasia.trim(),
        tipoOperacao: empresa.value.tipoOperacao,
        ...montarPayloadFiscal(tributacao.value),
      },
      documentos.value,
    );
  }

  onMounted(async () => {
    if (!empresaId.value) {
      return;
    }

    carregandoDetalhe.value = true;
    const ok = await carregarDetalhe(empresaId.value);
    carregandoDetalhe.value = false;
    if (!ok || !detalhe.value) {
      return;
    }

    empresa.value = {
      razaoSocial: detalhe.value.razaoSocial,
      nomeFantasia: detalhe.value.nomeFantasia,
      cnpj: detalhe.value.cnpj,
      tipoOperacao: detalhe.value.tipoOperacao,
    };
    tributacao.value = tributacaoDeDetalhe(detalhe.value);
    documentos.value = {
      ...criarDocumentosVazios(),
      tipoCertificado: detalhe.value.certificado?.tipo ?? 'A1',
    };
  });

  return {
    editando,
    carregandoDetalhe,
    salvando,
    detalhe,
    passo,
    empresa,
    unidades,
    tributacao,
    documentos,
    admin,
    adicionarUnidade,
    removerUnidade,
    definirMatriz,
    avancar,
    concluir,
    salvarEdicao,
  };
}
