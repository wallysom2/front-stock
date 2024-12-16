"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Search, DollarSign, Users, ShoppingCart, TrendingUp, Pencil, Trash2, Eye } from "lucide-react"
import { Sale } from "@/types/sale"
import api from "@/lib/api"
import { formatCurrency, formatDate } from "@/lib/utils"
import { SaleDialog } from "@/components/sales/sale-dialog"
import { SaleDetails } from "@/components/sales/sale-details"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function VendasPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [stats, setStats] = useState({
    totalAmount: 0,
    averageTicket: 0,
    totalOrders: 0,
    uniqueCustomers: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const { toast } = useToast()

  const loadSales = async () => {
    try {
      const response = await api.getSales()
      const salesData = response.data
      setSales(salesData)
console.log(salesData)
      // Calculate stats
      const total = salesData.reduce((acc, sale) => acc + sale.valorTotal, 0)
      const uniqueCustomers = new Set(salesData.map(sale => sale.cliente.documento)).size

      setStats({
        totalAmount: total,
        averageTicket: total / salesData.length || 0,
        totalOrders: salesData.length,
        uniqueCustomers
      })
    } catch (error) {
      console.error("Erro ao carregar vendas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as vendas.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSales()
  }, [])

  const handleCreateSale = async (data: any) => {
    try {
      await api.createSale(data)
      toast({
        title: "Sucesso",
        description: "Venda criada com sucesso!"
      })
      loadSales()
    } catch (error) {
      console.error("Erro ao criar venda:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a venda.",
        variant: "destructive"
      })
    }
  }

  const handleUpdateSale = async (data: any) => {
    if (!selectedSale) return

    try {
      await api.updateSale(selectedSale.id, data)
      toast({
        title: "Sucesso",
        description: "Venda atualizada com sucesso!"
      })
      loadSales()
    } catch (error) {
      console.error("Erro ao atualizar venda:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a venda.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteSale = async () => {
    if (!selectedSale) return

    try {
      await api.deleteSale(selectedSale.id)
      toast({
        title: "Sucesso",
        description: "Venda excluída com sucesso!"
      })
      loadSales()
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Erro ao excluir venda:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a venda.",
        variant: "destructive"
      })
    }
  }

  const filteredSales = sales.filter(sale =>
    sale.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.cliente.documento.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Vendas</h2>
            <p className="text-sm text-muted-foreground">Gerencie suas vendas e pedidos</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Buscar vendas..."
                className="pl-8 h-9 w-[250px] rounded-md bg-background border border-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => {
              setSelectedSale(null)
              setDialogOpen(true)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 bg-white/15 hover:bg-white/20 transition-colors">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Total de Vendas</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/15 hover:bg-white/20 transition-colors">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{formatCurrency(stats.averageTicket)}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/15 hover:bg-white/20 transition-colors">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/15 hover:bg-white/20 transition-colors">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Clientes Únicos</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{stats.uniqueCustomers}</h3>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-white/10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-sm font-medium">ID</th>
                <th className="text-left p-4 text-sm font-medium">Cliente</th>
                <th className="text-left p-4 text-sm font-medium">Data</th>
                <th className="text-left p-4 text-sm font-medium">Valor</th>
                <th className="text-left p-4 text-sm font-medium">Itens</th>
                <th className="text-left p-4 text-sm font-medium">Pagamento</th>
                <th className="text-left p-4 text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => (
                <tr key={sale.id} className="border-b border-border/50">
                  <td className="p-4 text-sm">#{sale.id}</td>
                  <td className="p-4 text-sm">{sale.cliente.nome}</td>
                  <td className="p-4 text-sm">{(sale.createdAt)}</td>
                  <td className="p-4 text-sm">{formatCurrency(sale.valorTotal)}</td>
                  <td className="p-4 text-sm">{sale.produtos.length} itens</td>
                  <td className="p-4 text-sm">
                    {sale.formaPagamento === "BOLETO" && "Boleto"}
                    {sale.formaPagamento === "PIX" && "PIX"}
                    {sale.formaPagamento === "CARTAO_CREDITO" && "Cartão de Crédito"}
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSale(sale)
                          setDetailsOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSale(sale)
                          setDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSale(sale)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <SaleDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onSubmit={selectedSale ? handleUpdateSale : handleCreateSale}
        initialData={selectedSale || undefined}
      />

      {/* View Details Dialog */}
      {selectedSale && (
        <SaleDetails
          open={detailsOpen}
          setOpen={setDetailsOpen}
          sale={selectedSale}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Venda</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSale}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}