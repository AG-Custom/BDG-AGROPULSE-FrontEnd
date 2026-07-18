# Contratos Agrícolas — Gap de implementação

CPR, Barter e contratos a termo / trava de preço — com liquidação física/financeira, vínculos operacionais e alertas.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**Atualizado:** 2026-07-17 (implementação dos gaps BE/FE)  
**SQL alinhado (BE):** `scripts/20260717_Contratos_GestaoCompleta.sql` (cópia em `scripts/sql/`)

---

## Já existe (pré-gaps)

| Capacidade | Situação |
|---|---|
| CRUD CPR / Barter / Termo | Três rotas + abas no FE |
| Workflow de status | Aberto → Liquidado / Entregue / Cancelado (+ ParcialmenteEntregue) |
| FontePreco | Manual, CBOT, ESALQ |
| Cotação stub | `GET /contratos/cotacao-mercado` |
| `safraId` + trava preço no pedido | Parcial (PedidoVenda.ContratoId) |

---

## O que foi implementado (2026-07-17)

### CPR

#### 1. Registro completo — ✅ BE/FE
- Número CPR único, qualidade, local, data entrega prevista, emitente/credor, garantias
- Form CPR tipado no FE

#### 2. Vínculo a pedidos — ✅ BE/FE
- `contrato_vinculos_pedido` (Insumos|Graos)
- Listagem no detalhe

#### 3. Painel operacional — ✅ BE/FE
- `GET /contratos/painel` — saldo, comprometido %, dias vencimento
- Colunas entregue/saldo/dias na listagem

#### 4. Liquidação física — ✅ BE (NF-e stub) / ✅ FE
- `POST .../entregas` parcial → `ParcialmenteEntregue` / `Entregue`
- Dialog entrega parcial + barra de progresso

#### 5. Liquidação financeira — ✅ BE/FE
- `liquidar` usa cotação quando fonte ≠ Manual
- Dialog com preço manual opcional (`precoLiquidacaoManual`)

#### 6. Alertas — ✅ BE/FE
- `GET /contratos/alertas` (30/15/5 + vencidos)
- Painel de alertas na listagem

### Barter

#### 7–11 — ✅ BE/FE (estoque/NF stub)
- Cadastro dual insumos × grãos
- Cálculo equivalente (local no form + `POST .../calcular-equivalente` no salvo)
- Entrega com NF stub + ajuste financeiro
- Safra + alertas pré-colheita

### Termo / trava

#### 12–15 — ✅ BE/FE
- `tipoOperacao` Compra|Venda + contraparte
- `GET /painel-safra`
- Alertas 30/15/5
- Entrega + resultado financeiro

### Transversal
- Cotação aplicável no formulário (card FE)
- Aditivos CRUD leve no BE
- Status `ParcialmenteEntregue`

---

## SQL

`scripts/20260717_Contratos_GestaoCompleta.sql`

- ALTER nas 3 tabelas (campos tipados, quantidade_entregue, liquidação…)
- `contrato_garantias`, `contrato_entregas`, `contrato_vinculos_pedido`, `contrato_aditivos`
- Seed módulo `contratos`

Contrato API: `api-contract/contratos.md`

---

## Mapa rápido (pós-implementação)

| Capacidade | Backend | Frontend |
|---|---|---|
| CPR registro completo | ✅ | ✅ |
| Vínculo pedidos | ✅ | ✅ |
| Painel abertas | ✅ | ✅ |
| Entrega parcial + NF stub | ✅ | ✅ |
| Liquidação financeira + cotação | ✅ | ✅ |
| Alertas prazo | ✅ | ✅ |
| Barter dual + equivalente | ✅ | ✅ |
| Termo compra/venda + painel safra | ✅ | ✅ |
| Estoque real / NF-e fiscal | ⚠️ stub | ⚠️ stub |

**Legenda:** ✅ pronto · ⚠️ stub · ❌ ausente

---

## Síntese

Contratos Agrícolas passaram de CRUD genérico para modelo tipado com entregas parciais, liquidação com cotação, painel, alertas e barter dual. Integrações reais de estoque/NF-e permanecem stub.

---

## Pendente para fechar o módulo

| Tipo | Item |
|------|------|
| Integração | NF-e real na liquidação física / barter (hoje `StubNfe`) |
| Domínio | Baixa/entrada de estoque real nas liquidações (hoje stub) |
| Integração | Cotação CBOT / ESALQ real (hoje `GET /contratos/cotacao-mercado` stub) |
| Fora de escopo | — |

**Status:** CPR / Barter / Termo tipados com painel, alertas e entregas parciais; falta amarrar estoque e fiscal reais.
