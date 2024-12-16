"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Search, 
  DollarSign, 
  PackageCheck, 
  TrendingUp, 
  Eye,
  Store,
  ShoppingBag,
  Truck,
  ShoppingCart,
  Plus
} from "lucide-react"
import { Purchase } from "@/types/purchase"
import { Sale } from "@/types/sale"
import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { PurchaseDetails } from "@/components/purchases/purchase-details"
import { PurchaseCreateDialog } from "@/components/purchases/purchase-create-dialog"

export default function ComprasPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [pendingSales, setPendingSales] = useState<Sale[]>([])
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalItems: 0,
    activeSuppliers: 0,
    pendingPurchases: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null)
  const { toast } = useToast()

  const loadPurchases = async () => {
    try {
      const [purchasesResponse, salesResponse] = await Promise.all([
        api.getPurchases(),
        api.getSales()
      ])

      const purchasesData = purchasesResponse.data
      const salesData = salesResponse.data

      // Find sales that need purchases
      const salesWithPurchases = new Set(purchasesData.map(p => p.vendaId))
      const pendingSalesData = salesData.filter(sale => !salesWithPurchases.has(sale.id))

      setPurchases(purchasesData)
      setPendingSales(pendingSalesData)

      // Calculate stats
      const total = purchasesData.reduce((acc, purchase) => acc + purchase.valorTotal, 0)
      const totalItems = purchasesData.reduce((acc, purchase) => 
        acc + purchase.produtos.reduce((sum, prod) => sum + prod.quantidade, 0), 0)
      const uniqueSuppliers = new Set(purchasesData.map(purchase => purchase.fornecedor.cnpj)).size

      setStats({
        totalAmount: total,
        totalItems: totalItems,
        activeSuppliers: uniqueSuppliers,
        pendingPurchases: pendingSalesData.length
      })
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPurchases()
  }, [])

  const handleCreatePurchase = async (saleId: number, purchaseData: any) => {
    try {
      const sale = pendingSales.find(s => s.id === saleId)
      if (!sale) return

      // Usa os dados fornecidos pelo componente de criação
      const finalPurchaseData = {
        vendaId: sale.id,
        fornecedor: purchaseData.fornecedor,
        produtos: sale.produtos.map(prod => ({
          id: prod.id,
          nome: prod.nome,
          fabricante: prod.fabricante,
          quantidade: prod.quantidade,
          precoUnitario: prod.precoUnitario
        })),
        formaPagamento: purchaseData.formaPagamento
      }

      await api.createPurchase(finalPurchaseData)
      
      toast({
        title: "Sucesso",
        description: "Compra criada com sucesso!"
      })
      
      loadPurchases()
    } catch (error) {
      console.error("Erro ao criar compra:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a compra.",
        variant: "destructive"
      })
    }
  }

  const filteredPurchases = purchases.filter(purchase =>
    purchase.fornecedor.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.fornecedor.cnpj.includes(searchTerm) ||
    purchase.produtos.some(prod => 
      prod.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.fabricante.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Compras e Suprimentos</h2>
            <p className="text-sm text-muted-foreground">Gerencie o abastecimento de produtos para suas vendas</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Buscar por fornecedor ou produto..."
                className="pl-8 h-9 w-[300px] rounded-md bg-background border border-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Compra
              {stats.pendingPurchases > 0 && (
                <span className="ml-2 bg-purple-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {stats.pendingPurchases}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Pending Sales Alert */}
        {stats.pendingPurchases > 0 && (
          <Card className="bg-yellow-500/10 border-yellow-500/20 p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-yellow-500" />
              <div>
                <h3 className="font-medium text-yellow-500">Vendas Pendentes de Compra</h3>
                <p className="text-sm text-muted-foreground">
                  Existem {stats.pendingPurchases} venda{stats.pendingPurchases > 1 ? 's' : ''} que necessita{stats.pendingPurchases > 1 ? 'm' : ''} de compras para serem atendida{stats.pendingPurchases > 1 ? 's' : ''}.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="ml-auto"
                onClick={() => setCreateDialogOpen(true)}
              >
                Ver Vendas Pendentes
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 bg-white/15 hover:bg-white/20 transition-colors">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <PackageCheck className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Total de Itens Comprados</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{stats.totalItems} unidades</h3>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/15 hover:bg-white/20 transition-colors">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Investimento Total</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/15 hover:bg-white/20 transition-colors">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <Store className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Fornecedores Ativos</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{stats.activeSuppliers}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/15 hover:bg-white/20 transition-colors">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Compras Pendentes</p>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold">{stats.pendingPurchases}</h3>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-white/10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-sm font-medium">ID</th>
                <th className="text-left p-4 text-sm font-medium">Fornecedor</th>
                <th className="text-left p-4 text-sm font-medium">Data</th>
                <th className="text-left p-4 text-sm font-medium">Produtos</th>
                <th className="text-right p-4 text-sm font-medium">Valor Total</th>
                <th className="text-left p-4 text-sm font-medium">Venda Relacionada</th>
                <th className="text-center p-4 text-sm font-medium">Pagamento</th>
                <th className="text-center p-4 text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map(purchase => (
                <tr key={purchase.id} className="border-b border-border/50">
                  <td className="p-4 text-sm">#{purchase.id}</td>
                  <td className="p-4 text-sm">
                    <div>
                      <div className="font-medium">{purchase.fornecedor.nomeFantasia}</div>
                      <div className="text-xs text-muted-foreground">{purchase.fornecedor.cnpj}</div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{purchase.createdAt}</td>
                  <td className="p-4 text-sm">
                    <div className="flex flex-col gap-1">
                      {purchase.produtos.map((produto, index) => (
                        <div key={index} className="text-xs">
                          {produto.quantidade}x {produto.nome}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-right">{formatCurrency(purchase.valorTotal)}</td>
                  <td className="p-4 text-sm">
                    {purchase.venda ? (
                      <div>
                        <div className="font-medium">Venda #{purchase.venda.id}</div>
                        <div className="text-xs text-muted-foreground">{purchase.venda.cliente.nome}</div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-4 text-sm text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                      ${purchase.formaPagamento === "BOLETO" ? "bg-yellow-500/10 text-yellow-500" :
                        purchase.formaPagamento === "PIX" ? "bg-green-500/10 text-green-500" :
                        "bg-blue-500/10 text-blue-500"}`}>
                      {purchase.formaPagamento === "BOLETO" && "Boleto"}
                      {purchase.formaPagamento === "PIX" && "PIX"}
                      {purchase.formaPagamento === "CARTAO_CREDITO" && "Cartão"}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPurchase(purchase)
                          setDetailsOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Create Purchase Dialog */}
      <PurchaseCreateDialog
        open={createDialogOpen}
        setOpen={setCreateDialogOpen}
        pendingSales={pendingSales}
        onCreatePurchase={(saleId, purchaseData) => handleCreatePurchase(saleId, purchaseData)}
      />

      {/* View Details Dialog */}
      {selectedPurchase && (
        <PurchaseDetails
          open={detailsOpen}
          setOpen={setDetailsOpen}
          purchase={selectedPurchase}
        />
      )}
    </div>
  )
}
