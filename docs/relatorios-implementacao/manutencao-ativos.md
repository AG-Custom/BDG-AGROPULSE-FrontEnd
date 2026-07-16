# Manutenção e Ativos — Gap de implementação

Cadastro de ativos, manutenção preventiva/corretiva, peças, custos, telemetria, checklist e depreciação.

**Escopo analisado:** frontend (`new_agropulse_frontend`) + backend (`new_agropulse_backend`)  
**Data:** 2026-07-13

---

## Já existe

| Capacidade | Situação |
|---|---|
| — | **Módulo inexistente** (sem domínio, rotas, UI, contrato API ou permissões) |

### Infraestrutura tangencial (reutilizável no futuro)

| Capacidade | Situação |
|---|---|
| Colaboradores | Cadastro de pessoas — potencial responsável de OS |
| Estoque / saída manual | Pode baixar peças, mas sem origem `Manutencao` nem vínculo com OS |
| Notificações | Motor genérico — hoje só fluxo de pedidos |
| Ordens de produção | Domínio de fábrica — **não** é OS de manutenção |
| Produtos | Pode cadastrar sobressalentes como produto — sem campos de ativo patrimonial |

---

## O que falta

### 1. Cadastro de ativos
Sem entidade/tela: número de série, modelo, fabricante, ano, valor de aquisição.

### 2. Plano de manutenção preventiva
Sem plano por horas de uso, quilometragem ou período.

### 3. Alertas de manutenção preventiva
Sem alertas de vencida/próxima. Alertas existentes são de estoque (mínimo/validade).

### 4. Ordens de serviço corretivas
Sem OS com prioridade e responsável.

### 5. Peças substituídas + consumo automático do estoque
Sem itens de peça por OS nem baixa automática de sobressalentes.

### 6. Custo de manutenção real
Sem relatório por ativo, período e tipo (preventiva vs corretiva).

### 7. Horímetros digitais / telemetria
Inexistente.

### 8. Checklist de inspeção diária (app mobile)
Inexistente. Checklist do onboarding é outro conceito.

### 9. Depreciação contábil
Sem método linear/acelerada nem valor residual.

---

## Mapa rápido

| Capacidade da doc | Backend | Frontend |
|---|---|---|
| Cadastro de ativos (série, modelo, fabricante, ano, valor) | ❌ | ❌ |
| Plano preventiva (horas / km / período) | ❌ | ❌ |
| Alertas preventiva vencida/próxima | ❌ | ❌ |
| OS corretivas (prioridade + responsável) | ❌ | ❌ |
| Peças + baixa automática estoque | ❌ | ⚠️ saída manual genérica |
| Custo manutenção por ativo/período/tipo | ❌ | ❌ |
| Horímetros / telemetria | ❌ | ❌ |
| Checklist inspeção diária (mobile) | ❌ | ❌ |
| Depreciação linear/acelerada + residual | ❌ | ❌ |

**Legenda:** ✅ pronto · ⚠️ parcial · ❌ ausente

---

## Síntese

Manutenção e Ativos é **greenfield** (0/9 capacidades). Qualquer implementação parte do zero, podendo reaproveitar colaboradores, estoque e notificações como base.
