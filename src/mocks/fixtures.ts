import type { Nft, NftCategory, Wallet } from '@/lib/api/contracts'

// gerador com semente fixa: todo reset gera os mesmos dados
function seeded(seed: number) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

const categories: NftCategory[] = ['art', 'collectibles', 'music', 'photography', 'video', 'utility']
const words = ['Distant', 'Neon', 'Silent', 'Cosmic', 'Golden', 'Liquid', 'Lunar', 'Velvet']
const things = ['Galaxy', 'Dreams', 'Orbit', 'Garden', 'Signal', 'Machine', 'Wave', 'Echo']
const artists = ['Dish Studio', 'Shroomie', 'Keepitreal', 'Animakid', 'Moondancer']

export function buildNfts(): Nft[] {
  const rnd = seeded(2024)
  return Array.from({ length: 40 }, (_, i) => {
    const n = i + 1
    const editions = Array.from({ length: 1 + Math.floor(rnd() * 3) }, (_, e) => {
      const available = n === 7 ? 0 : Math.floor(rnd() * 10)
      return {
        id: `nft-${n}-ed-${e + 1}`,
        label: `Edição ${e + 1}`,
        price: (0.01 + Math.round(rnd() * 2500) / 1000).toFixed(3),
        available,
        maxPerOrder: Math.max(1, Math.min(5, available)),
      }
    })
    return {
      id: `nft-${n}`,
      name: `${words[i % words.length]} ${things[(i * 3) % things.length]} #${n}`,
      description: 'Peça digital de tiragem limitada.',
      category: categories[i % categories.length],
      artist: { name: artists[i % artists.length], avatarUrl: `https://picsum.photos/seed/artist-${i % artists.length}/120/120` },
      images: [`https://picsum.photos/seed/nft-${n}-a/600/560`, `https://picsum.photos/seed/nft-${n}-b/600/560`],
      editions,
      featured: n <= 3,
      createdAt: new Date(Date.UTC(2026, 0, n)).toISOString(),
      version: 1,
    }
  })
}

export const seedUsers = [
  { id: 'u1', name: 'Ana Colecionadora', username: 'ana', email: 'ana@example.com', password: 'Senha@123' },
  { id: 'u2', name: 'Bruno Trader', username: 'bruno', email: 'bruno@example.com', password: 'Senha@123' },
]

export const seedWallets: Record<string, Wallet[]> = {
  u1: [
    { id: 'w1', label: 'Principal', address: '0x1111111111111111111111111111111111111111', network: 'ethereum', primary: true },
    { id: 'w2', label: 'Secundária', address: '0x2222222222222222222222222222222222222222', network: 'polygon', primary: false },
  ],
  u2: [{ id: 'w3', label: 'Principal', address: '0x3333333333333333333333333333333333333333', network: 'ethereum', primary: true }],
}

export const coupons: Record<string, { percent: number; expiresAt: string }> = {
  JUNGLE10: { percent: 10, expiresAt: '2099-01-01T00:00:00Z' },
  EXPIRED20: { percent: 20, expiresAt: '2020-01-01T00:00:00Z' },
}

export const networkFees = { ethereum: '0.0042', polygon: '0.0003' }