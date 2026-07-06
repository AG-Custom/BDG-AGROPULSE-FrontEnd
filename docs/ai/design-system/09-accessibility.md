# 09 — Acessibilidade

> WCAG 2.1 AA como meta mínima. Agronegócio inclui operadores em campo — contraste e legibilidade são críticos.

---

## Contraste

| Par | Ratio mínimo | Status AgroPulse |
|---|---|---|
| Text primary / bg default | 4.5:1 | ✅ ~12:1 |
| Text secondary / bg default | 4.5:1 | ✅ ~5.5:1 |
| Primary.500 (`#1e8a4a`) / white | 3:1 (UI/texto grande) | ✅ ~4.4:1 — usar primary.600+ para texto corrido sobre branco |
| Error.500 / white | 4.5:1 | ✅ |
| Placeholder / bg | 3:1 | ✅ neutral.400 |
| Sidebar.text / sidebar.bg (forest.900) | 4.5:1 | ✅ ~13:1 |
| Sidebar.text.secondary / sidebar.bg | 4.5:1 | ✅ ~7.9:1 |

**Regra:** nunca usar `neutral.400` para body text — apenas placeholder e disabled.

---

## Focus

- Estilo global `:focus-visible` em `app.scss`
- Ring: 2px `color.border.focus`, offset 2px
- **Nunca** `outline: none` sem alternativa
- Ordem de tab lógica: header → sidebar → content → actions

```css
:focus-visible {
  outline: var(--border-width-medium) solid var(--color-border-focus);
  outline-offset: 2px;
}
```

---

## Navegação por teclado

| Tecla | Ação |
|---|---|
| Tab / Shift+Tab | Navegar entre interativos |
| Enter / Space | Ativar botão, toggle |
| Escape | Fechar modal, menu, drawer overlay |
| Arrow keys | Navegar em tabs, menus, selects |

Quasar implementa grande parte — não sobrescrever handlers que quebrem comportamento nativo.

---

## Screen Readers

- `<html lang="pt-BR">` em `index.html`
- Títulos de página dinâmicos via `document.title` ou `@vueuse/head` (futuro)
- Landmarks: `q-layout` mapeia para estrutura semântica
- Live regions: Notify do Quasar já implementa

---

## ARIA

| Elemento | ARIA |
|---|---|
| Icon button sem label | `aria-label="Descrição da ação"` |
| Loading button | `aria-busy="true"` (Quasar `:loading`) |
| Modal | `role="dialog"`, `aria-modal="true"` (Quasar) |
| Tabs | `role="tablist/tab/tabpanel"` (Quasar) |
| Form error | `aria-invalid="true"`, `aria-describedby="error-id"` |
| Sidebar nav | `<nav aria-label="Navegação principal">` |

---

## Labels

- Todo input deve ter `label` visível — placeholder **não** substitui label
- Campos obrigatórios: indicador visual `*` + `aria-required="true"`
- Grupos de radio/checkbox: `legend` ou label de grupo

---

## Estados acessíveis

- Error: cor + `error-message` text + `aria-invalid`
- Disabled: visual + `disabled` attribute (não apenas CSS)
- Loading: spinner + `aria-busy`
- Success toast: auto-dismiss com tempo suficiente para leitura (4s mínimo)

---

## Alto contraste

Respeitar `prefers-contrast: more` (futuro):

```css
@media (prefers-contrast: more) {
  :root {
    --color-border-default: var(--color-neutral-400);
  }
}
```

Por ora, paleta base já atende contraste elevado.

---

## Checklist por componente

- [ ] Contraste AA verificado
- [ ] Focus visible funcional
- [ ] Navegável por teclado
- [ ] Labels/aria em icon buttons
- [ ] Erros anunciáveis (texto, não só cor)
- [ ] Não depende exclusivamente de cor para significado
