# Relatórios de implementação

Gap analysis entre a especificação funcional de cada módulo e o que existe no **frontend** (`new_agropulse_frontend`) e no **backend** (`new_agropulse_backend`).

Cada arquivo lista o que está pronto, o que ainda falta e um mapa Backend × Frontend.

**Atualizado:** 2026-07-17

---

## Escopo

| Decisão | Detalhe |
|--------|---------|
| Meta | Cobrir a spec comercial dos módulos listados abaixo no stack novo (Vue + .NET) |
| RH e Folha | **Fora de escopo.** Não haverá módulo nem relatório. Cadastro de colaboradores permanece só como apoio a OS, responsável, etc. |
| Legado | `AGROPULSE2026` (React) é referência de telas/fluxos/endpoints — não copiar código; portar comportamento via `api-contract` |

### Legenda de status

| Status | Significado |
|--------|-------------|
| Domínio OK | Fluxos e API internos cobertos; ver seção **Pendente** do arquivo (stubs de integração / gaps pontuais) |
| Greenfield | Módulo ainda não existe no stack novo (ou só fragmento tangencial) |
| Fora de escopo | Explicitamente excluído do produto |

---

## Índice

| Módulo | Arquivo | Status |
|--------|---------|--------|
| Gestão de Estoque | [gestao-estoque-OK.md](./gestao-estoque-OK.md) | Domínio OK |
| Compras e Fornecedores | [compras-fornecedores-OK.md](./compras-fornecedores-OK.md) | Domínio OK |
| Vendas e Pedidos | [vendas-pedidos-OK.md](./vendas-pedidos-OK.md) | Domínio OK |
| Produção e Beneficiamento | [producao-beneficiamento-OK.md](./producao-beneficiamento-OK.md) | Domínio OK |
| Financeiro | [financeiro-OK.md](./financeiro-OK.md) | Domínio OK |
| Fiscal e Tributário | [fiscal-tributario-OK.md](./fiscal-tributario-OK.md) | Domínio OK |
| Gestão de Safras | [gestao-safras-OK.md](./gestao-safras-OK.md) | Domínio OK |
| Logística e Transporte | [logistica-transporte-OK.md](./logistica-transporte-OK.md) | Domínio OK |
| Manutenção e Ativos | [manutencao-ativos-OK.md](./manutencao-ativos-OK.md) | Domínio OK |
| CRM Agrícola | [crm-agricola-OK.md](./crm-agricola-OK.md) | Domínio OK |
| Relatórios / Dashboards | [relatorios-dashboards-OK.md](./relatorios-dashboards-OK.md) | Domínio OK |
| Cobrança e Crédito Rural | [cobranca-credito-rural-OK.md](./cobranca-credito-rural-OK.md) | Domínio OK |
| Contratos Agrícolas | [contratos-agricolas-OK.md](./contratos-agricolas-OK.md) | Domínio OK |
| RH e Folha | — | **Fora de escopo** |
| QA — Notificações / aprovações / travas | [fluxo-teste-notificacoes-aprovacoes.md](./fluxo-teste-notificacoes-aprovacoes.md) | Roteiro de teste |
| Legado React — mocks / sem integração real | [legado-stub-integracoes.md](./legado-stub-integracoes.md) | Documento para cliente |
| Plano de ação stubs (baixa → alta) | [plano-acao-stubs-cliente.md](./plano-acao-stubs-cliente.md) | Decisão com cliente: implementar / fase 2 / não |

---

## Backlog priorizado (o que ainda precisa ser feito)

### 1. Integrações externas (stubs → real) — impacto alto

Decisões detalhadas (fora / implementar / a validar): ver [plano-acao-stubs-cliente.md](./plano-acao-stubs-cliente.md).

| Prioridade | Módulo | Pendência | Decisão (2026-08-01) |
|------------|--------|-----------|----------------------|
| Alta | Fiscal | Focus/SEFAZ; contingência; reversões; SPED | **A validar** (contingência tende a “só online”) |
| Alta | Financeiro | Boletos; OFX; PTAX; saldo intraday | **A validar** |
| Alta | Vendas | NFC-e/PDV alinhado ao Fiscal | **A validar** |
| Média | Contratos / Compras / Logística fiscal | NF satélite; destinados; CT-e/MDF-e | **A validar** |
| Média | Cobrança | Serasa/SPC | **A validar** · crédito BB/Sicredi = **Fora/Feito** |
| Média | Estoque | Locais hierárquicos | **Feito** |
| Baixa | CRM / Jurídico | Foto check-in + anexos R2 · WhatsApp Web | **Feito** · API campanha = **Fora/Feito** |
| Baixa | Relatórios | Excel/PDF (+ ranking) | **Feito** · Power BI = **Fora/Feito** |
| Baixa | IoT / GPS / balança / telemetria | — | **Fora/Feito** (geo/offline ainda a validar) |

Detalhe da rodada: [plano-acao-stubs-cliente.md](./plano-acao-stubs-cliente.md) §6.

### 2. Domínio interno ainda aberto (opcional)

- Estoque: cadastro hierárquico formal de locais (galpão → depósito → corredor → prateleira)
- Relatórios: escopo fino por perfil além de `verCustos` (sem Power BI)

### 3. Explicitamente fora de escopo

- **RH e Folha** (eSocial, ponto, folha, FGTS, EPI, NR-31 como módulo)
- Bonificação / fidelidade por volume (Vendas)
- App mobile vendedor/consultor (Vendas)

---

## Como usar estes arquivos

1. Abrir o `*-OK.md` do módulo.
2. Conferir o mapa rápido e a seção **Pendente para fechar o módulo**.
3. Antes de implementar: atualizar `new_agropulse_backend/api-contract/` e só então BE + FE no padrão AgroPulse.
4. Referência de UX/legado: `C:\Users\Guilherme\Documents\AGROPULSE2026\AGROPULSE2026` (páginas React por módulo).
