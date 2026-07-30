# Permissões por perfil — gaps FE (2026-07-30)

Alinhamento da matriz e guards do frontend com o documento de perfis (RH fora de escopo de produto).

## Decisões

- **Operacional:** matriz permanece como tabela do doc (`Financeiro` Visualizar; CRM/Safras Visualizar).
- **Vendedor:** `OverridesSlugPorPerfil` em [`matriz-permissoes.ts`](../../src/constants/matriz-permissoes.ts) concede `clientes.editar` sem elevar Cadastros (evita `tabelas-preco.editar`).
- **Custos/margem:** UI gated **somente** por `useVerCustos` (API `/api/permissoes/{id}`); defaults por perfil no BE (`PermissaoGranularDefaults`) — sem `if (perfil === …)` nas telas.
- **Auditoria:** página `/auditoria` sob Administração; permissão `auditoria.visualizar` na área Configurações.
- **Ações destrutivas:** `messageService.confirmarDestrutivo` (justificativa + digitar `CONFIRMAR`).
- **Unidade/carteira:** contrato em `api-contract/auth.md`; FE não refiltra multiunidade.

## Backend relacionado

- `BDG.AGRO.Domain/Auth/Services/PermissaoGranularDefaults.cs`
- `BDG.AGRO.Domain/Auth/Services/PermissaoGranularDomainService.cs`
- `api-contract/permissoes.md`
