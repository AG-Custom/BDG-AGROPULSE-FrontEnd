# Plano de ação — stubs (stack novo)

| Campo | Valor |
|-------|-------|
| Sistema | AgroPulse novo (Vue 3 + .NET) |
| Público | Alinhamento com o cliente |
| Criado | 2026-08-01 |
| Última revisão | 2026-08-03 |
| Estrutura | **Parte A = feito** · **Parte B = ainda não** |

---

## Visão rápida

| | O quê |
|---|---|
| **Parte A — Feito** | Limpezas de stub + Pacote 0 (2026-08-01) + cotação referência + upload XML recebimento + **PTAX BCB** (2026-08-03) · **Ops SQL/R2 aplicados** |
| **Parte B — Ainda não** | Itens **a validar** com o cliente (fiscal, banking, Serasa…) + fora de escopo permanente |
| **Ops** | Parte A homologada nos ambientes |

```text
FEITO                          AINDA NÃO (decidir com cliente)
─────────────────────────      ─────────────────────────────
Fotos visita (R2)              Focus / SEFAZ (NF-e, NFC-e…)
Anexos jurídicos (R2)          Contingência / reversão / DANFE
WhatsApp Web (wa.me)           Boletos / OFX / intraday
Locais hierárquicos            Serasa / SPC
Exports Excel/PDF              CT-e/MDF-e, NF transferência…
Cotação CBOT/ESALQ (ref.)      Docs destinados SEFAZ (baixar XML)
Upload XML recebimento         SPED avançado
PTAX Banco Central (BCB)       NF satélite contratos/barter
Sem Power BI / IoT / GPS
Sem crédito bancário API
Sem disparo campanha fake
Sem offline PWA
Sem Geo mapa (Fora)
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
| **M1** | **Cotação CBOT / ESALQ** | **Referência real (não stub):** ESALQ via AgroDoc, CBOT via Yahoo; painel soja+milho; auto-refresh 5 min; disclaimer de cotação indicativa | Contratos · `GET /contratos/cotacao-mercado` + `/lista` · FE `CotacaoMercadoCard` |
| **—** | **Upload XML recebimento** | **Campo textarea trocado por upload `.xml`:** lê arquivo → preview-xml → preenche form | Compras → Recebimentos `/novo` · `RecebimentoCompraFormPage.vue` |
| **A10** | **PTAX / FX** | **BCB Olinda real:** sync compra/venda; origem `Bacen` \| `Manual` (sem Stub); exposição com `cotacaoPendente` | Financeiro → Cotações · `POST /cotacoes-moeda/sincronizar-ptax` · SQL `20260803_Financeiro_CotacaoMoedaTaxaCompra.sql` |

**Nota M11:** lotes históricos só com texto livre **não** foram remapeados automaticamente (helper SQL comentado).

**Nota M1:** cotação é **indicativa** (fonte pública free). Upgrade para provedor licenciado CEPEA/CBOT fica opcional comercial.

**Nota A10:** PTAX oficial do BCB (dados abertos). Fins de semana/feriados usam último dia útil disponível.

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
| B5 | Diário de campo offline PWA | Fora do produto (2026-08-03) | Diário só online no navegador |
| B4 | Geo KML/Shapefile/mapa | Fora do produto (2026-08-03) | Import geo permanece stub/ausente; sem mapa |

## A3. SQLs para aplicar no banco (ordem)

1. `scripts/20260801_Logistica_RemoverGpsStub.sql`
2. `scripts/20260801_Manutencao_RemoverChecklistSyncStub.sql`
3. `scripts/20260801_CobrancaCredito_RemoverCreditoBancarioStub.sql`
4. `scripts/20260801_Safras_VisitaFotoChaveArmazenamento.sql`
5. `scripts/20260801_CobrancaCredito_JuridicoAnexos.sql`
6. `scripts/20260801_Estoque_LocaisHierarquicos.sql`
7. `scripts/20260803_Financeiro_CotacaoMoedaTaxaCompra.sql` *(A10)*

**Ops Parte A:** SQLs 1–6 + R2/API já aplicados nos ambientes.

Depois do A10: aplicar SQL 7 + reiniciar API.

## A4. Fora de escopo permanente (não é stub a “ligar”)

| Item | Motivo |
|------|--------|
| RH e Folha (eSocial, ponto, FGTS, EPI…) | Fora de escopo do produto novo |
| Bonificação / fidelidade por volume | Fora de escopo |
| App mobile nativo vendedor/consultor | Fora de escopo |
| Diário de campo offline PWA (B5) | Fora de escopo — uso apenas online |
| Geo KML/Shapefile/mapa (B4) | Fora de escopo (2026-08-03) |

---

# PARTE B — O QUE AINDA NÃO FOI FEITO

Itens **ainda stub ou ausentes**. Não implementar até o cliente marcar SIM / NÃO / Fase 2 — exceto melhorias internas já alinhadas (como M1 referência / A10 PTAX).

## B0. Lista rápida — o que falta (para verificar implementação)

Legenda **Viabilidade**:
- **Código** = dá para implementar no FE/BE sem contrato externo novo
- **Código + token** = código + config (ex.: Focus token)
- **Externo** = precisa provedor/banco/bureau/licença antes
- **Depende** = só faz sentido depois de outro item

| ID | Item | Viabilidade | Esforço | Nota curta |
|----|------|-------------|---------|------------|
| A1 | Emissão Focus/SEFAZ (NF-e, NFC-e…) | Código + token | GG | Núcleo fiscal; token Focus |
| A2 | Contingência SEFAZ | Depende A1 | G* | Preferência atual: só online |
| A3 | Cancelamento + reversão estoque/CR/CP | Depende A1 | G* | Muito domínio interno |
| A4 | Manifestação / inutilização / GNRE | Código + token | M–G* | Escopo a fechar com cliente |
| A5 | SPED avançado | Código | GG | Ou fica no escritório |
| A6 | DANFE customizável | Código (+ Focus) | M* | Ou DANFE padrão Focus |
| A7 | Boletos registrados | Externo | GG | CNAB / API banco / intermediador |
| A8 | OFX / Open Finance | Externo | G–GG | Base do banking real |
| A9 | Saldo intraday (Tesouraria) | Depende A8 | M–G* | Saldo ao vivo do banco |
| ~~A10~~ | ~~PTAX / FX~~ | ~~Código (+ BCB free)~~ | ~~M~~ | **Feito 2026-08-03** — BCB Olinda |
| A11 | NFC-e / contingência no PDV | Depende A1/A2 | G* | Mesmo ciclo do Fiscal |
| M2 | NF na entrega/liquidação/barter | Depende A1 | M* | Hoje `stubNfe` |
| M3 | Serasa / SPC | Externo | G | Contrato bureau |
| M6 | CT-e / MDF-e logística | Código + token | G* | Focus/SEFAZ |
| M9 | NF de transferência | Depende A1 | M* | Botão stub |
| M10 | Docs destinados SEFAZ (baixar XML) | Código + token | M–G* | Lista existe; falta baixar XML na seleção. Upload XML já cobre o fluxo manual |
| ~~B4~~ | ~~Geo KML/Shapefile/mapa~~ | — | — | **Fora** (2026-08-03) |

### Mais fáceis de atacar agora (sem esperar cliente/banco)

1. ~~**A10 PTAX**~~ — **feito**  
2. **M10** — baixar XML do documento destinado (precisa Focus token; lista já existe)  
3. ~~**B4 Geo MVP**~~ — **Fora**  
4. **A6 DANFE** — se aceitar HTML/padrão Focus  

### Precisam decisão/contrato externo

- **A1/A11/M2/M6/M9** → Focus + escopo NF  
- **A7/A8/A9** → banco / Open Finance  
- **M3** → Serasa/SPC  
- **A5** → SPED no produto ou fora  

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
| A9 | Saldo intraday (Tesouraria) | Stub (lista contas internas) | Precisa? (depende A8) | M–G* |
| ~~A10~~ | ~~PTAX / FX~~ | **Feito (2026-08-03)** — BCB Olinda + sync + manual | — | Feito |
| A11 | NFC-e / contingência no PDV | Depende A1/A2 | No mesmo ciclo do A1? | G* |

\* depende de A1 e/ou A8.

## B2. Prioridade média

| ID | Item | Situação hoje | Pergunta ao cliente | Esforço |
|----|------|---------------|---------------------|---------|
| ~~M1~~ | ~~Cotação CBOT / ESALQ~~ | **Feito (2026-08-03)** — referência Yahoo/AgroDoc, soja+milho, auto-refresh, disclaimer | Upgrade licenciado? | Feito* |
| M2 | NF na entrega/liquidação/barter | `stubNfe` | Automática no contrato ou só no Fiscal? | M* |
| M3 | Serasa / SPC | Consulta bureau stub | Haverá contrato com bureau? | G |
| M6 | CT-e / MDF-e na logística | Autorizar stub SEFAZ | No go-live ou depois do Fiscal? | G* |
| M9 | NF de transferência | Botão stub | Precisa no go-live? | M* |
| M10 | Docs destinados SEFAZ | Lista Focus existe; seleção só preenche chave; **upload XML no recebimento já funciona** | XML basta ou completar download por chave? | M–G* |

## B3. Prioridade baixa (ainda a validar)

~~B4 Geo~~ — **Fora** (2026-08-03).  
~~B5 Offline PWA~~ — **Fora** (2026-08-03).

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
- [x] **A10** PTAX BCB — **feito 2026-08-03**
- [ ] **A11** NFC-e PDV junto com A1?
- [x] **M1** Cotação referência (Yahoo/AgroDoc) — **feito 2026-08-03**; upgrade licenciado opcional
- [ ] **M2 / M6 / M9 / M10** Satélites fiscais no go-live?
- [ ] **M3** Serasa/SPC?
- [x] **B4** Geo — **Fora** (2026-08-03)
- [x] **B5** Offline PWA — **Fora** (2026-08-03)

## B5. Pacotes comerciais (só o que falta decidir)

| Pacote | Conteúdo | Status |
|--------|----------|--------|
| **0 — Operacional** | Parte A | **Homologado** — SQLs/ops aplicados |
| **1 — Fiscal** | A1 (+ A3); opcional A4/A6; A2 tende a “não” | A validar |
| **2 — Banking** | A7 (+ A8); A9 opcional; ~~A10~~ feito | A validar (A7/A8/A9) |
| **3 — Crédito externo** | M3 Serasa (M4 já fora) | A validar |
| **4 — Campo** | B4 geo + B5 offline = **Fora** | Fechado |
| **6 — SPED** | A5 | A validar |

## B6. Ordem se o cliente quiser “o máximo”

```text
1) Fechar A1 + A7 na reunião
2) Confirmar A2 = só online
3) A1 → A3 → A11 → A4/A6
4) A7 → A8 → A9
5) Satélites M2/M6/M9/M10 + M3
6) A5 SPED
(M1 referência + A10 PTAX já entregues; B4/B5 Fora)
```

---

## Ata rápida

| | |
|---|---|
| Data | |
| Participantes | |
| Pacote 0 (Parte A) homologado? | ☑ SQLs aplicados · ☑ Testado · ☐ Pendente |
| Pacote 1 Fiscal | ☐ Sim · ☐ Não · ☐ Fase 2 |
| Pacote 2 Banking | ☐ Sim · ☐ Não · ☐ Fase 2 |
| M3 Serasa | ☐ Sim · ☐ Não · ☐ Fase 2 |
| A2 só online | ☐ Confirmado · ☐ Reabrir |
| B4 Geo | ☑ Fora 2026-08-03 |
| B5 Offline PWA | ☑ Fora 2026-08-03 |
| M1 cotação ref. | ☑ Feito 2026-08-03 |
| A10 PTAX BCB | ☑ Feito 2026-08-03 |
| Próximo passo | ☐ Proposta Pacote 1/2 · ☐ Outro |

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
| Cotação mercado | `CotacaoMercadoCard.vue` · `CotacaoMercadoFeedClient` · `api-contract/contratos.md` |
| Recebimento XML | `RecebimentoCompraFormPage.vue` |
| PTAX | `CotacoesMoedaPage.vue` · `PtaxBacenClient` · `api-contract/financeiro.md` |
| Contrato API | `new_agropulse_backend/api-contract/` + `CHANGELOG.md` |

---

*Parte A concluída em 2026-08-01; M1 + upload XML + A10 PTAX em 2026-08-03; B4/B5 Fora; Ops Parte A homologada. Parte B = fila aberta para decisão comercial.*
