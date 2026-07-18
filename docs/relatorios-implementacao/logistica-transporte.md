# Logística e Transporte — Gap de implementação

Frota, expedição operacional, roteirização, documentos de transporte, rastreamento, abastecimento e custo logístico.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-17  
**Status:** **Greenfield** no stack novo  
**Referência legado:** `AGROPULSE2026/src/pages/Logistica.tsx` (abas + endpoints Django)

---

## Já existe (tangencial — não é o módulo)

| Capacidade | Situação |
|---|---|
| Expedição pós-aprovação do pedido | Listagem + romaneio com lotes FEFO sugeridos (`/expedicao`) |
| CT-e / MDF-e | Stub no módulo Fiscal (`/notas-fiscais`) — sem frota/carga/roteiro |

**Não confundir:** romaneio de expedição de venda ≠ módulo Logística (frota, cargas, borderô, GPS, frete).

---

## Referência legado (a portar)

Abas no React: Frota · Programação · Romaneios · Docs transporte · Transportadoras · Abastecimento · Relatórios.

| Endpoint legado (Django) | Uso |
|---|---|
| `GET/POST /api/veiculos/` | Frota (placa, capacidade, CRLV, motorista, status) |
| `/api/cargas/` | Programação de cargas |
| `/api/romaneios/` | Romaneios / borderô |
| `/api/docs-transporte/` | Documentos de transporte |
| `/api/abastecimentos/` | Combustível por veículo |
| `/api/logistica/relatorio/` | Relatório de custo logístico |

Legado usa mock em várias abas quando a API falha — no stack novo: domínio + `api-contract/logistica.md` reais.

---

## Mapa rápido (stack novo)

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| Cadastro veículos (CRLV, capacidade, motorista) | ❌ | ❌ |
| Programação de cargas / roteirização | ❌ | ❌ |
| Romaneio + borderô + código rastreamento | ❌ | ❌ (só FEFO pós-pedido) |
| Emissão CT-e / MDF-e no fluxo logístico | ❌ | ❌ (stub fiscal isolado) |
| Rastreamento GPS em tempo real | ❌ | ❌ |
| Ocorrências (foto, geo, assinatura) | ❌ | ❌ |
| Abastecimento / consumo por veículo | ❌ | ❌ |
| Transportadoras + tabela de fretes | ❌ | ❌ |
| Balança rodoviária / ticket pesagem | ❌ | ❌ |
| Relatório custo logístico | ❌ | ❌ |

**Legenda:** ✅ pronto · ⚠️ parcial/stub · ❌ ausente

---

## Pendente para fechar o módulo

### Domínio interno (implementar no .NET + Vue)

1. Contrato API `api-contract/logistica.md` + seed módulo `logistica`
2. Frota: CRUD veículos, docs (CRLV/tacógrafo), motorista, status, alertas de vencimento
3. Programação de cargas (região, janela, veículo)
4. Romaneio/borderô operacional vinculado a pedidos/expedição (evoluir o romaneio FEFO atual)
5. Transportadoras + tabela frete por rota/peso
6. Abastecimentos e consumo
7. Ocorrências de entrega
8. Relatório de custo por entrega/rota/período
9. Permissão FE `logistica.visualizar` + sidebar

### Integrações externas (depois do domínio)

- GPS / telemetria de veículo
- CT-e / MDF-e reais no fluxo de carga (Focus/SEFAZ — alinhar com Fiscal)
- Balança rodoviária
- Roteirização automática avançada (pode começar manual)

### Fora deste relatório

- **RH e Folha** — fora de escopo do produto

---

## Síntese

Único módulo da spec comercial ainda **greenfield** no stack novo (além do RH, excluído). Prioridade #1 do backlog em [README.md](./README.md). Portar fluxos do legado React; implementar BE/FE no padrão AgroPulse.
