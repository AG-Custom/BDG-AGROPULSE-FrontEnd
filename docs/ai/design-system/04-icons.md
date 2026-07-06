# 04 — Ícones

## Biblioteca

**Material Icons** (via `@quasar/extras/material-icons`) — já configurado no projeto.

### Por quê Material Icons?

- Integração nativa com Quasar (`q-icon name="..."`)
- Amplo catálogo cobrindo agronegócio (agriculture, eco, water, inventory)
- Peso visual consistente com UI premium limpa
- Sem bundle extra de SVG customizado

---

## Tamanho padrão

| Contexto | Tamanho | Quasar |
|---|---|---|
| Inline com texto sm | 16px | `size="16px"` |
| **Padrão** | 20px | `size="20px"` |
| Botões, list items | 24px | `size="24px"` |
| Header, empty state | 32px | `size="32px"` |
| Feature/hero | 48px | `size="48px"` |

**Token:** usar múltiplos de 4px. Nunca 22px, 18px arbitrários.

---

## Peso

Material Icons usa peso **Regular (400)** como padrão.

| Variante | Quando usar |
|---|---|
| Outlined | **Padrão AgroPulse** — leve, premium |
| Filled | Apenas ícone standalone em empty state ou nav ativo |
| Round | Não usar — inconsistente com identidade |
| Sharp | Não usar |

Configuração futura: migrar para `material-icons-outlined` se necessário distinção visual.

---

## Cor

| Contexto | Token |
|---|---|
| Padrão inline | `color.text.secondary` |
| Sobre botão primário | `color.text.inverse` |
| Nav ativo (sidebar) | `color.sidebar.accent` (accent.400) |
| Nav inativo (sidebar) | `color.sidebar.text.secondary` |
| Sucesso | `color.success.500` |
| Erro | `color.error.500` |
| Aviso | `color.warning.500` |
| Decorativo em empty state | `color.neutral.300` |

**Regra:** ícones informativos sempre acompanhados de texto ou `aria-label`.

---

## Ícones por contexto (agronegócio)

| Contexto | Ícone | Nome Material |
|---|---|---|
| Dashboard | `dashboard` | dashboard |
| Clientes | `groups` | groups |
| Produtos | `inventory_2` | inventory_2 |
| Pedidos | `shopping_cart` | shopping_cart |
| Safras | `agriculture` | agriculture |
| Talhões | `grid_on` | grid_on |
| Clima | `cloud` | cloud |
| Financeiro | `payments` | payments |
| Relatórios | `assessment` | assessment |
| Configurações | `settings` | settings |
| Sair | `logout` | logout |
| Adicionar | `add` | add |
| Editar | `edit` | edit |
| Excluir | `delete` | delete |
| Filtrar | `filter_list` | filter_list |
| Buscar | `search` | search |
| Exportar | `download` | download |
| Upload | `upload` | upload |
| Menu | `menu` | menu |
| Fechar | `close` | close |
| Sucesso | `check_circle` | check_circle |
| Erro | `error` | error |
| Aviso | `warning` | warning |
| Info | `info` | info |

---

## Regras para novos ícones

1. **Buscar primeiro** no catálogo Material Icons — evitar SVG custom
2. Se SVG custom necessário, salvar em `src/assets/icons/` como componente Vue em `components/ui/icons/`
3. Manter viewBox 24×24, stroke/fill via `currentColor`
4. Documentar nome e contexto de uso neste arquivo
5. Nunca misturar bibliotecas (Font Awesome, Heroicons) no mesmo contexto visual
6. Ícones de ação devem ter `aria-hidden="true"` se botão adjacente tem label textual

---

## Exemplos

### ✅ Correto

```vue
<q-item clickable :to="{ name: 'dashboard' }">
  <q-item-section avatar>
    <q-icon name="dashboard" size="20px" color="primary" />
  </q-item-section>
  <q-item-section>Dashboard</q-item-section>
</q-item>
```

### ❌ Incorreto

```vue
<!-- Ícone sem label e sem aria -->
<q-btn flat icon="delete" @click="excluir" />

<!-- Tamanho arbitrário -->
<q-icon name="agriculture" size="22px" />
```

**Correção:**

```vue
<q-btn flat icon="delete" aria-label="Excluir safra" @click="excluir" />
```
