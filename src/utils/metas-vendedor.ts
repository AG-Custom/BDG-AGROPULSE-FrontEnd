import {
  EscopoMetaVendedor,
  TipoMetaVendedor,
  type MetaVendedorDto,
  type MetaVendedorFormModel,
} from 'types/dtos/comercial-extras.dto';

function periodosSobrepostos(
  inicioA: string,
  fimA: string,
  inicioB: string,
  fimB: string,
): boolean {
  return inicioA.slice(0, 10) <= fimB.slice(0, 10) && inicioB.slice(0, 10) <= fimA.slice(0, 10);
}

function mesmaNatureza(meta: MetaVendedorDto, form: MetaVendedorFormModel): boolean {
  if (meta.tipo !== form.tipo) {
    return false;
  }

  if (form.tipo === TipoMetaVendedor.Produto) {
    return Boolean(form.produtoId) && meta.produtoId === form.produtoId;
  }

  return true;
}

/** Meta da unidade no mesmo tipo/produto e período sobreposto — a do vendedor prevalece. */
export function metaUnidadeConflitante(
  metas: readonly MetaVendedorDto[],
  form: MetaVendedorFormModel,
  ignorarMetaId?: string | null,
): MetaVendedorDto | null {
  if (form.escopo !== EscopoMetaVendedor.Vendedor) {
    return null;
  }

  if (!form.periodoInicio || !form.periodoFim) {
    return null;
  }

  return (
    metas.find(
      (meta) =>
        !meta.vendedorUsuarioId &&
        meta.id !== ignorarMetaId &&
        mesmaNatureza(meta, form) &&
        periodosSobrepostos(
          form.periodoInicio,
          form.periodoFim,
          meta.periodoInicio,
          meta.periodoFim,
        ),
    ) ?? null
  );
}
