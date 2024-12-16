import axios from 'axios';
import { Product } from '@/types/product';
import { Sale } from '@/types/sale';
import { Purchase } from '@/types/purchase';
import { Supplier } from '@/types/supplier';

const api = axios.create({
  baseURL:'http://localhost:3000',
});

interface CreateProductData {
  nome: string;
  fabricante: string;
  quantidade: number;
  precoUnitario: number;
}

interface CreateSaleData {
  cliente: {
    nome: string;
    documento: string;
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
    }
  };
  produtos: CreateProductData[];
  formaPagamento: 'BOLETO' | 'PIX' | 'CARTAO_CREDITO';
}

interface CreatePurchaseData {
  vendaId: number;
  fornecedor: {
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
    }
  };
  produtos: CreateProductData[];
  formaPagamento: 'BOLETO' | 'PIX' | 'CARTAO_CREDITO';
}

interface CreateProductDTO {
  // Please define the properties of CreateProductDTO
}

export default {

  // Produtos
  getProducts() {
    return api.get<Product[]>('/produtos').then(response => response.data);
  },

  getProduct(id: number) {
    return api.get<Product>(`/produtos/${id}`).then(response => response.data);
  },

  createProduct(data: CreateProductDTO) {
    return api.post<Product>('/produtos', data).then(response => response.data);
  },

  updateProduct(id: number, data: Partial<Product>) {
    return api.put<Product>(`/produtos/${id}`, data).then(response => response.data);
  },

  deleteProduct(id: number) {
    return api.delete(`/produtos/${id}`).then(response => response.data);
  },

  // Vendas
  getSales() {
    return api.get<Sale[]>('/vendas');
  },

  getSale(id: number) {
    return api.get<Sale>(`/vendas/${id}`);
  },

  createSale(data: CreateSaleData) {
    return api.post<Sale>('/vendas', data);
  },

  updateSale(id: number, data: Partial<CreateSaleData>) {
    return api.put<Sale>(`/vendas/${id}`, data);
  },

  deleteSale(id: number) {
    return api.delete(`/vendas/${id}`);
  },

  // Compras
  getPurchases() {
    return api.get<Purchase[]>('/compras');
  },

  getPurchase(id: number) {
    return api.get<Purchase>(`/compras/${id}`);
  },

  createPurchase(data: CreatePurchaseData) {
    return api.post<Purchase>('/compras', data);
  },

  updatePurchase(id: number, data: Partial<CreatePurchaseData>) {
    return api.put<Purchase>(`/compras/${id}`, data);
  },

  deletePurchase(id: number) {
    return api.delete(`/compras/${id}`);
  },

  // Fornecedores
  getSuppliers() {
    return api.get<Supplier[]>('/fornecedores');
  },

  getSupplier(id: number) {
    return api.get<Supplier>(`/fornecedores/${id}`);
  },

  createSupplier(data: Omit<Supplier, 'id'>) {
    return api.post<Supplier>('/fornecedores', data);
  },

  updateSupplier(id: number, data: Partial<Supplier>) {
    return api.put<Supplier>(`/fornecedores/${id}`, data);
  },

  deleteSupplier(id: number) {
    return api.delete(`/fornecedores/${id}`);
  },

  // Dashboard
  getDashboardStats() {
    return api.get('/dashboard/stats').then(response => ({
      totalSales: response.data.totalSales,
      totalPurchases: response.data.totalPurchases,
      totalProducts: response.data.totalProducts,
      recentSales: response.data.recentSales,
      recentPurchases: response.data.recentPurchases,
      productStats: response.data.productStats,
    }));
  },
};