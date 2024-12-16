"use client"

import { Purchase } from "@/types/purchase"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"

interface PurchaseDetailsProps {
  open: boolean
  setOpen: (open: boolean) => void
  purchase: Purchase
}

export function PurchaseDetails({ open, setOpen, purchase }: PurchaseDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Compra #{purchase.id}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Informações do Fornecedor</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Razão Social:</span> {purchase.fornecedor.razaoSocial}</p>
              <p><span className="text-muted-foreground">Nome Fantasia:</span> {purchase.fornecedor.nomeFantasia}</p>
              <p><span className="text-muted-foreground">CNPJ:</span> {purchase.fornecedor.cnpj}</p>
              <p><span className="text-muted-foreground">Email:</span> {purchase.fornecedor.email}</p>
              <p><span className="text-muted-foreground">Telefone:</span> {purchase.fornecedor.telefone}</p>
            </div>

            <h3 className="font-semibold mt-4 mb-2">Endereço</h3>
            <div className="space-y-1 text-sm">
              <p>
                {purchase.fornecedor.endereco.rua}, {purchase.fornecedor.endereco.numero}
                {purchase.fornecedor.endereco.complemento && ` - ${purchase.fornecedor.endereco.complemento}`}
              </p>
              <p>
                {purchase.fornecedor.endereco.bairro} - {purchase.fornecedor.endereco.cidade}/{purchase.fornecedor.endereco.estado}
              </p>
              <p>CEP: {purchase.fornecedor.endereco.cep}</p>
            </div>

            <h3 className="font-semibold mt-4 mb-2">Contato</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Nome:</span> {purchase.fornecedor.contato.nome}</p>
              <p><span className="text-muted-foreground">Cargo:</span> {purchase.fornecedor.contato.cargo}</p>
              <p><span className="text-muted-foreground">Email:</span> {purchase.fornecedor.contato.email}</p>
              <p><span className="text-muted-foreground">Telefone:</span> {purchase.fornecedor.contato.telefone}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Informações da Compra</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Data:</span> {purchase.createdAt}</p>
              <p><span className="text-muted-foreground">Forma de Pagamento:</span> {
                purchase.formaPagamento === "BOLETO" ? "Boleto" :
                purchase.formaPagamento === "PIX" ? "PIX" :
                "Cartão de Crédito"
              }</p>
              <p><span className="text-muted-foreground">Valor Total:</span> {formatCurrency(purchase.valorTotal)}</p>
            </div>

            <h3 className="font-semibold mt-4 mb-2">Produtos</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 text-xs font-medium">Produto</th>
                    <th className="text-left p-2 text-xs font-medium">Fabricante</th>
                    <th className="text-right p-2 text-xs font-medium">Qtd</th>
                    <th className="text-right p-2 text-xs font-medium">Preço</th>
                    <th className="text-right p-2 text-xs font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.produtos.map((produto, index) => (
                    <tr key={index} className="border-t border-border/50">
                      <td className="p-2 text-sm">{produto.nome}</td>
                      <td className="p-2 text-sm">{produto.fabricante}</td>
                      <td className="p-2 text-sm text-right">{produto.quantidade}</td>
                      <td className="p-2 text-sm text-right">{formatCurrency(produto.precoUnitario)}</td>
                      <td className="p-2 text-sm text-right">{formatCurrency(produto.quantidade * produto.precoUnitario)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr>
                    <td colSpan={4} className="p-2 text-sm font-medium text-right">Total:</td>
                    <td className="p-2 text-sm font-medium text-right">{formatCurrency(purchase.valorTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {purchase.venda && (
              <>
                <h3 className="font-semibold mt-4 mb-2">Venda Relacionada</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">ID da Venda:</span> #{purchase.venda.id}</p>
                  <p><span className="text-muted-foreground">Cliente:</span> {purchase.venda.cliente.nome}</p>
                  <p><span className="text-muted-foreground">Documento:</span> {purchase.venda.cliente.documento}</p>
                  <p><span className="text-muted-foreground">Valor da Venda:</span> {formatCurrency(purchase.venda.valorTotal)}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
