# AgroPulse legado — telas com dados mockados / sem integração real

| Campo | Valor |
|-------|-------|
| Sistema analisado | AgroPulse legado (React + Vite) |
| Caminho | `AGROPULSE2026/AGROPULSE2026` |
| Data | 2026-07-17 |
| Público | Cliente / acompanhamento de entrega |
| Escopo | Frontend legado — identificação de **mock** vs chamada de API |

---

## O que significa “mock” neste relatório

| Situação | O que o usuário vê | O que acontece de verdade |
|----------|--------------------|---------------------------|
| **Mock / simulado** | Tela abre, lista dados, botões “salvam” | Dados inventados no código (`MOCK_*`) ou a operação continua mesmo se a API falhar |
| **API com fallback** | Tela tenta carregar do servidor | Se o servidor não responder, a tela usa dados mock ou lista vazia |
| **Integração real (parcial)** | Depende do backend Django estar online | Há chamada HTTP real; ainda assim **não** significa SEFAZ, banco, eSocial etc. homologados |

**Importante:** mesmo quando a API responde, integrações externas (SEFAZ, boletos bancários, Serasa, eSocial, GPS, balança) no legado **não estão comprovadas como produção** — o padrão do código é simular ou engolir erro.

---

## Resumo executivo (para o cliente)

| Classificação | Módulos / telas |
|---------------|-----------------|
| **Predominantemente mock** — UI de demonstração | RH, BI (Relatórios), Logística (maior parte das abas), Manutenção, Safras (vários fluxos) |
| **Misto** — tenta API; se falhar, usa mock ou finge sucesso | Fiscal (emissão NF), Financeiro (parte), CRM, Cobrança, Contratos, Cadastros, Dashboard |
| **Mais próximo de API** — chama servidor; mock só como reserva | Estoque, Compras, Vendas (pedidos/PDV/caixa), Produção, SuperHost, Configurações (parte) |

> Conclusão: o legado **não deve ser apresentado como “tudo com integração real”**. Grande parte das telas funciona como **protótipo navegável** com dados mockados ou simulação quando o backend falha.

---

## Detalhamento por tela / módulo

### 1. Dashboard
| Item | Status |
|------|--------|
| KPIs principais | Tenta API (`/api/dashboard/`) |
| Alertas | Há dados **mock** (`MOCK_ALERTAS`) como reserva |
| **Para o cliente** | Pode parecer completo; alertas podem não refletir dados reais |

---

### 2. Cadastros
| Item | Status |
|------|--------|
| Produtos, clientes, fornecedores, colaboradores, veículos, fazendas, tabelas | Arrays **MOCK_*** no código |
| **Para o cliente** | Telas de cadastro com forte componente de demonstração |

---

### 3. Estoque
| Item | Status |
|------|--------|
| Entradas / saídas / transferência / inventário / alertas | Chamadas de API |
| Listas de produto/lote/movimentação | Também existem **MOCK_*** no arquivo |
| **Para o cliente** | Fluxos principais tentam servidor; se API cair, comportamento pode degradar para mock/vazio |

---

### 4. Compras
| Item | Status |
|------|--------|
| Importação XML, pedidos de compra, fornecedores, solicitações, cotações | Chamadas de API |
| Dados de demonstração | Existem **MOCK_NFE**, pedidos, fornecedores, etc. |
| **Para o cliente** | Fluxo desenhado para API; não garante SEFAZ real |

---

### 5. Vendas (pedidos, orçamentos, PDV, aprovações, devoluções, comissões)
| Item | Status |
|------|--------|
| Pedidos, orçamentos, caixa, PDV, aprovações, devoluções | Chamadas de API |
| Dados de demonstração | **MOCK_PEDIDOS**, orçamentos, aprovações, devoluções, comissões, produtos PDV |
| **Para o cliente** | Operação comercial tenta API; NFC-e/NF-e reais dependem do backend/fiscal |

---

### 6. Produção
| Item | Status |
|------|--------|
| Ordens, BOM, laudos, paradas, OEE | Chamadas de API (falha → lista vazia) |
| Dados de demonstração | **MOCK_ORDENS**, BOM, laudos, paradas, OEE |
| **Para o cliente** | UI pronta; integração IoT/balança **não** é real no legado |

---

