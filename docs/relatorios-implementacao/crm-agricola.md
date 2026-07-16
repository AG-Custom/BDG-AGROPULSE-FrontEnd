# CRM Agrícola — Gap de implementação

Carteira de produtores, visitas técnicas, histórico comercial, crédito, recomendações, pipeline, amostras, campanhas, canais de comunicação e dashboard de produtividade.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13

---

## Já existe

| Capacidade | Situação |
|---|---|
| Cadastro de clientes / produtores | CRUD completo; `TipoCliente.ProdutorRural` |
| Carteira do vendedor | `vendedorUsuarioId` + filtro; perfil Vendedor vê só a própria carteira |
| Consultor no cliente | Campo de vínculo no cadastro (FE) |
| Endereço tipo Propriedade + lat/long | GPS estático no endereço — não é visita |
| Contatos (e-mail, telefone) | Cadastro apenas — sem disparo |
| Limite de crédito manual | Campo no cliente + travas na aprovação de pedidos |
| Histórico comercial disperso | Pedidos, orçamentos, CR e contratos filtráveis por cliente |
| Talhões / aplicações (rastreabilidade) | Área e safra/cultura — **sem vínculo com o cliente/produtor** |
| Relatório de comissões por vendedor | `/relatorios` — sem visitas/conversão |
| Notificações in-app | Só fluxo de pedidos (retido/aprovado/recusado) |

---

## O que falta

### 1. Carteira agronômica do produtor
Sem perfil de cultura plantada, área total consolidada e histórico de safras **por cliente**. Talhões/aplicações não têm `clienteId`.

### 2. Visitas técnicas
Inexistente: agendamento, geolocalização de check-in, fotos e duração.

### 3. Histórico 360° (compras, negociações, preferências)
Listagens separadas existem; FE sem aba no cliente. Sem entidade de negociação nem preferências estruturadas.

### 4. Análise de crédito (score / limite sugerido / adimplência)
Só limite manual + travas de exposição/atraso. Sem pontuação, limite sugerido nem painel de adimplência.

### 5. Recomendações agronômicas por visita
Inexistente. Aplicações não vinculam a visita/recomendação.

### 6. Pipeline de oportunidades
Inexistente. Orçamento comercial ≠ funil por safra/cultura/produto.

### 7. Amostras e demonstrações em campo
Inexistente.

### 8. Campanhas de relacionamento
Inexistente. Segmentação de `TabelaPreco` é só precificação.

### 9. WhatsApp e e-mail automáticos
Inexistente. E-mail/telefone são campos cadastrais; notificações são in-app internas.

### 10. Dashboard consultor/vendedor
`DashboardPage` é stub. Sem KPIs de visitas, pedidos e conversão.

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| Carteira produtores (cultura, área, safras) | ⚠️ cliente + talhão desconectado | ⚠️ carteira vendedor; sem perfil agronômico |
| Visitas técnicas (geo, fotos, duração) | ❌ | ❌ |
| Histórico compras / negociações / preferências | ⚠️ listagens por cliente | ⚠️ sem aba 360° no cliente |
| Análise crédito (score, limite sugerido, adimplência) | ⚠️ limite + travas | ⚠️ campo manual + fila aprovações |
| Recomendações agronômicas | ❌ | ❌ |
| Pipeline oportunidades (safra/cultura/produto) | ❌ | ❌ |
| Amostras / demonstrações | ❌ | ❌ |
| Campanhas segmentadas | ❌ | ❌ |
| WhatsApp / e-mail | ❌ | ⚠️ só cadastro de contato |
| Dashboard produtividade consultor/vendedor | ⚠️ comissões | ❌ dashboard stub |

**Legenda:** ✅ pronto · ⚠️ parcial · ❌ ausente

---

## Síntese

CRM Agrícola **não existe como módulo**. Há base de **ERP comercial** (clientes, carteira, vendas, crédito operacional). Das 10 capacidades: 6 ausentes e 4 parciais/tangenciais.
