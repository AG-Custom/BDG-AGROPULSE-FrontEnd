# Contratos Agrícolas — Gap de implementação

CPR, Barter e contratos a termo / trava de preço — com liquidação física/financeira, vínculos operacionais e alertas.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13

---

## Já existe

| Capacidade | Situação |
|---|---|
| CRUD CPR / Barter / Termo | Três rotas (`/contratos/cprs`, `/barter`, `/termo`) + abas no FE |
| Cadastro mínimo | Cliente, produto, quantidade, preço, fonte, vigência, observação |
| Workflow de status | Aberto → Liquidado / Entregue / Cancelado (botões no detalhe) |
| Enum `FontePreco` | Manual, CBOT, ESALQ |
| Cotação de mercado | `GET /contratos/cotacao-mercado` — **stub** com preços fixos; card informativo no FE |
| Navegação + permissão | Sidebar Operações; `contratos.visualizar` |

**Campos persistidos hoje:** `clienteId`, `produtoId`, `quantidade`, `preco`, `fontePreco`, `status`, `dataInicio`, `dataFim`, `observacao`, `liquidadoEm`, `entregueEm`. Os três tipos compartilham o **mesmo schema genérico**.

---

## O que falta

### CPR

#### 1. Registro completo
Sem número sequencial, múltiplas partes, qualidade mínima, local de entrega, data dedicada e garantias.

#### 2. Vínculo a pedidos de venda de insumos
Sem rastreio crédito de insumos × obrigação de entrega de grãos.

#### 3. Painel operacional
Listagem básica existe; sem comprometido vs entregue, filtros de painel nem quantidade entregue parcial.

#### 4. Liquidação física
`entregar` só muda status. Sem baixa proporcional, estoque ou NF-e de recebimento.

#### 5. Liquidação financeira (CBOT/ESALQ)
`liquidar` não consulta cotação. Cotação é stub desconectado do fluxo.

#### 6. Alerta de não liquidação + Cobrança/Crédito
Inexistente.

---

### Barter

#### 7. Cadastro específico (insumos + grãos)
Schema genérico (1 produto, 1 preço). Sem lado insumos, sacas/t nem preço de referência separado.

#### 8. Cálculo automático de grãos equivalentes
Inexistente.

#### 9. Estoque + NF-e (saída insumos / entrada grãos)
Inexistente.

#### 10. Ajuste financeiro (preço entrega × referência)
Inexistente.

#### 11. Vínculo à safra + alerta pré-colheita
Inexistente.

---

### Contratos a termo / trava de preço

#### 12. Compra ou venda futura tipada
Cadastro genérico; sem tipo compra/venda nem partes completas.

#### 13. Painel por safra (travado, preço médio, exposição)
Inexistente. Sem trava de preço no pedido de venda.

#### 14. Alertas 30 / 15 / 5 dias
Inexistente.

#### 15. Entrega com NF-e e resultado financeiro
Inexistente (stub de status).

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| **CPR** | | |
| Registro completo | ⚠️ campos mínimos | ⚠️ form genérico |
| Vínculo pedidos insumos ↔ grãos | ❌ | ❌ |
| Painel abertas (prazo, comprometido/entregue) | ⚠️ listagem + status | ⚠️ listagem enxuta |
| Liquidação física + NF-e | ❌ stub status | ❌ botão stub |
| Liquidação financeira CBOT/ESALQ | ❌ stub status | ❌ botão stub |
| Alerta vencimento → Cobrança | ❌ | ❌ |
| **Barter** | | |
| Cadastro insumos + grãos | ⚠️ schema genérico | ⚠️ form genérico |
| Cálculo grãos equivalentes | ❌ | ❌ |
| Estoque + NF-e | ❌ | ❌ |
| Ajuste financeiro diferença preço | ❌ | ❌ |
| Safra + alerta pré-colheita | ❌ | ❌ |
| **Termo / trava** | | |
| Compra/venda futura preço fixado | ⚠️ cadastro genérico | ⚠️ form genérico |
| Painel por safra (exposição mercado) | ❌ | ❌ |
| Alertas 30/15/5 dias | ❌ | ❌ |
| Entrega NF-e + resultado financeiro | ❌ | ❌ |
| **Transversal** | | |
| CRUD + status | ✅ | ✅ |
| Fonte preço Manual/CBOT/ESALQ | ✅ enum | ✅ select |
| Cotação mercado aplicada ao preço | ❌ stub desconectado | ⚠️ card sem aplicar |
| Trava preço no pedido de venda | ❌ | ❌ |

**Legenda:** ✅ pronto · ⚠️ parcial · ❌ ausente

---

## Síntese

Contratos Agrícolas estão em **esqueleto CRUD + máquina de estados**. CPR, Barter e Termo usam o mesmo modelo; liquidação/entrega/cotação são stubs. Integrações com pedidos, estoque, fiscal, financeiro, safra e alertas ainda não existem.
