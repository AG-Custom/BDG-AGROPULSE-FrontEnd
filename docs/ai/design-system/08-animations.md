# 08 — Animações

> Motion system **leve e performático**. Premium = responsivo, não espetacular.

## Princípios

1. **Nunca prejudicar performance** — sem blur, sem animações longas, sem parallax
2. **Funcional, não decorativo** — animação comunica estado, não enfeita
3. **Respeitar `prefers-reduced-motion`** — implementado em `app.scss`
4. **GPU-friendly** — preferir `opacity` e `transform`, evitar `width/height/top/left`

---

## Duration

| Token | Valor | Uso |
|---|---|---|
| `duration.instant` | 0ms | Reduced motion, toggles |
| `duration.fast` | 120ms | Hover, focus, color changes |
| `duration.normal` | 180ms | Modais fade, drawer, dropdowns |
| `duration.slow` | 240ms | Máximo permitido — page transitions |

**Regra absoluta:** nenhuma animação > 240ms.

---

## Easing

| Token | Curva | Uso |
|---|---|---|
| `ease.default` | cubic-bezier(0.4, 0, 0.2, 1) | Padrão |
| `ease.in` | cubic-bezier(0.4, 0, 1, 1) | Saída (close) |
| `ease.out` | cubic-bezier(0, 0, 0.2, 1) | Entrada (open) |
| `ease.in-out` | cubic-bezier(0.4, 0, 0.2, 1) | Movimentos bidirecionais |

**Proibido:** bounce, elastic, spring overshoot.

---

## Por contexto

### Hover
- Propriedades: `background-color`, `border-color`, `box-shadow`
- Duration: `duration.fast`
- Sem transform scale em botões (exceto icon buttons: max scale 1.02)

### Modal
- Entrada: fade in opacity 0→1, `duration.normal`
- Saída: fade out, `duration.fast`
- **Sem** scale(0.9→1), **sem** slide from bottom

### Drawer
- Slide lateral default Quasar — OK
- Overlay fade simultâneo
- Não customizar para animações mais longas

### Loading
- Spinner: rotação contínua (Quasar default)
- Skeleton: pulse opacity 0.5↔1, 1.5s — **sem shimmer gradient**

### Skeleton
```css
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
```

### Fade
- Page content: opcional fade in 120ms on mount — apenas em pages pesadas
- Tab panels: **sem** slide animation

### Slide
- Permitido: drawer, menu dropdown
- Proibido: transição entre rotas, carrosséis automáticos

---

## Proibido

| Pattern | Motivo |
|---|---|
| `backdrop-filter: blur()` | Performance GPU, visual pesado |
| Overlay fullscreen com fade 500ms+ | Bloqueia percepção de velocidade |
| `animate.css` / bibliotecas de animação | Peso de bundle desnecessário |
| Parallax scroll | Irrelevante para SaaS operacional |
| Confetti / celebrações | Inadequado para contexto agro profissional |
| Auto-play carrossel | Distrai de dados operacionais |
| Page transition slide | Cada navegação parece lenta |

---

## Transições CSS padrão

```css
.btn {
  transition: var(--transition-bg), var(--transition-border), var(--transition-shadow);
}

.modal-overlay {
  transition: var(--transition-opacity);
}
```

---

## Reduced motion

Global em `app.scss`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Toda animação custom deve funcionar sem motion quando esta media query está ativa.
