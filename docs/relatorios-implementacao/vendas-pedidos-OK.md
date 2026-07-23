# Vendas e Pedidos — Gap de implementação

Dois fluxos: venda consultiva (orçamento → pedido → NF-e) e venda de balcão (PDV). Regras de desconto, crédito e bloqueio se aplicam a ambos.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**SQL alinhado (BE):** `scripts/20260713_Vendas_GestaoCompleta.sql` (cópia também em `scripts/sql/`)

---

## Já existe

| Capacidade | Situação |
|---|---|
| Pedidos de venda (ciclo completo) | Orçamento → aprovação → faturamento; reserva FEFO; contas a receber |
| Orçamentos dedicados + conversão 1 clique | CRUD + `POST /orcamentos/{id}/converter` e UI |
| Tabelas de preço com escopos | Cliente, grupo comercial, canal, região, vigência — CRUD BE/FE |
| Motor de resolução de preço (domínio) | Prioridade cliente → grupo → canal/região → geral (sem fallback `precoVenda` em vendas) |
| Margem mínima produto/categoria/item de tabela | Cadastro + trava `MargemMinima` |
| Fila de aprovações com travas | Margem, limite crédito, estoque insuficiente, atraso cliente |
| Notificações pós-decisão | Pedido retido / aprovado / recusado / expirado |
| Permissão granular `verCustos` | Existe no backend (omite custo/margem na API de produtos) |
| PDV básico | Vender / listar / cancelar com baixa/estorno de estoque |
| Devolução vinculada a pedido | Itens parciais + destino Reposição/Descarte |
| Contratos CPR / Barter / Termo | Cadastro com preço e vigência |
| Comissão no item + relatório de repasse | % fotografado no pedido; relatório `/relatorios` |
| Carteira do vendedor | `Cliente.VendedorUsuarioId` + filtro de pedidos |
| Histórico básico por cliente | Listagens de pedidos/orçamentos filtráveis por `clienteId` |
| Expedição pós-aprovação | Romaneio com lotes FEFO sugeridos |

---

## O que falta (status FE 2026-07-13)

### Tabela de preços

#### 1. Tabela padrão explícita — ✅ FE
- `ehPadrao` no DTO; badge na listagem; `PUT /tabelas-preco/{id}/definir-padrao` via botão estrela.
- SQL BE: `scripts/sql/20260713_Vendas_GestaoCompleta.sql`.

#### 2. Aplicação automática na venda — ✅ FE
- `GET /precificacao/resolver` + select de tabela; preço auto ao adicionar item (pedido, orçamento, PDV).
- `precoUnitario` opcional no payload (BE resolve se omitido).

#### 3. Seleção manual de tabela pelo operador — ✅ FE
- `tabelaPrecoId` em pedido/orçamento/PDV; `GET /tabelas-preco/permitidas`.

#### 4. Bloqueio se produto não estiver em tabela — ✅
- BE e FE sem fallback `precoVenda`; `GET /precificacao/resolver` e domínio de pedido/orçamento/PDV em hard mode.

---

### Desconto e margem mínima

#### 5. Desconto dentro da margem segue sem gerente — ✅ FE tipado
- UI trata resposta de enviar-aprovação como auto-aprovado (`Aprovado`) ou `PendenteEstoque` / `Aguardando`.

#### 6. Trava de margem efetiva no fluxo — ✅ FE
- `GET /pedidos-venda/{id}/travas` + card de travas no detalhe do pedido.

#### 7. Vendedor sem ver margem/custo/lucro — ✅ FE
- `useVerCustos` carrega permissão granular do usuário; oculta comissão no detalhe do pedido e lucro/comissão em relatórios.

---

### PDV

#### 8. Identificação rápida e venda sem cliente — ✅ FE
- Busca cliente por nome/documento; CPF/nome avulso.

#### 9. Código de barras / busca rápida — ✅ FE
- Campo barcode + `GET /estoque/produtos/por-codigo`.

#### 10. Múltiplas formas de pagamento + troco — ✅ FE
- Pagamentos múltiplos (`CartaoDebito`/`CartaoCredito`/`Cheque` + existentes); cálculo de troco.

#### 11. À vista vs a prazo no balcão — ✅ FE
- Toggle `aPrazo` no payload PDV.

#### 12. NFC-e / NF-e automática — ✅ FE stub
- Botão `POST /pdv/{id}/emitir-nfce` no detalhe da venda.

#### 13. Contingência SEFAZ — ❌ fora deste ciclo

---

### Pedidos bloqueados (fluxo unificado)

#### 14. Só bloqueados vão ao gerente — ✅ FE tipado (depende BE)
#### 15. Estoque zerado com liberação automática — ✅ FE status `PendenteEstoque`

Enum FE sincronizado com BE atual: status de espera continua `Aguardando` (não `AguardandoAprovacao`). Novo: `PendenteEstoque`.

---

### Devoluções

