"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { Sale } from "@/types/sale"
import { ShoppingCart, Plus } from "lucide-react"

interface PurchaseCreateDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  pendingSales: Sale[]
  onCreatePurchase: (saleId: number, purchaseData: any) => void
}

export function PurchaseCreateDialog({ 
  open, 
  setOpen, 
  pendingSales,
  onCreatePurchase 
}: PurchaseCreateDialogProps) {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    fornecedor: {
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      email: "",
      telefone: "",
      endereco: {
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: ""
      },
      contato: {
        nome: "",
        email: "",
        telefone: "",
        cargo: ""
      }
    },
    formaPagamento: "CARTAO_CREDITO" as "BOLETO" | "PIX" | "CARTAO_CREDITO"
  })

  const handleSubmit = () => {
    if (selectedSale) {
      onCreatePurchase(selectedSale.id, formData)
      handleReset()
    }
  }

  const handleReset = () => {
    setOpen(false)
    setSelectedSale(null)
    setShowForm(false)
    setFormData({
      fornecedor: {
        razaoSocial: "",
        nomeFantasia: "",
        cnpj: "",
        email: "",
        telefone: "",
        endereco: {
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: ""
        },
        contato: {
          nome: "",
          email: "",
          telefone: "",
          cargo: ""
        }
      },
      formaPagamento: "CARTAO_CREDITO"
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Compra</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!showForm ? (
            <>
              <div>
                <Label>Selecione uma venda para criar uma compra dos produtos necessários:</Label>
                <div className="grid gap-4 mt-2">
                  {pendingSales.map(sale => {
                    const totalItems = sale.produtos.reduce((acc, prod) => acc + prod.quantidade, 0)
                    
                    return (
                      <Card 
                        key={sale.id} 
                        className={`p-4 cursor-pointer transition-colors
                          ${selectedSale?.id === sale.id ? 'bg-purple-500/20' : 'hover:bg-white/10'}`}
                        onClick={() => setSelectedSale(sale)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">Venda #{sale.id}</div>
                            <div className="text-sm text-muted-foreground mb-2">{sale.cliente.nome}</div>
                            
                            <div className="space-y-1">
                              {sale.produtos.map((produto, index) => (
                                <div key={index} className="text-sm flex items-center gap-2">
                                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                  {produto.quantidade}x {produto.nome} ({produto.fabricante})
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Valor Total</div>
                            <div className="font-medium">{formatCurrency(sale.valorTotal)}</div>
                            <div className="text-sm text-muted-foreground mt-2">Total de Itens</div>
                            <div className="font-medium">{totalItems} unidades</div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>

                {pendingSales.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Não há vendas pendentes de compra no momento.
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => setShowForm(true)}
                    disabled={!selectedSale}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Continuar
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="bg-purple-500/10 p-4 rounded-lg">
                  <div className="font-medium">Venda Selecionada: #{selectedSale?.id}</div>
                  <div className="text-sm text-muted-foreground">Cliente: {selectedSale?.cliente.nome}</div>
                </div>

                <Label>Dados do Fornecedor</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Razão Social"
                      value={formData.fornecedor.razaoSocial}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: { ...prev.fornecedor, razaoSocial: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Nome Fantasia"
                      value={formData.fornecedor.nomeFantasia}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: { ...prev.fornecedor, nomeFantasia: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="CNPJ"
                      value={formData.fornecedor.cnpj}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: { ...prev.fornecedor, cnpj: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Email"
                      type="email"
                      value={formData.fornecedor.email}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: { ...prev.fornecedor, email: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Telefone"
                      value={formData.fornecedor.telefone}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: { ...prev.fornecedor, telefone: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Rua"
                      value={formData.fornecedor.endereco.rua}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: {
                          ...prev.fornecedor,
                          endereco: { ...prev.fornecedor.endereco, rua: e.target.value }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Número"
                      value={formData.fornecedor.endereco.numero}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: {
                          ...prev.fornecedor,
                          endereco: { ...prev.fornecedor.endereco, numero: e.target.value }
                        }
                      }))}
                    />
                  </div>
                  <Input
                    placeholder="Complemento"
                    value={formData.fornecedor.endereco.complemento}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      fornecedor: {
                        ...prev.fornecedor,
                        endereco: { ...prev.fornecedor.endereco, complemento: e.target.value }
                      }
                    }))}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="Bairro"
                      value={formData.fornecedor.endereco.bairro}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: {
                          ...prev.fornecedor,
                          endereco: { ...prev.fornecedor.endereco, bairro: e.target.value }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Cidade"
                      value={formData.fornecedor.endereco.cidade}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: {
                          ...prev.fornecedor,
                          endereco: { ...prev.fornecedor.endereco, cidade: e.target.value }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Estado"
                      value={formData.fornecedor.endereco.estado}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: {
                          ...prev.fornecedor,
                          endereco: { ...prev.fornecedor.endereco, estado: e.target.value }
                        }
                      }))}
                    />
                  </div>
                  <Input
                    placeholder="CEP"
                    value={formData.fornecedor.endereco.cep}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      fornecedor: {
                        ...prev.fornecedor,
                        endereco: { ...prev.fornecedor.endereco, cep: e.target.value }
                      }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contato</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Nome do Contato"
                      value={formData.fornecedor.contato.nome}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: {
                          ...prev.fornecedor,
                          contato: { ...prev.fornecedor.contato, nome: e.target.value }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Cargo"
                      value={formData.fornecedor.contato.cargo}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: {
                          ...prev.fornecedor,
                          contato: { ...prev.fornecedor.contato, cargo: e.target.value }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Email do Contato"
                      type="email"
                      value={formData.fornecedor.contato.email}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: {
                          ...prev.fornecedor,
                          contato: { ...prev.fornecedor.contato, email: e.target.value }
                        }
                      }))}
                    />
                    <Input
                      placeholder="Telefone do Contato"
                      value={formData.fornecedor.contato.telefone}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        fornecedor: {
                          ...prev.fornecedor,
                          contato: { ...prev.fornecedor.contato, telefone: e.target.value }
                        }
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Forma de Pagamento</Label>
                  <Select
                    value={formData.formaPagamento}
                    onValueChange={value => setFormData(prev => ({ 
                      ...prev, 
                      formaPagamento: value as "BOLETO" | "PIX" | "CARTAO_CREDITO"
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BOLETO">Boleto</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedSale || !formData.fornecedor.razaoSocial || !formData.fornecedor.cnpj}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Compra
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
