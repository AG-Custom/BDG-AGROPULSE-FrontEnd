# CRM Agrícola — Gap de implementação

Carteira de produtores, visitas técnicas, histórico comercial, crédito, recomendações, pipeline, amostras, campanhas, canais de comunicação e dashboard de produtividade.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**Atualizado:** 2026-07-17 (implementação dos gaps BE/FE)  
**SQL alinhado (BE):** `scripts/20260717_Crm_GestaoCompleta.sql` (cópia em `scripts/sql/`)

---

## Já existe (pré-gaps / reutilizado)

| Capacidade | Situação |
|---|---|
| Cadastro de clientes / produtores | CRUD completo; `TipoCliente.ProdutorRural` |
| Carteira do vendedor | `vendedorUsuarioId` + filtro; perfil Vendedor vê só a própria carteira |
| Limite de crédito manual | Campo no cliente + travas na aprovação de pedidos |
| Histórico comercial | `GET /api/clientes/{id}/historico-comercial` + seção no cliente |
| Visitas técnicas (CRUD básico) | `/api/safras/visitas-tecnicas` + páginas em Safras |
| Recomendações agronômicas | `/api/safras/recomendacoes` + páginas em Safras |
| Fazenda ↔ cliente | `Fazenda.ClienteId` (base da carteira agronômica) |

**Não duplicar:** visitas e recomendações permanecem em Safras (estendidas, não recriadas no CRM).

---

## O que foi implementado (2026-07-17)

### 1. Carteira agronômica do produtor — ✅ BE/FE
- `GET /api/crm/carteira-agronomica` agrega fazendas por `ClienteId` (área, culturas, safras, `itens[]` por produtor)
- Página `CarteiraAgronomicaPage` com filtros cliente/vendedor

### 2. Visitas técnicas (geo, fotos, duração, agenda) — ✅ BE/FE
- ALTER `visitas_tecnicas`: `status`, `duracao_min`, `checkin_lat/lng/em`, `vendedor_usuario_id`
- Tabela `visita_tecnica_fotos`
- `PATCH .../check-in` + `POST .../fotos`
- FE: check-in (GPS/manual) e foto (URL stub) na listagem de Safras

### 3. Histórico 360° — ✅ BE/FE
- Preferências: CRUD `/api/crm/preferencias`
- `GET /api/crm/clientes/{id}/perfil-360` (prefs + última análise + contagens)
- `ClientePerfil360Section` no formulário do cliente (abas: comercial, agronômico, visitas, crédito, preferências)
- Histórico comercial reutilizado (não recriado)

### 4. Análise de crédito (score / limite sugerido / adimplência) — ✅ BE/FE
- Entidade `analises_credito` + CRUD
- `POST /api/crm/analises-credito/recalcular?clienteId=` (score heurístico A–E + limite sugerido)
- Listagem e detalhe no FE; limite manual do cliente preservado

### 5. Recomendações agronômicas — ✅ (já existia em Safras)
- Sem CRUD paralelo no CRM; linkadas via visita no fluxo 360° / Safras

### 6. Pipeline de oportunidades — ✅ BE/FE
- CRUD `/api/crm/oportunidades` + `PATCH /{id}/etapa`
- Etapas: Prospeccao → … → FechadoGanho / FechadoPerdido
- Listagem + formulário no FE

### 7. Amostras e demonstrações em campo — ✅ BE/FE
- CRUD `/api/crm/amostras` (status Entregue / EmAvaliacao / Convertida / Descartada)
- Listagem + formulário

### 8. Campanhas de relacionamento — ✅ BE/FE
- CRUD `/api/crm/campanhas` + métricas (envios, aberturas, respostas, conversões)
- Detalhe com botão disparar

### 9. WhatsApp e e-mail automáticos — ⚠️ stub BE/FE
- `POST /api/crm/campanhas/{id}/disparar` grava `campanha_disparos` e incrementa `envios`
- Sem provider externo (WhatsApp/e-mail real)

### 10. Dashboard consultor/vendedor — ✅ BE/FE
- `GET /api/crm/dashboard` (visitasMes, pipeline, amostras, conversão, score médio, campanhas)
- `CrmDashboardPage` com KPIs + atalhos (incl. visitas em Safras)

### Extra
- Permissão FE: `crm.visualizar`
- Seed módulo: `modulos_sistema.Codigo = 'crm'`
- Sidebar seção “CRM Agrícola”
- Contrato API: `api-contract/crm.md`

---

## SQL (sem migration EF)

Aplicar manualmente:

`new_agropulse_backend/scripts/20260717_Crm_GestaoCompleta.sql`  
(cópia: `scripts/sql/20260717_Crm_GestaoCompleta.sql`)

Contrato API: `new_agropulse_backend/api-contract/crm.md`

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| Carteira produtores (cultura, área, safras) | ✅ agregação + itens | ✅ |
| Visitas técnicas (geo, fotos, duração) | ✅ extensão Safras | ✅ |
| Histórico 360° (compras / prefs / crédito) | ✅ perfil-360 + prefs | ✅ abas no cliente |
| Análise crédito (score, limite sugerido) | ✅ + recalcular | ✅ |
| Recomendações agronômicas | ✅ Safras | ✅ Safras |
| Pipeline oportunidades | ✅ | ✅ |
| Amostras / demonstrações | ✅ | ✅ |
| Campanhas segmentadas | ✅ | ✅ |
| WhatsApp / e-mail | ⚠️ stub disparo | ⚠️ botão disparar |
| Dashboard produtividade consultor/vendedor | ✅ | ✅ |

**Legenda:** ✅ pronto · ⚠️ parcial/stub · ❌ ausente

### Observações

- Disparo de campanha é **stub** (persiste status; sem Twilio/SendGrid/etc.).
- Score de crédito é heurístico determinístico (não bureau externo).
- Visitas/recomendações **não** foram duplicadas sob `/api/crm`.

---

## Pendente para fechar o módulo

| Tipo | Item |
|------|------|
| Integração | WhatsApp / e-mail reais no disparo de campanhas (Twilio, SendGrid ou equivalente) |
| Nota | Score interno permanece no CRM; bureau Serasa/SPC é backlog de Cobrança e Crédito |
| Fora de escopo | — |

**Status:** carteira, pipeline, amostras, campanhas, perfil 360 e dashboard cobertos; falta canal de comunicação real.
