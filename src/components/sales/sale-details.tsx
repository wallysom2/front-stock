"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sale } from "@/types/sale"
import { formatCurrency } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react"

interface SaleDetailsProps {
  open: boolean
  setOpen: (open: boolean) => void
  sale: Sale
}

export function SaleDetails({ open, setOpen, sale }: SaleDetailsProps) {
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "BOLETO":
        return "Boleto"
      case "PIX":
        return "PIX"
      case "CARTAO_CREDITO":
        return "Cartão de Crédito"
      default:
        return method
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Venda #{sale.id}</DialogTitle>
          <DialogDescription>
            Venda realizada em {sale.createdAt}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Dados do Cliente</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Nome</p>
                <p>{sale.cliente.nome}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Documento</p>
                <p>{sale.cliente.documento}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p>{sale.cliente.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Telefone</p>
                <p>{sale.cliente.telefone}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">Endereço</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Rua</p>
                <p>{sale.cliente.endereco.rua}, {sale.cliente.endereco.numero}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Complemento</p>
                <p>{sale.cliente.endereco.complemento || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bairro</p>
                <p>{sale.cliente.endereco.bairro}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cidade/Estado</p>
                <p>{sale.cliente.endereco.cidade}/{sale.cliente.endereco.estado}</p>
              </div>
              <div>
                <p className="text-muted-foreground">CEP</p>
                <p>{sale.cliente.endereco.cep}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">Produtos</h3>
            <div className="grid gap-2">
              {sale.produtos.map((produto, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Produto</p>
                    <p>{produto.nome}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fabricante</p>
                    <p>{produto.fabricante}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantidade</p>
                    <p>{produto.quantidade}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preço Unitário</p>
                    <p>{formatCurrency(produto.precoUnitario)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {sale.compras && sale.compras.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Compras Relacionadas</h3>
              <div className="grid gap-4">
                {sale.compras.map((compra, index) => (
                  <div key={index} className="border-t pt-2 first:border-t-0 first:pt-0">
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <p className="text-muted-foreground">Fornecedor</p>
                        <p>{compra.fornecedor.nomeFantasia}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Data</p>
                        <p>{compra.createdAt}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Valor Total</p>
                        <p>{formatCurrency(compra.valorTotal)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Forma de Pagamento</p>
                        <p>{formatPaymentMethod(compra.formaPagamento)}</p>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      {compra.produtos.map((produto: { nome: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; fabricante: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; quantidade: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; precoUnitario: number }, prodIndex: Key | null | undefined) => (
                        <div key={prodIndex} className="grid grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Produto</p>
                            <p>{produto.nome}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Fabricante</p>
                            <p>{produto.fabricante}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Quantidade</p>
                            <p>{produto.quantidade}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Preço Unitário</p>
                            <p>{formatCurrency(produto.precoUnitario)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h3 className="font-semibold mb-2">Informações de Pagamento</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Forma de Pagamento</p>
                <p>{formatPaymentMethod(sale.formaPagamento)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Valor Total</p>
                <p className="text-lg font-semibold">{formatCurrency(sale.valorTotal)}</p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
