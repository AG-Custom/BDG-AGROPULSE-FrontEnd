# Plano de ação — stubs (stack novo)

| Campo | Valor |
|-------|-------|
| Sistema | AgroPulse novo (Vue 3 + .NET) |
| Público | Alinhamento com o cliente |
| Criado | 2026-08-01 |
| Última revisão | 2026-08-02 |
| Estrutura | **Parte A = feito** · **Parte B = ainda não** |

---

## Visão rápida

| | O quê |
|---|---|
| **Parte A — Feito** | Limpezas de stub + implementações do Pacote 0 (código entregue em 2026-08-01) |
| **Parte B — Ainda não** | Itens **a validar** com o cliente (fiscal, banking, Serasa, geo…) + fora de escopo permanente |
| **Ops** | Aplicar SQLs da Parte A em cada ambiente e reiniciar a API |

```text
FEITO                          AINDA NÃO (decidir com cliente)
─────────────────────────      ─────────────────────────────
Fotos visita (R2)              Focus / SEFAZ (NF-e, NFC-e…)
Anexos jurídicos (R2)          Boletos / OFX / PTAX
WhatsApp Web (wa.me)           Contingência SEFAZ
Locais hierárquicos            Serasa / SPC
Exports Excel/PDF              Cotação CBOT/ESALQ
Sem Power BI / IoT / GPS       Geo mapa / offline PWA
Sem crédito bancário API       CT-e/MDF-e, NF transferência…
Sem disparo campanha fake      SPED avançado, DANFE avançado
```

---

# PARTE A — O QUE JÁ FOI FEITO

Código entregue na rodada L1–L7 + I1–I5. Domínio interno (cadastros, estoque, compras, vendas, CAP/CR, etc.) já operava antes; abaixo é o que **mudou** nesta rodada.

## A1. Features novas / reais

| ID | Item | Como ficou | Onde / SQL |
|----|------|------------|------------|
| B3 | Foto check-in visita | Upload multipart → Cloudflare R2 (`IArmazenamentoArquivo`) | Safras → Visitas · `20260801_Safras_VisitaFotoChaveArmazenamento.sql` |
| M5 | Anexos jurídicos | Upload/listar/abrir/remover no R2; HTML só como “Resumo” opcional | Cobrança → Jurídico · `20260801_CobrancaCredito_JuridicoAnexos.sql` |
| B2b | WhatsApp Web | Botão abre `wa.me` (sem API Meta) | Cobrança lista diária + Contatos do cliente · `utils/whatsapp-web.ts` |
| M11 | Locais hierárquicos | Galpão → Depósito → Corredor → Prateleira; cascade em entrada/inventário | Estoque → Locais (`/estoque/locais`) · `20260801_Estoque_LocaisHierarquicos.sql` |
| B1b | Exports Excel/PDF | Ranking + dashboard; demais abas/listagens já tinham export | Relatórios + Dashboard |

**Nota M11:** lotes históricos só com texto livre **não** foram remapeados automaticamente (helper SQL comentado).

## A2. Stubs removidos (fora do produto)

| ID | Item | O que saiu | O que permanece |
|----|------|------------|-----------------|
| B1 | Power BI | Aba + `GET /relatorios/power-bi` | Excel/PDF |
| B2 | Disparo campanha API | `POST .../campanhas/{id}/disparar` + botão Disparar | CRUD de campanha; e-mail SMTP do projeto |
| B6 | Telemetria IoT | UI + `POST .../telemetria/leitura` | Horímetro **manual** |
| B7 | Sync checklist mobile | `POST .../sincronizar` + coluna Sync | Checklist só no navegador · SQL `...RemoverChecklistSyncStub.sql` |
| B8 | Balança / leitura-peso | `POST .../leitura-peso` | Quantidade manual; lookup por código/EAN |
| M4 | Crédito BB/Sicredi | GET/POST `credito-bancario` + UI | Score/garantias/bureau stub · SQL `...RemoverCreditoBancarioStub.sql` |
| M7 | GPS tempo real | Campos `ultimaPosicao*` no veículo | Flag geo manual em ocorrência · SQL `...RemoverGpsStub.sql` |
| B9 | OEE campo avançado | — (nunca entrou) | Heurística atual |
| M8 | Balança rodoviária | — (nunca existiu) | Peso manual na carga |