#### 16. Busca pela NF-e original — ✅ FE
- `GET /devolucoes-venda/origem?numeroNf|chaveNf`

#### 17. Estoque com lote original + justificativa de descarte — ✅ FE
- Campos lote + justificativa obrigatória se destino = Descarte.

#### 18. Tratamento financeiro (3 formas) — ✅ FE
- `destinoCredito`: AbatimentoProximaCompra | DevolucaoDinheiroPix | EstornoCartao.

#### 19. NF-e de devolução automática — ❌ fora deste ciclo

---

### Demais funcionalidades

#### 20. Representantes/consultores com carteira e metas — ✅ FE tipado
- Rotas `/metas-vendedor` e `/representantes` (listagens; graceful se BE ainda não expuser).

#### 21. Comissões por canal e faixa de desconto — ✅
- BE aplica regras com canal da tabela de preço do pedido; FE CRUD `/regras-comissao`.

#### 22. Contratos com trava de preço por safra — ✅
- `contratoId` no pedido trava preço do produto do contrato (CPR/Barter/Termo); FE select opcional no formulário.

#### 23. Bonificação / fidelidade por volume — ❌ fora de escopo

#### 24. App mobile vendedor/consultor — ❌ fora de escopo

#### 25. Histórico completo de negociações por cliente — ✅ FE
- Seção no cliente: `GET /clientes/{id}/historico-comercial`.

---

## Mapa rápido (FE pós-implementação)

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| **Tabela de preços** | | |
| Tabela padrão | ⚠️ em paralelo (`ehPadrao` + SQL) | ✅ badge + definir padrão |
| Tabelas exclusivas (cliente/grupo/canal/período) | ✅ | ✅ |
| Aplicação automática pelo perfil | ⚠️ resolver domínio + API | ✅ resolver + preço auto |
| Seleção manual de tabela | ⚠️ `tabelaPrecoId` | ✅ |
| Bloqueio item sem preço de tabela | ✅ hard mode | ✅ sem fallback `precoVenda` |
| **Desconto / margem** | | |
| Margem mínima produto/categoria | ✅ | ✅ cadastro |
| Vendedor não vê custo/margem/lucro | ✅ `verCustos` | ✅ telas venda/relatório |
| Desconto OK → segue sem gerente | ⚠️ | ✅ tipado |
| Viola margem → trava + gerente | ⚠️ | ✅ detalhe com travas |
| Notificação pós-decisão | ✅ | ✅ |
| **PDV** | | |
| Tela balcão rápida | ⚠️ | ✅ barcode/pagamentos/troco |
| Cliente CPF/nome/tel + limite sem ID | ⚠️ | ✅ busca + avulso |
| Código de barras / busca | ✅ estoque por-codigo | ✅ |
| Múltiplos pagamentos + troco | ⚠️ | ✅ |
| À vista vs a prazo + crédito | ⚠️ | ✅ `aPrazo` |
| NFC-e / NF-e automática | ⚠️ stub | ✅ stub UI |
| Contingência SEFAZ | ❌ | ❌ |
| **Bloqueios unificados** | | |
| Fila gerente (margem/crédito/inadimplência) | ⚠️ | ✅ fila + detalhe |
| Estoque zerado → libera ao entrar | ⚠️ `PendenteEstoque` | ✅ status UI |
| **Devoluções** | | |
| Busca NF-e original | ⚠️ | ✅ |
| Total / parcial | ⚠️ | ⚠️ parcial |
| Estoque lote original / descarte c/ justificativa | ⚠️ | ✅ |
| Financeiro (3 formas) | ⚠️ | ✅ `destinoCredito` |
| NF-e devolução + impostos | ❌ | ❌ |
| **Demais** | | |
| Orçamento + tabela automática | ⚠️ | ✅ |
| Orçamento → pedido 1 clique | ✅ | ✅ |
| Representante + carteira + metas | ⚠️ | ✅ listagens tipadas |
| Comissões por canal + faixa desconto | ✅ canal da tabela | ✅ CRUD `/regras-comissao` |
| Trava preço contrato/safra no pedido | ✅ `contratoId` | ✅ select + DTO |
| Histórico pedidos/negociações por cliente | ⚠️ | ✅ aba/seção no cliente |
| Bonificação / fidelidade | ❌ | ❌ (fora) |
| App mobile | ❌ | ❌ (fora) |

**Legenda:** ✅ pronto · ⚠️ parcial / depende BE paralelo · ❌ ausente / fora de escopo

---

## Pendente para fechar o módulo

| Tipo | Item |
|------|------|
| — | Domínio + Focus NFC-e/NF-e/devolução + crédito financeiro devolução fechados (2026-07-22) |
| Integração | Contingência SEFAZ offline avançada (retransmissão básica via job já existe) |
| Fora de escopo | Bonificação / fidelidade por volume |
| Fora de escopo | App mobile vendedor / consultor |

**Status:** domínio e emissão Focus NFC-e/devolução cobertos; contingência com fila + job de retransmissão.
