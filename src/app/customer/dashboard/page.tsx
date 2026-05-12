import { CustomerGallery } from './CustomerGallery'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
export const dynamic = 'force-dynamic'

export default async function CustomerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    if (process.env.npm_lifecycle_event === 'build' || process.env.NEXT_PHASE === 'phase-production-build') {
      return <div>Customer Dashboard (Build Mode)</div>
    }
    redirect('/customer/login')
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-white">Hello, Customer</h1>
            <p className="text-neutral-400 mt-2">Find and download your event photos securely.</p>
          </div>
        </header>

        <CustomerGallery />
      </div>
    </div>
  )
}