### 7. Logística e Transporte — alto nível de mock
| Aba / função | Status |
|--------------|--------|
| Frota (veículos) | Tenta API (`/api/veiculos/`) |
| Programação de cargas | Dados **MOCK_CARGAS** |
| Romaneios | Dados **MOCK_ROMANEIOS** |
| Documentos de transporte | Dados **MOCK_DOCS** |
| Transportadoras / fretes | Dados **MOCK_TRANSPORTADORAS** |
| Abastecimento | Tenta API; se falhar → **mock** (`catch { /* mock */ }`) |
| Ocorrências | Dados **MOCK_OCORRENCIAS** |
| Relatório logístico | Endpoint de export; dados de apoio mock |
| GPS / rastreamento em tempo real | **Não há integração real** na UI |
| **Para o cliente** | Maior parte das abas é **demonstração**. Só frota está mais ligada à API |

---

### 8. RH — predominantemente mock
| Aba / função | Status |
|--------------|--------|
| Colaboradores, ponto, folha, afastamentos, EPI, treinamentos | Dados **MOCK_*** |
| Gerar folha | Tenta API; se falhar → **mock** |
| eSocial / FGTS | Tenta API; se falhar → **mock** (não é envio real ao governo) |
| Relatório de custo | Baseado em estruturas mock |
| **Para o cliente** | Tela completa para demo. **Não** há integração real eSocial/FGTS/folha homologada |

> No produto novo (Vue + .NET), o módulo RH está **fora de escopo**.

---

### 9. Safras
| Item | Status |
|------|--------|
| Fazendas, talhões, safras, aplicações, diário, OS agrícola, custeio | **MOCK_*** + posts com `catch { /* mock */ }` |
| OEE campo / rastreabilidade | Dados mock |
| **Para o cliente** | Fluxos navegáveis; gravação pode ser só local se a API falhar |

---

### 10. Financeiro
| Item | Status |
|------|--------|
| Contas a pagar / receber, fluxo, contas bancárias, aplicações, orçamento | Chamadas de API |
| Listas de demonstração | **MOCK_PAGAR**, RECEBER, FLUXO, CONTAS, etc. |
| Renegociação | Em falha mostra mensagem **“simulado”** |
| Boletos / OFX / Open Finance | **Não comprovados como integração bancária real** |
| **Para o cliente** | Telas operacionais com API; banking externo não é produção |

---

### 11. Fiscal — simulação explícita na emissão
| Item | Status |
|------|--------|
| Listagem documentos, cancelar, CC-e, contingência, Funrural, SPED, config | Chamadas de API |
| **Emitir NF-e / NFC-e** | Se a API falhar, a tela **ainda mostra “autorizada”** com mensagem: *“Autorizado (simulado — backend não conectado)”* |
| Dados de apoio | **MOCK_NOTAS**, contingência, GNRE, SPED, etc. |
| **Para o cliente** | **Não usar como prova de emissão SEFAZ real.** Emissão pode ser simulada no próprio navegador |

---

### 12. Cobrança e Crédito
| Item | Status |
|------|--------|
| Painel, aging, PDD, fichas, lista diária, disputa, acordos | Tenta API; há **MOCK_*** de reserva |
| Serasa / SPC | **Não há integração real** evidenciada no front |
| **Para o cliente** | Painéis e fluxos de demo/API; bureau de crédito não é real |

---

### 13. Contratos agrícolas (CPR / Barter / Termo)
| Item | Status |
|------|--------|
| CRUD, entrega, liquidação, alertas, cotação | Tenta API; erros podem ser engolidos (`.catch(() => {})`) |
| Dados de demonstração | **MOCK_CPRS**, BARTERS, TERMOS, ALERTAS |
| Cotação CBOT/ESALQ | Depende da API; não há garantia de mercado real |
| **Para o cliente** | Telas prontas; liquidação fiscal/estoque real não comprovada |

---

### 14. Manutenção
| Item | Status |
|------|--------|
| Ativos, planos, OS, peças, checklists | **MOCK_*** |
| Salvar ativo / OS | `catch { /* mock */ }` — segue mesmo se API falhar |
| Telemetria | **Não há integração real** |
| **Para o cliente** | Demonstração de módulo; não operar frota/máquinas com base só nesta tela |

---

