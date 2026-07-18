# Fiscal e Tributário — Gap de implementação

Obrigações fiscais do agronegócio brasileiro: emissão (NF-e, NFC-e, CT-e, MDF-e), contingência SEFAZ, eventos pós-emissão, regras setoriais (ICMS, PIS/COFINS, Funrural, NFPR) e escrituração (SPED).

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**Atualizado:** 2026-07-13 (implementação dos gaps BE/FE)  
**SQL alinhado (BE):** `scripts/20260713_Fiscal_GestaoCompleta.sql` (cópia em `scripts/sql/`)

---

## Já existe (pré-gaps)

| Capacidade | Situação |
|---|---|
| Configuração fiscal da empresa | Regime tributário + token Focus NFe (BE/FE) |
| Cadastro fiscal do produto | NCM, CEST, origem, CSOSN, CST ICMS, alíquota, MVA, CFOP interno/externo |
| Sugestão tributária simples | `GET /fiscal/sugerir/{produtoId}` por UF — foundation |
| Importação XML NF-e de entrada | Itens → produto + entrada estoque (BE/FE) |
| Export SPED registro 0200 | Download linhas produtos ativos (BE/FE) |
| Entidade `NotaFiscal` | Esqueleto — estendida na gestão completa |
| Stub emissão NF-e legado | `POST /fiscal/emitir-nfe/{pedidoId}` — ainda falha sem Focus; preferir `/notas-fiscais` |

---

## O que foi implementado (2026-07-13)

### Emissão e transmissão

#### 1. NF-e / NFC-e / CT-e / MDF-e — ✅ BE/FE (stub Focus)
- Listagem/detalhe em `/api/notas-fiscais`
- Emissão stub com chave 44 dígitos local: NF-e (pedido), NFC-e (PDV), CT-e, MDF-e, NFPR
- DANFE HTML + XML stub (lote/cultura/safra)
- UI: `NotasFiscaisListPage` + dialog de emissão

#### 2. CFOP automático completo — ✅ BE/FE
- `GET /fiscal/sugerir-completo/{produtoId}` (natureza, destinatário, PIS/COFINS, ST/DIFAL)
- `POST /fiscal/cfop-override` com log
- UI na página de cálculo de impostos + API em `useFiscal`

### Contingência SEFAZ

#### 3. Offline, SVC, painel e alerta 168h — ✅ BE/FE (stub)
- Ativar/desativar Offline|SVC, fila pendentes, reprocessar, alerta 168h
- UI: `ContingenciaFiscalPage`

### Eventos pós-emissão

#### 4. Cancelamento (24h + reversões) — ✅ BE/FE (reversão stub)
- Motivo ≥15 chars; bloqueio se emitida >24h; flag `reverterEstoque` stub

#### 5. CC-e / Complementar / Devolução NF / Inutilização — ✅ BE/FE
- CC-e (máx 20), complementar, NF-e devolução, inutilização de numeração
- UI: dialogs + `InutilizacoesListPage`

### Obrigações do agronegócio

#### 6. Suspensão PIS/COFINS por NCM — ✅ BE/FE
- CRUD `ncm_pis_cofins` + uso na sugestão completa

#### 7. ICMS ST / diferimento / DIFAL — ✅ BE/FE
- Tabela `mva_ncm_uf` + `POST /fiscal/calcular-impostos`
- UI: `MvaNcmUfListPage` + `CalculoImpostosPage`

#### 8. GNRE automática — ✅ BE/FE (stub protocolo)
- Gerar a partir de nota + listagem

#### 9. Funrural + GILRAT + SENAR — ✅ BE/FE
- Config + cálculo breakdown

#### 10. NFPR — ✅ BE/FE (stub)
- `POST /notas-fiscais/emitir-nfpr`

#### 11. DANFE customizável (lote, cultura, safra) — ⚠️ stub BE/FE
- HTML com campos agronômicos; sem layout customizável avançado

### Escrituração e obrigações acessórias

#### 12. SPED Fiscal e SPED Contribuições — ⚠️ stub BE/FE
- EFD ICMS/IPI + EFD Contribuições (blocos mínimos a partir de notas + 0200)
- UI: `SpedFiscalPage` (+ 0200 na config)

#### 13. Regime por CNPJ com vigência + Produtor Rural — ✅ BE/FE
- Enum `ProdutorRural`; CRUD regimes CNPJ com vigência

