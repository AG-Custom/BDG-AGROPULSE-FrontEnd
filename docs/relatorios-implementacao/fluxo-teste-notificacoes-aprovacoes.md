# Fluxo de teste — Notificações, aprovações e travas

Roteiro QA para validar o pacote de gaps (fila de vendas, ciclo de vida do pedido, motor operacional).

**Atualizado:** 2026-07-30  
**Perfis usados:** Vendedor · Gerente (ou Diretor / Administrador) · Administrativo · Operacional · Consultor

---

## Pré-requisitos gerais

1. Empresa ativa com pelo menos uma unidade.
2. Usuários com perfis acima vinculados à mesma empresa/unidade.
3. Produtos com preço de tabela, margem mínima e (quando aplicável) estoque/lotes.
4. Cliente com limite de crédito e, se for testar atraso, títulos em aberto vencidos.
5. Host `Jobs.Web` rodando (ou chamar `POST /api/notificacoes/gerar` com JWT).

---

## 1. Auto-aprovação (sem travas)

| Campo | Valor |
|-------|-------|
| **Perfil** | Vendedor |
| **Pré-condição** | Pedido/orçamento com itens dentro da margem, estoque suficiente, cliente sem atraso e dentro do limite |
| **Ação** | Abrir pedido → **Enviar para aprovação** |
| **Notificação** | `PedidoAprovado` para o **vendedor** |
| **Clique** | Vai ao detalhe do pedido |
| **Resultado** | Status `Aprovado`; não entra na fila `/aprovacoes` |

---

## 2. Retenção por margem / crédito / atraso → aprovar na fila ou no alerta

| Campo | Valor |
|-------|-------|
| **Perfil (ação)** | Vendedor envia; **Gerente** decide |
| **Pré-condição** | Forçar trava: preço abaixo da margem (OK) **ou** limite excedido (OK ) **ou** atraso acima do limiar |
| **Ação 1** | Vendedor → **Enviar para aprovação** |
| **Notificação** | `PedidoAguardandoAprovacao` (broadcast; visível a Gerente/Diretor/Admin/Administrativo) |
| **Clique** | Com `idReferencia` → detalhe do pedido; senão → `/aprovacoes` |
| **Ação 2a** | Gerente em `/aprovacoes` (ou dashboard “Fila de aprovações”) → **Aprovar** |
| **Ação 2b** | Gerente no **sino** ou `/notificacoes` → botões **Aprovar** / **Recusar** no próprio alerta (requer `aprovacoes.aprovar`) |
| **Notificação** | `PedidoAprovado` ao vendedor; retenção `pedido_aguardando_*` some da lista |
| **Resultado** | Status `Aprovado`; item some da fila; alerta marcado como lido após decisão no sino/página |

---

## 3. Recusa na fila com motivo

| Campo | Valor |
|-------|-------|
| **Perfil** | Gerente |
| **Pré-condição** | Pedido em `Aguardando` na fila |
| **Ação** | `/aprovacoes` → **Recusar** → informar motivo → confirmar **ou** recusar pelo alerta (dialog de motivo) |
| **Notificação** | `PedidoRecusado` ao **vendedor** (mensagem com motivo) |
| **Clique** | Detalhe do pedido |
| **Resultado** | Status `Recusado`; reserva de estoque devolvida; some da fila |

---

## 4. Só estoque insuficiente → PendenteEstoque

| Campo | Valor |
|-------|-------|
| **Perfil** | Vendedor (envio); Operacional/Admin (entrada) |
| **Pré-condição** | Única trava = estoque insuficiente (margem/crédito ok) |
| **Ação 1** | Enviar para aprovação |
| **Notificação** | Não cria `PedidoAguardandoAprovacao` neste caminho |
| **Resultado 1** | Status `PendenteEstoque` |
| **Ação 2** | Registrar **entrada de estoque** do produto |
| **Resultado 2** | Pedido libera para `Aprovado` (sem outras travas) ou `Aguardando` (se surgirem outras) + notificação correspondente |

---

## 5. Expiração

| Campo | Valor |
|-------|-------|
| **Perfil** | Gerente (manual) ou job `ExpirarPedidosVencidosJob` |
| **Pré-condição** | Pedido `Aguardando` com `dataExpiracao` no passado |
| **Ação** | Detalhe → **Expirar** **ou** aguardar job (1h) |
| **Notificação** | `PedidoExpirado` ao vendedor; retenção removida |
| **Resultado** | Status `Expirado`; estoque devolvido |

---

## 6. Faturar → pós-venda

| Campo | Valor |
|-------|-------|
| **Perfil** | Vendedor (ou quem fatura) |
| **Pré-condição** | Pedido `Aprovado` |
| **Ação** | **Faturar** |
| **Notificação** | `PosVenda` para o vendedor **e** broadcast (gerência comercial vê pela matriz) |
| **Clique** | Cliente (`cliente-visualizar`) ou CRM carteira |
| **Resultado** | Status `Faturado`; contas a receber geradas |

---

## 7. Job operacional (estoque, validade, financeiro, CRM, fiscal, safras, caixa)

| Campo | Valor |
|-------|-------|
| **Perfil** | Gerente / Administrativo / Operacional / Consultor (conforme matriz) |
| **Pré-condição** | Dados que disparem cada alerta (ver tabela abaixo) |
| **Ação** | `POST /api/notificacoes/gerar` **ou** aguardar `GerarNotificacoesOperacionaisJob` (1h) |
| **Checagem** | Menu de notificações / página `/notificacoes` |

