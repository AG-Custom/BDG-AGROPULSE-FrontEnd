# Produção e Beneficiamento — Gap de implementação

Ordens de produção, BOM/receitas, rastreabilidade lote a lote, custos, qualidade, paradas e OEE.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**Atualizado:** 2026-07-13 (implementação dos gaps FE)  
**SQL alinhado (BE):** `scripts/20260713_Producao_GestaoCompleta.sql`

---

## Já existe

| Capacidade | Situação |
|---|---|
| Ordens de produção | CRUD + status Aberta → EmAndamento → Concluida/Cancelada; insumos; `receitaId` |
| Conclusão com quantidade + custos | Dialog/API com `quantidadeProduzida`, `custoMaoObra`, `custoOverhead` |
| Apontamentos de consumo / produção | UI no detalhe da OP + balança stub |
| Beneficiamento entrada → saídas tipadas | CRUD rascunho + confirmar; Principal/Subproduto/Perda |
| Receitas / BOM com tolerâncias | CRUD + ativar; explosão na OP |
| Laudos laboratoriais | CRUD + aprovar/reprovar |
| Ficha técnica de processo | CRUD temperatura/umidade/tempo |
| Paradas de linha | CRUD + resolver |
| OEE | Página `/producao/oee` |
| Genealogia de lotes | Modal em Lotes (`GET /estoque/lotes/{id}/genealogia`) |
| Rastreabilidade de campo | Talhões + aplicações de insumo |
| Documento “Ficha Técnica” no produto | Upload de arquivo (`TipoDocumentoProduto.FichaTecnica`) — complementar à ficha estruturada |

---

## O que falta (status FE 2026-07-13)

### 1. Estrutura de produto (BOM) — ✅ FE
- `ReceitasListPage` / `ReceitaFormPage`; select receita na OP carrega insumos.

### 2. Apontamento de consumo real por lote — ✅ FE
- Detalhe da OP: lote + qtd + etapa; conclusão usa apontamentos no BE.

### 3. Rastreabilidade MP → PA lote a lote — ✅ FE
- Modal genealogia na listagem de lotes.

### 4. Subprodutos e perdas — ✅ FE
- Saídas tipadas no beneficiamento + botão Confirmar.

### 5. Custo real vs planejado — ✅ FE
- Card de custos no detalhe; custos opcionais na conclusão.

### 6. Laudo laboratorial — ✅ FE
- Listagem + form/detalhe com aprovar/reprovar.

### 7. Ficha técnica estruturada — ✅ FE
- CRUD parâmetros de processo.

### 8. Paradas de linha — ✅ FE
- Listagem + dialog de registro + resolver.

### 9. Integração balanças / sensores — ⚠️ stub UI
- Botão “Ler balança” via `POST /estoque/dispositivos/leitura-peso` + apontamento produção.

### 10. Relatório OEE — ✅ FE
- `OeePage` com disponibilidade/performance/qualidade/OEE.

---

## SQL (sem migration EF)

Aplicar manualmente:

`new_agropulse_backend/scripts/20260713_Producao_GestaoCompleta.sql`

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| BOM / receitas + tolerâncias | ✅ | ✅ |
| OP + consumo real por lote | ✅ | ✅ |
| Rastreabilidade MP→PA lote a lote | ✅ | ✅ genealogia |
| Subprodutos / perdas | ✅ | ✅ |
| Custo real vs planejado | ✅ | ✅ |
| Laudo laboratorial por lote | ✅ | ✅ |
| Ficha técnica (temp./umidade/tolerâncias) | ✅ | ✅ |
| Paradas de linha | ✅ | ✅ |
| Balanças / sensores | ⚠️ stub | ⚠️ stub UI |
| OEE / eficiência produtiva | ✅ | ✅ |
| Integração OP → estoque | ✅ Domain | ✅ via concluir/confirmar |

**Legenda:** ✅ pronto · ⚠️ parcial · ❌ ausente

### Observações

- IoT/balança real permanece stub (sem hardware).
- Upload PDF de ficha no produto continua disponível em paralelo à ficha estruturada de processo.
