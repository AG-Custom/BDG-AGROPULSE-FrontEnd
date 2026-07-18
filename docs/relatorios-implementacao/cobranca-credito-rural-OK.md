# Cobrança e Crédito Rural — Gap de implementação

Análise/concessão de crédito, monitoramento da carteira e cobrança ativa.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**Atualizado:** 2026-07-17 (implementação dos gaps BE/FE)  
**SQL alinhado (BE):** `scripts/20260717_CobrancaCredito_GestaoCompleta.sql` (cópia em `scripts/sql/`)

---

## Já existe (pré-gaps / reutilizado)

| Capacidade | Situação |
|---|---|
| Limite de crédito no cliente | Campo manual `limiteCredito` (CRUD) |
| Contas a receber | Geradas no faturamento; baixa/cancelar em Financeiro |
| Exposição / travas na aprovação | LimiteCredito e AtrasoCliente |
| Régua de cobrança | Financeiro — `/regua-cobranca` (não recriada) |
| Renegociação financeira | Financeiro — `/renegociacoes` (não recriada) |
| Análise CRM heurística | `/crm/analises-credito` — enriquecida com score ponderado |
| CPR / Barter básicos | Módulo Contratos (não recriados) |

---

## O que foi implementado (2026-07-17)

### Análise e concessão

#### 1. Ficha de análise rural — ✅ BE/FE
- Tabela `fichas_credito_rural` + CRUD `/api/cobranca-credito/fichas`
- Área, cultura, produtividade, renda, endividamento, observações de garantias
- Aba Fichas no hub FE

#### 2. Score interno ponderado — ✅ BE/FE
- `config_credito_cobranca` com pesos 40/20/20/20
- `CreditoScoreDomainService` usado no recalcular CRM
- Config editável na aba Configuração

#### 3. Integração Serasa/SPC — ⚠️ stub BE/FE
- `POST /api/cobranca-credito/bureau/consultar`

#### 4. Aprovação por alçada — ✅ BE/FE
- Alçadas gerente/diretor/CEO na config
- `POST /analises/{id}/aplicar-limite` valida perfil

#### 5. Revisão automática de limite — ⚠️ stub BE/FE
- `POST /revisar-limites` lista sugestões

### Monitoramento

#### 6. Painel da carteira — ✅ BE/FE
- `GET /carteira` — limite/utilizado/disponível/adimplência
- Hub aba Carteira com MetricTiles

#### 7. Aging por faixas — ✅ BE/FE
- `GET /aging` — 7 faixas (a vencer … >180)

#### 8. Alerta de concentração — ✅ BE/FE
- `GET /concentracao` + `maxConcentracaoPct`

#### 9. Índice de inadimplência + histórico — ✅ BE/FE
- `GET /inadimplencia-indice` + `POST /snapshots/gerar`

#### 10. PDD por faixa — ✅ BE/FE
- `GET /pdd` + % configuráveis

#### 11. Bloqueio automático por atraso — ✅ BE
- `bloqueioEfetivo` + JSON dias por perfil
- Enforce em `enviar-aprovacao` / fila quando flag ativa
- Toggle na config FE

### Cobrança ativa

#### 12. Lista diária priorizada — ✅ BE/FE
- `GET /lista-diaria`

#### 13. Tentativas de contato — ✅ BE/FE
- CRUD `tentativas_cobranca`

#### 14. Títulos em disputa — ✅ BE/FE
- `titulos_disputa` + abrir/resolver

#### 15. Encaminhamento jurídico — ✅ BE/FE (pacote docs stub URL)
- `/juridico` + encaminhar

#### 16. Acordos judiciais — ✅ BE/FE
- CRUD `acordos_judiciais` (distinto de renegociação financeira)

### Extra
- Garantias CRUD + crédito bancário stub (BB/Sicredi)
- Módulo FE `/cobranca-credito` com 6 abas; permissão `cobranca-credito.visualizar`
- Atalhos para CR / Régua / Renegociações / CRM Crédito

---

## SQL

`scripts/20260717_CobrancaCredito_GestaoCompleta.sql`

- Seed módulo `cobranca-credito`
- `config_credito_cobranca`, `fichas_credito_rural`, `inadimplencia_snapshots`
- `tentativas_cobranca`, `titulos_disputa`, `encaminhamentos_juridicos`, `acordos_judiciais`
- `garantias_credito`, `credito_bancario_operacoes`

Contrato: `api-contract/cobranca-credito.md`

---

## Mapa rápido (pós-implementação)

| Capacidade | Backend | Frontend |
|---|---|---|
| Ficha análise rural | ✅ | ✅ |
| Score pesos configuráveis | ✅ | ✅ |
| Serasa / SPC | ⚠️ stub | ⚠️ stub |
| Alçada gerente / diretor / CEO | ✅ | ✅ |
| Revisão automática de limite | ⚠️ stub | ⚠️ stub |
| Painel carteira | ✅ | ✅ |
| Aging 7 faixas | ✅ | ✅ |
| Concentração | ✅ | ✅ |
| Índice + histórico | ✅ | ✅ |
| PDD | ✅ | ✅ |
| Bloqueio pedido por atraso | ✅ (flag) | ✅ config |
| Lista diária | ✅ | ✅ |
| Tentativas de contato | ✅ | ✅ |
| Disputa | ✅ | ✅ |
| Jurídico | ✅ | ✅ |
| Acordos judiciais | ✅ | ✅ |
| Régua / Renegociação / CR | ✅ (Financeiro) | ✅ (links) |

**Legenda:** ✅ pronto · ⚠️ stub/parcial · ❌ ausente

---

## Síntese

Módulo **Cobrança e Crédito Rural** criado sob `/api/cobranca-credito` e hub FE, reutilizando Financeiro (régua/renegociação/CR) e CRM (análises). Bureau e crédito bancário permanecem stub até integração externa.

---

## Pendente para fechar o módulo

| Tipo | Item |
|------|------|
| Integração | Serasa / SPC real (hoje consulta stub) |
| Domínio + job | Revisão automática de limite com alertas periódicos (hoje `revisar-limites` stub) |
| Integração | Crédito bancário BB/Sicredi real (hoje stub) |
| Domínio | Pacote documental jurídico real (hoje URL `stub://juridico/...`) |
| Fora de escopo | — |

**Status:** ficha, score, carteira, aging, PDD, lista diária, disputa e acordos cobertos; faltam bureau e banking.
