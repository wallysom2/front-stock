"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ProdutoVendido {
  nome: string;
  quantidade: number;
  valor: number;
  lucro?: number;
}

interface Compra {
  produtos: Array<{ nome: string; precoUnitario: number }>;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<any[]>([]);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const response = await api.getSales();
      setSales(response.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cálculos para os cards
  const totalVendas = sales.length;
  const totalFaturamento = sales.reduce((acc, sale) => acc + sale.valorTotal, 0);
  const totalProdutosVendidos = sales.reduce((acc, sale) => 
    acc + sale.produtos.reduce((sum: number, prod: { quantidade: number }) => sum + prod.quantidade, 0), 0
  );
  const ticketMedio = totalFaturamento / totalVendas || 0;

  // Dados para os gráficos
  const vendasPorFormaPagamento = sales.reduce((acc, sale) => {
    acc[sale.formaPagamento] = (acc[sale.formaPagamento] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(vendasPorFormaPagamento).map(([name, value]) => ({
    name: name === 'CARTAO_CREDITO' ? 'Cartão' : name === 'BOLETO' ? 'Boleto' : 'Pix',
    value,
    label: `${name === 'CARTAO_CREDITO' ? 'Cartão' : name === 'BOLETO' ? 'Boleto' : 'Pix'}`
  }))

  // Produtos mais vendidos
  const produtosVendidos = sales.flatMap(sale => sale.produtos)

  // Função auxiliar para encurtar nomes
  const encurtarNome = (nome: string) => {
    return nome.split(' ')[0]; // Pega apenas a primeira palavra
  };

  // Atualizar os dados dos gráficos
  const produtosMaisVendidos = Object.values<ProdutoVendido>(produtosVendidos.reduce((acc, prod) => {
    if (!acc[prod.nome]) {
      acc[prod.nome] = { 
        nome: encurtarNome(prod.nome), // Encurtar nome aqui
        quantidade: 0, 
        valor: 0 
      }
    }
    acc[prod.nome].quantidade += prod.quantidade
    acc[prod.nome].valor += prod.quantidade * prod.precoUnitario
    return acc
  }, {} as Record<string, ProdutoVendido>))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 3)

  // Produtos com maior lucro (valor de venda - valor de compra)
  const produtosMaiorLucro = Object.values<ProdutoVendido>(produtosVendidos.reduce((acc, prod) => {
    const venda = sales.find(sale => 
      sale.produtos.some((p: { nome: string }) => p.nome === prod.nome)
    );
    const compra = venda?.compras.find((compra: Compra) => 
      compra.produtos.some((p: { nome: string }) => p.nome === prod.nome)
    );

    if (!acc[prod.nome]) {
      acc[prod.nome] = { 
        nome: encurtarNome(prod.nome), // Encurtar nome aqui
        quantidade: 0, 
        valor: 0,
        lucro: 0 
      }
    }

    const valorVenda = prod.quantidade * prod.precoUnitario;
    const valorCompra = compra?.produtos.find((p: { nome: string; precoUnitario: number }) => p.nome === prod.nome)?.precoUnitario * prod.quantidade || 0;
    
    acc[prod.nome].quantidade += prod.quantidade;
    acc[prod.nome].valor += valorVenda;
    acc[prod.nome].lucro = (acc[prod.nome].lucro || 0) + (valorVenda - valorCompra);
    
    return acc;
  }, {} as Record<string, ProdutoVendido>))
    .sort((a, b) => (b.lucro || 0) - (a.lucro || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <h3 className="text-sm font-medium text-muted-foreground">Total de Vendas</h3>
              <p className="text-2xl font-bold">{totalVendas}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <h3 className="text-sm font-medium text-muted-foreground">Faturamento</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalFaturamento)}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5">
              <h3 className="text-sm font-medium text-muted-foreground">Produtos Vendidos</h3>
              <p className="text-2xl font-bold">{totalProdutosVendidos}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
              <h3 className="text-sm font-medium text-muted-foreground">Ticket Médio</h3>
              <p className="text-2xl font-bold">{formatCurrency(ticketMedio)}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Formas de Pagamento</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name }) => name}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} vendas`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Produtos Mais Vendidos</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={produtosMaisVendidos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip formatter={(value) => value + " unidades"} />
                    <Bar dataKey="quantidade" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Top 5 Produtos em Lucro</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={produtosMaiorLucro}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="lucro" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Top 3 Produtos em Faturamento</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Produto</th>
                    <th className="text-right p-2">Quantidade</th>
                    <th className="text-right p-2">Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosMaisVendidos.map((produto, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2">{produto.nome}</td>
                      <td className="text-right p-2">{produto.quantidade}</td>
                      <td className="text-right p-2">{formatCurrency(produto.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
} 