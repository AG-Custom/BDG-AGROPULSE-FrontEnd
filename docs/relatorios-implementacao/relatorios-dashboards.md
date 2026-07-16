# Relatórios via Dashboards — Gap de implementação

Dashboards gerenciais, margem por lote, DRE multi-visão, rentabilidade, inadimplência, desempenho comercial, alertas, exportação e Power BI.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13

---

## Já existe

| Capacidade | Situação |
|---|---|
| Curva ABC de lucratividade | `GET /relatorios/curva-abc-lucratividade` + aba no FE (custo via **CMP**, não lote) |
| Relatório de comissões / repasse | `GET /relatorios/comissoes-repasse` + aba no FE |
| Rotas + permissões + sidebar | `dashboard.visualizar`, `relatorios.visualizar` |
| Export Excel/PDF em listagens | Clientes, produtos, pedidos, fornecedores — **não** nos relatórios analíticos |
| Alertas de estoque | Mínimo e validade (módulo estoque) |
| Travas de margem / atraso | Fila de aprovações (não alertas de dashboard) |
| Dados brutos operacionais | Pedidos faturados, lotes com `custoUnitario`, contas a receber, saldos |
| `MetricTile` no design system | Componente pronto — **não usado** no painel |
| Dashboard (`/`) | Stub: “Painel em construção” |

---

## O que falta

### 1. Dashboard gerencial com KPIs em tempo real
Sem agregação de faturamento, margem, inadimplência e estoque. Painel é placeholder.

### 2. Análise de margem por lote
Diferencial da doc. Lote tem custo unitário e baixa FEFO, mas a Curva ABC usa **CMP do produto**. Sem relatório de margem por lote vendido.

### 3. DRE (unidade / CNPJ / consolidado)
Inexistente.

### 4. Comparativo / ranking entre unidades
Inexistente. Switcher de unidade é só contexto operacional.

### 5. Rentabilidade por produto, cliente, canal e região
Só ABC por produto. Sem cliente/canal/região em analytics (canal/região existem só em tabela de preço).

### 6. Inadimplência e aging de recebíveis
CR listável; atraso usado em trava de aprovação. Sem buckets aging, % inadimplência nem visão consolidada.

### 7. Desempenho da equipe de vendas
Comissões por vendedor existem. Sem pedidos agregados, conversão, ticket médio nem metas.

### 8. Alertas de desvio de metas / margem / inadimplência crítica
Sem alertas de dashboard. Travas de pedido ≠ alertas gerenciais de meta.

### 9. Export Excel/PDF dos relatórios + Power BI
Export não existe em `/relatorios`. Zero integração Power BI.

### 10. Relatórios customizáveis por perfil
Perfis descrevem escopos no enum, mas não governam o que cada um vê. Curva ABC pode expor lucro sem checagem de `verCustos`.

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| Dashboard KPIs (faturamento, margem, inadimplência, estoque) | ❌ | ❌ stub |
| Margem por lote (não CMP diluído) | ⚠️ dados de lote; ABC usa CMP | ❌ |
| DRE unidade / CNPJ / consolidado | ❌ | ❌ |
| Ranking comparativo de filiais | ❌ | ❌ |
| Rentabilidade produto | ⚠️ ABC (CMP) | ⚠️ ABC |
| Rentabilidade cliente / canal / região | ❌ | ❌ |
| Inadimplência + aging | ⚠️ CR + atraso interno | ⚠️ trava/parcelas |
| Desempenho equipe (pedidos, conversão, ticket, metas) | ⚠️ só comissões | ⚠️ só comissões |
| Alertas metas / margem / inadimplência | ⚠️ travas pedido | ⚠️ fila aprovações |
| Alertas estoque | ✅ | ✅ |
| Export Excel/PDF dos relatórios | ❌ | ❌ |
| Export listagens operacionais | ✅ | ✅ |
| Integração Power BI | ❌ | ❌ |
| Relatórios por perfil de usuário | ❌ | ⚠️ permissões sem escopo analítico |
| Curva ABC | ✅ | ✅ |
| Comissões / repasse | ✅ | ✅ |

**Legenda:** ✅ pronto · ⚠️ parcial · ❌ ausente

---

## Síntese

Relatórios analíticos estão em estágio mínimo (2 rotas: ABC + comissões). O diferencial da doc — **margem por lote** — ainda não está no relatório (usa CMP). Dashboard, DRE, aging, rankings, Power BI e escopo por perfil ainda não existem.
