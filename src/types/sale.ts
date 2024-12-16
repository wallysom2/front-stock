export interface Address {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Cliente {
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  endereco: Address;
}

export interface SaleProduct {
  id: number;
  nome: string;
  fabricante: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Sale {
  id: number;
  cliente: Cliente;
  produtos: SaleProduct[];
  valorTotal: number;
  formaPagamento: 'BOLETO' | 'PIX' | 'CARTAO_CREDITO';
  createdAt: string;
  compras?: any[];
}