| Tipo | Como provocar | Quem deve ver | Destino do clique |
|------|---------------|---------------|-------------------|
| `EstoqueMinimo` | Produto com saldo ≤ mínimo | Gestão + Operacional + Administrativo | `/estoque/alertas` |
| `ValidadeProxima` | Lote com validade ≤ 45 dias (ou `diasAlertaValidade`) | Gestão + Administrativo + **Operacional** | `/estoque/alertas` |
| `ContasVencidas` / `BoletoCliente` | CR aberta vencida | Financeiros (gestão + administrativo) | Contas a receber |
| `ContasVencer3Dias` / `7` / `15` | CR com vencimento na janela | Idem | Contas a receber |
| `BoletoFornecedor` | CP vencendo em ≤ 2 dias ou vencida | Financeiros | Contas a pagar |
| `AniversarioCliente` | Cliente com aniversário em ≤ 7 dias | CRM comerciais + Consultor | Cliente / carteira |
| `AniversariantesCarteira` | Idem + `vendedorUsuarioId` no cliente | Vendedor da carteira (+ gestão) | Cliente |
| `ClienteSemComprar` | Último faturamento além de `prazoRecompra` (default 25d) | CRM comerciais + Consultor (+ cópia ao vendedor) | Cliente |
| `ContingenciaSefaz` | Contingência fiscal ativa na unidade | Gestão + Operacional (**sem** Administrativo) | `/fiscal/contingencia` |
| `RecomendacaoPendente` | Recomendação agronômica com status `Pendente` | Diretor, Admin, Gerente, **Consultor** | `/safras/recomendacoes` |
| `OsAgricolaAtrasada` | OS agrícola `Aberta`/`EmAndamento` com prazo vencido | Diretor, Admin, Gerente, **Consultor** | `/safras/ordens-servico` |
| `SaldoMinimoCaixa` | Caixa/conta da unidade com `saldoAtual <= saldoMinimo` | Financeiros + **Operacional** | `/financeiro/caixas` |

### Contrato backend (tipos novos)

O FE já aceita e filtra `RecomendacaoPendente`, `OsAgricolaAtrasada` e `SaldoMinimoCaixa`. O job / `POST /notificacoes/gerar` deve emitir esses tipos com `modeloReferencia`/`idReferencia` coerentes e destinatários alinhados à matriz do FE (`src/constants/matriz-alertas.ts`). Espelhar em `new_agropulse_backend/api-contract/notificacoes.md` quando o BE for atualizado.

---

## 8. Matriz de perfil (não deve ver)

| Perfil | Não deve receber |
|--------|------------------|
| **Vendedor** | `EstoqueMinimo`, `ValidadeProxima`, `BoletoFornecedor`, `ContasVencer*`, `ContasVencidas` (broadcast financeiro), `ContingenciaSefaz`, `RecomendacaoPendente`, `OsAgricolaAtrasada`, `SaldoMinimoCaixa` |
| **Administrativo** | `PosVenda`, `ClienteSemComprar`, `AniversarioCliente`, `DataComemorativa` (tipos CRM comerciais), `ContingenciaSefaz`, tipos de safras |
| **Operacional** | Financeiro de boletos/contas (`Boleto*`, `Contas*`), CRM comercial (`PosVenda`, aniversário, sem comprar); **pode** ver `SaldoMinimoCaixa`, estoque e SEFAZ |
| **Consultor** | Financeiro, estoque broadcast, SEFAZ; **pode** ver CRM carteira + `RecomendacaoPendente` / `OsAgricolaAtrasada` |

Validar: logar com cada perfil → `GET /api/notificacoes` / menu → confirmar ausência.

---

## 9. Dashboard — widget da fila

| Campo | Valor |
|-------|-------|
| **Perfil** | Com `aprovacoes.visualizar` (Gerente etc.) |
| **Ação** | Abrir Painel |
| **Resultado** | Card “Fila de aprovações” com contagem + botão **Ver fila** |
| **Perfil sem permissão** | Card não aparece |

---

## Checklist rápido (happy path)

1. [ ] Vendedor cria pedido limpo → auto-aprovado + notificação  
2. [ ] Vendedor cria pedido com margem baixa → aguardando + notificação gestão  
3. [ ] Gerente aprova na **fila** → vendedor notificado  
4. [ ] Gerente aprova/recusa **no sino ou `/notificacoes`** → vendedor notificado; alerta lido  
5. [ ] Gerente recusa na **fila** → estoque devolvido + notificação  
6. [ ] Pedido só com falta de estoque → `PendenteEstoque` → entrada libera  
7. [ ] Faturar → `PosVenda`  
8. [ ] `POST /notificacoes/gerar` gera alertas operacionais (incl. safras/caixa quando BE pronto)  
9. [ ] Matriz oculta tipos indevidos por perfil (Administrativo sem SEFAZ; Operacional vê validade)  
10. [ ] Clique na notificação navega para a tela correta  

---

## Referências

- Contrato: `new_agropulse_backend/api-contract/notificacoes.md`  
- Matriz FE: `src/constants/matriz-alertas.ts`  
- Fila: `GET /api/aprovacoes` · decisão: `POST /api/pedidos-venda/{id}/aprovar|recusar`  
- Relatório módulo: [vendas-pedidos-OK.md](./vendas-pedidos-OK.md)
