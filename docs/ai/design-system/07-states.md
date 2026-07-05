# 07 — Estados

> Todo componente interativo deve implementar os estados aplicáveis. Valores via tokens.

---

## Referência universal

| Estado | Descrição | Tokens visuais |
|---|---|---|
| **Default** | Repouso | Cores base do componente |
| **Hover** | Mouse sobre elemento | `color.hover` bg, underline em links |
| **Active/Pressed** | Clique mantido | `color.active` bg |
| **Focus** | Navegação teclado | `color.focus.ring` outline 2px offset 2px |
| **Disabled** | Não interativo | `color.disabled.*`, `opacity.disabled` |
| **Loading** | Processando | Spinner no componente, disable interação |
| **Error** | Validação falhou | `color.border.error`, `color.error.500` text |
| **Success** | Validação OK | `color.success.500` border/icon (sutil) |
| **Warning** | Atenção | `color.warning.500` border/icon |
| **Readonly** | Visualização sem edição | Fundo `color.surface.sunken`, sem border focus |

---

## Por componente

### Button

| Estado | Visual |
|---|---|
| Default | BG primary.500, text inverse |
| Hover | BG primary.600 |
| Active | BG primary.700 |
| Focus | Ring focus |
| Disabled | BG neutral.100, text neutral.400 |
| Loading | Spinner branco, label oculto, disabled |

### Input

| Estado | Visual |
|---|---|
| Default | Border neutral.200 |
| Focus | Border primary.500, ring sutil |
| Error | Border error.500, message error.500 abaixo |
| Disabled | BG neutral.100, text neutral.400 |
| Readonly | BG neutral.100, cursor default |

### Table Row

| Estado | Visual |
|---|---|
| Default | BG surface |
| Hover | BG color.hover |
| Selected | BG primary.50 |
| Disabled row | Opacity 0.48 |

### Nav Item

| Estado | Visual |
|---|---|
| Default | Text neutral.600, icon neutral.500 |
| Hover | BG color.hover |
| Active | BG primary.50, text primary.600, icon primary.500, font-weight medium |
| Disabled | Text neutral.400 |

### Card

| Estado | Visual |
|---|---|
| Default | Border neutral.200, shadow.sm |
| Hover (clickable) | Shadow md, border neutral.300 |
| Selected | Border primary.500 |

---

## Loading — hierarquia

Prioridade (usar o mais específico, nunca todos):

1. **Button loading** — ação em progresso
2. **Section skeleton** — carregamento de área conhecida
3. **Table linear progress** — carregamento de dados tabulares
4. **Inline spinner** — área pequena (< 100px)
5. ~~Fullscreen overlay~~ — **PROIBIDO**
6. ~~Page transition spinner~~ — **PROIBIDO**

---

## Error vs Warning vs Success

| Tipo | Quando | Onde exibir |
|---|---|---|
| Error | Validação, falha API, operação impossível | Inline no campo + toast |
| Warning | Dado incompleto, ação reversível, alerta operacional | Banner inline |
| Success | Confirmação de operação | Toast (3-4s) + estado visual breve |

**Regra:** nunca usar cor semântica como única indicadora — sempre texto/ícone acompanhando (acessibilidade).

---

## Readonly vs Disabled

| | Readonly | Disabled |
|---|---|---|
| Copiar texto | ✅ | ✅ |
| Tab focus | ✅ | ❌ (skip) |
| Visual | Fundo sunken | Opacity reduzida |
| Uso | Visualizar dado existente | Ação indisponível temporariamente |

---

## Implementação CSS

```css
.interactive {
  transition: var(--transition-bg), var(--transition-border);
}

.interactive:hover:not(:disabled) {
  background: var(--color-hover);
}

.interactive:active:not(:disabled) {
  background: var(--color-active);
}

.interactive:focus-visible {
  outline: var(--border-width-medium) solid var(--color-border-focus);
  outline-offset: 2px;
}

.interactive:disabled {
  background: var(--color-disabled-bg);
  color: var(--color-disabled-text);
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}
```
