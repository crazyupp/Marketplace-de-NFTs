import type { Nft, Order, Quote, Wallet } from '@/lib/api/contracts'
import { buildNfts, seedUsers, seedWallets } from './fixtures'

interface CartRow {
  nftId: string
  editionId: string
  quantity: number
}

export interface DbState {
  nfts: Nft[]
  users: { id: string; name: string; username: string; email: string; passwordHash: string }[]
  sessions: { token: string; userId: string; expiresAt: string }[]
  carts: Record<string, { rows: CartRow[]; couponCode: string | null }>
  favorites: Record<string, string[]>
  wallets: Record<string, Wallet[]>
  quotes: Record<string, Quote & { owner: string; fingerprint: string; rows: CartRow[] }>
  orders: (Order & { userId: string; finalizeAt: number; outcome: 'confirmed' | 'rejected' })[]
  idempotency: Record<string, { orderId: string; bodyHash: string }>
}

const KEY = 'nft-mock:db'
let state: DbState

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function seed(): Promise<DbState> {
  return {
    nfts: buildNfts(),
    users: await Promise.all(
      seedUsers.map(async ({ password, ...u }) => ({ ...u, passwordHash: await sha256(password) })),
    ),
    sessions: [],
    carts: {},
    favorites: { u1: ['nft-2'], u2: [] },
    wallets: structuredClone(seedWallets),
    quotes: {},
    orders: [],
    idempotency: {},
  }
}

export async function initDb() {
  const saved = localStorage.getItem(KEY)
  state = saved ? JSON.parse(saved) : await seed()
  save()
}

export async function resetDb() {
  state = await seed()
  save()
}

export const db = () => state

export function save() {
  localStorage.setItem(KEY, JSON.stringify(state))
}