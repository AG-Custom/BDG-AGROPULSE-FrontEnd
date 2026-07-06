# 10 — Formulários

> Formulários são core do AgroPulse — cadastro de safras, clientes, pedidos, talhões.

---

## Princípios

1. Label sempre visível (outlined inputs)
2. Validação clara e próxima ao campo
3. Submit explícito — sem auto-save silencioso (exceto rascunhos futuros)
4. Feedback imediato sem bloquear a tela

---

## Estrutura padrão

```vue
<q-form @submit.prevent="salvar" @validation-error="onValidationError">
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-6">
      <q-input v-model="form.nome" outlined label="Nome" class="field-required" :rules="[obrigatorio]" />
    </div>
  </div>
  <div class="agro-form-actions">
    <q-btn flat label="Cancelar" @click="cancelar" />
    <q-btn color="primary" unelevated type="submit" label="Salvar" :loading="salvando" />
  </div>
</q-form>
```

Gap entre campos: `var(--form-gap)` = 16px.
Gap entre seções: `var(--section-gap)` = 24px.

Inputs `outlined` têm fundo `color.surface.default` (branco), borda `color.border.strong` no hover e borda 2px `color.primary.500` no focus. Hints (`q-field__bottom`) em `color.text.tertiary` — estilos globais em `app.scss`.

---

## Validação

| Momento | Quando |
|---|---|
| On blur | Campos individuais (opcional) |
| On submit | Formulário completo — **padrão** |
| On change | Switches, selects críticos |

Regras via `:rules="[]"` do Quasar ou validação manual com erros da API.

Erros da API via `useTratarErroFormulario()`:

```typescript
const { mensagem, errosPorCampo } = useTratarErroFormulario();

catch (error) {
  const campos = errosPorCampo(error);
  if (Object.keys(campos).length) {
    erros.value = mapearErrosApi(campos);
  } else {
    notificacao.erro(mensagem(error));
  }
}
```

---

## Mensagens

| Tipo | Posição | Estilo |
|---|---|---|
| Error | Abaixo do campo | `color.error.500`, `font.size.sm` |
| Helper | Abaixo do field | `color.text.secondary`, `font.size.sm` |
| Form error | Topo do form (banner) | `q-banner` negative |

**Tom:** direto e operacional — "Informe o CPF do produtor" (não "Ops! Algo deu errado").

---

## Máscaras e campos numéricos

**Regra obrigatória:** campos com formato fixo (CNPJ, CEP, telefone, número de endereço) **nunca** devem usar apenas `formatarXxx()` via computed — isso não bloqueia letras nem excesso de dígitos na digitação.

Use sempre:

1. **`mask` do Quasar** — bloqueia caracteres inválidos em tempo real
2. **`maxlength`** — limita o tamanho formatado
3. **`inputmode="numeric"`** — teclado numérico no mobile
4. **Constantes centralizadas** — `constants/masks.ts`
5. **Validador em `utils/validators.ts`** — conferência no submit
6. **Payload limpo** — `apenasDigitos()` ao montar request na store/service

### Referência de máscaras

| Campo | Arquivo | Máscara Quasar | Dígitos | Tamanho formatado |
|---|---|---|---|---|
| CNPJ | `constants/masks.ts` | `##.###.###/####-##` | 14 | 18 |
| CEP | `constants/masks.ts` | `#####-###` | 8 | 9 |
| Telefone fixo | `constants/masks.ts` | `(##) ####-####` | 10 | 14 |
| Telefone celular | `constants/masks.ts` | `(##) #####-####` | 11 | 15 |
| Número (endereço) | `constants/masks.ts` | `##########` | até 10 | 10 |

Telefone usa máscara **dinâmica** — alterna entre fixo e celular conforme o usuário digita (funções `mascaraTelefone` / `tamanhoFormatadoTelefone`).

### Exemplo correto

```vue
<script setup lang="ts">
import { MASCARAS, TAMANHO_FORMATADO } from 'constants/masks';
import { cep, obrigatorio } from 'utils/validators';
</script>

<template>
  <q-input
    v-model="form.cep"
    outlined
    label="CEP *"
    hint="8 dígitos"
    :mask="MASCARAS.CEP"
    :maxlength="TAMANHO_FORMATADO.CEP"
    inputmode="numeric"
    :rules="[obrigatorio, cep]"
  />
</template>
```

