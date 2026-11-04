'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/farmer', label: 'Farmer' },
  { href: '/advisor', label: 'Advisor' },
  { href: '/knowledge', label: 'Knowledge' },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        <div className="flex flex-col leading-tight">
          <span className="font-semibold">Harvest IQ</span>
          <span className="font-mono text-xs text-muted-foreground">Iowa corn advisory · ISU Extension · USDA · CIMMYT · CGIAR</span>
        </div>
        <nav className="flex gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'rounded px-3 py-1.5 text-sm transition-colors hover:bg-muted',
                pathname === href ? 'bg-muted font-medium' : 'text-muted-foreground',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
