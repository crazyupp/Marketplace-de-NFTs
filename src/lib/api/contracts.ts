// Tipos compartilhados entre o app e os mocks.
// Valores em ETH sempre como string decimal ("0.125").

export type EthString = string

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'STOCK_CONFLICT'
  | 'QUOTE_OUTDATED'
  | 'TRANSIENT'

export interface ApiError {
  code: ApiErrorCode
  message: string
  fields?: Record<string, string>
}

export interface User {
  id: string
  name: string
  email: string
  username: string
  avatarUrl: string | null
}

export interface Session {
  token: string
  expiresAt: string
  user: User
}

export type NftCategory = 'art' | 'collectibles' | 'music' | 'photography' | 'video' | 'utility'

export interface NftEdition {
  id: string
  label: string
  price: EthString
  available: number
  maxPerOrder: number
}

export interface Nft {
  id: string
  name: string
  description: string
  category: NftCategory
  artist: { name: string; avatarUrl: string }
  images: string[]
  editions: NftEdition[]
  featured: boolean
  createdAt: string
  version: number
}

export interface NftSummary {
  id: string
  name: string
  category: NftCategory
  artistName: string
  imageUrl: string
  floorPrice: EthString
  totalAvailable: number
}

export type NftSort = 'recent' | 'price_asc' | 'price_desc'

export interface NftListParams {
  q?: string
  category?: NftCategory
  sort?: NftSort
  onlyAvailable?: boolean
  page?: number
}

export interface Paginated<T> {
  items: T[]
  page: number
  totalPages: number
  total: number
}

export interface CartLine {
  nftId: string
  editionId: string
  quantity: number
  nftName: string
  imageUrl: string
  editionLabel: string
  unitPrice: EthString
  available: number
}

export interface Cart {
  lines: CartLine[]
  couponCode: string | null
  subtotal: EthString
  discount: EthString
}

export type Network = 'ethereum' | 'polygon'

export interface Quote {
  id: string
  subtotal: EthString
  discount: EthString
  networkFee: EthString
  total: EthString
  network: Network
  expiresAt: string
}

export interface Wallet {
  id: string
  label: string
  address: string
  network: Network
  primary: boolean
}

export type OrderStatus = 'pending' | 'confirmed' | 'rejected'

export interface CreateOrderInput {
  quoteId: string
  walletId: string
  buyerName: string
  buyerEmail: string
}

export interface OrderLine {
  nftId: string
  editionId: string
  nftName: string
  editionLabel: string
  quantity: number
  unitPrice: EthString
}

export interface Order {
  id: string
  status: OrderStatus
  lines: OrderLine[]
  subtotal: EthString
  discount: EthString
  networkFee: EthString
  total: EthString
  network: Network
  walletAddress: string
  txHash: string | null
  rejectionReason: string | null
  createdAt: string
  version: number
}

// Eventos em tempo real: eventId (dedupe), resourceId e version (ordem)
interface EventBase<T extends string, P> {
  eventId: string
  type: T
  resourceId: string
  version: number
  payload: P
}

export type NftUpdatedEvent = EventBase<'nft.updated', { editions: Pick<NftEdition, 'id' | 'price' | 'available'>[] }>
export type OrderUpdatedEvent = EventBase<'order.updated', Pick<Order, 'status' | 'txHash' | 'rejectionReason'>>