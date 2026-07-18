# Relatórios via Dashboards — Gap de implementação

Dashboards gerenciais, margem por lote, DRE multi-visão, rentabilidade, inadimplência, desempenho comercial, alertas, exportação e Power BI.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**Atualizado:** 2026-07-17 (implementação dos gaps BE/FE)  
**SQL alinhado (BE):** `scripts/20260717_Relatorios_GestaoCompleta.sql`

---

## Já existe (pré-gaps)

| Capacidade | Situação |
|---|---|
| Curva ABC de lucratividade | `GET /relatorios/curva-abc-lucratividade` + aba no FE (custo via **CMP**) |
| Relatório de comissões / repasse | `GET /relatorios/comissoes-repasse` + aba no FE |
| Giro de estoque | `GET /relatorios/giro-estoque` + aba no FE |
| Rotas + permissões + sidebar | `dashboard.visualizar`, `relatorios.visualizar` |
| Export Excel/PDF em listagens | Clientes, produtos, pedidos, fornecedores |
| Alertas de estoque | Mínimo e validade (módulo estoque) |
| Travas de margem / atraso | Fila de aprovações (não alertas de dashboard) |
| `MetricTile` no design system | Componente pronto |

---

## O que foi implementado (2026-07-17)

### 1. Dashboard gerencial com KPIs — ✅ BE/FE
- `GET /api/relatorios/dashboard?dias=30`
- KPIs: faturamento, margem, inadimplência, a receber/pagar, estoque abaixo do mínimo, meta %
- FE: `DashboardPage` com `MetricTile`, top 5 alertas e ranking de unidades
- `verCustos` mascara custo/lucro/margem

### 2. Análise de margem por lote — ✅ BE/FE
- `GET /api/relatorios/margem-por-lote` — custo via `Lote.CustoUnitario` (não CMP)
- Join `MovimentacaoEstoque` (ReservaPedido) × lote × receita do pedido
- Aba + export Excel/PDF

### 3. DRE (unidade / CNPJ / consolidado) — ✅ BE/FE
- `GET /api/relatorios/dre?mes=&ano=&visao=Unidade|Cnpj|Grupo`
- Receita, CMV, lucro bruto/líquido, despesas (CAP pagas), comissões, ticket médio
- Aba com seletor de visão

### 4. Comparativo / ranking entre unidades — ✅ BE/FE
- `GET /api/relatorios/ranking-unidades`
- Bloco no dashboard + export

### 5. Rentabilidade por produto, cliente, canal e região — ✅ BE/FE
- `GET /api/relatorios/rentabilidade?dimensao=Produto|Cliente|Canal|Regiao`
- Aba com seletor de dimensão + export
- ABC por produto (CMP) mantida

### 6. Inadimplência e aging de recebíveis — ✅ BE/FE
- `GET /api/relatorios/inadimplencia`
- Buckets 1–15 / 16–30 / 31–60 / 61–90 / 90+ + % + por vendedor
- Aba com KPIs + tabelas

### 7. Desempenho da equipe de vendas — ✅ BE/FE
- `GET /api/relatorios/desempenho-equipe?mes=&ano=`
- Pedidos, conversão, ticket, comissão, meta e atingimento %
- Aba + export

### 8. Alertas de desvio de metas / margem / inadimplência — ✅ BE/FE
- `GET /api/relatorios/alertas` (computado; thresholds em `config_alertas_gerenciais`)
- Tipos: MetaDesvio, MargemBaixa, InadimplenciaCritica, EstoqueMinimo
- Aba + resumo no dashboard

### 9. Export Excel/PDF dos relatórios + Power BI — ✅ BE / ⚠️ stub Power BI
- Export `?exportar=excel|pdf` em: ABC, comissões, giro, margem-lote, ranking, rentabilidade, desempenho
- `GET /api/relatorios/power-bi` — stub (`stub: true`; lê `power_bi_config` se ativo)
- FE: botões de export nas abas de lista; aba Power BI stub

### 10. Relatórios customizáveis por perfil — ✅ parcial BE/FE
- BE: `PossuiVerCustosAsync` mascara custo/lucro/margem nos responses sensíveis
- FE: `useVerCustos` oculta colunas; abas DRE/Margem ocultas para perfil Operacional/RH

---

## SQL

`scripts/20260717_Relatorios_GestaoCompleta.sql`

- Seed módulo `relatorios`
- `config_alertas_gerenciais` (thresholds)
- `power_bi_config` (embed futuro)

---

## Mapa rápido (pós-implementação)

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| Dashboard KPIs | ✅ | ✅ MetricTile |
| Margem por lote (não CMP) | ✅ | ✅ |
| DRE unidade / CNPJ / consolidado | ✅ | ✅ |
| Ranking comparativo de filiais | ✅ | ✅ |
| Rentabilidade produto / cliente / canal / região | ✅ | ✅ |
| Inadimplência + aging | ✅ | ✅ |
| Desempenho equipe (pedidos, conversão, ticket, metas) | ✅ | ✅ |
| Alertas metas / margem / inadimplência | ✅ | ✅ |
| Alertas estoque | ✅ (estoque + dashboard) | ✅ |
| Export Excel/PDF dos relatórios | ✅ | ✅ |
| Integração Power BI | ⚠️ stub | ⚠️ stub |
| Relatórios por perfil / verCustos | ✅ | ✅ parcial |
| Curva ABC | ✅ | ✅ |
| Comissões / repasse | ✅ | ✅ |

**Legenda:** ✅ pronto · ⚠️ stub/parcial · ❌ ausente

---

## Síntese

Relatórios analíticos cobrem dashboard, margem por lote, DRE multi-visão, ranking, rentabilidade dimensional, aging, desempenho com metas, alertas gerenciais e export. Power BI permanece stub até integração externa. Escopo analítico fino por perfil além de `verCustos` pode ser evoluído depois.

---

## Pendente para fechar o módulo

| Tipo | Item |
|------|------|
| Integração | Power BI embed real (hoje `stub: true` + `power_bi_config`) |
| Domínio (opcional) | Relatórios customizáveis por perfil além de `verCustos` / ocultação Operacional |
| Fora de escopo | — |

**Status:** analytics internos e export Excel/PDF cobertos; falta Power BI nativo.
