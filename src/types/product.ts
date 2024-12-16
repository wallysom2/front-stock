export interface Product {
  id: number
  nome: string
  descricao: string
  fabricante: string
  categoria: string
  precoUnitario: number
  quantidadeEstoque: number
  estoqueMinimo: number
  estoqueMaximo: number
  codigoBarras: string
  status: "ATIVO" | "INATIVO"
  createdAt: string
  updatedAt: string
}

export type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>