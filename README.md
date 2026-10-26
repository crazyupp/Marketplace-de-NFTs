# NFT Marketplace — Desafio Frontend Jungle Gaming

Marketplace de NFTs em React + TypeScript, com backend simulado via MSW.

🔗 **Deploy:** https://marketplace-de-nf-ts-alpha.vercel.app/

## Status da entrega

Com o prazo de 2 dias, priorizei a **fundação técnica**: a stack configurada e publicada e a base do backend simulado, com contratos tipados, dados determinísticos, persistência e cenários de falha. As telas ainda não foram implementadas. Abaixo explico o que foi feito, as decisões e como eu seguiria.

| Parte | Situação |
| --- | --- |
| Vite + React + TypeScript, deploy na Vercel | ✅ Pronto |
| Tailwind CSS v4 + shadcn/ui + alias `@/` | ✅ Pronto |
| TanStack Router, TanStack Query, Axios | ✅ Instalados |
| Contratos tipados (REST e eventos) | ✅ Pronto |
| Cálculo decimal de ETH (big.js) | ✅ Pronto |
| Fixtures determinísticas, banco simulado, cenários de falha | ✅ Pronto |
| Handlers MSW e ativação do worker | ⏳ Próximo passo |
| Telas, Socket.IO, Playwright, Lighthouse | ⏳ Não iniciado |

## Como rodar

Requisitos: Node.js 22+ e npm.

```bash
npm install
npm run dev
```

Acesse http://localhost:5173

Outros comandos:

```bash
npm run build     # build de produção
npm run preview   # serve o build localmente
npm run lint      # ESLint
npx tsc -b        # verificação de tipos
```

## Variáveis de ambiente (`.env`)

| Variável | Valor | Uso |
| --- | --- | --- |
| `VITE_ENABLE_MOCKS` | `true` | Liga a camada de mocks (MSW) |
| `VITE_API_URL` | `https://api.nft-mock.local` | URL base da API, interceptada pelo MSW |
| `VITE_REALTIME_URL` | `wss://realtime.nft-mock.local` | URL do Socket.IO (simulado) |

O `.env` está versionado porque não contém segredos e é necessário para o mock funcionar no deploy.

## Estrutura

```
src/
  components/ui/      # componentes shadcn/ui
  lib/
    api/contracts.ts  # contratos tipados compartilhados entre app e mocks
    money.ts          # aritmética decimal de ETH
    utils.ts          # cn() para classes do Tailwind
  mocks/
    fixtures.ts       # dados iniciais determinísticos
    db.ts             # estado do backend simulado, persistido no localStorage
    scenarios.ts      # latência e falhas configuráveis
```

## Decisões técnicas

- **Contratos tipados em um único arquivo.** O app e os mocks importam os mesmos tipos, então qualquer mudança de formato é apontada pelo TypeScript nos dois lados.
- **ETH como string decimal + big.js.** `number` perde precisão em decimais (`0.1 + 0.2 ≠ 0.3`). Os valores trafegam como string, os cálculos usam big.js e o arredondamento acontece só na exibição.
- **Mocks na camada de rede.** O MSW intercepta as requisições HTTP. Componentes, hooks e o cliente Axios não contêm dados fictícios: trocar pelo backend real é só desligar `VITE_ENABLE_MOCKS`.
- **Dados determinísticos.** As fixtures usam um gerador pseudoaleatório com semente fixa, então todo reset produz os mesmos dados. Isso é essencial para testes E2E e regressão visual.
- **Persistência e reset.** O estado do mock fica em um objeto salvo no `localStorage` a cada alteração, e `resetDb()` restaura integralmente o cenário inicial.
- **Senhas em hash.** O banco simulado guarda apenas o hash SHA-256 (Web Crypto API). Em produção eu usaria bcrypt ou argon2 no servidor, com salt.
- **Campos para tempo real e snapshot já previstos.** NFTs e pedidos têm `version`, e eventos têm `eventId`, para descartar duplicatas e eventos antigos. O pedido guarda cópia de nomes e preços, para que o recibo não mude se o catálogo mudar.

## Cenários de falha

Selecionados pela URL (`?scenario=nome`) e persistidos no navegador. Volte ao normal com `?scenario=default`.

| Cenário | Comportamento |
| --- | --- |
| `default` | Latência de 100 ms |
| `slow` | Latência de 2,5 s |
| `out-of-order` | Atrasos fixos alternados, respostas fora de ordem |
| `offline` | Falha de rede |
| `server-error` | Catálogo responde HTTP 500 |
| `favorite-fail` | Favoritar responde HTTP 503 (rollback otimista) |
| `price-change` | Preço muda após a cotação |
| `order-timeout` | Pedido criado, resposta demora 15 s (idempotência) |
| `payment-rejected` | Pagamento recusado |

A lógica dos cenários está pronta em `scenarios.ts` e será acionada pelos handlers do MSW no próximo passo.

## Dados de teste

- Usuários: `ana@example.com` e `bruno@example.com`, senha `Senha@123`
- Cupons: `JUNGLE10` (válido, 10%) e `EXPIRED20` (expirado)
- NFT #7: todas as edições esgotadas
- NFTs #1 a #3: destaques

## Limitações atuais

- O worker do MSW ainda não é iniciado: faltam os handlers REST e a ativação em `main.tsx`.
- As imagens das fixtures vêm do picsum.photos, temporariamente. A intenção é substituí-las pelos assets do Figma, servidos localmente.
- As cores e fontes do Figma ainda não foram aplicadas.

## Próximos passos

1. Handlers MSW (NFTs, favoritos, auth, carrinho, cotação, pedidos) e ativação do worker
2. Rotas com TanStack Router: catálogo com busca, filtros e paginação no estado da URL
3. Cliente Axios com interceptors de token e sessão expirada; queries e mutations com TanStack Query
4. Identidade visual do Figma (tokens no Tailwind e assets locais)
5. Detalhe, login/cadastro, carrinho com cupom, checkout com chave de idempotência e recibo
6. Socket.IO via `@mswjs/socket.io-binding` (`nft.updated` e `order.updated`, com deduplicação por `eventId` e ordenação por `version`)
7. Testes E2E e de regressão visual com Playwright; auditoria com Lighthouse