## A3. SQLs para aplicar no banco (ordem)

1. `scripts/20260801_Logistica_RemoverGpsStub.sql`
2. `scripts/20260801_Manutencao_RemoverChecklistSyncStub.sql`
3. `scripts/20260801_CobrancaCredito_RemoverCreditoBancarioStub.sql`
4. `scripts/20260801_Safras_VisitaFotoChaveArmazenamento.sql`
5. `scripts/20260801_CobrancaCredito_JuridicoAnexos.sql`
6. `scripts/20260801_Estoque_LocaisHierarquicos.sql`

Depois: reiniciar API + conferir config Cloudflare R2.

## A4. Fora de escopo permanente (não é stub a “ligar”)

| Item | Motivo |
|------|--------|
| RH e Folha (eSocial, ponto, FGTS, EPI…) | Fora de escopo do produto novo |
| Bonificação / fidelidade por volume | Fora de escopo |
| App mobile nativo vendedor/consultor | Fora de escopo |

---

# PARTE B — O QUE AINDA NÃO FOI FEITO

Itens **ainda stub ou ausentes**. Não implementar até o cliente marcar SIM / NÃO / Fase 2.

## B1. Prioridade alta — Fiscal e banking

| ID | Item | Situação hoje | Pergunta ao cliente | Esforço |
|----|------|---------------|---------------------|---------|
| A1 | Emissão Focus/SEFAZ (NF-e, NFC-e…) | Autorização local / stub | Quais tipos de NF no go-live? | GG |
| A2 | Contingência SEFAZ offline/SVC | Fila stub | Confirmar **só online** (preferência atual)? | G* |
| A3 | Cancelamento com reversão estoque/CR/CP | Flag stub | Incluir junto com A1? (recomendado) | G* |
| A4 | Manifestação / inutilização / GNRE | Protocolo stub | Quais eventos no produto? | M–G* |
| A5 | SPED avançado | Blocos stub | No ERP ou no escritório? | GG |
| A6 | DANFE customizável | HTML stub | Custom ou DANFE Focus? | M* |
| A7 | Boletos registrados | Emissão/remessa stub | CNAB / API banco / intermediador? | GG |
| A8 | Conciliação OFX / Open Finance | Import pode ser simulado | OFX, Open Finance ou nenhum? | G–GG |
| A9 | Saldo intraday (Tesouraria) | Pode ser simulado | Precisa? (depende A8) | M–G* |
| A10 | PTAX / FX | Stub/manual | Opera moeda estrangeira? | M |
| A11 | NFC-e / contingência no PDV | Depende A1/A2 | No mesmo ciclo do A1? | G* |

\* depende de A1 e/ou A8.

## B2. Prioridade média

| ID | Item | Situação hoje | Pergunta ao cliente | Esforço |
|----|------|---------------|---------------------|---------|
| M1 | Cotação CBOT / ESALQ | Endpoint stub | Fonte automática ou manual? | M–G |
| M2 | NF na entrega/liquidação/barter | `stubNfe` | Automática no contrato ou só no Fiscal? | M* |
| M3 | Serasa / SPC | Consulta bureau stub | Haverá contrato com bureau? | G |
| M6 | CT-e / MDF-e na logística | Autorizar stub SEFAZ | No go-live ou depois do Fiscal? | G* |
| M9 | NF de transferência | Botão stub | Precisa no go-live? | M* |
| M10 | Docs destinados SEFAZ | Stub / XML manual | XML basta ou Focus destinados? | M–G* |

## B3. Prioridade baixa (ainda a validar)

| ID | Item | Situação hoje | Pergunta ao cliente | Esforço |
|----|------|---------------|---------------------|---------|
| B4 | Geo KML/Shapefile/mapa | Import stub | Fora definitivo ou Fase 2? | G |
| B5 | Diário de campo offline PWA | Sync stub | Fora definitivo ou Fase 2? | G |

