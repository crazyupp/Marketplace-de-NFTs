import { delay, HttpResponse } from 'msw'

export const scenarios = {
  default: 'Normal',
  slow: 'Latência de 2,5s',
  'out-of-order': 'Respostas fora de ordem',
  offline: 'Sem conexão',
  'server-error': 'Catálogo com erro 500',
  'favorite-fail': 'Favoritar falha (rollback)',
  'price-change': 'Preço muda após a cotação',
  'order-timeout': 'Pedido demora 15s para responder',
  'payment-rejected': 'Pagamento recusado',
} as const

export type Scenario = keyof typeof scenarios

const KEY = 'nft-mock:scenario'

export function getScenario(): Scenario {
  const fromUrl = new URLSearchParams(location.search).get('scenario')
  if (fromUrl && fromUrl in scenarios) localStorage.setItem(KEY, fromUrl)
  const saved = localStorage.getItem(KEY)
  return saved && saved in scenarios ? (saved as Scenario) : 'default'
}

export function setScenario(s: Scenario) {
  localStorage.setItem(KEY, s)
}

const outOfOrderDelays = [1500, 200, 900, 100]
let counter = 0

export async function latency() {
  const s = getScenario()
  if (s === 'slow') return delay(2500)
  if (s === 'out-of-order') return delay(outOfOrderDelays[counter++ % outOfOrderDelays.length])
  return delay(100)
}

export function failure(kind: 'catalog' | 'favorite' | 'any') {
  const s = getScenario()
  if (s === 'offline') return HttpResponse.error()
  if (s === 'server-error' && kind === 'catalog') return HttpResponse.json({ code: 'TRANSIENT', message: 'Erro no servidor' }, { status: 500 })
  if (s === 'favorite-fail' && kind === 'favorite') return HttpResponse.json({ code: 'TRANSIENT', message: 'Falha ao favoritar' }, { status: 503 })
  return null
}