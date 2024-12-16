"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  ShoppingCart, 
  Package, 
  LayoutDashboard,
  Users,
  FileText,
} from 'lucide-react'

const links = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Vendas',
    href: '/vendas',
    icon: ShoppingCart
  },
  {
    name: 'Produtos',
    href: '/produtos',
    icon: Package
  },
  {
    name: 'Fornecedores',
    href: '/fornecedores',
    icon: Users
  },
  {
    name: 'Relatórios',
    href: '/relatorios',
    icon: FileText
  }
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2">
      {links.map((link, index) => {
        const Icon = link.icon
        return (
          <Link
            key={index}
            href={link.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors",
              pathname === link.href ? "bg-accent" : "transparent"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.name}
          </Link>
        )
      })}
    </nav>
  )
} 