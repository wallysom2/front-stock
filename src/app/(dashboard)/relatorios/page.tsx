"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { FileDown, FileText } from "lucide-react"
import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => void;
}

export default function RelatoriosPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const gerarRelatorioVendas = async () => {
    setLoading(true)
    try {
      const response = await api.getSales()
      const vendas = response.data

      const doc = new jsPDF() as jsPDFWithAutoTable
      
      // Cabeçalho
      doc.setFontSize(20)
      doc.text('Relatório de Vendas', 14, 22)
      doc.setFontSize(10)
      doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30)

      // Resumo
      const totalVendas = vendas.length
      const faturamentoTotal = vendas.reduce((acc, venda) => acc + venda.valorTotal, 0)
      
      doc.setFontSize(12)
      doc.text('Resumo:', 14, 40)
      doc.setFontSize(10)
      doc.text(`Total de Vendas: ${totalVendas}`, 14, 48)
      doc.text(`Faturamento Total: ${formatCurrency(faturamentoTotal)}`, 14, 56)

      // Tabela de Vendas
      const tableData = vendas.map(venda => [
        new Date(venda.createdAt).toLocaleDateString(),
        venda.cliente.nome,
        venda.produtos.length,
        formatCurrency(venda.valorTotal),
        venda.formaPagamento
      ])

      doc.autoTable({
        startY: 65,
        head: [['Data', 'Cliente', 'Produtos', 'Valor', 'Pagamento']],
        body: tableData,
      })

      window.open(doc.output('bloburl'), '_blank');
      
      toast({
        title: "Sucesso",
        description: "Relatório gerado com sucesso!"
      })
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const gerarRelatorioProdutos = async () => {
    setLoading(true)
    try {
      const response = await api.getSales()
      const vendas = response.data

      // Extrair produtos únicos
      const produtosMap = new Map()
      vendas.forEach(venda => {
        venda.produtos.forEach(produto => {
          if (!produtosMap.has(produto.nome)) {
            produtosMap.set(produto.nome, {
              nome: produto.nome,
              quantidade: 0,
              valorTotal: 0
            })
          }
          const prod = produtosMap.get(produto.nome)
          prod.quantidade += produto.quantidade
          prod.valorTotal += produto.quantidade * produto.precoUnitario
        })
      })

      const produtos = Array.from(produtosMap.values())

      const doc = new jsPDF() as jsPDFWithAutoTable
      
      // Cabeçalho
      doc.setFontSize(20)
      doc.text('Relatório de Produtos', 14, 22)
      doc.setFontSize(10)
      doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30)

      // Resumo
      const totalProdutos = produtos.length
      const totalVendido = produtos.reduce((acc, prod) => acc + prod.valorTotal, 0)
      
      doc.setFontSize(12)
      doc.text('Resumo:', 14, 40)
      doc.setFontSize(10)
      doc.text(`Total de Produtos: ${totalProdutos}`, 14, 48)
      doc.text(`Valor Total Vendido: ${formatCurrency(totalVendido)}`, 14, 56)

      // Tabela de Produtos
      const tableData = produtos.map(produto => [
        produto.nome,
        produto.quantidade,
        formatCurrency(produto.valorTotal),
        formatCurrency(produto.valorTotal / produto.quantidade)
      ])

      doc.autoTable({
        startY: 65,
        head: [['Produto', 'Quantidade', 'Total Vendido', 'Preço Médio']],
        body: tableData,
      })

      window.open(doc.output('bloburl'), '_blank');
      
      toast({
        title: "Sucesso",
        description: "Relatório gerado com sucesso!"
      })
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-semibold">Relatórios</h2>
        <p className="text-sm text-muted-foreground">Gere relatórios detalhados do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <h3 className="text-lg font-medium">Relatório de Vendas</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Relatório detalhado de todas as vendas, incluindo informações de clientes,
              produtos vendidos e valores.
            </p>
            <Button 
              onClick={gerarRelatorioVendas} 
              disabled={loading}
              className="w-full"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <h3 className="text-lg font-medium">Relatório de Produtos</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Análise completa dos produtos vendidos, incluindo quantidade,
              valor total e preço médio de venda.
            </p>
            <Button 
              onClick={gerarRelatorioProdutos}
              disabled={loading}
              className="w-full"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 