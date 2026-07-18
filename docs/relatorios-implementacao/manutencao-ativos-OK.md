# Manutenção e Ativos — Gap de implementação

Cadastro de ativos, manutenção preventiva/corretiva, peças, custos, telemetria, checklist e depreciação.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**Atualizado:** 2026-07-17 (implementação dos gaps BE/FE)  
**SQL alinhado (BE):** `scripts/20260717_Manutencao_GestaoCompleta.sql` (cópia em `scripts/sql/`)

---

## Já existe (pré-gaps)

| Capacidade | Situação |
|---|---|
| — | **Módulo inexistente** (sem domínio, rotas, UI, contrato API ou permissões) |

### Infraestrutura tangencial (reutilizada)

| Capacidade | Situação |
|---|---|
| Colaboradores | Responsável opcional via `colaboradorId` na OS |
| Estoque / saída | Origem `Manutencao` (= 12) na baixa de peças da OS |
| Produtos | Sobressalentes via `produtoId` na peça da OS |
| Notificações | Motor genérico (alertas preventiva via listagem/API) |

**Não confundir:** `OrdemServicoAgricola` (safras) e Ordens de Produção — domínios distintos.

---

## O que foi implementado (2026-07-17)

### 1. Cadastro de ativos — ✅ BE/FE
- CRUD: série, modelo, fabricante, ano, valor/data aquisição, status, localização
- Horímetro / km no ativo + leituras manuais

### 2. Plano de manutenção preventiva — ✅ BE/FE
- Gatilho por horas, km ou dias + intervalo
- Registrar execução (`dataExecucao` + `valorMedidor`)

### 3. Alertas de manutenção preventiva — ✅ BE/FE
- `GET /manutencao/alertas/preventiva` (status `Proximo` / `Vencido`)
- Banner/listagem na tela de planos

### 4. Ordens de serviço (preventiva/corretiva) — ✅ BE/FE
- Prioridade, responsável (`responsavelNome` / `colaboradorId`), transições: iniciar / aguardar peça / concluir / cancelar
- Número `OS-YYYY-NNN`

### 5. Peças + baixa automática do estoque — ✅ BE/FE
- Itens por OS com `produtoId` opcional
- Baixa via `OrigemMovimentacaoEstoque.Manutencao` na conclusão (ou `baixarAgora` ao adicionar)

### 6. Custo de manutenção real — ✅ BE/FE
- `GET /manutencao/relatorios/custos` (ativo, período, tipo) + página de custos

### 7. Horímetros / telemetria — ⚠️ stub BE/FE
- Leituras manuais + histórico `leituras_horimetro`
- `POST /manutencao/telemetria/leitura` (origem `TelemetriaStub`)

### 8. Checklist de inspeção diária — ✅ BE/FE (sync mobile stub)
- CRUD checklist + itens OK/falha
- `POST .../sincronizar` marca `sincronizado=true` (stub mobile)

### 9. Depreciação contábil — ✅ BE/FE
- Métodos linear e acelerada (2× na 1ª metade da vida útil)
- `GET /manutencao/ativos/{id}/depreciacao` + card no detalhe do ativo

### Extra
- Dashboard KPIs: `GET /manutencao/dashboard`
- Permissão FE: `manutencao.visualizar`
- Seed módulo: `modulos_sistema.Codigo = 'manutencao'`

---

## SQL (sem migration EF)

Aplicar manualmente:

`new_agropulse_backend/scripts/20260717_Manutencao_GestaoCompleta.sql`  
(cópia: `scripts/sql/20260717_Manutencao_GestaoCompleta.sql`)

Contrato API: `new_agropulse_backend/api-contract/manutencao.md`

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| Cadastro de ativos (série, modelo, fabricante, ano, valor) | ✅ | ✅ |
| Plano preventiva (horas / km / período) | ✅ | ✅ |
| Alertas preventiva vencida/próxima | ✅ | ✅ |
| OS corretivas (prioridade + responsável) | ✅ | ✅ |
| Peças + baixa automática estoque | ✅ | ✅ |
| Custo manutenção por ativo/período/tipo | ✅ | ✅ |
| Horímetros / telemetria | ⚠️ stub telemetria | ⚠️ stub UI |
| Checklist inspeção diária (mobile) | ✅ sync stub | ✅ |
| Depreciação linear/acelerada + residual | ✅ | ✅ |

**Legenda:** ✅ pronto · ⚠️ parcial/stub · ❌ ausente

### Observações

- Telemetria IoT real permanece stub (`TelemetriaStub`).
- Sync mobile do checklist é stub (flag `sincronizado`).
- Peças sem `produtoId` registram só custo, sem baixar estoque.
- Cadastro paralelo de “peças” (legado) foi substituído por produtos de estoque.
- Rotas FE: `/manutencao` (dashboard, ativos, planos, ordens, checklists, custos).

---

## Síntese

Manutenção e Ativos saiu de **greenfield (0/9)** para **9/9 cobertas** (telemetria e sync mobile como stub). Domínio novo em BE/FE, reaproveitando colaboradores, estoque e produtos.

---

## Pendente para fechar o módulo

| Tipo | Item |
|------|------|
| Integração | Telemetria / horímetro digital real (hoje `TelemetriaStub`) |
| Integração | Sync mobile real do checklist (hoje flag `sincronizado`) |
| Fora de escopo | — |

**Nota:** cadastro de colaboradores continua como apoio (responsável OS); módulo **RH e Folha** permanece fora de escopo do produto.

**Status:** domínio 9/9; falta IoT e app mobile reais.