## B4. Checklist da próxima reunião

Marcar **SIM** / **NÃO** / **Fase 2**:

- [ ] **A1** Escopo Focus: NF-e? NFC-e? CT-e/MDF-e? NFPR?
- [ ] **A2** Só online (sem contingência)?
- [ ] **A3** Reversão automática no cancelamento?
- [ ] **A4** Manifestação / inutilização / GNRE?
- [ ] **A5** SPED no produto ou no escritório?
- [ ] **A6** DANFE custom ou padrão Focus?
- [ ] **A7** Boletos: CNAB / API / intermediador?
- [ ] **A8** OFX e/ou Open Finance?
- [ ] **A9** Saldo intraday?
- [ ] **A10** Opera FX / PTAX?
- [ ] **A11** NFC-e PDV junto com A1?
- [ ] **M1** Cotação automática?
- [ ] **M2 / M6 / M9 / M10** Satélites fiscais no go-live?
- [ ] **M3** Serasa/SPC?
- [ ] **B4 / B5** Geo e offline — Fora ou Fase 2?

## B5. Pacotes comerciais (só o que falta decidir)

| Pacote | Conteúdo | Status |
|--------|----------|--------|
| **0 — Operacional** | Parte A | **Código feito** — falta SQL/ops por ambiente |
| **1 — Fiscal** | A1 (+ A3); opcional A4/A6; A2 tende a “não” | A validar |
| **2 — Banking** | A7 (+ A8); A9/A10 opcionais | A validar |
| **3 — Crédito externo** | M3 Serasa (M4 já fora) | A validar |
| **4 — Campo** | Só B4/B5 se reabrirem | A validar |
| **6 — SPED** | A5 | A validar |

## B6. Ordem se o cliente quiser “o máximo”

```text
1) Fechar A1 + A7 na reunião
2) Confirmar A2 = só online
3) A1 → A3 → A11 → A4/A6
4) A7 → A8 → A9 → A10
5) Satélites M2/M6/M9/M10 + M3 + M1
6) B4/B5 ou declarar Fora
7) A5 SPED
```

---

## Ata rápida

| | |
|---|---|
| Data | |
| Participantes | |
| Pacote 0 (Parte A) homologado? | ☐ SQLs aplicados · ☐ Testado · ☐ Pendente |
| Pacote 1 Fiscal | ☐ Sim · ☐ Não · ☐ Fase 2 |
| Pacote 2 Banking | ☐ Sim · ☐ Não · ☐ Fase 2 |
| M3 Serasa | ☐ Sim · ☐ Não · ☐ Fase 2 |
| A2 só online | ☐ Confirmado · ☐ Reabrir |
| B4/B5 | ☐ Fora · ☐ Fase 2 |
| Próximo passo | ☐ Ops SQL · ☐ Proposta Pacote 1/2 · ☐ Outro |

---

## Glossário

| Termo | Significado |
|-------|-------------|
| **Feito** | Código no FE/BE; pode faltar só SQL/ops no ambiente |
| **A validar** | Cliente ainda não decidiu — não desenvolver |
| **Fora** | Não será produto |
| **Stub** | UI responde sem integração externa real |
| **Esforço** | P dias · M 1–3 sem · G várias sem · GG homologação externa |

## Referências

| | |
|---|---|
| Índice módulos | [README](./README.md) |
| Legado React | [legado-stub-integracoes.md](../legado-stub-integracoes.md) |
| Storage R2 | `IArmazenamentoArquivo` / `CloudflareR2ArmazenamentoArquivo` |
| WhatsApp | `src/utils/whatsapp-web.ts` |
| Locais | `pages/estoque/LocaisEstoquePage.vue` |
| Contrato API | `new_agropulse_backend/api-contract/` + `CHANGELOG.md` |

---

*Parte A concluída em 2026-08-01. Parte B = única fila aberta para decisão comercial.*
