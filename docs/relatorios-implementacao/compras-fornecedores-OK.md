# Compras e Fornecedores — Gap de implementação

Módulo otimizado para revendas: ponto de entrada principal é o recebimento da NF-e (entrada de estoque + conta a pagar). Fluxo avançado solicitação → cotação → aprovação → OC é opcional e habilitável por tenant.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**Atualizado:** 2026-07-17 (envio de cotação + contratos de fornecimento)

---

## Já existe

| Capacidade | Situação |
|---|---|
| Cadastro de fornecedores + contatos | CRUD completo BE/FE |
| Avaliação de desempenho do fornecedor | Notas preço/prazo/qualidade/**conformidade** + resumo/médias BE/FE |
| Solicitação de compra | CRUD com urgência + justificativa BE/FE |
| Cotação múltipla | Criar cotação, respostas (preço/prazo/condições/validade), comparativo BE/FE |
| Envio de cotação (fila interna) | `POST /compras/cotacoes/{id}/enviar` + status `Enviada` + envios persistidos (sem SendGrid) BE/FE |
| Contratos de fornecimento | CRUD `/compras/contratos-fornecimento` + alertas de vencimento BE/FE |
| Ordem/pedido de compra com status | Inclui `AguardandoAprovacao`; receber abre recebimento BE/FE |
| Recebimento NF-e (compras) | Preview XML, conferência, divergências, confirmar → estoque + CAP + histórico |
| Contas a pagar | Listagem `/contas-pagar` BE/FE |
| Histórico de compras / evolução de preço | Endpoints + tela BE/FE |
| Flag tenant fluxo completo | `GET/PUT /compras/config` + menus condicionais no sidebar |
| Alçadas de aprovação | CRUD alçadas + fila de aprovações BE/FE |
| Stub SEFAZ documentos destinados | `GET /fiscal/sefaz/documentos-destinados` + botão no form de recebimento |

---

## SQL (sem migration EF)

Aplicar manualmente:

1. `new_agropulse_backend/scripts/20260713_Compras_GestaoCompleta.sql`
2. `new_agropulse_backend/scripts/20260717_Compras_ContratosFornecimento.sql` (envios de cotação + contratos de fornecimento)

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| **Decisão de produto** | | |
| Flag tenant: fluxo completo on/off | ✅ | ✅ menus condicionais |
| **Fluxo essencial** | | |
| Recebimento NF-e (XML) | ✅ | ✅ |
| Integração SEFAZ | ⚠️ stub | ⚠️ stub |
| Conferência de itens + divergências | ✅ | ✅ |
| Entrada estoque ao confirmar (lote/validade/custo) | ✅ | ✅ |
| Conta a pagar ao confirmar | ✅ | ✅ listagem |
| Histórico compras (fornecedor/produto/data) | ✅ | ✅ |
| **Opcionais** | | |
| Solicitação interna | ✅ urgência/justificativa | ✅ |
| Cotação múltipla (preço/prazo) | ✅ | ✅ |
| Envio cotação aos fornecedores | ✅ fila interna | ✅ |
| Comparativo de preços/condições | ✅ | ✅ |
| Aprovação por alçada de valor | ✅ | ✅ |
| Ordem de compra + status | ✅ efeitos via recebimento | ✅ |
| Contratos de fornecimento + alerta vencimento | ✅ | ✅ |
| Avaliação de fornecedores | ✅ + conformidade | ✅ |
| Cadastro de fornecedores | ✅ | ✅ |

**Legenda:** ✅ pronto · ⚠️ parcial · ❌ ausente

### Observações

- SEFAZ é stub (sem Focus NFe real nesta fase).
- Envio de cotação é fila interna (persiste destinatários/`Enviada`); e-mail real (SendGrid/portal) permanece integração futura.

---

## Pendente para fechar o módulo

| Tipo | Item |
|------|------|
| — | SEFAZ documentos destinados + e-mail cotação cobertos (2026-07-22) |
| Fora de escopo | — |

**Status:** fluxo essencial e completo cobertos; Focus destinadas e e-mail SMTP/log no envio de cotação ativos.
