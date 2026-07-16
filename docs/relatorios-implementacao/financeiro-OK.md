# Financeiro — Gap de implementação

Controle financeiro integrado às operações em três níveis (unidade, CNPJ e consolidado do grupo), com geração automática de títulos, tesouraria, cobrança interna, renegociação, antecipação, orçamento vs realizado e multi-moeda.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**Atualizado:** 2026-07-13 (implementação dos gaps BE/FE)  
**SQL alinhado (BE):** `scripts/20260713_Financeiro_GestaoCompleta.sql` (cópia em `scripts/sql/`)

---

## Já existe (pré-gaps)

| Capacidade | Situação |
|---|---|
| Contas a receber a partir de venda | Geradas no `faturar` do pedido (+ PDV a prazo) |
| Contas a pagar a partir de compra | Geradas ao confirmar recebimento NF-e |
| Condições de pagamento | CRUD BE; FE agora com páginas CRUD |
| Config de formas de pagamento + taxas | CRUD BE/FE (menu Financeiro) |
| Listagem CAP | Já existia sob Compras; movida para Financeiro |
| Limite de crédito + exposição / atraso | Travas de aprovação de pedidos |

---

## O que foi implementado (2026-07-13)

### Funcionalidades core

#### 1. Contas a pagar — ✅ BE/FE
- Baixa (parcial → `ParcialmentePaga`), cancelamento, criar avulso
- Listagem com escopo Unidade/CNPJ/Grupo; menu em Financeiro

#### 2. CR completa operacional — ✅ BE/FE
- Baixa (múltiplas formas), cancelamento, listagem global
- Status `ParcialmentePaga`; PDV já gerava CR no BE

#### 3. Visões por unidade / CNPJ / consolidado — ✅ BE/FE
- Query `escopo` + filtros nas listagens CAP/CR e telas correlatas

#### 4. Fluxo de caixa — ✅ BE/FE
- Diário / semanal / projetado (`GET /financeiro/fluxo-caixa`)

#### 5. Boletos bancários — ⚠️ stub BE/FE
- Emitir / listar / remessa / retorno simulados

#### 6. Conciliação bancária (OFX / API) — ⚠️ stub BE/FE
- Importar OFX, vincular títulos, propor lançamentos

#### 7. Cheques, cartões e múltiplas formas — ✅ BE/FE
- Cheques: custódia → depositar/compensar/devolver
- Baixa CR com múltiplas formas; cartão continua via config de taxas

#### 8. Contas bancárias e caixas — ✅ BE/FE
- CRUD + alerta de saldo mínimo

#### 9. Centro de custo — ✅ BE/FE
- CRUD; vínculo opcional em títulos

#### 10. Transferências entre unidades — ✅ BE/FE
- Criar / confirmar / cancelar

### Tesouraria

#### 11. Saldo intraday — ⚠️ stub BE/FE
- `GET /financeiro/tesouraria/saldo-intraday`

#### 12. Projeção de caixa 30/60/90 — ✅ BE/FE
- `GET /financeiro/tesouraria/projecao`

#### 13. Aplicações financeiras — ✅ BE/FE
- CDB/LCI/LCA/Fundo + resgate

#### 14. Alerta de saldo mínimo — ✅ BE/FE
- Flag / endpoint por conta bancária

#### 15. Conciliação diária com proposta — ⚠️ stub BE/FE
- `propor-lancamentos` na conciliação

### Régua de cobrança

#### 16. Escalonamento D+1 … D+30+ — ✅ BE/FE
- Config etapas, painel, `processar-dia` (avisos internos)

### Renegociação e antecipação

#### 17. Renegociação de títulos — ✅ BE/FE
- Criar (mora/multa + novas parcelas), aprovar / rejeitar

#### 18. Antecipação de recebíveis — ✅ BE/FE
- Carteira, simular (deságio), ceder

### Orçamento vs realizado / multi-moeda

#### 19. Orçamento financeiro + DRE — ✅ BE/FE
- Versões R0/R1/R2, DRE orçado vs realizado, alertas 80%/100%

#### 20. PTAX / FX / exposição — ⚠️ stub PTAX BE/FE
- Cotações manuais/stub + exposição cambial CAP/CR ≠ BRL

---

## SQL (sem migration EF)

Aplicar manualmente:

`new_agropulse_backend/scripts/20260713_Financeiro_GestaoCompleta.sql`  
(cópia: `scripts/sql/20260713_Financeiro_GestaoCompleta.sql`)

Inclui ALTER em `contas_receber`/`contas_pagar`, tabelas de tesouraria/cobrança/orçamento/FX e `configs_forma_pagamento` se ausentes.

Contrato API: `new_agropulse_backend/api-contract/financeiro.md`

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| **Core** | | |
| CR automática por venda / PDV | ✅ | ✅ listagem + parcelas pedido |
| CAP automática por compra / NF-e | ✅ | ✅ listagem |
| Contas a pagar (baixa/cancelar) | ✅ | ✅ |
| Baixa / quitação / parcial CR | ✅ | ✅ multi-forma |
| Visão por unidade | ✅ | ✅ |
| Visão por CNPJ / consolidado grupo | ✅ | ✅ filtro escopo |
| Fluxo de caixa | ✅ | ✅ |
| Boletos registrados | ⚠️ stub | ⚠️ stub UI |
| Conciliação OFX / API | ⚠️ stub | ⚠️ stub UI |
| Cheques pré-datados | ✅ | ✅ |
| Cartões (taxas) + multi-forma na baixa | ✅ | ✅ |
| Contas bancárias / caixas | ✅ | ✅ |
| Centro de custo | ✅ | ✅ |
| Transferências entre unidades | ✅ | ✅ |
| Cond. pagamento + formas/taxas | ✅ | ✅ CRUD |
| **Tesouraria** | | |
| Saldo intraday | ⚠️ stub | ⚠️ stub |
| Projeção 30/60/90 | ✅ | ✅ |
| Aplicações financeiras | ✅ | ✅ |
| Alerta saldo mínimo | ✅ | ✅ |
| Conciliação com proposta | ⚠️ stub | ⚠️ stub |
| **Régua de cobrança** | | |
| D+1 … D+30+ avisos internos | ✅ | ✅ |
| Bloqueio por atraso (aprovação) | ✅ limiar empresa | ✅ badge fila |
| **Renegociação / antecipação** | | |
| Renegociação + mora/multa + aprovação | ✅ | ✅ |
| Simulação / deságio / cedido | ✅ | ✅ |
| **Orçamento vs realizado** | | |
| Orçamento / DRE / R0–R2 / alertas | ✅ | ✅ |
| **Multi-moeda** | | |
| PTAX / FX / exposição | ⚠️ PTAX stub | ⚠️ stub UI |

**Legenda:** ✅ pronto · ⚠️ parcial/stub · ❌ ausente

### Observações

- Integrações bancárias reais (OFX/Open Finance, CNAB, Asaas, PTAX Bacen) permanecem stub.
- Geração automática de CAP/CR (compras/vendas) foi reutilizada — não duplicada.
- Permissão FE: `financeiro.visualizar` (+ `formas-pagamento-config.visualizar` para formas).
- Rota legado `compras/contas-pagar` redireciona para `financeiro/contas-pagar`.
