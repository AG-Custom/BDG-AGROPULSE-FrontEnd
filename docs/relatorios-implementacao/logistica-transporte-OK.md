# Logística e Transporte — Gap de implementação

Frota, expedição operacional, roteirização, documentos de transporte, rastreamento, abastecimento e custo logístico.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-17  
**Status:** **Domínio OK**  
**Contrato:** `api-contract/logistica.md`  
**Referência legado:** `AGROPULSE2026/src/pages/Logistica.tsx` (comportamento portado; não código React)

---

## Já existe

| Capacidade | Situação |
|---|---|
| Módulo Logística completo | ✅ `/api/logistica/*` + páginas Vue |
| Frota (CRLV, tacógrafo, motorista, status) | ✅ |
| Programação de cargas + paradas | ✅ |
| Romaneio operacional + rastreio interno + ocorrências | ✅ |
| Transportadoras + tabela frete | ✅ |
| Abastecimento / consumo | ✅ |
| Relatório custo logístico | ✅ |
| Docs CT-e / MDF-e | ⚠️ stub interno (autorizar sem SEFAZ) |
| Expedição FEFO pós-pedido | ✅ módulo separado (`/expedicao`); romaneio logístico aceita vínculo opcional |

---

## Mapa rápido (stack novo)

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| Cadastro veículos (CRLV, capacidade, motorista) | ✅ | ✅ |
| Programação de cargas / roteirização manual | ✅ | ✅ |
| Romaneio + borderô + código rastreamento | ✅ | ✅ |
| Emissão CT-e / MDF-e no fluxo logístico | ⚠️ stub | ⚠️ stub UI |
| Rastreamento GPS em tempo real | ⚠️ campos stub | ⚠️ display |
| Ocorrências (foto, geo flags) | ✅ domínio | ✅ |
| Abastecimento / consumo por veículo | ✅ | ✅ |
| Transportadoras + tabela de fretes | ✅ | ✅ |
| Balança rodoviária / ticket pesagem | ❌ | ❌ |
| Relatório custo logístico | ✅ | ✅ |

**Legenda:** ✅ pronto · ⚠️ parcial/stub · ❌ ausente

---

## Pendente para fechar o módulo

### Domínio interno

_(nenhum — domínio fechado em 2026-07-17)_

### Integrações externas (depois do domínio)

- GPS / telemetria de veículo
- CT-e / MDF-e reais no fluxo de carga (Focus/SEFAZ — alinhar com Fiscal)
- Balança rodoviária
- Roteirização automática avançada (hoje manual)

### Fora deste relatório

- **RH e Folha** — fora de escopo do produto

---

## Síntese

Módulo **Logística e Transporte** criado sob `/api/logistica` e hub FE (frota, cargas, romaneios, transportadoras, abastecimento, docs stub, custos). Integrações GPS/SEFAZ/balança permanecem para depois.
