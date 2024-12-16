"use client"

import { LayoutDashboard, Package, ShoppingCart, Users, ClipboardList, BarChart2, Bell, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    title: 'Vendas',
    icon: ShoppingCart,
    href: '/vendas'
  },
  {
    title: 'Compras',
    icon: ClipboardList,
    href: '/compras'
  },
  {
    title: 'Produtos',
    icon: Package,
    href: '/produtos'
  },
  {
    title: 'Fornecedores',
    icon: Users,
    href: '/fornecedores'
  },
  {
    title: 'Relatórios',
    icon: BarChart2,
    href: '/relatorios'
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">StockControl</h1>
        </div>
        <nav className="space-y-2 px-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-8">
          {children}
        </div>
      </main>
    </div>
  )
} 