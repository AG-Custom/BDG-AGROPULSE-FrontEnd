# Cobrança e Crédito Rural — Gap de implementação

Análise/concessão de crédito, monitoramento da carteira e cobrança ativa.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13

---

## Já existe

| Capacidade | Situação |
|---|---|
| Limite de crédito no cliente | Campo manual `limiteCredito` (CRUD) |
| Contas a receber | Geradas no faturamento do pedido; listagem `GET /contas-receber` |
| Exposição aberta do cliente | Soma CR abertas (uso interno nas travas) |
| Travas na aprovação de pedidos | `LimiteCredito` e `AtrasoCliente` na fila `GET /aprovacoes` |
| Parâmetro dias de atraso | `empresa.diasAtrasoBloqueio` (global, não por perfil) |
| Endereço tipo Cobrança | Tipo cadastral — não é workflow de cobrança |
| Contatos do cliente | Cadastro — sem tentativas de cobrança |
| Dados rurais adjacentes | Talhão/cultura em rastreabilidade — **sem vínculo** com ficha de crédito |

---

## O que falta

### Análise e concessão de crédito

#### 1. Ficha de análise rural
Sem área plantada, cultura, produtividade, renda, endividamento e garantias no contexto de crédito.

#### 2. Score interno ponderado
Sem cálculo nem pesos configuráveis (40/20/20/20).

#### 3. Integração Serasa/SPC
Inexistente.

#### 4. Aprovação por alçada (gerente / diretor / CEO)
Aprovação genérica de pedido existe; sem limites por cargo/valor. Flag `aprovarPedido` não enforce no aprovar.

#### 5. Revisão automática de limite + alertas ao analista
Inexistente.

---

### Monitoramento da carteira

#### 6. Painel da carteira
Dados brutos existem; sem endpoint/UI agregando limite, utilizado, disponível, vencimentos e adimplência.

#### 7. Aging por faixas
Inexistente (a vencer, 1–15 … >180).

#### 8. Alerta de concentração
Inexistente.

#### 9. Índice de inadimplência diário + histórico mensal
Inexistente (só maior atraso pontual nas travas).

#### 10. PDD por faixa de atraso
Inexistente.

#### 11. Bloqueio automático de pedidos por atraso
⚠️ Parcial: `diasAtrasoBloqueio` por empresa gera trava **informativa** — não bloqueia de fato o envio/aprovação; sem N por perfil; FE sem tela de configuração.

---

### Cobrança ativa

#### 12. Lista diária priorizada
Inexistente.

#### 13. Registro de tentativas de contato
Inexistente.

#### 14. Títulos em disputa
Inexistente. CR sem baixa operacional completa.

#### 15. Encaminhamento jurídico + pacote de documentos
Inexistente.

#### 16. Acordos judiciais / parcelamento com acompanhamento
Inexistente.

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| **Análise / concessão** | | |
| Ficha análise (área, cultura, renda, garantias…) | ❌ | ❌ |
| Score interno (pesos configuráveis) | ❌ | ❌ |
| Serasa / SPC | ❌ | ❌ |
| Alçada gerente / diretor / CEO | ⚠️ aprovação genérica | ⚠️ fila de pedidos |
| Revisão automática de limite | ❌ | ⚠️ campo manual |
| **Monitoramento** | | |
| Painel carteira (limite/utilizado/disponível) | ⚠️ dados brutos | ❌ |
| Aging por faixas | ❌ | ❌ |
| Concentração de carteira | ❌ | ❌ |
| Índice inadimplência + histórico | ❌ | ⚠️ badge atraso na fila |
| PDD configurável | ❌ | ❌ |
| Bloqueio pedido por atraso (N por perfil) | ⚠️ limiar global, advisory | ⚠️ badge; sem config |
| **Cobrança ativa** | | |
| Lista diária priorizada | ❌ | ❌ |
| Tentativas de contato | ❌ | ❌ |
| Títulos em disputa | ❌ | ❌ |
| Encaminhamento jurídico | ❌ | ❌ |
| Acordos judiciais | ❌ | ❌ |
| **Infra** | | |
| Limite no cliente | ✅ | ✅ |
| CR gerada no faturamento | ✅ | ⚠️ read-only no pedido |
| Travas crédito/atraso na aprovação | ⚠️ informativas | ⚠️ na fila |

**Legenda:** ✅ pronto · ⚠️ parcial · ❌ ausente

---

## Síntese

Cobrança e Crédito Rural **não existe como módulo**. Há fundação comercial mínima (limite + CR + travas na aprovação). Das 16 capacidades: a maioria está ausente; o que existe é operacional de vendas, não análise/monitoramento/cobrança ativa.
