# 15 — Boas Práticas

---

## O que fazer

### Tokens e consistência
- ✅ Usar `var(--token)` para toda cor, spacing, radius, shadow
- ✅ Usar componentes Quasar como base, customizar via tokens
- ✅ Reutilizar `MetricTile`, `AppPageHeader`, `useNotificacao`
- ✅ Manter paleta agro (verde, neutro quente, accent mínimo)

### Performance visual
- ✅ Skeleton para layouts conhecidos com fetch > 200ms
- ✅ Button loading para ações
- ✅ Table linear progress para fetch tabular
- ✅ Animações ≤ 240ms
- ✅ Respeitar `prefers-reduced-motion`

### UX operacional
- ✅ Empty states com CTA claro
- ✅ Confirmação para ações destrutivas
- ✅ Toast para feedback de CRUD
- ✅ Erros inline em formulários
- ✅ Labels visíveis em todo input

### Layout premium
- ✅ Superfícies flat com border sutil
- ✅ Whitespace generoso (24px page padding)
- ✅ Hierarquia tipográfica clara
- ✅ Dados alinhados e formatados via utils

---

## O que evitar

### Visual pesado
- ❌ Glassmorphism / backdrop-filter blur
- ❌ Gradientes decorativos
- ❌ Sombras dramáticas (shadow-10+)
- ❌ Animações bounce/elastic
- ❌ Dark mode não solicitado
- ❌ Ilustrações stock genéricas

### Performance
- ❌ Fullscreen loading overlay
- ❌ Spinner em tela inteira
- ❌ Skeleton em fetch < 200ms
- ❌ Animações > 240ms
- ❌ Count-up animado em KPIs
- ❌ Parallax / scroll-linked animations

### Código
- ❌ Cores/spacing hardcoded
- ❌ `Notify.create` direto em components
- ❌ Estilos inline (`style="color: red"`)
- ❌ Componentes > 150 linhas sem split
- ❌ Quasar `filled` inputs (usar `outlined`)
- ❌ Quasar `glossy` / `elevated` buttons

---

## Exemplos corretos

### Card de métrica
```vue
<metric-tile label="Pedidos" :value="formatarNumero(total)" />
```

### Formulário
```vue
<q-form @submit.prevent="salvar">
  <q-input v-model="nome" outlined label="Nome *" :rules="[obrigatorio]" />
  <q-btn color="primary" unelevated type="submit" label="Salvar" :loading="salvando" />
</q-form>
```

### Estilo com tokens
```vue
<style scoped>
.panel {
  background: var(--color-surface-default);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-6);
}
</style>
```

### Feedback
```typescript
try {
  await store.salvar(dados);
  notificacao.sucesso('Registro salvo.');
} catch (error) {
  notificacao.erro(tratarErro.mensagem(error));
}
```

---

## Anti-patterns

### ❌ Dashboard genérico fintech
```vue
<div style="background: linear-gradient(135deg, #667eea, #764ba2)">
  <q-spinner-hourglass size="100px" />
</div>
```

### ❌ Tabela sem UX
```vue
<q-table :rows="[]" />  <!-- sem no-data slot, sem loading -->
```

### ❌ Modal pesado
```vue
<q-dialog transition-show="scale" transition-hide="scale">
  <!-- scale bounce animation -->
</q-dialog>
```

### ❌ Input sem label
```vue
<q-input v-model="x" placeholder="Digite seu nome" />
```

### ❌ Hardcoded everything
```vue
<style scoped>
.box { padding: 24px; background: #fff; border-radius: 8px; }
</style>
```

---

## Checklist de UI antes de PR

- [ ] Zero valores hardcoded de cor/spacing/radius/shadow
- [ ] Componentes Quasar usam variantes AgroPulse (outlined, unelevated, flat)
- [ ] Loading apropriado (button/skeleton/table — não fullscreen)
- [ ] Empty state para listas
- [ ] Formulários com labels e validação
- [ ] Responsivo testado (375, 768, 1280px)
- [ ] Focus visible funcional
- [ ] Icon buttons com aria-label
- [ ] Notificações via `useNotificacao`
- [ ] Nenhuma animação > 240ms ou blur

---

## Referência cruzada

| Necessidade | Documento |
|---|---|
| Cor de status | [01-foundations.md](./01-foundations.md) |
| Token exato | [02-tokens.md](./02-tokens.md) |
| Componente específico | [03-components.md](./03-components.md) |
| Layout shell | [05-layout.md](./05-layout.md) |
| Mobile | [06-responsiveness.md](./06-responsiveness.md) |
| Animação | [08-animations.md](./08-animations.md) |
| Form | [10-forms.md](./10-forms.md) |