### Payload para API

Exibir formatado no form; enviar só dígitos:

```typescript
import { apenasDigitos } from 'utils/formatters';

cnpj: apenasDigitos(form.cnpj),
telefone: apenasDigitos(form.telefone),
cep: apenasDigitos(form.cep),
```

### Anti-patterns

```vue
<!-- ❌ Computed com formatarCep — letras passam na digitação -->
<q-input v-model="cepFormatado" />

<!-- ❌ Máscara hardcoded no template -->
<q-input mask="#####-###" />

<!-- ❌ Sem maxlength — usuário cola texto longo -->
<q-input :mask="MASCARAS.CEP" />

<!-- ❌ Enviar valor formatado para API -->
cnpj: form.cnpj.trim()
```

`utils/formatters.ts` (`formatarCnpj`, `formatarCep`, etc.) permanece para formatação programática (ex.: exibir dado vindo da API). **Não** usar como único controle de input.

Futuro: CPF, área (ha), moeda — seguir o mesmo padrão em `constants/masks.ts`.

---

## Required

- Indicador visual: classe `field-required` no `q-input`/`q-select` — asterisco vermelho via CSS global (`app.scss`)
- Usar prop `label` nativa do Quasar — **não** usar slot `#label` com componente Vue (quebra o label flutuante)
- Validação: rule `obrigatorio` reutilizável
- `aria-required="true"` no input

```vue
<q-input
  v-model="form.nome"
  outlined
  label="Nome"
  class="field-required"
  aria-required="true"
  :rules="[obrigatorio]"
/>
```

CSS em `src/css/app.scss`:

```scss
.field-required .q-field__label::after {
  color: var(--color-error-500);
  content: '*';
  margin-left: 2px;
}
```

---

## Wizard / passos

- Cada passo com campos obrigatórios deve ter `q-form` com `greedy` e expor `validar()` via `defineExpose`
- Botão "Continuar" só avança após `await form.validar()` retornar `true`
- Passos futuros no stepper: `:disable="true"` até o passo anterior ser validado
- Remover `header-nav` se a navegação for linear e dependente de validação

---

## Ações do formulário

Botões de ação (Continuar, Salvar, Voltar) alinhados à **direita** via classe global `.agro-form-actions` (`app.scss`) — rodapé com border-top:

```css
.agro-form-actions {
  border-top: var(--border-width-thin) solid var(--color-border-default);
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-5);
}
```

Usada em `UnidadeFormPage`, `CnpjFormPage` e `FornecedorFormPage`.

Ordem sugerida (esquerda → direita): secundário (Voltar/Cancelar) → primário (Continuar/Salvar).

---

## Placeholder

- Uso **secundário** — nunca substituir label
- Exemplo: `"Ex: Soja 2025/26"` em campo com label "Nome da safra"
- Cor: `color.text.tertiary`

---

## Helper Text

Informação permanente sobre o campo:

```vue
<q-input hint="Código usado na integração com o ERP" />
```

Diferente de placeholder — helper é instrução, placeholder é exemplo.

---

## Feedback

| Ação | Feedback |
|---|---|
| Submit success | Toast sucesso + redirect ou reset |
| Submit error | Erros inline + toast se erro genérico |
| Submit loading | Button `:loading`, form `:disable` implícito |
| Field valid | Sem feedback visual (evitar check verde em todo campo) |

---

## Loading

- **Button loading** durante submit — padrão
- **Primeiro carregamento** (modo edição): `AgroFormSkeleton` no lugar do form — **não** `q-inner-loading`
- **Nunca** overlay fullscreen sobre form
- Disable todos inputs durante submit se operação crítica

---

## Seções de formulário longo

```vue
<section class="form-section">
  <h3 class="text-h5 q-mb-md">Dados da propriedade</h3>
  <!-- campos -->
</section>
```

Sticky actions footer em forms > 2 viewport heights (mobile).

---

## Anti-patterns

```vue
<!-- ❌ Placeholder como label -->
<q-input placeholder="Nome" />

<!-- ❌ Validação só via toast -->
<q-form @submit="salvar" /> <!-- sem rules, erro só no toast -->

<!-- ❌ 3 colunas em mobile -->
<div class="col-4"> <!-- usar col-12 col-md-4 -->

<!-- ❌ Botão salvar no topo -->
```
