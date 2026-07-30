# Identificador sem campo `codigo` cadastrável

Para produto, tabela de preço, categoria, condição de pagamento e centro de custo:

- **Não existe mais input de código** no frontend
- O identificador é o **`id` (Guid)** gerado pelo banco
- No backend, a coluna `codigo` (legado/unicidade) é preenchida automaticamente com o próprio `id` sem hífens (`Guid.ToString("N")`)

Mantidos com código digitável (abreviação semântica): unidade de medida (`KG`, `UN`) e unidade operacional (`MATRIZ`).

## Backend

- `CodigoGerador.APartirDoId(Guid)` → `id.ToString("N").ToUpperInvariant()`
- Create das entidades acima: `Codigo = APartirDoId(Id)`
- Edit: **não altera** `Codigo`
- Requests de create/edit: `codigo` ignorado / opcional

## Frontend

Forms/payloads sem `codigo` nos 5 cadastros. Listagens e selects usam nome/descrição. Respostas da API ainda podem trazer `codigo` (espelho do id em registros novos).

## Fora do escopo

- Códigos auxiliares do produto (EAN etc.)
- `codigoBarras`, `codigoRastreamento`, `codigoProdutoXml`
