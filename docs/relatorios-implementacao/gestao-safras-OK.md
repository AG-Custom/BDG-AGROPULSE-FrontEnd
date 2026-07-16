# Gestão de Safras — Gap de implementação

Duas versões: **Revenda** (suporte técnico — visitas, recomendações, histórico de aplicações) e **Indústria** (planejamento, custeio/ha, OS agrícola, OEE). Capacidades comuns: talhões, aplicações com lote, diário de campo e histórico.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**Atualizado:** 2026-07-13 (implementação dos gaps BE/FE)  
**SQL alinhado (BE):** `scripts/20260713_Safras_GestaoCompleta.sql` (cópia em `scripts/sql/`)

---

## Já existe (pré-gaps)

| Capacidade | Situação |
|---|---|
| Cadastro de talhões | CRUD nome + área (ha) + inativação (BE/FE) |
| Aplicações de insumos | CRUD talhão, produto, quantidade, unidade, data |
| Lote do insumo na aplicação | `loteId` opcional — agora com select de estoque + `numeroLote` na response |
| Safra / cultura | Antes texto livre; agora entidade Safra + vínculo opcional |
| Metadados regulatórios | `numeroReceita`, `crea` |
| Tipo Revenda / Indústria na empresa | `TipoOperacaoEmpresa` — agora exposto em `GET /safras/perfil` e menus FE |
| Produção industrial (adjacente) | OP + beneficiamento — domínio de fábrica, **não** OS agrícola |

---

## O que foi implementado (2026-07-13)

### Estrutura territorial e geo

#### 1. Fazendas, glebas e georreferenciamento — ✅ BE/FE (geo stub)
- Hierarquia fazenda → gleba → talhão (`glebaId` no talhão)
- Coordenadas texto em fazenda/gleba/talhão
- Importação KML/Shapefile/GeoJSON: `POST /safras/geo/importar` (stub)

### Revenda

#### 2. Visitas técnicas — ✅ BE/FE
- CRUD `/safras/visitas-tecnicas` + página listagem/dialog

#### 3. Recomendações — ✅ BE/FE
- CRUD + aplicar/cancelar; vínculo opcional à visita/talhão/safra

#### 4. Histórico de aplicações (visão suporte) — ✅ BE/FE
- `GET /safras/aplicacoes/historico` com filtros cliente/fazenda/talhão/safra
- Listagem de aplicações com filtros talhão/safra/datas

### Indústria

#### 5. Planejamento de safra — ✅ BE/FE
- Entidade Safra (cultura, área, época, produtividade, status)
- CRUD + encerrar/cancelar

#### 6. Ordem de serviço agrícola — ✅ BE/FE
- Tipos plantio→colheita; iniciar/concluir/cancelar
- Número gerado `OSA-AAAA-####`

#### 7. Custeio por hectare — ✅ BE/FE
- Itens por categoria + `GET /safras/custeios/resumo` (custo total, R$/ha, receita, margem)

#### 8. Produtividade planejada vs realizada — ✅ BE/FE
- Campos na Safra + `GET /safras/produtividade`

#### 9. Relatório custo total e receita líquida — ✅ BE/FE
- Resumo de custeio + histórico de produtividade

#### 10. OEE agrícola / de campo — ✅ BE/FE (heurística)
- `GET /safras/oee-campo?mes=&ano=` (a partir de OS; stub/heurística)

### Ambos (Revenda e Indústria)

#### 11. Aplicação completa — ✅ BE/FE
- Dose/ha, área aplicada, equipamento, operador, temperatura/umidade/vento, observações + `safraId`

#### 12. Lote rastreável — ✅ BE/FE
- Select de lotes do estoque; response com `numeroLote`

#### 13. Diário de campo offline + sync — ⚠️ stub BE/FE
- CRUD + `POST /safras/diario-campo/sync` por `clientSyncId` (idempotente; sem PWA/offline real)

#### 14. Histórico de safras / evolução produtividade — ✅ BE/FE
- `GET /safras/historico-produtividade`

#### 15. Diferenciação Revenda vs Indústria — ✅ BE/FE
- `GET /safras/perfil` + sidebar condicionada; fallback mostra ambos se perfil falhar

---

## SQL (sem migration EF)

Aplicar manualmente:

`new_agropulse_backend/scripts/20260713_Safras_GestaoCompleta.sql`  
(cópia: `scripts/sql/20260713_Safras_GestaoCompleta.sql`)

Inclui tabelas `fazendas`, `glebas`, `safras`, `visitas_tecnicas`, `recomendacoes_agronomicas`, `ordens_servico_agricola`, `custeio_safra_itens`, `diario_campo_entradas` e ALTERs em `talhoes` / `aplicacoes_insumo`.

Contrato API: `new_agropulse_backend/api-contract/safras.md` (+ `rastreabilidade.md` estendido)

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend | Escopo |
|---|---|---|---|
| Talhões (nome + ha) | ✅ | ✅ | Ambos |
| Fazendas / glebas | ✅ | ✅ | Ambos |
| Georreferenciamento (shapefile/KML) | ⚠️ stub | ⚠️ stub UI | Ambos |
| Planejamento de safra | ✅ | ✅ | Indústria |
| OS agrícola (plantio→colheita) | ✅ | ✅ | Indústria |
| Custeio por hectare | ✅ | ✅ | Indústria |
| Lote do insumo na aplicação | ✅ | ✅ select estoque | Ambos |
| Aplicação (dose/equip/operador/clima) | ✅ | ✅ | Ambos |
| Diário de campo offline + sync | ⚠️ stub sync | ⚠️ stub UI | Ambos |
| Produtividade planejada vs real | ✅ | ✅ | Indústria |
| Relatório custo/receita por safra | ✅ | ✅ | Indústria |
| Histórico safras / evolução produtividade | ✅ | ✅ | Ambos |
| Visitas técnicas | ✅ | ✅ | Revenda |
| Recomendações | ✅ | ✅ | Revenda |
| OEE de campo | ⚠️ heurística | ✅ | Indústria |
| Perfil Revenda vs Indústria nas telas | ✅ | ✅ sidebar | — |

**Legenda:** ✅ pronto · ⚠️ parcial/stub · ❌ ausente

### Observações

- Talhões/aplicações permaneceram em `/api/rastreabilidade/*` (estendidos) — não duplicados.
- Geo real (polígono/mapa) e offline tablet permanecem stub.
- OEE de campo é heurística a partir de OS (não confundir com OEE industrial em `/producao/oee`).
- Permissão FE: `rastreabilidade.visualizar`.
