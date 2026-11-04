import type { Metadata } from 'next'
import { AdvisorDesk } from '@/components/advisor/advisor-desk'

export const metadata: Metadata = { title: 'Advisor desk — Harvest IQ' }

export default function AdvisorPage() {
  return <AdvisorDesk />
}
