"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/api"

interface Fornecedor {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  contato: {
    nome: string;
    email: string;
    telefone: string;
    cargo: string;
  };
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const loadFornecedores = async () => {
    try {
      const response = await api.getSales()
      const salesData = response.data

      // Extrair fornecedores únicos de todas as compras
      const uniqueFornecedores = new Map<string, Fornecedor>()
      
      salesData.forEach(sale => {
        if (sale.compras) {
          sale.compras.forEach(compra => {
            if (!uniqueFornecedores.has(compra.fornecedor.cnpj)) {
              uniqueFornecedores.set(compra.fornecedor.cnpj, compra.fornecedor)
            }
          })
        }
      })

      const fornecedoresArray = Array.from(uniqueFornecedores.values())
      setFornecedores(fornecedoresArray)
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os fornecedores.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFornecedores()
  }, [])

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cnpj.includes(searchTerm)
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Fornecedores</h2>
            <p className="text-sm text-muted-foreground">Lista de fornecedores cadastrados</p>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar fornecedores..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Card className="bg-white/10">
          {loading ? (
            <div className="p-4">Carregando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-sm font-medium">Razão Social</th>
                    <th className="text-left p-4 text-sm font-medium">Nome Fantasia</th>
                    <th className="text-left p-4 text-sm font-medium">CNPJ</th>
                    <th className="text-left p-4 text-sm font-medium">Contato</th>
                    <th className="text-left p-4 text-sm font-medium">Cidade/UF</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFornecedores.map((fornecedor, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="p-4 text-sm">{fornecedor.razaoSocial}</td>
                      <td className="p-4 text-sm">{fornecedor.nomeFantasia}</td>
                      <td className="p-4 text-sm">{fornecedor.cnpj}</td>
                      <td className="p-4 text-sm">
                        <div>{fornecedor.contato.nome}</div>
                        <div className="text-muted-foreground">{fornecedor.contato.telefone}</div>
                      </td>
                      <td className="p-4 text-sm">
                        {fornecedor.endereco.cidade}/{fornecedor.endereco.estado}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
} 