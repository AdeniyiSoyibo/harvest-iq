import type { Metadata } from 'next'
import { FarmerConsole } from '@/components/farmer/farmer-console'

export const metadata: Metadata = {
  title: 'Harvest IQ — Iowa Corn Adviser',
  description:
    'Ask any Iowa corn question — nitrogen, replanting, diseases, weeds, pests, harvest, economics. Answers grounded in ISU Extension and USDA-ARS research.',
}

export default function FarmerPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <FarmerConsole />
    </main>
  )
}