### 15. CRM
| Item | Status |
|------|--------|
| Produtores, visitas | API com fallback |
| Oportunidades, crédito, amostras, campanhas | API; se falhar → **MOCK_*** |
| Dashboard do consultor | KPIs calculados em cima de **MOCK_VISITAS / MOCK_PRODUTORES / etc.** |
| WhatsApp / e-mail | **Não há provider real** no front |
| **Para o cliente** | Relacionamento navegável; comunicação automática e parte dos KPIs podem ser mock |

---

### 16. BI / Relatórios gerenciais — mock (e ainda vazio)
| Item | Status |
|------|--------|
| Dashboard, DRE, margem por lote, rentabilidade, inadimplência, equipe, alertas | Estruturas **MOCK_*** |
| Conteúdo atual dos mocks | Arrays **vazios** (`[]`) — telas abrem sem dados reais de demonstração populados |
| Power BI / export real de BI | **Não há integração Power BI** evidenciada |
| **Para o cliente** | Módulo **não funciona com integração real**; UI de layout apenas |

---

### 17. Matriz consolidado
| Item | Status |
|------|--------|
| Consolidado / detalhe filial | Tenta API; existe **MOCK_CONSOLIDADO** de reserva |
| **Para o cliente** | Depende do backend; fallback mock possível |

---

### 18. Configurações / Header
| Item | Status |
|------|--------|
| Config comercial, 2FA | Chamadas de API |
| Logs de auditoria | **MOCK_LOGS** |
| Notificações (header) | API; se falhar → **MOCK_NOTIFICACOES** |
| **Para o cliente** | Parte real (se API up); auditoria/notificações podem ser mock |

---

### 19. SuperHost (admin plataforma)
| Item | Status |
|------|--------|
| Clientes, plano, unidades, bloquear, acessar | Chamadas de API |
| **Para o cliente** | Mais próximo de integração real com o backend Django (quando online) |

---

## Lista rápida — o que comunicar ao cliente

### Telas / áreas **não** confiáveis como integração real (mock ou simulação forte)

1. **RH** (folha, ponto, eSocial, FGTS, EPI)  
2. **BI / Relatórios** (dashboard gerencial do legado)  
3. **Logística** (cargas, romaneios, docs, transportadoras, ocorrências; abastecimento com fallback mock)  
4. **Manutenção** (ativos/OS com mock)  
5. **Safras** (vários saves com mock)  
6. **Fiscal — emissão de nota** (pode mostrar “autorizada” **simulada**)  
7. **CRM — dashboard e campanhas** (KPIs/mock e sem WhatsApp/e-mail real)  
8. **Cadastros** (forte uso de MOCK)  
9. Qualquer fluxo que dependa de **SEFAZ, banco, Serasa, GPS, eSocial** — tratar como **não entregue em produção** no legado  

### Telas que **tentam** API (ainda assim dependem do servidor e não provam integração externa)

- Estoque (movimentações)  
- Compras (XML / pedidos)  
- Vendas (pedido, PDV, caixa, aprovações)  
- Produção (OP / BOM)  
- Financeiro (CAP/CR — sem banking real comprovado)  
- SuperHost  

---

## Nota sobre o sistema novo (Vue + .NET)

Este relatório cobre apenas o **legado React**.  

No stack novo (`new_agropulse_frontend` + `new_agropulse_backend`):

- O domínio interno está mais estruturado (grava no banco via API .NET).  
- Integrações externas (Focus/SEFAZ, boletos, Serasa, Power BI, etc.) ainda podem estar em **stub no backend** — ver os arquivos `*-OK.md` e o [README](./README.md) desta pasta.  
- **RH** no produto novo: **fora de escopo**.  
- **Logística** no produto novo: **domínio OK** (ver [logistica-transporte-OK.md](./logistica-transporte-OK.md)); integrações GPS/CT-e/MDF-e permanecem futuras.

---

## Glossário rápido (cliente)

| Termo | Significado |
|-------|-------------|
| Mock | Dados ou comportamento inventados no código para a tela parecer pronta |
| Stub / simulado | Resposta falsa de “sucesso” (ex.: NF autorizada sem SEFAZ) |
| Fallback | Se a API falha, a tela usa mock ou continua como se tivesse salvo |
| Integração real | Comunicação efetiva com SEFAZ, banco, bureau, governo, hardware, etc. |

---

*Documento gerado a partir da análise estática do código-fonte do frontend legado. Não substitui testes de homologação com ambientes externos (SEFAZ, bancos, eSocial).*
