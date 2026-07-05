# 12 — Data Display

> AgroPulse é data-centric — dashboards, tabelas operacionais, KPIs de safra.

---

## Table (`q-table`)

### Padrão AgroPulse

```vue
<q-table
  flat
  bordered
  row-key="id"
  :rows="rows"
  :columns="columns"
  :loading="loading"
  v-model:pagination="paginacao"
  @request="onRequest"
>
  <template #top>
    <div class="row full-width items-center q-gutter-sm">
      <q-input v-model="busca" outlined dense placeholder="Buscar..." class="col-grow">
        <template #prepend><q-icon name="search" /></template>
      </q-input>
      <q-btn outline icon="filter_list" label="Filtros" />
      <q-btn outline icon="download" label="Exportar" />
    </div>
  </template>

  <template #body-cell-status="props">
    <q-td :props="props">
      <q-badge :color="statusCor(props.row.status)" :label="statusLabel(props.row.status)" />
    </q-td>
  </template>

  <template #no-data>
    <app-empty-state icon="inventory_2" titulo="Nenhum produto" />
  </template>
</q-table>
```

### Colunas

| Tipo | Alinhamento | Formato |
|---|---|---|
| Texto | left | truncate com tooltip se > 40 chars |
| Número | right | `formatarNumero()` |
| Moeda | right | `formatarMoeda()` |
| Data | left | DD/MM/YYYY |
| Status | center | Badge |
| Ações | center, fixed right | Icon buttons |

### Densidade

| Modo | Row height | Uso |
|---|---|---|
| Comfortable | 52px | **Padrão** |
| Compact | 40px | Tabelas > 50 rows visíveis |
| Spacious | 64px | Poucos registros, detalhe |

### Virtual scroll

Ativar para > 500 rows. Quasar `virtual-scroll` prop.

---

## Cards

### MetricTile (KPI)

Componente existente — label + value. Padrão dashboard.

Futuro:
```vue
<metric-tile
  label="Área plantada"
  value="1.240 ha"
  trend="+12%"
  trend-direction="up"
  icon="agriculture"
/>
```

### Data Card (listagem)

```vue
<q-card flat bordered>
  <q-card-section>
    <div class="text-overline">Safra 2025/26</div>
    <div class="text-h6">Soja</div>
    <div class="text-caption">340 ha · 3 talhões</div>
  </q-card-section>
  <q-card-actions>
    <q-btn flat color="primary" label="Ver detalhes" />
  </q-card-actions>
</q-card>
```

Mobile: cards substituem tabelas.

---

## List (`q-list`)

Para navegação secundária, seleção, menus de configuração.

- `q-item` height: 48px
- Avatar/icon à esquerda
- Meta info à direita (badge, data)
- Divider entre grupos

---

## Timeline

Futuro: componente para histórico de operações (plantio, colheita, aplicação).

Vertical, ícone semântico por tipo, data à esquerda, conteúdo à direita.

---

## Charts

Futuro: biblioteca leve (Chart.js ou ECharts tree-shaken).

### Paleta de gráficos
```
Série 1: color.primary.500
Série 2: color.secondary.500
Série 3: color.accent.500
Série 4: color.info.500
Série 5: color.success.400
```

Neutro para eixos: `color.neutral.300`.
Grid lines: `color.neutral.200`.

**Regra:** legendas sempre visíveis. Nunca depender só de cor — incluir labels/patterns.

---

## Statistics / KPIs

Dashboard grid:

```css
.dashboard-grid {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
```

Métricas prioritárias primeiro (esquerda/topo). Máximo 8 tiles por dashboard view.

Números: `font.weight.bold`, `font.size.2xl`.
Labels: `text-caption`.

---

## Tags

`q-chip` compacto:

```vue
<q-chip dense outline color="primary" label="Soja" />
```

Cores por categoria de domínio (cultura, status, região) — mapear em `constants/tags.ts`.

---

## Badges

Status operacionais:

| Status | Cor |
|---|---|
| Ativo | positive |
| Inativo | grey |
| Pendente | warning |
| Cancelado | negative |
| Em andamento | info |

Sempre com label textual — nunca badge sem texto.

---

## Formatação de dados

Usar `utils/formatters.ts`:

```typescript
formatarNumero(1240.5)    // "1.240,5"
formatarMoeda(1500)       // "R$ 1.500,00"
formatarData('2025-07-05') // "05/07/2025"
formatarArea(340)          // "340 ha"
```

Nunca formatar inline no template.

---

## Anti-patterns

- Tabela sem empty state
- Números sem alinhamento à direita
- Gráfico sem legenda
- KPI com animação count-up
- Cards com sombra pesada para cada row de tabela mobile
