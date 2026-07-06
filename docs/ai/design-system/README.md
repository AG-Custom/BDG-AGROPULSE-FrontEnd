# AgroPulse Design System

> Sistema de design oficial da plataforma SaaS AgroPulse — gerenciamento e operação do agronegócio.

## Princípios

1. **Premium agro** — paleta natural (verde campo, terra, colheita), tipografia limpa, espaço respirável
2. **Performance first** — sem animações pesadas, blur, overlays opacos ou carregamentos desnecessários
3. **Dados em foco** — dashboards densos mas legíveis; hierarquia clara para decisões operacionais
4. **Tokens, não valores** — nunca hardcodar cores, espaços ou sombras nos componentes
5. **Quasar como base** — componentes primitivos via Quasar, customizados via tokens e wrappers AgroPulse

## Filosofia visual

O AgroPulse transmite **confiança profissional** para produtores, gestores e operadores rurais. A interface evoca:

- **Campo e crescimento** — verde primário `#1e8a4a`
- **Identidade brand-forward** — verde-floresta escuro (`forest.800`–`950`) no shell (sidebar, painel de marca do login)
- **Tecnologia confiável** — azul secundário `#2f5f73`
- **Produtividade e colheita** — accent âmbar `#d98a20` (uso pontual)
- **Neutralidade quente** — cinzas com subtom verde, nunca cinza frio corporativo genérico
- **Tipografia com personalidade** — **Sora** no display/headings, **Inter** no corpo, **JetBrains Mono** em valores numéricos de dados

**Evitar:** glassmorphism, gradientes chamativos, animações longas, skeleton em toda tela, spinners fullscreen, backdrop-filter blur.

## Implementação

| Camada | Localização |
|---|---|
| Tokens SCSS/CSS | `src/css/tokens/` |
| Variáveis Quasar | `src/css/quasar.variables.scss` |
| Estilos globais | `src/css/app.scss` |
| Componentes UI | `src/components/ui/` |
| Layout | `src/layouts/`, `src/components/layout/` |

## Índice

| # | Documento | Conteúdo |
|---|---|---|
| 01 | [Foundations](./01-foundations.md) | Cores, tipografia, espaçamento, bordas, sombras |
| 02 | [Tokens](./02-tokens.md) | Referência completa de design tokens |
| 03 | [Components](./03-components.md) | Catálogo de componentes |
| 04 | [Icons](./04-icons.md) | Material Icons, tamanhos, regras |
| 05 | [Layout](./05-layout.md) | Shell, sidebar, header, containers |
| 06 | [Responsiveness](./06-responsiveness.md) | Breakpoints, mobile-first |
| 07 | [States](./07-states.md) | Estados visuais universais |
| 08 | [Animations](./08-animations.md) | Motion system leve |
| 09 | [Accessibility](./09-accessibility.md) | WCAG, focus, ARIA |
| 10 | [Forms](./10-forms.md) | Validação, máscaras, feedback |
| 11 | [Feedback](./11-feedback.md) | Toast, alert, empty state |
| 12 | [Data Display](./12-data-display.md) | Tabelas, cards, métricas |
| 13 | [Navigation](./13-navigation.md) | Sidebar, breadcrumb, tabs |
| 14 | [Conventions](./14-conventions.md) | Nomenclatura, props, organização |
| 15 | [Best Practices](./15-best-practices.md) | Do's and don'ts |

## Regras Cursor

Regras ativas em `.cursor/rules/designsystem/` — aplicadas automaticamente ao gerar UI.
