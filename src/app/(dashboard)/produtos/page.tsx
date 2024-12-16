"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Search,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

interface Product {
  id: number;
  nome: string;
  fabricante: string;
  precoUnitario: number;
  descricao?: string;
  categoria?: string;
  quantidadeEstoque?: number;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  dataCadastro?: string;
  dataAtualizacao?: string;
  status?: string;
  codigoBarras?: string;
}

interface FormData {
  nome: string
  fabricante: string
  precoUnitario: number
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    fabricante: "",
    precoUnitario: 0,
  })
  const { toast } = useToast()

  const loadProducts = async () => {
    try {
      const response = await api.getSales()
      const salesData = response.data

      // Extrair produtos únicos de todas as vendas
      const uniqueProducts = new Map<number, Product>()
      
      salesData.forEach(sale => {
        sale.produtos.forEach(produto => {
          if (!uniqueProducts.has(produto.id)) {
            uniqueProducts.set(produto.id, {
              id: produto.id,
              nome: produto.nome,
              fabricante: produto.fabricante,
              precoUnitario: produto.precoUnitario,
            })
          }
        })
      })

      const productsArray = Array.from(uniqueProducts.values())
      setProducts(productsArray)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleCreateProduct = async () => {
    try {
      await api.createProduct(formData)
      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso!"
      })
      loadProducts()
      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Erro ao criar produto:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o produto.",
        variant: "destructive"
      })
    }
  }

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return

    try {
      await api.updateProduct(selectedProduct.id, formData)
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!"
      })
      loadProducts()
      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      await api.deleteProduct(selectedProduct.id)
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!"
      })
      loadProducts()
      setDeleteDialogOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto.",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      nome: "",
      fabricante: "",
      precoUnitario: 0,
    })
    setSelectedProduct(null)
  }

  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.fabricante.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Produtos</h2>
            <p className="text-sm text-muted-foreground">Visualize seu catálogo de produtos</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                resetForm()
                setDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>

        <Card className="bg-white/10">
          {loading ? (
            <div className="p-4">Carregando...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-sm font-medium">Código</th>
                  <th className="text-left p-4 text-sm font-medium">Nome</th>
                  <th className="text-left p-4 text-sm font-medium">Fabricante</th>
                  <th className="text-left p-4 text-sm font-medium">Preço</th>
                  <th className="text-right p-4 text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b border-border/50">
                    <td className="p-4 text-sm">#{product.id}</td>
                    <td className="p-4 text-sm">{product.nome}</td>
                    <td className="p-4 text-sm">{product.fabricante}</td>
                    <td className="p-4 text-sm">{formatCurrency(product.precoUnitario)}</td>
                    <td className="p-4 text-sm text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedProduct(product)
                          setFormData({
                            nome: product.nome,
                            fabricante: product.fabricante,
                            precoUnitario: product.precoUnitario,
                          })
                          setDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedProduct(product)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription>
              {selectedProduct 
                ? "Edite as informações do produto." 
                : "Preencha as informações para criar um novo produto."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome do Produto</Label>
              <Input
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Fabricante</Label>
              <Input
                value={formData.fabricante}
                onChange={e => setFormData({ ...formData, fabricante: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Preço Unitário</Label>
              <Input
                type="number"
                value={formData.precoUnitario}
                onChange={e => setFormData({ ...formData, precoUnitario: Number(e.target.value) })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDialogOpen(false)
              resetForm()
            }}>
              Cancelar
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={selectedProduct ? handleUpdateProduct : handleCreateProduct}
            >
              {selectedProduct ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false)
              setSelectedProduct(null)
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteProduct}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}