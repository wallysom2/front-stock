"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sale } from "@/types/sale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SaleDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  initialData?: Sale
}

export function SaleDialog({ open, setOpen, onSubmit, initialData }: SaleDialogProps) {
  const [formData, setFormData] = useState({
    cliente: {
      nome: initialData?.cliente.nome || "",
      documento: initialData?.cliente.documento || "",
      email: initialData?.cliente.email || "",
      telefone: initialData?.cliente.telefone || "",
      endereco: {
        rua: initialData?.cliente.endereco.rua || "",
        numero: initialData?.cliente.endereco.numero || "",
        complemento: initialData?.cliente.endereco.complemento || "",
        bairro: initialData?.cliente.endereco.bairro || "",
        cidade: initialData?.cliente.endereco.cidade || "",
        estado: initialData?.cliente.endereco.estado || "",
        cep: initialData?.cliente.endereco.cep || "",
      }
    },
    produtos: initialData?.produtos || [{ id: 0, nome: "", fabricante: "", quantidade: 0, precoUnitario: 0 }],
    formaPagamento: initialData?.formaPagamento || "BOLETO"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    setOpen(false)
  }

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      produtos: [...prev.produtos, { id: 0, nome: "", fabricante: "", quantidade: 0, precoUnitario: 0 }]
    }))
  }

  const updateProduct = (index: number, field: string, value: any) => {
    const newProdutos = [...formData.produtos]
    newProdutos[index] = { ...newProdutos[index], [field]: value }
    setFormData(prev => ({ ...prev, produtos: newProdutos }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{initialData ? "Editar Venda" : "Nova Venda"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Atualize os dados da venda" : "Preencha os dados para criar uma nova venda"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Dados do Cliente</Label>
              <Input
                placeholder="Nome do Cliente"
                value={formData.cliente.nome}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  cliente: { ...prev.cliente, nome: e.target.value }
                }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Documento"
                  value={formData.cliente.documento}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    cliente: { ...prev.cliente, documento: e.target.value }
                  }))}
                />
                <Input
                  placeholder="Telefone"
                  value={formData.cliente.telefone}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    cliente: { ...prev.cliente, telefone: e.target.value }
                  }))}
                />
              </div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.cliente.email}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  cliente: { ...prev.cliente, email: e.target.value }
                }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Endereço</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Rua"
                  value={formData.cliente.endereco.rua}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    cliente: {
                      ...prev.cliente,
                      endereco: { ...prev.cliente.endereco, rua: e.target.value }
                    }
                  }))}
                />
                <Input
                  placeholder="Número"
                  value={formData.cliente.endereco.numero}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    cliente: {
                      ...prev.cliente,
                      endereco: { ...prev.cliente.endereco, numero: e.target.value }
                    }
                  }))}
                />
              </div>
              <Input
                placeholder="Complemento"
                value={formData.cliente.endereco.complemento}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  cliente: {
                    ...prev.cliente,
                    endereco: { ...prev.cliente.endereco, complemento: e.target.value }
                  }
                }))}
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Bairro"
                  value={formData.cliente.endereco.bairro}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    cliente: {
                      ...prev.cliente,
                      endereco: { ...prev.cliente.endereco, bairro: e.target.value }
                    }
                  }))}
                />
                <Input
                  placeholder="Cidade"
                  value={formData.cliente.endereco.cidade}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    cliente: {
                      ...prev.cliente,
                      endereco: { ...prev.cliente.endereco, cidade: e.target.value }
                    }
                  }))}
                />
                <Input
                  placeholder="Estado"
                  value={formData.cliente.endereco.estado}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    cliente: {
                      ...prev.cliente,
                      endereco: { ...prev.cliente.endereco, estado: e.target.value }
                    }
                  }))}
                />
              </div>
              <Input
                placeholder="CEP"
                value={formData.cliente.endereco.cep}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  cliente: {
                    ...prev.cliente,
                    endereco: { ...prev.cliente.endereco, cep: e.target.value }
                  }
                }))}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label>Produtos</Label>
                <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                  Adicionar Produto
                </Button>
              </div>
              {formData.produtos.map((produto, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <Input
                    placeholder="Nome do Produto"
                    value={produto.nome}
                    onChange={e => updateProduct(index, "nome", e.target.value)}
                  />
                  <Input
                    placeholder="Fabricante"
                    value={produto.fabricante}
                    onChange={e => updateProduct(index, "fabricante", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Quantidade"
                    value={produto.quantidade}
                    onChange={e => updateProduct(index, "quantidade", Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Preço Unitário"
                    value={produto.precoUnitario}
                    onChange={e => updateProduct(index, "precoUnitario", Number(e.target.value))}
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-2">
              <Label>Forma de Pagamento</Label>
              <Select
                value={formData.formaPagamento}
                onValueChange={(value: "PIX" | "BOLETO" | "CARTAO_CREDITO") => setFormData(prev => ({ ...prev, formaPagamento: value }))}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Salvar Alterações" : "Criar Venda"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
