# Gestão de Estoque — Gap de implementação

Controle completo do estoque físico, com rastreabilidade por lote, custeio, movimentações, localização, alertas, inventário e relatórios.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13  
**Atualizado:** 2026-07-13 (implementação dos gaps)

---

## Já existe

| Capacidade | Situação |
|---|---|
| Lotes com número, validade e custo unitário | Lotes, telas e API `/estoque/lotes` |
| Custo de aquisição por lote + impacto na margem | `custoUnitario` no lote; CMP recalcula `custoMedioPonderado` |
| Método de custeio CMP / FIFO por produto | Também FEFO; usado na baixa/reserva |
| Entrada via NF-e | Importação XML em Fiscal + vínculo `notaFiscalOrigemId` no lote |
| Entrada por produção | Conclusão da OP gera baixa de insumos + entrada do acabado (`Producao`) |
| Transferência entre unidades + NF stub | Fluxo Pendente → Confirmar/Cancelar; NF opcional stub |
| Saída por venda | Pedido (reserva FEFO) e PDV |
| Saídas tipadas | Motivo `RequisicaoInterna` / `Descarte` / `Manual` na saída |
| Localização física | Galpão + depósito/corredor/prateleira no lote e telas |
| Alertas de estoque mínimo | Limite por produto/unidade + página de alertas |
| Alerta de estoque zerado | `GET /estoque/alertas/zerado` + card na página |
| Alertas de vencimento | Janela global + `diasAlertaValidade` por produto |
| Inventário físico / cíclico | Filtros categoria e localização ao iniciar |
| Embalagens / frações (kg, L, etc.) | Unidades de medida + conversões no produto |
| Código de barras na operação | Lookup por código/EAN na entrada/saída |
| Stub balança | `POST /estoque/dispositivos/leitura-peso` |
| Relatório de giro | Aba em Relatórios + `GET /relatorios/giro-estoque` |

---

## SQL (sem migration EF)

Aplicar manualmente:

`new_agropulse_backend/scripts/20260713_Estoque_GestaoCompleta.sql`

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| Lotes + validade + custo | ✅ | ✅ |
| NF de origem no lote | ✅ | ✅ |
| Custeio CMP/FIFO | ✅ | ✅ |
| Entrada NF-e | ✅ | ✅ |
| Entrada por produção | ✅ | ✅ (via OP) |
| Transferência + NF stub | ✅ | ✅ |
| Saída venda | ✅ | ✅ |
| Requisição / descarte | ✅ | ✅ |
| Local físico (galpão/depósito/…) | ✅ | ✅ |
| Alerta mínimo | ✅ | ✅ |
| Alerta zerado | ✅ | ✅ |
| Alerta validade (por produto) | ✅ | ✅ |
| Inventário cíclico | ✅ | ✅ |
| Balança / leitor (stub) | ✅ | ✅ |
| Embalagens/frações | ✅ | ✅ |
| Relatório de giro | ✅ | ✅ |

**Legenda:** ✅ pronto · ⚠️ parcial · ❌ ausente

### Observações

- NF automática de transferência e balança/leitor são **stubs** (sem Focus NFe / hardware real).
- Cadastro hierárquico formal de locais por unidade continua fora de escopo (localização livre em texto no lote).