#### 14. SPED Contábil + envio ao escritório — ⚠️ stub BE/FE
- Export contábil + `POST /fiscal/sped/enviar-escritorio`

### Extra

#### Manifestação destinatário — ✅ BE/FE (stub)
- `POST /fiscal/sefaz/manifestar` + seção na `FiscalConfigPage`

---

## SQL (sem migration EF)

Aplicar manualmente:

`new_agropulse_backend/scripts/20260713_Fiscal_GestaoCompleta.sql`  
(cópia: `scripts/sql/20260713_Fiscal_GestaoCompleta.sql`)

Inclui ALTER em `notas_fiscais` e tabelas: cartas_correcao, contingência/fila, inutilizações, ncm_pis_cofins, mva_ncm_uf, gnre, funrural, regimes_cnpj, cfop_override_logs, envios escritório, manifestações.

Contrato API: `new_agropulse_backend/api-contract/fiscal.md`

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| **Cadastro / foundation** | | |
| Config fiscal (regime + Focus) | ✅ | ✅ |
| Produto fiscal (NCM/ICMS/CFOP) | ✅ | ✅ |
| Sugestão CFOP/tributação completa | ✅ | ✅ cálculo + API |
| Import XML entrada | ⚠️ estoque | ✅ |
| SPED 0200 | ✅ | ✅ |
| Entidade NotaFiscal + listagem | ✅ | ✅ |
| **Emissão** | | |
| NF-e / NFC-e / CT-e / MDF-e | ⚠️ stub Focus | ✅ |
| CFOP auto + override/log | ✅ | ✅ sugestão / API override |
| **Contingência** | | |
| Offline + SVC + fila + 168h | ⚠️ stub | ✅ |
| **Eventos** | | |
| Cancelamento 24h + reversões | ⚠️ reversão stub | ✅ |
| CC-e / Complementar / Devolução / Inutilização | ✅ | ✅ |
| **Agronegócio** | | |
| PIS/COFINS zero por NCM | ✅ | ✅ |
| ICMS ST / diferimento / DIFAL | ✅ | ✅ |
| GNRE automática | ⚠️ stub | ✅ |
| Funrural / GILRAT / SENAR | ✅ | ✅ |
| NFPR | ⚠️ stub | ✅ |
| DANFE agronômico | ⚠️ stub HTML | ✅ |
| **Escrituração** | | |
| SPED EFD ICMS/IPI | ⚠️ stub blocos | ✅ |
| SPED EFD PIS/COFINS | ⚠️ stub | ✅ |
| Regime por CNPJ + vigência + Produtor Rural | ✅ | ✅ |
| SPED Contábil + envio escritório | ⚠️ stub | ✅ |
| Manifestação destinatário | ⚠️ stub | ✅ |

**Legenda:** ✅ pronto · ⚠️ parcial/stub · ❌ ausente

### Observações

- Integração real Focus/SEFAZ permanece stub (autorização local).
- Foundation (`/api/fiscal/*` legado) preservada; emissão operacional em `/api/notas-fiscais/*`.
- Reversão de estoque/CR/CP no cancelamento é flag/observação stub — não integra estoque real.
- Permissão FE: `fiscal.visualizar`.
- Rotas FE: `fiscal/notas-fiscais`, `contingencia`, `inutilizacoes`, `ncm-pis-cofins`, `mva-ncm-uf`, `gnre`, `funrural`, `regimes-cnpj`, `sped`, `calculo-impostos` (+ config).

---

## Pendente para fechar o módulo

| Tipo | Item |
|------|------|
| Integração | Emissão Focus/SEFAZ real (NF-e, NFC-e, CT-e, MDF-e, NFPR) |
| Integração | Contingência offline + SVC reais (hoje stub de fila) |
| Domínio + integração | Cancelamento com reversão real de estoque, CR/CP e comissões |
| Integração | GNRE com protocolo real |
| Integração | SPED Fiscal / Contribuições / Contábil além de blocos stub |
| Integração | Envio automático ao escritório contábil |
| Domínio | DANFE customizável avançado (hoje HTML stub com campos agronômicos) |
| Fora de escopo | — |

**Status:** UI e regras tributárias (CFOP, Funrural, MVA, regimes) cobertas; prioridade #1 de integração do produto.
