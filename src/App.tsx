import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">NFT Marketplace</h1>
      <Button onClick={() => alert('shadcn funcionando!')}>Testar</Button>
    </main>
  )
}